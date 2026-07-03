/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;

/**
 * Play a highly realistic physical-mechanical "click" sound using the Web Audio API
 * to simulate physical haptic feedback on non-vibrating devices (such as desktops or iOS).
 */
export function playWebHapticSound(frequency = 1600, duration = 0.012) {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }

    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // High frequency tone for short tick
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Quick exponential decay for the "tap" feel
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Gracefully catch any blocked autoplays
  }
}

/**
 * Triggers premium sensory haptic feedback.
 * Combines physical device vibration (if available) with a synchronized high-quality physical audio tick.
 */
export function triggerHapticFeedback() {
  // 1. Device physical vibration (best for Android / touchscreens)
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(15); // Short, tactile 15ms pulse
    } catch (e) {
      // Ignored
    }
  }

  // 2. High-fidelity audio tick (works everywhere, providing click response)
  playWebHapticSound(1400, 0.01);
}

/**
 * Play an alternate double-tick or lower-frequency accent feedback for toggle actions.
 */
export function triggerToggleHaptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate([10, 30, 10]); // double pulse
    } catch (e) {
      // Ignored
    }
  }

  playWebHapticSound(1000, 0.015);
  setTimeout(() => playWebHapticSound(1200, 0.012), 40);
}

/**
 * Play a nice high-pitched chime for successful actions (e.g. Copy successful, login success).
 */
export function triggerSuccessHaptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate([15, 50, 20]);
    } catch (e) {
      // Ignored
    }
  }

  // Chime chord
  playWebHapticSound(1500, 0.02);
  setTimeout(() => playWebHapticSound(1800, 0.02), 50);
  setTimeout(() => playWebHapticSound(2200, 0.03), 100);
}
