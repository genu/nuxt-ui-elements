import { useOverlay } from "#imports"
import DialogConfirm from "../components/DialogConfirm.vue"
import DialogAlert from "../components/DialogAlert.vue"
import type { DialogConfirmProps, DialogAlertProps } from "../types"

export const useDialog = () => {
  const overlay = useOverlay()

  const confirm = (options: DialogConfirmProps): void => {
    const modal = overlay.create(DialogConfirm, {
      destroyOnClose: true,
      props: options as any,
    })

    // Auto-open the dialog
    modal.open()
  }

  const alert = (options: DialogAlertProps): void => {
    const modal = overlay.create(DialogAlert, {
      destroyOnClose: true,
      props: options as any,
    })

    // Auto-open the dialog
    modal.open()
  }

  return { confirm, alert }
}
