import DialogConfirm from "../components/DialogConfirm.vue"
import DialogAlert from "../components/DialogAlert.vue"
import { useOverlay } from "#imports"

type CallbackFn = () => void | Promise<void>
type Color = "primary" | "secondary" | "success" | "info" | "warning" | "error" | (string & {})
type Variant = "solid" | "outline"

export interface DialogConfirmOptions {
  title: string
  description?: string
  icon?: boolean
  confirmLabel?: string
  dismissLabel?: string
  color?: Color
  variant?: Variant
  close?: boolean
  onConfirm?: CallbackFn
  onDismiss?: CallbackFn
  ui?: any
}

export interface DialogAlertOptions {
  title: string
  description?: string
  icon?: string
  label?: string
  color?: Color
  variant?: Variant
  onDismiss?: CallbackFn
  ui?: any
}

export const useDialog = () => {
  const overlay = useOverlay()

  const confirm = (options: DialogConfirmOptions): void => {
    const modal = overlay.create(DialogConfirm, {
      destroyOnClose: true,
      props: options as any,
    })

    // Auto-open the dialog
    modal.open()
  }

  const alert = (options: DialogAlertOptions): void => {
    const modal = overlay.create(DialogAlert, {
      destroyOnClose: true,
      props: options as any,
    })

    // Auto-open the dialog
    modal.open()
  }

  return { confirm, alert }
}
