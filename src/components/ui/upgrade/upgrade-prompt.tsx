"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Feature, getUpgradeMessage } from "@/lib/features/gating";
import { Crown, Lock, Sparkles } from "lucide-react";

interface UpgradePromptProps {
  feature: Feature;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradePrompt({ feature, isOpen, onClose, onUpgrade }: UpgradePromptProps) {
  const message = getUpgradeMessage(feature);
  const isUltra = message.title.includes("Ultra");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {isUltra ? (
              <Crown className="h-6 w-6 text-purple-500" />
            ) : (
              <Sparkles className="h-6 w-6 text-blue-500" />
            )}
            <DialogTitle className="text-xl">{message.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {message.message}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{message.buttonText}</span>
            <Badge variant={isUltra ? "default" : "secondary"}>
              {isUltra ? "$49/month" : "$19/month"}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>Includes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>More generations per month</li>
              <li>All premium templates</li>
              <li>AI-powered features</li>
              <li>Priority support</li>
              <li>No watermark</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={onUpgrade} className={isUltra ? "bg-purple-600 hover:bg-purple-700" : ""}>
            {message.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Locked feature badge component
interface LockedFeatureProps {
  feature: Feature;
  children: React.ReactNode;
  onLockedClick?: () => void;
}

export function LockedFeature({ feature, children, onLockedClick }: LockedFeatureProps) {
  return (
    <div 
      className="relative inline-block" 
      onClick={onLockedClick}
    >
      {children}
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-white/80 transition-colors">
        <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
          <Lock className="h-3 w-3" />
          <span>Upgrade</span>
        </div>
      </div>
    </div>
  );
}

