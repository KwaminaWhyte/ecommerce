import { useState } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import IdGenerator from "~/lib/IdGenerator";

function generateRandomIds(n) {
  let randomIds = [];
  for (let i = 0; i < n; i++) {
    let randomId = Math.random().toString(36).substring(2, 15);
    randomIds.push(randomId);
  }
  return randomIds;
}

export function Toaster() {
  const { toasts } = useToast();
  const [uniqueId, setUniqueId] = useState(generateRandomIds(10));

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={IdGenerator()} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
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
