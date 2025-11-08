import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMessagesByCategory, postMessage } from '../api';
import { deleteMessage } from '../api';
import { useAuth } from '../auth/AuthContext';
import Button from './UI/Button';
import { 
  PaperClipIcon, 
  MicrophoneIcon, 
  StopIcon, 
  PaperAirplaneIcon, 
  PhotoIcon, 
  FaceSmileIcon, 
  ArrowUturnLeftIcon, 
  XMarkIcon, 
  EllipsisVerticalIcon,
  ArrowLeftIcon,
  UserCircleIcon,
  CheckBadgeIcon,
  ClockIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon,
  CalendarDaysIcon,
  CameraIcon,
  SignalIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

// Simple built-in stickers (emoji) for demo — can be replaced with images
const STICKERS = ['😂','🎉','🔥','👍','🙌','❤️','🤔','😮','👏','✨','💯','🚀'];

// Category-specific features configuration
const CATEGORY_FEATURES = {
  sharing: {
    name: 'Sharing Auto',
    features: ['location', 'route'],
    locationLabel: 'Share Live Location',
    placeholder: 'Share your route and timing...'
  },
  papers: {
    name: 'Previous Papers/Notes',
    features: ['favorite', 'downloads'],
    placeholder: 'Share exam papers, notes, solutions, or ask for resources...'
  },
  borrow: {
    name: 'Borrow / Lend',
    features: ['returnDate', 'availability'],
    placeholder: 'What do you want to borrow or lend?...'
  },
  laundry: {
    name: 'Lost Laundry',
    features: ['photo', 'tags'],
    placeholder: 'Describe your lost item (color, pattern, etc.)...'
  },
  faculty: {
    name: 'Faculty Cabins',
    features: ['availability', 'queue'],
    placeholder: 'Ask about faculty availability or cabin location...'
  },
  ffcs: {
    name: 'FFCS',
    features: ['recommendations', 'seats'],
    placeholder: 'Share course recommendations or ask for advice...'
  },
  hostel: {
    name: 'Hostel Issues',
    features: ['priority', 'voting'],
    placeholder: 'Report hostel issues or concerns...'
  },
  alumni: {
    name: 'Alumni Help',
    features: ['linkedin', 'mentorship'],
    placeholder: 'Seek career guidance or mentorship...'
  },
  others: {
    name: 'Others',
    features: ['poll', 'event'],
    placeholder: 'Start a discussion or create a poll...'
  }
};

export default function Chat() {
  const { category } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  // Category-specific features
  const [showFeatureModal, setShowFeatureModal] = useState(null);
  const [location, setLocation] = useState(null);
  const [returnDate, setReturnDate] = useState('');
  const [availability, setAvailability] = useState('available');
  const [priority, setPriority] = useState('medium');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [eventDetails, setEventDetails] = useState({ date: '', time: '', venue: '' });

  const categoryConfig = CATEGORY_FEATURES[category] || CATEGORY_FEATURES.others;

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

  // Get current location
  function shareLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString()
        };
        setLocation(loc);
        setShowFeatureModal('location');
      },
      (error) => {
        alert('Unable to get location: ' + error.message);
      }
    );
  }

  // Send message with special features
  async function sendWithFeature(featureData) {
    const messageText = text || featureData.defaultText;
    const fd = new FormData();
    fd.append('category', category);
    fd.append('text', messageText);
    fd.append('consent_for_contact', consent ? 'true' : 'false');
    
    // Add feature-specific data as metadata
    if (featureData.metadata) {
      fd.append('metadata', JSON.stringify(featureData.metadata));
    }
    
    if (file) fd.append('file', file);
    
    try {
      const res = await postMessage(fd);
      setMessages(prev => [res.post, ...prev]);
      setText('');
      setFile(null);
      setShowFeatureModal(null);
      // Reset feature states
      setLocation(null);
      setReturnDate('');
      setAvailability('available');
      setPriority('medium');
      setPollOptions(['', '']);
      setEventDetails({ date: '', time: '', venue: '' });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to send message');
    }
  }

  const categoryTitles = {
    sharing: 'Sharing Auto',
    papers: 'Previous Papers/Notes',
    borrow: 'Borrow / Lend',
    laundry: 'Lost Laundry',
    faculty: 'Faculty Cabins',
    ffcs: 'FFCS',
    hostel: 'Hostel Issues',
    alumni: 'Alumni Help',
    others: 'Others'
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{categoryTitles[category] || category}</h2>
            <p className="text-indigo-100 text-sm">{messages.length} messages</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
            <UserCircleIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        onClick={() => setOpenMenuId(null)} 
        className="flex-1 overflow-y-auto p-4" 
        ref={listRef} 
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3 mx-auto"></div>
              <div className="text-gray-600">Loading messages...</div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">Be the first to start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map(m => (
            <div key={m._id} className={`mb-4 flex ${isMine(m) ? 'justify-end' : 'justify-start'}`}>
              <div className={`group relative max-w-[75%] md:max-w-[60%]`}> 
                {/* Message Bubble */}
                <div className={`
                  ${isMine(m) 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-md' 
                    : 'bg-white text-gray-800 rounded-2xl rounded-tl-md shadow-md border border-gray-100'
                  } 
                  p-4 relative
                `}>
                  {/* Sender Name */}
                  <div className={`
                    ${isMine(m) ? 'text-indigo-100' : 'text-indigo-600'} 
                    text-xs font-semibold mb-2 flex items-center gap-1
                  `}>
                    {m.sender?.username || m.sender?.full_name || 'User'}
                    {m.consent_for_contact && !isMine(m) && (
                      <CheckBadgeIcon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Reply preview (if this message replies to another) */}
                  {m.reply_to && (
                    <div className={`
                      ${isMine(m) 
                        ? 'bg-white/20 border-l-2 border-white/50' 
                        : 'bg-indigo-50 border-l-2 border-indigo-300'
                      } 
                      p-3 rounded-lg mb-3
                    `}>
                      <div className={`${isMine(m) ? 'text-white/90' : 'text-indigo-900'} text-xs font-medium mb-1`}>
                        {m.reply_to.sender?.username || m.reply_to.sender?.full_name || 'User'}
                      </div>
                      <div className={`${isMine(m) ? 'text-white/80' : 'text-gray-600'} text-sm line-clamp-2`}>
                        {m.reply_to.text}
                      </div>
                    </div>
                  )}

                  {/* Message content with special feature badges */}
                  {typeof m.text === 'string' && m.text.startsWith(':sticker:') ? (
                    <div className="text-5xl py-2">{m.text.replace(':sticker:', '')}</div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap break-words leading-relaxed">{m.text}</div>
                      
                      {/* Feature badges based on metadata */}
                      {m.metadata && (
                        <div className="mt-3 space-y-2">
                          {m.metadata.location && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isMine(m) ? 'bg-white/20' : 'bg-blue-50'}`}>
                              <MapPinIcon className={`w-4 h-4 ${isMine(m) ? 'text-white' : 'text-blue-600'}`} />
                              <a 
                                href={`https://www.google.com/maps?q=${m.metadata.location.latitude},${m.metadata.location.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm font-medium ${isMine(m) ? 'text-white underline' : 'text-blue-600 hover:underline'}`}
                              >
                                View Location on Map
                              </a>
                            </div>
                          )}
                          
                          {m.metadata.returnDate && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isMine(m) ? 'bg-white/20' : 'bg-orange-50'}`}>
                              <CalendarDaysIcon className={`w-4 h-4 ${isMine(m) ? 'text-white' : 'text-orange-600'}`} />
                              <span className={`text-sm ${isMine(m) ? 'text-white' : 'text-orange-900'}`}>
                                Return by: {new Date(m.metadata.returnDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          
                          {m.metadata.availability && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                              m.metadata.availability === 'available' 
                                ? (isMine(m) ? 'bg-white/20' : 'bg-green-50')
                                : (isMine(m) ? 'bg-white/20' : 'bg-red-50')
                            }`}>
                              <SignalIcon className={`w-4 h-4 ${
                                m.metadata.availability === 'available'
                                  ? (isMine(m) ? 'text-white' : 'text-green-600')
                                  : (isMine(m) ? 'text-white' : 'text-red-600')
                              }`} />
                              <span className={`text-sm font-medium ${
                                m.metadata.availability === 'available'
                                  ? (isMine(m) ? 'text-white' : 'text-green-900')
                                  : (isMine(m) ? 'text-white' : 'text-red-900')
                              }`}>
                                {m.metadata.availability === 'available' ? 'Available' : 'Not Available'}
                              </span>
                            </div>
                          )}
                          
                          {m.metadata.priority && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                              m.metadata.priority === 'high' ? (isMine(m) ? 'bg-white/20' : 'bg-red-50') :
                              m.metadata.priority === 'medium' ? (isMine(m) ? 'bg-white/20' : 'bg-yellow-50') :
                              (isMine(m) ? 'bg-white/20' : 'bg-gray-50')
                            }`}>
                              <ExclamationTriangleIcon className={`w-4 h-4 ${
                                m.metadata.priority === 'high' ? (isMine(m) ? 'text-white' : 'text-red-600') :
                                m.metadata.priority === 'medium' ? (isMine(m) ? 'text-white' : 'text-yellow-600') :
                                (isMine(m) ? 'text-white' : 'text-gray-600')
                              }`} />
                              <span className={`text-sm font-medium ${isMine(m) ? 'text-white' : 'text-gray-900'}`}>
                                Priority: {m.metadata.priority.charAt(0).toUpperCase() + m.metadata.priority.slice(1)}
                              </span>
                            </div>
                          )}
                          
                          {m.metadata.linkedin && (
                            <a 
                              href={m.metadata.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isMine(m) ? 'bg-white/20 hover:bg-white/30' : 'bg-blue-50 hover:bg-blue-100'} transition-colors`}
                            >
                              <LinkIcon className={`w-4 h-4 ${isMine(m) ? 'text-white' : 'text-blue-600'}`} />
                              <span className={`text-sm font-medium ${isMine(m) ? 'text-white' : 'text-blue-600'}`}>
                                View LinkedIn Profile
                              </span>
                            </a>
                          )}
                          
                          {m.metadata.poll && (
                            <div className={`${isMine(m) ? 'bg-white/20' : 'bg-purple-50'} rounded-lg p-3`}>
                              <div className={`text-sm font-semibold mb-2 ${isMine(m) ? 'text-white' : 'text-purple-900'}`}>
                                📊 Poll
                              </div>
                              {m.metadata.poll.options.map((option, idx) => (
                                <button
                                  key={idx}
                                  className={`w-full text-left px-3 py-2 rounded mb-1 ${
                                    isMine(m) ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-purple-100 text-gray-900'
                                  } transition-colors text-sm`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          {m.metadata.event && (
                            <div className={`${isMine(m) ? 'bg-white/20' : 'bg-indigo-50'} rounded-lg p-3`}>
                              <div className={`text-sm font-semibold mb-2 ${isMine(m) ? 'text-white' : 'text-indigo-900'}`}>
                                📅 Event Details
                              </div>
                              <div className={`text-sm space-y-1 ${isMine(m) ? 'text-white/90' : 'text-gray-700'}`}>
                                <div>📆 {new Date(m.metadata.event.date).toLocaleDateString()}</div>
                                <div>🕐 {m.metadata.event.time}</div>
                                <div>📍 {m.metadata.event.venue}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Media */}
                  {m.media_url && (
                    <div className="mt-3">
                      {m.media_type === 'image' || (m.media_url && m.media_url.match(/\.(jpg|jpeg|png|gif)$/i)) ? (
                        <img 
                          src={m.media_url} 
                          alt="media" 
                          className="max-w-full rounded-lg border-2 border-white/30" 
                        />
                      ) : (
                        <a 
                          href={m.media_url} 
                          className={`
                            inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                            ${isMine(m) 
                              ? 'bg-white/20 hover:bg-white/30 text-white' 
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                            }
                          `}
                        >
                          <PaperClipIcon className="w-4 h-4" />
                          Open attachment
                        </a>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className={`
                    ${isMine(m) ? 'text-indigo-100' : 'text-gray-500'} 
                    text-xs mt-2 flex items-center gap-1
                  `}>
                    <ClockIcon className="w-3 h-3" />
                    {new Date(m.created_at || Date.now()).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>

                  {/* Three-dot menu */}
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setOpenMenuId(openMenuId === m._id ? null : m._id); 
                      }} 
                      type="button" 
                      className={`
                        w-8 h-8 flex items-center justify-center rounded-full transition-all
                        ${isMine(m) 
                          ? 'bg-white/0 hover:bg-white/20 text-white' 
                          : 'bg-white/0 hover:bg-gray-100 text-gray-600'
                        } 
                        opacity-0 group-hover:opacity-100
                      `}
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === m._id && (
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="absolute top-10 right-0 w-52 bg-white border border-gray-200 rounded-xl shadow-xl text-sm z-50 overflow-hidden"
                      >
                        {isMine(m) ? (
                          <button 
                            type="button" 
                            onClick={() => handleDeleteMessage(m._id)} 
                            className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                            Delete for everyone
                          </button>
                        ) : (
                          <>
                            <button 
                              type="button" 
                              onClick={() => { 
                                setReplyTo({ 
                                  id: m._id, 
                                  text: (m.text || '').slice(0,200), 
                                  sender: m.sender?.username || m.sender?.full_name 
                                }); 
                                setOpenMenuId(null); 
                              }} 
                              className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-indigo-50 text-gray-700 transition-colors"
                            >
                              <ArrowUturnLeftIcon className="w-5 h-5 text-indigo-600" />
                              Reply
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { 
                                navigator.clipboard?.writeText(m.text || ''); 
                                setOpenMenuId(null); 
                              }} 
                              className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-indigo-50 text-gray-700 transition-colors"
                            >
                              <DocumentDuplicateIcon className="w-5 h-5 text-indigo-600" />
                              Copy message
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { 
                                setOpenMenuId(null); 
                                if (m.consent_for_contact) { 
                                  setContactModal({ ok: true, sender: m.sender }); 
                                } else { 
                                  setContactModal({ ok: false }); 
                                } 
                              }} 
                              className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-indigo-50 text-gray-700 transition-colors border-t border-gray-100"
                            >
                              <PhoneIcon className="w-5 h-5 text-indigo-600" />
                              Contact sender
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={submit} className="bg-white border-t border-gray-200 p-4 shadow-lg relative">
        {/* Reply Preview Bar */}
        {replyTo && (
          <div className="absolute left-4 right-4 -top-16 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl px-4 py-3 shadow-lg flex items-start gap-3 z-10">
            <div className="flex-1">
              <div className="text-xs font-semibold text-indigo-600 mb-1">
                Replying to {replyTo.sender}
              </div>
              <div className="text-sm text-gray-700 line-clamp-1">{replyTo.text}</div>
            </div>
            <button 
              type="button" 
              onClick={() => setReplyTo(null)} 
              className="p-1 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Stickers Row */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <FaceSmileIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {STICKERS.map(s => (
            <button 
              key={s} 
              type="button" 
              onClick={() => pickSticker(s)} 
              className="text-2xl hover:scale-125 transition-transform flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg"
            >
              {s}
            </button>
          ))}
        </div>

        {/* File/Audio Preview */}
        {(file || audioBlob) && (
          <div className="mb-3 bg-indigo-50 rounded-lg p-3 flex items-center gap-3">
            {file && (
              <>
                <PhotoIcon className="w-6 h-6 text-indigo-600" />
                <div className="flex-1 text-sm text-gray-700 font-medium truncate">{file.name}</div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)} 
                  className="p-1 hover:bg-indigo-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
            {audioBlob && (
              <>
                <audio controls src={URL.createObjectURL(audioBlob)} className="flex-1" />
                <button 
                  type="button" 
                  onClick={sendAudio} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Send Voice
                </button>
              </>
            )}
          </div>
        )}

        {/* Main Input Row */}
        <div className="flex items-end gap-3">
          {/* Category-specific feature buttons */}
          {category === 'sharing' && (
            <button 
              type="button"
              onClick={shareLocation}
              className="p-3 rounded-xl hover:bg-indigo-50 transition-colors flex-shrink-0 group"
              title="Share Location"
            >
              <MapPinIcon className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
            </button>
          )}
          
          {category === 'borrow' && (
            <button 
              type="button"
              onClick={() => setShowFeatureModal('returnDate')}
              className="p-3 rounded-xl hover:bg-orange-50 transition-colors flex-shrink-0 group"
              title="Set Return Date"
            >
              <CalendarDaysIcon className="h-6 w-6 text-orange-600 group-hover:scale-110 transition-transform" />
            </button>
          )}
          
          {(category === 'faculty' || category === 'borrow') && (
            <button 
              type="button"
              onClick={() => setShowFeatureModal('availability')}
              className="p-3 rounded-xl hover:bg-green-50 transition-colors flex-shrink-0 group"
              title="Set Availability"
            >
              <SignalIcon className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
            </button>
          )}
          
          {category === 'hostel' && (
            <button 
              type="button"
              onClick={() => setShowFeatureModal('priority')}
              className="p-3 rounded-xl hover:bg-red-50 transition-colors flex-shrink-0 group"
              title="Set Priority"
            >
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 group-hover:scale-110 transition-transform" />
            </button>
          )}
          
          {category === 'alumni' && (
            <button 
              type="button"
              onClick={() => setShowFeatureModal('linkedin')}
              className="p-3 rounded-xl hover:bg-blue-50 transition-colors flex-shrink-0 group"
              title="Add LinkedIn"
            >
              <LinkIcon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
          )}
          
          {category === 'others' && (
            <>
              <button 
                type="button"
                onClick={() => setShowFeatureModal('poll')}
                className="p-3 rounded-xl hover:bg-purple-50 transition-colors flex-shrink-0 group"
                title="Create Poll"
              >
                <ChartBarIcon className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
              </button>
              <button 
                type="button"
                onClick={() => setShowFeatureModal('event')}
                className="p-3 rounded-xl hover:bg-pink-50 transition-colors flex-shrink-0 group"
                title="Create Event"
              >
                <CalendarDaysIcon className="h-6 w-6 text-pink-600 group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Attachment Button */}
          <label className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors flex-shrink-0">
            <input 
              type="file" 
              accept="image/*,video/*,image/gif" 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <PaperClipIcon className="h-6 w-6 text-indigo-600" />
          </label>

          {/* Voice Recording Button */}
          <button 
            type="button" 
            onClick={() => recording ? stopRecording() : startRecording()} 
            className={`
              p-3 rounded-xl transition-all flex-shrink-0
              ${recording 
                ? 'bg-red-100 hover:bg-red-200 animate-pulse' 
                : 'hover:bg-gray-100'
              }
            `}
          >
            {recording ? (
              <StopIcon className="h-6 w-6 text-red-600" />
            ) : (
              <MicrophoneIcon className="h-6 w-6 text-indigo-600" />
            )}
          </button>

          <div className="flex-1 relative">
            <textarea 
              value={text} 
              onChange={e => setText(e.target.value)} 
              placeholder={categoryConfig.placeholder || "Type a message..."} 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              rows={1}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit(e);
                }
              }}
            />
          </div>

          {/* Contact Consent Dropdown */}
          <select 
            className="px-3 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none cursor-pointer bg-white flex-shrink-0"
            value={consent ? '1' : '0'} 
            onChange={e => setConsent(e.target.value === '1')}
          >
            <option value="0">🔒 Private</option>
            <option value="1">📞 Share contact</option>
          </select>

          {/* Send Button */}
          <button 
            type="submit" 
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
            Send
          </button>
        </div>
      </form>

      {/* Contact Modal */}
      {contactModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
          onClick={() => setContactModal(null)}
        >
          <div 
            onClick={e => e.stopPropagation()} 
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <PhoneIcon className="w-6 h-6 text-indigo-600" />
                Contact Information
              </h3>
              <button 
                type="button" 
                onClick={() => setContactModal(null)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {contactModal.ok ? (
              <div className="space-y-4">
                {contactModal.sender?.student_id && (
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="text-sm font-medium text-indigo-600 mb-1">Student ID</div>
                    <div className="text-lg font-semibold text-gray-900">{contactModal.sender.student_id}</div>
                  </div>
                )}
                {contactModal.sender?.full_name && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="text-sm font-medium text-purple-600 mb-1">Name</div>
                    <div className="text-lg font-semibold text-gray-900">{contactModal.sender.full_name}</div>
                  </div>
                )}
                {contactModal.sender?.email && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="text-sm font-medium text-blue-600 mb-1">Email</div>
                    <div className="text-gray-900 break-all">{contactModal.sender.email}</div>
                  </div>
                )}
                {contactModal.sender?.phone && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="text-sm font-medium text-green-600 mb-1">Phone</div>
                    <div className="text-lg font-semibold text-gray-900">{contactModal.sender.phone}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 rounded-lg p-6 border border-red-100 text-center">
                <div className="text-5xl mb-3">🔒</div>
                <p className="text-gray-700">
                  The sender did not agree to share contact details with this message.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature Modals */}
      {showFeatureModal === 'location' && location && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-indigo-600" />
                Share Location
              </h3>
              <button onClick={() => setShowFeatureModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Your current location:</p>
              <div className="bg-indigo-50 rounded-lg p-3 text-sm">
                <div>📍 Lat: {location.latitude.toFixed(6)}</div>
                <div>📍 Long: {location.longitude.toFixed(6)}</div>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add route details, timing, or pickup points..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              rows={3}
            />
            <button
              onClick={() => sendWithFeature({
                defaultText: text || 'Sharing location for auto ride',
                metadata: { location }
              })}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Send with Location
            </button>
          </div>
        </div>
      )}

      {showFeatureModal === 'returnDate' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarDaysIcon className="w-6 h-6 text-orange-600" />
                Set Return Date
              </h3>
              <button onClick={() => setShowFeatureModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe the item you want to borrow/lend..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              rows={3}
            />
            <button
              onClick={() => returnDate && sendWithFeature({
                defaultText: text || 'Item available for borrow/lend',
                metadata: { returnDate }
              })}
              disabled={!returnDate}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send with Return Date
            </button>
          </div>
        </div>
      )}

      {showFeatureModal === 'availability' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <SignalIcon className="w-6 h-6 text-green-600" />
                Set Availability
              </h3>
              <button onClick={() => setShowFeatureModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
            >
              <option value="available">Available</option>
              <option value="unavailable">Not Available</option>
              <option value="busy">Busy</option>
            </select>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={category === 'faculty' ? "Faculty cabin details or timing..." : "Item details..."}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 resize-none focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              rows={3}
            />
            <button
              onClick={() => sendWithFeature({
                defaultText: text || 'Availability updated',
                metadata: { availability }
              })}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Send with Availability
            </button>
          </div>
        </div>
      )}

      {showFeatureModal === 'priority' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                Set Priority Level
              </h3>
              <button onClick={() => setShowFeatureModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe the hostel issue in detail..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 resize-none focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
              rows={3}
            />
            <button
              onClick={() => sendWithFeature({
                defaultText: text || 'Hostel issue reported',
                metadata: { priority }
              })}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all"
            >
              Send with Priority
            </button>
          </div>
        </div>
      )}

      {showFeatureModal === 'linkedin' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <LinkIcon className="w-6 h-6 text-blue-600" />
                Add LinkedIn Profile
              </h3>
              <button onClick={() => setShowFeatureModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              onChange={(e) => setText(prev => ({ ...prev, linkedin: e.target.value }))}
            />
            <textarea
              value={text.message || ''}
              onChange={(e) => setText(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Share your experience, offer mentorship, or ask for guidance..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              rows={3}
            />
            <button
              onClick={() => text.linkedin && sendWithFeature({
                defaultText: text.message || 'Open for mentorship and guidance',
                metadata: { linkedin: text.linkedin }
              })}
              disabled={!text.linkedin}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send with LinkedIn
            </button>
          </div>
        </div>
      )}

      {showFeatureModal === 'poll' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
                Create Poll
              </h3>
              <button onClick={() => setShowFeatureModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Poll question..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
            {pollOptions.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOpts = [...pollOptions];
                  newOpts[idx] = e.target.value;
                  setPollOptions(newOpts);
                }}
                placeholder={`Option ${idx + 1}`}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            ))}
            <button
              onClick={() => setPollOptions([...pollOptions, ''])}
              className="text-sm text-purple-600 hover:text-purple-700 mb-4"
            >
              + Add option
            </button>
            <button
              onClick={() => text && pollOptions.filter(o => o.trim()).length >= 2 && sendWithFeature({
                defaultText: text,
                metadata: { poll: { options: pollOptions.filter(o => o.trim()) } }
              })}
              disabled={!text || pollOptions.filter(o => o.trim()).length < 2}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Poll
            </button>
          </div>
        </div>
      )}

      {showFeatureModal === 'event' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarDaysIcon className="w-6 h-6 text-pink-600" />
                Create Event
              </h3>
              <button onClick={() => setShowFeatureModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Event title..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
            <input
              type="date"
              value={eventDetails.date}
              onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
            <input
              type="time"
              value={eventDetails.time}
              onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
            <input
              type="text"
              value={eventDetails.venue}
              onChange={(e) => setEventDetails({ ...eventDetails, venue: e.target.value })}
              placeholder="Venue..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
            <button
              onClick={() => text && eventDetails.date && eventDetails.time && eventDetails.venue && sendWithFeature({
                defaultText: text,
                metadata: { event: eventDetails }
              })}
              disabled={!text || !eventDetails.date || !eventDetails.time || !eventDetails.venue}
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
