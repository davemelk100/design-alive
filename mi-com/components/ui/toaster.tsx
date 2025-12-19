"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        open,
        onOpenChange,
        duration = 3000,
        ...props
      }) {
        return (
          <Toast
            key={id}
            open={open}
            onOpenChange={onOpenChange}
            duration={Infinity}
            variant="default"
            className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 shadow-2xl"
            style={{
              zIndex: 99999,
              position: "fixed",
              top: "1rem",
              right: "1rem",
              minWidth: "300px",
              maxWidth: "420px",
            }}
            {...props}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="font-semibold">{title}</ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-sm">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
