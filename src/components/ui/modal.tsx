import * as React from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/70 backdrop-blur-xs overflow-y-auto"
    >
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg my-auto bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-border flex items-start justify-between gap-4 shrink-0 bg-surface">
          <div>
            <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-ink leading-tight">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="text-xs sm:text-sm text-muted mt-1">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-muted hover:text-ink hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 shrink-0 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};
