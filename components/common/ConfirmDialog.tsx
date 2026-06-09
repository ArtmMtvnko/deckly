'use client'

import { Modal } from './Modal'

type ConfirmVariant = 'danger' | 'warning'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel: string
  loading?: boolean
  variant?: ConfirmVariant
}

const CONFIRM_VARIANT_CLASSES: Record<ConfirmVariant, string> = {
  danger: 'bg-red-600 hover:bg-red-700',
  warning: 'bg-amber-600 hover:bg-amber-700',
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  loading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  function handleConfirm(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (loading) return
    onConfirm()
  }

  function handleCancel(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-content-secondary dark:text-content-secondary-dark text-sm">
        {description}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="rounded-button border-border text-content-primary hover:bg-interactive-bg-hover dark:border-border-dark dark:text-content-primary-dark dark:hover:bg-interactive-bg-hover-dark cursor-pointer border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className={`rounded-button cursor-pointer px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${CONFIRM_VARIANT_CLASSES[variant]}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
