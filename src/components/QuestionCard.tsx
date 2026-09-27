import React, { useRef } from 'react';
import { QuestionConfig } from '../surveyConfig';

interface QuestionCardProps {
  question: QuestionConfig;
  value: string;
  otherValue?: string;
  error?: string;
  isActive?: boolean;
  onFocus?: () => void;
  onChange: (val: string) => void;
  onOtherChange?: (val: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  otherValue = '',
  error,
  isActive = false,
  onFocus,
  onChange,
  onOtherChange,
}) => {
  const otherInputRef = useRef<HTMLInputElement>(null);

  const isOtherSelected = value === 'Other';
  const hasError = Boolean(error);

  return (
    <div
      id={`question-card-${question.id}`}
      tabIndex={-1}
      onClick={onFocus}
      className={`bg-white rounded-lg p-5 md:p-6 mb-3 border transition-all duration-200 shadow-sm outline-none ${
        hasError
          ? 'border-[#d93025] shadow-xs'
          : isActive
          ? 'border-[#dadce0] border-l-[6px] border-l-[#673ab7] shadow-md'
          : 'border-[#dadce0] hover:border-[#c2c5c9]'
      }`}
    >
      {/* Question Title & Required Asterisk */}
      <div className="mb-4">
        <label
          htmlFor={`input-${question.id}`}
          className="text-base font-normal text-[#202124] leading-snug block"
        >
          {question.title}
          {question.required && (
            <span
              className="text-[#d93025] ml-1 font-medium select-none"
              title="Required"
              aria-label="required"
            >
              *
            </span>
          )}
        </label>
        {question.helpText && (
          <p className="text-xs text-[#5f6368] mt-1">{question.helpText}</p>
        )}
      </div>

      {/* Input Types */}
      {question.type === 'text' && (
        <div className="mt-2 pt-2 max-w-xl">
          <div className="relative group">
            <input
              id={`input-${question.id}`}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={onFocus}
              placeholder={question.placeholder || 'Your answer'}
              className="w-full py-2 bg-transparent text-sm md:text-base text-[#202124] border-b border-[#dadce0] focus:border-b-transparent focus:outline-none transition-colors placeholder-[#70757a]"
            />
            {/* Animated purple underline highlight on focus */}
            <span
              className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#673ab7] transition-transform duration-300 origin-center ${
                isActive ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </div>
        </div>
      )}

      {question.type === 'radio' && question.options && (
        <div className="space-y-3 mt-1">
          {question.options.map((option) => {
            const isOther = option === 'Other' && question.hasOther;
            const isSelected = value === option;

            return (
              <div
                key={option}
                className="flex items-center group cursor-pointer py-1"
                onClick={() => {
                  onChange(option);
                  onFocus?.();
                  if (isOther && otherInputRef.current) {
                    otherInputRef.current.focus();
                  }
                }}
              >
                {/* Google Forms-style custom Radio Button */}
                <div className="relative flex items-center justify-center w-6 h-6 mr-3 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#673ab7]'
                        : 'border-[#5f6368] group-hover:border-[#202124]'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full bg-[#673ab7] transition-transform duration-200 ${
                        isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                    />
                  </div>
                  {/* Subtle ripple background on hover */}
                  <div className="absolute inset-0 rounded-full group-hover:bg-[#673ab7]/10 transition-colors pointer-events-none" />
                </div>

                {/* Option text */}
                {!isOther ? (
                  <span className="text-sm md:text-[14.5px] text-[#202124] select-none leading-normal">
                    {option}
                  </span>
                ) : (
                  <div className="flex items-center flex-1 gap-2 flex-wrap sm:flex-nowrap">
                    <span className="text-sm md:text-[14.5px] text-[#202124] select-none shrink-0">
                      Other:
                    </span>
                    <div className="relative flex-1 min-w-[140px] max-w-sm">
                      <input
                        ref={otherInputRef}
                        type="text"
                        value={otherValue}
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange('Other');
                          onFocus?.();
                        }}
                        onChange={(e) => {
                          onChange('Other');
                          onOtherChange?.(e.target.value);
                        }}
                        onFocus={() => {
                          onChange('Other');
                          onFocus?.();
                        }}
                        placeholder={question.otherPlaceholder || 'Other...'}
                        className="w-full py-1 text-sm md:text-[14.5px] text-[#202124] bg-transparent border-b border-[#dadce0] focus:border-b-transparent focus:outline-none placeholder-[#70757a]"
                      />
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#673ab7] transition-transform duration-300 origin-center ${
                          isOtherSelected && isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Validation Error Message */}
      {hasError && (
        <div className="flex items-center gap-2 mt-4 text-[#d93025] text-xs md:text-sm font-normal">
          <svg
            className="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>{error || 'This is a required question'}</span>
        </div>
      )}
    </div>
  );
};
