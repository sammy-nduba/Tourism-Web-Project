import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../../shared/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg',
        {
          'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500':
            variant === 'primary',
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500':
            variant === 'secondary',
          'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-emerald-500':
            variant === 'outline',
          'text-gray-700 hover:bg-gray-100 focus:ring-emerald-500':
            variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}