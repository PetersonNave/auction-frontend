'use client';

import React, { useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface InfoModalProps {
  open: boolean;
  title?: string;
  description?: string;
  closeLabel?: string;
  onClose: () => void;
}

export default function InfoModal({
  open,
  title,
  description,
  closeLabel = 'Fechar',
  onClose,
}: InfoModalProps) {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      
      <div 
        className="fixed inset-0 bg-gray-950/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          
          <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl ring-1 ring-black/5 transition-all sm:my-8 sm:w-full sm:max-w-sm animate-in fade-in zoom-in-95 duration-300">
            
            <div className="absolute right-4 top-4 z-10">
              <button 
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 pb-4 pt-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 mb-4 ring-4 ring-blue-50/50">
                  <Info className="h-7 w-7 text-blue-600" aria-hidden="true" />
                </div>

                <div className="mt-2">
                  {title && (
                    <h3 className="text-xl font-bold leading-6 text-gray-900 tracking-tight" id="modal-title">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 px-4 py-3 sm:px-6 border-t border-gray-100">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:-translate-y-0.5 active:translate-y-0"
                onClick={onClose}
              >
                {closeLabel}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}