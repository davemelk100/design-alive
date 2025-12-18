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
        // Debug logging
        if (open) {
          console.log("Rendering toast:", { id, title, description, open });
        }
        
        return (
          <Toast
            key={id}
            open={open}
            onOpenChange={(newOpen) => {
              console.log("Toast onOpenChange:", { id, newOpen, hasTimeout: true });
              if (onOpenChange) {
                onOpenChange(newOpen);
              }
            }}
            duration={Infinity}
            variant="default"
            className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl"
            style={{ 
              zIndex: 99999, 
              position: "fixed",
              top: "1rem",
              right: "1rem",
              minWidth: "300px",
              maxWidth: "420px"
            }}
            {...props}
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-sm">{description}</ToastDescription>
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
