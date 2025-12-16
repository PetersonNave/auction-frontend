'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

// A INTERFACE PERMANECE IDÊNTICA
interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'info';
}

export default function ConfirmModal({
  open,
  title = 'Tem certeza?',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmModalProps) {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      
      <div 
        className="fixed inset-0 bg-gray-950/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onCancel}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          
          <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl ring-1 ring-black/5 transition-all sm:my-8 sm:w-full sm:max-w-lg animate-in fade-in zoom-in-95 duration-300">
            
            <div className="absolute right-4 top-4 z-10">
              <button 
                onClick={onCancel}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                
                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                  isDanger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {isDanger ? (
                    <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Info className="h-6 w-6" aria-hidden="true" />
                  )}
                </div>

                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-bold leading-6 text-gray-900 tracking-tight" id="modal-title">
                    {title}
                  </h3>
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

            <div className="bg-gray-50/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3 border-t border-gray-100">
              <button
                type="button"
                className={`inline-flex w-full justify-center items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto ${
                  isDanger 
                    ? 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600 shadow-red-200' 
                    : 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600 shadow-blue-200'
                }`}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
              
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:mt-0 sm:w-auto transition-all"
                onClick={onCancel}
              >
                {cancelLabel}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}