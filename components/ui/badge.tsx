'use client';

import React, { ReactNode } from 'react';
import clsx from 'clsx';

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'red' | 'blue';
};

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  const baseStyles = 'inline-block rounded-full px-3 py-1 text-xs font-semibold';
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    outline: 'border border-gray-300 text-gray-800',
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;
