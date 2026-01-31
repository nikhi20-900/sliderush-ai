"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      closeButton
      toastOptions={{
        duration: 3500,
      }}
    />
  );
}

