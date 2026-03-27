'use client';

import { ReactNode, ButtonHTMLAttributes, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#6366f1] hover:bg-[#4f46e5] text-white focus:ring-[#6366f1] hover:shadow-lg hover:shadow-[#6366f1]/30',
    secondary: 'bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] border border-[#334155] focus:ring-[#334155]',
    ghost: 'bg-transparent hover:bg-[#1e293b] text-[#94a3b8] hover:text-white focus:ring-[#6366f1]',
    success: 'bg-[#10b981] hover:bg-[#059669] text-white focus:ring-[#10b981] glow-success',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
