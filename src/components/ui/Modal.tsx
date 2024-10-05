// src/components/ui/modal.tsx

"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      )}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close modal"
        >
          ✕
        </button>
        {/* Adjust padding to account for the close button */}
        <div className="flex-1 overflow-auto pt-6 px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

