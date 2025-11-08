import fs from 'fs/promises';
import path from 'path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const root = process.cwd();
const inputPath = path.join(root, 'src', 'index.css');

async function run() {
  try {
    const css = await fs.readFile(inputPath, 'utf8');
  const result = await postcss([tailwindcss(), autoprefixer()]).process(css, { from: inputPath });
    const out = result.css;

    // Heuristic checks for common Tailwind utilities
    const checks = [
      '.container',
      '.bg-',
      '.text-',
      '.flex',
      '.grid',
      '.p-',
      '.m-'
    ];

    const found = checks.some((c) => out.includes(c));

    if (found) {
      console.log('✅ Tailwind smoke test passed: generated CSS contains Tailwind utilities.');
      process.exit(0);
    }

    console.error('❌ Tailwind smoke test failed: no Tailwind utilities found in generated CSS.');
    // write a small sample for debugging
    await fs.mkdir(path.join(root, '.cache'), { recursive: true });
    await fs.writeFile(path.join(root, '.cache', 'smoke-output.css'), out, 'utf8');
    console.error('Wrote processed CSS to .cache/smoke-output.css for inspection.');
    process.exit(2);
  } catch (err) {
    console.error('Error running Tailwind smoke test:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(3);
  }
}

run();
