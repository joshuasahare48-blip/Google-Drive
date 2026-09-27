/**
 * =========================================================================
 * SUBMIT AUDIO CONTROLLER (SINGLETON)
 * =========================================================================
 * Manages the single HTML Audio instance as requested.
 * Exactly ONE Audio object is created and reused.
 * Volume is set to 1.0 (100% in HTML audio).
 * Loops continuously after submit.
 */

import { surveyConfig } from './surveyConfig';

// Primary audio URL from public assets, with fallback to user's remote URL
const AUDIO_URL =
  '/audio/submit-sound.mp3';
const REMOTE_AUDIO_URL =
  'https://www.image2url.com/r2/default/audio/1790512369275-0d49639c-8667-4df1-98a2-5bf17a13a54b.mp3';

// Exactly ONE Audio object created:
export const submitAudio = new Audio(AUDIO_URL);
submitAudio.loop = true;
submitAudio.volume = 1.0;
submitAudio.preload = 'auto';

// Fallback to remote if local fails
submitAudio.addEventListener('error', () => {
  if (submitAudio.src !== REMOTE_AUDIO_URL) {
    console.log('Falling back to remote audio source...');
    submitAudio.src = REMOTE_AUDIO_URL;
    submitAudio.load();
  }
});

// Preload audio when user first interacts with page (ensures iOS Safari / Android Chrome unlock)
let audioUnlocked = false;
function unlockAudio() {
  if (!audioUnlocked) {
    audioUnlocked = true;
    submitAudio.load();
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
  window.addEventListener('click', unlockAudio, { once: true, passive: true });
}

let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let sourceConnected = false;

function setupWebAudioBoost() {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 2.0; // Boost to loud/high volume
        gainNode.connect(audioCtx.destination);
      }
    }

    if (audioCtx && gainNode && !sourceConnected) {
      try {
        const source = audioCtx.createMediaElementSource(submitAudio);
        source.connect(gainNode);
        sourceConnected = true;
      } catch {
        // MediaElementSource already connected or cross-origin
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (err) {
    console.warn('Web Audio gain boost initialization bypassed:', err);
  }
}

/**
 * Start playing submit audio on submit immediately in continuous loop at high volume
 */
export function playSubmitAudio(): Promise<void> {
  submitAudio.currentTime = 0;
  submitAudio.loop = true;
  submitAudio.volume = 1.0;

  // Attempt loud Web Audio boost
  setupWebAudioBoost();

  const playPromise = submitAudio.play();
  if (playPromise !== undefined) {
    return playPromise.catch((err) => {
      console.warn('Audio play error, retrying with remote source:', err);
      submitAudio.src = REMOTE_AUDIO_URL;
      submitAudio.loop = true;
      submitAudio.volume = 1.0;
      return submitAudio.play().catch((e) => console.warn('Retry failed:', e));
    });
  }
  return Promise.resolve();
}

/**
 * Stop audio (if needed)
 */
export function stopSubmitAudio(): void {
  submitAudio.pause();
  submitAudio.currentTime = 0;
}

