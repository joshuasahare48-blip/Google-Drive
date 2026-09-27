import React from 'react';
import { surveyConfig } from '../surveyConfig';

export const HeaderCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-[#dadce0] shadow-sm overflow-hidden mb-3 transition-shadow hover:shadow-md">
      {/* Top purple stripe signature to Google Forms */}
      <div
        className="h-2.5 w-full"
        style={{ backgroundColor: surveyConfig.themeColor.primary }}
      />

      <div className="p-6 md:p-7">
        {/* Form Title */}
        <h1 className="text-2xl md:text-[32px] font-normal leading-tight text-[#202124] tracking-normal mb-3">
          {surveyConfig.formTitle}
        </h1>

        {/* Form Description */}
        <p className="text-sm md:text-[14.5px] leading-relaxed text-[#202124] mb-5 whitespace-pre-line">
          {surveyConfig.formDescription}
        </p>

        {/* Divider */}
        <div className="border-t border-[#dadce0] pt-3 flex items-center justify-between">
          <span className="text-xs md:text-sm text-[#d93025] font-normal">
            * Indicates required question
          </span>
        </div>
      </div>
    </div>
  );
};
