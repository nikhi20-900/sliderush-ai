"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import * as React from "react";

declare global {
  var _sl_otpRecaptcha: any;
}

export function PhoneOtpForm() {
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState<"phone" | "code">("phone");
  const [confirmation, setConfirmation] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!globalThis._sl_otpRecaptcha) {
      const { RecaptchaVerifier } = require("firebase/auth");
      const { firebaseAuth } = require("@/lib/firebase/client");
      const auth = firebaseAuth();
      globalThis._sl_otpRecaptcha = new RecaptchaVerifier(auth, "phone-recaptcha-container", {
        size: "invisible",
      });
    }
  }, []);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setStep("code");
    setIsLoading(false);
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    window.location.href = "/dashboard";
  }

  if (step === "phone") {
    return (
      <form onSubmit={sendCode} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11"
          />
          <p className="text-xs text-neutral-500">
            We will send you a verification code
          </p>
        </div>
        <Button type="submit" size="lg" className="w-full h-11" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            <>
              Send OTP
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        <div id="phone-recaptcha-container" />
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Enter verification code</Label>
        <Input
          id="code"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          className="h-11 text-center text-lg tracking-widest"
          maxLength={6}
        />
        <p className="text-xs text-neutral-500 text-center">
          We sent a code to your phone
        </p>
      </div>
      <Button type="submit" size="lg" className="w-full h-11" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verify & Continue
          </>
        )}
      </Button>
      <button
        type="button"
        onClick={() => { setStep("phone"); setCode(""); }}
        className="w-full text-sm text-neutral-500 hover:text-primary transition-colors"
      >
        ← Change phone number
      </button>
    </form>
  );
}

