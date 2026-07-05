"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneCall } from "lucide-react";

interface CallbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { name: string; phone: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ name: string; phone: string }>
  >;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  nameField: string;
  phoneField: string;
  title: string;
  description: string;
  submitText: string;
}

export default function CallbackDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  loading,
  onSubmit,
  nameField,
  phoneField,
  title,
  description,
  submitText,
}: CallbackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="cb-name" className="text-xs font-medium">
              {nameField} *
            </Label>
            <Input
              id="cb-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              placeholder={nameField}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cb-phone" className="text-xs font-medium">
              {phoneField} *
            </Label>
            <Input
              id="cb-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder={phoneField}
              required
              className="h-11"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-brand hover:bg-brand/85 text-white w-full h-12 text-[15px] font-medium rounded-lg disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {submitText}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <PhoneCall size={16} />
                {submitText}
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
