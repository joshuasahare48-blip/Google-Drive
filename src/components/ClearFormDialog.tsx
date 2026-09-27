import React from 'react';

interface ClearFormDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ClearFormDialog: React.FC<ClearFormDialogProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 space-y-4 border border-gray-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-form-title"
      >
        <h3
          id="clear-form-title"
          className="text-lg font-medium text-[#202124]"
        >
          Clear form?
        </h3>
        <p className="text-sm text-[#5f6368] leading-relaxed">
          This will remove your answers from all questions and cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#673ab7] hover:bg-[#ede7f6] rounded cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-[#673ab7] hover:bg-[#ede7f6] rounded cursor-pointer transition-colors"
          >
            Clear form
          </button>
        </div>
      </div>
    </div>
  );
};
