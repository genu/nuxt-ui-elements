import DialogConfirm from "../components/DialogConfirm.vue";
import { useOverlay } from "#imports";
import { navigateTo } from "#app";

type CallbackFn = () => void | Promise<void>;
type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | (string & {})
type Variant = "solid" | "outline";

export interface DialogConfirmOptions {
  title: string;
  description?: string;
  icon?: boolean;
  confirmLabel?: string;
  dismissLabel?: string;
  color?: Color;
  variant?: Variant;
  close?: boolean;
  onConfirm?: CallbackFn;
  onDismiss?: CallbackFn;
  ui?: any;
}

export const useDialog = () => {
  const overlay = useOverlay();

  const confirm = (options: DialogConfirmOptions) => {
    const modal = overlay.create(DialogConfirm, {
      destroyOnClose: true,
      props: options as any,
    });

    // Auto-open the dialog
    modal.open();

    return modal;
  };

  const confirmNavigate = (
    path: string,
    options?: Omit<DialogConfirmOptions, "title" | "description" | "onConfirm">
  ) => {
    confirm({
      title: "Leave this page?",
      description:
        "Are you sure you want to navigate away? Unsaved changes will be lost.",
      ...options,
      onConfirm: () => {
        navigateTo(path);
      },
    });
  };

  return { confirm, confirmNavigate };
};
