'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

export function DialogContent({ children, className, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 bg-white p-6 rounded-xl shadow-lg w-full max-w-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }) {
  return (
    <DialogPrimitive.Title>
      <VisuallyHidden>{children}</VisuallyHidden>
    </DialogPrimitive.Title>
  )
}

export function DialogDescription({ children }) {
  return (
    <DialogPrimitive.Description>
      <VisuallyHidden>{children}</VisuallyHidden>
    </DialogPrimitive.Description>
  )
}

export function DialogFooter({ children }) {
  return <div className="mt-4">{children}</div>
}
