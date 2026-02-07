"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebaseAuth } from "@/lib/firebase/client";
import type { Auth as FirebaseAuth } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import * as React from "react";
import { toast } from "sonner";

export function EmailAuthForm() {
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const auth = firebaseAuth();
      if (!auth) {
        throw new Error("Authentication service not available");
      }
      
      if (mode === "login") {
        await signInWithEmailAndPassword(auth as FirebaseAuth, email, password);
        toast.success("Signed in");
      } else {
        await createUserWithEmailAndPassword(auth as FirebaseAuth, email, password);
        toast.success("Account created");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Auth failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-md bg-neutral-100 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-md px-3 py-2 ${
            mode === "login" ? "bg-white shadow-sm" : "text-neutral-600"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-md px-3 py-2 ${
            mode === "signup" ? "bg-white shadow-sm" : "text-neutral-600"
          }`}
        >
          Signup
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
        />
      </div>

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Please wait…" : mode === "login" ? "Continue" : "Create account"}
      </Button>
    </form>
  );
}

