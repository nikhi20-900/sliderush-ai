"use client";

import * as React from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

declare global {
  // eslint-disable-next-line no-var
  var _sl_otpRecaptcha: RecaptchaVerifier | undefined;
}

export function PhoneOtpForm() {
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState<"phone" | "code">("phone");
  const [confirmation, setConfirmation] = React.useState<ConfirmationResult | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const auth = firebaseAuth();
    if (!globalThis.window) return;
    if (!globalThis._sl_otpRecaptcha) {
      globalThis._sl_otpRecaptcha = new RecaptchaVerifier(
        auth,
        "phone-recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, []);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const auth = firebaseAuth();
      const verifier = globalThis._sl_otpRecaptcha;
      if (!verifier) throw new Error("reCAPTCHA not ready. Refresh and try again.");
      const conf = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmation(conf);
      setStep("code");
      toast.success("OTP sent");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmation) return;
    setIsLoading(true);
    try {
      await confirmation.confirm(code);
      toast.success("Phone verified");
    } catch (err: any) {
      toast.error(err?.message ?? "Invalid code");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "phone") {
    return (
      <form onSubmit={sendCode} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending code…" : "Send OTP"}
        </Button>
        <div id="phone-recaptcha-container" />
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="code">OTP code</Label>
        <Input
          id="code"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying…" : "Verify & Continue"}
      </Button>
    </form>
  );
}

