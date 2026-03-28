'use client';

import React, { ForwardedRef, InputHTMLAttributes, useRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleRef = (el: HTMLInputElement | null) => {
      if (el !== null) {
        inputRef.current = el;
      }
      if (ref !== null && typeof ref === 'function') {
        ref(el);
      } else if (ref !== null && ref !== undefined) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#94a3b8] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={handleRef}
          className={`
            w-full px-4 py-2.5 rounded-lg bg-[#1e293b] border border-[#334155]
            text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent
            transition-all duration-200 ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#ef4444]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

const WrappedInput = (
  props: InputProps & { ref?: ForwardedRef<HTMLInputElement> }
) => <Input {...props} />;

export default WrappedInput;
