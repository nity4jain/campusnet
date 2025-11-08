import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMessagesByCategory, postMessage } from '../api';
import { deleteMessage } from '../api';
import { useAuth } from '../auth/AuthContext';
import Button from './UI/Button';
import { PaperClipIcon, MicrophoneIcon, StopIcon, PaperAirplaneIcon, PhotoIcon, FaceSmileIcon, ArrowUturnLeftIcon, XMarkIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';

// Simple built-in stickers (emoji) for demo — can be replaced with images
const STICKERS = ['😂','🎉','🔥','👍','🙌','❤️','🤔','😮'];

export default function Chat() {
  const { category } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null); // { id, text, sender }
  const [openMenuId, setOpenMenuId] = useState(null);
  const [contactModal, setContactModal] = useState(null);

  // Audio recording
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [category]);

  async function handleDeleteMessage(id) {
    if (!confirm('Delete this message for everyone? This cannot be undone.')) return;
    try {
      await deleteMessage(id);
      setMessages(prev => prev.filter(p => p._id !== id));
      setOpenMenuId(null);
    } catch (err) {
      console.error('Delete failed', err);
      alert(err?.message || 'Could not delete');
    }
  }

  // close open menus on escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpenMenuId(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getMessagesByCategory(category);
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  // Start audio recording (browser must support MediaRecorder)
  async function startRecording() {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('Audio recording is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      mr.start();
      setRecorder(mr);
      setRecording(true);
    } catch (err) {
      console.error('Recording failed', err);
      alert('Could not start recording: ' + (err.message || err));
    }
  }

  function stopRecording() {
    if (recorder) recorder.stop();
    setRecording(false);
  }

  async function sendAudio() {
    if (!audioBlob) return;
    const fd = new FormData();
    fd.append('category', category);
    fd.append('text', '');
    fd.append('consent_for_contact', consent ? 'true' : 'false');
    fd.append('file', new File([audioBlob], `voice-${Date.now()}.webm`, { type: audioBlob.type }));
    try {
      const res = await postMessage(fd);
      setMessages(prev => [res.post, ...prev]);
      setAudioBlob(null);
    } catch (err) {
      console.error(err);
      alert(err.message || JSON.stringify(err));
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!text.trim() && !file && !audioBlob) return;
    const fd = new FormData();
    fd.append('category', category);
    fd.append('text', text);
    if (replyTo && replyTo.id) fd.append('reply_to', replyTo.id);
    fd.append('consent_for_contact', consent ? 'true' : 'false');
    if (file) fd.append('file', file);
    if (audioBlob) fd.append('file', new File([audioBlob], `voice-${Date.now()}.webm`, { type: audioBlob.type }));
    try {
      const res = await postMessage(fd);
      setMessages(prev => [res.post, ...prev]);
      setText(''); setFile(null); setConsent(false); setAudioBlob(null);
      setReplyTo(null);
      if (listRef.current) listRef.current.scrollTop = 0;
    } catch (err) {
      console.error(err);
      alert(err.message || JSON.stringify(err));
    }
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  }

  function pickSticker(s) {
    // Send sticker as simple text flagged with :sticker: prefix
    const fd = new FormData();
    fd.append('category', category);
    fd.append('text', `:sticker:${s}`);
    fd.append('consent_for_contact', 'false');
    postMessage(fd).then(res => setMessages(prev => [res.post, ...prev])).catch(err => console.error(err));
  }

  // Helper to detect if a message is from current user
  function isMine(m) {
    const myId = user?.user_id || user?._id || user?.userId || null;
    const senderId = m.sender?._id || m.sender?.user_id || null;
    if (!myId || !senderId) return false;
    return String(myId) === String(senderId);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b bg-white flex items-center">
        <h2 className="text-lg font-semibold capitalize">{category}</h2>
      </div>

      <div onClick={() => setOpenMenuId(null)} className="flex-1 overflow-y-auto p-4 bg-slate-50" ref={listRef} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
        {loading ? <div className="text-sm text-slate-500">Loading...</div> : (
          messages.map(m => (
      <div key={m._id} className={`mb-3 flex ${isMine(m) ? 'justify-end' : 'justify-start'}`}>
    <div className={`group ${isMine(m) ? 'bg-gradient-to-r from-brand to-accent text-white' : 'bg-white text-slate-800'} max-w-[75%] p-3 rounded-lg shadow relative`}> 
          <div className={`${isMine(m) ? 'text-xs text-white/90 mb-1' : 'text-xs text-slate-500 mb-1'}`}>{m.sender?.username || m.sender?.full_name || 'User'}</div>
                {/* Reply preview (if this message replies to another) */}
                {m.reply_to && (
                  <div className={`p-2 rounded-md mb-2 ${isMine(m) ? 'bg-white/10 text-white/90' : 'bg-slate-50 text-slate-600'}`}>
                    <div className="text-xs font-medium">{m.reply_to.sender?.username || m.reply_to.sender?.full_name || 'User'}</div>
                    <div className="text-sm truncate">{m.reply_to.text}</div>
                  </div>
                )}
                {/* Sticker */}
                {typeof m.text === 'string' && m.text.startsWith(':sticker:') ? (
                  <div className="text-3xl">{m.text.replace(':sticker:', '')}</div>
                ) : (
                  <div className="whitespace-pre-wrap">{m.text}</div>
                )}
                {m.media_url && (
                  <div className="mt-2">
                    {m.media_type === 'image' || (m.media_url && m.media_url.match(/\.(jpg|jpeg|png|gif)$/i)) ? (
                      <img src={m.media_url} alt="media" className="max-w-full rounded" />
                    ) : (
                      <a href={m.media_url} className="text-accent">Open attachment</a>
                    )}
                  </div>
                )}

                {/* Hover actions: three-dot trigger -> dropdown menu (WhatsApp-like) */}
                <div className="absolute top-2 right-2">
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === m._id ? null : m._id); }} type="button" className={`w-8 h-8 flex items-center justify-center rounded-full ${isMine(m) ? 'bg-white/10 hover:bg-white/20' : 'bg-white/0 hover:bg-slate-100'} group-hover:opacity-100 opacity-0 transition-opacity shadow-sm`}>
                    <EllipsisVerticalIcon className={`h-4 w-4 ${isMine(m) ? 'text-white/90' : 'text-slate-500'}`} />
                  </button>
                  {openMenuId === m._id && (
                    <div onClick={(e) => e.stopPropagation()} className="absolute top-10 right-0 w-44 bg-white border rounded shadow-md text-sm z-50">
                      {isMine(m) ? (
                        <>
                          <button type="button" onClick={() => handleDeleteMessage(m._id)} className="w-full flex items-center gap-2 text-left px-3 py-2 text-black">Delete for everyone</button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => { setReplyTo({ id: m._id, text: (m.text || '').slice(0,200), sender: m.sender?.username || m.sender?.full_name }); setOpenMenuId(null); }} className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-slate-50">Reply</button>
                          <button type="button" onClick={() => { navigator.clipboard?.writeText(m.text || ''); setOpenMenuId(null); }} className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-slate-50">Copy</button>
                          <button type="button" onClick={() => { setOpenMenuId(null); if (m.consent_for_contact) { setContactModal({ ok: true, sender: m.sender }); } else { setContactModal({ ok: false }); } }} className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-slate-50">Contact</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

  <form onSubmit={submit} className="p-3 bg-white border-t relative">
        <div className="flex items-center gap-2">
          {replyTo && (
            <div className="absolute left-4 right-4 -translate-y-6 bg-white border rounded-md px-3 py-2 shadow flex items-start gap-3 w-auto z-10">
              <div className="flex-1">
                <div className="text-xs text-slate-500">Replying to {replyTo.sender}</div>
                <div className="text-sm text-slate-700 truncate">{replyTo.text}</div>
              </div>
              <button type="button" onClick={() => setReplyTo(null)} className="p-1 text-slate-500">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
          <label className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
            <input type="file" accept="image/*,video/*,image/gif" onChange={handleFileChange} className="hidden" />
            <PaperClipIcon className="h-6 w-6 text-accent" aria-hidden="true" />
          </label>

          <button type="button" onClick={() => recording ? stopRecording() : startRecording()} className={`p-2 rounded-full ${recording ? 'bg-red-100' : 'hover:bg-slate-100'}`}>
            {recording ? (
              <StopIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            ) : (
              <MicrophoneIcon className="h-6 w-6 text-accent" aria-hidden="true" />
            )}
          </button>

          <div className="flex-1">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Message" className="w-full px-3 py-2 border rounded-md resize-none" rows={1} />
          </div>

            <div className="flex items-center gap-2">
            <select className="text-sm border rounded px-2 py-1" value={consent ? '1' : '0'} onChange={e => setConsent(e.target.value === '1')}>
              <option value="0">Don't share</option>
              <option value="1">Share contact</option>
            </select>
            <button type="submit" className="px-3 py-2 bg-gradient-to-r from-brand to-accent text-white rounded flex items-center gap-2"><PaperAirplaneIcon className="h-4 w-4 -rotate-45" />Send</button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3 overflow-x-auto">
          {/* Stickers */}
          {STICKERS.map(s => (
            <button key={s} type="button" onClick={() => pickSticker(s)} className="p-2 text-2xl hover:scale-110 transition border rounded">{s}</button>
          ))}
          {/* If there's an audio recorded, show send preview */}
          {audioBlob && (
            <div className="ml-auto flex items-center gap-2">
              <audio controls src={URL.createObjectURL(audioBlob)} />
              <button type="button" onClick={sendAudio} className="px-3 py-1 bg-blue-600 text-white rounded">Send Voice</button>
            </div>
          )}
          {file && (
            <div className="ml-auto flex items-center gap-2">
              <div className="text-sm text-slate-600">{file.name}</div>
            </div>
          )}
        </div>
      </form>
      {/* Contact modal */}
      {contactModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-60" onClick={() => setContactModal(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sender contact</h3>
              <button type="button" onClick={() => setContactModal(null)} className="p-1 text-slate-600"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            {contactModal.ok ? (
              <div className="space-y-2">
                {/* Show student id primarily for confidentiality */}
                <div><span className="font-medium">Student ID:</span> <span className="ml-2">{contactModal.sender?.student_id || 'N/A'}</span></div>
                {/* Optionally show name/email/phone if available */}
                {contactModal.sender?.full_name && <div><span className="font-medium">Name:</span> <span className="ml-2">{contactModal.sender.full_name}</span></div>}
                {contactModal.sender?.email && <div><span className="font-medium">Email:</span> <span className="ml-2">{contactModal.sender.email}</span></div>}
                {contactModal.sender?.phone && <div><span className="font-medium">Phone:</span> <span className="ml-2">{contactModal.sender.phone}</span></div>}
              </div>
            ) : (
              <div className="text-slate-600">The sender did not agree to share contact details with this message.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
