'use client'

import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-stone-300">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`border ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-border focus:ring-amber-500 focus:border-amber-500'
          } rounded-lg px-4 py-3 bg-card text-base text-foreground placeholder:text-gray-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
