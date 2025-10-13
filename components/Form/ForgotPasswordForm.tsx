"use client";

import { CostumInput } from "@/components/ui/custom-input";
import React, {
  useState,
  useEffect,
  useActionState,
  useTransition,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-custom";
import Link from "next/link";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { forgotPasswordAction } from "@/app/action/forgot-password-action";
import { ArrowUpLeft, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    null
  );
  const [isTransitioning, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      // Clear email input on error
      setEmail("");
    } else if (state?.success) {
      setEmailSent(true);
      setResendCountdown(60); // 60 saniye countdown başlat
      toast.success("Şifre sıfırlama linki email'inize gönderildi");
    }
  }, [state]);

  // Countdown timer için useEffect
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Tekrar gönderme fonksiyonu
  const handleResend = () => {
    const formData = new FormData();
    formData.append("email", state?.email || email);

    startTransition(() => {
      formAction(formData);
    });
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-[#171717]">
        <Card className="w-full max-w-md bg-[#171717]">
          <Logo width={40} height={50} className="self-center" />
          <CardHeader>
            <CardTitle>Email Kontrolü</CardTitle>
            <CardDescription>
              {state?.email || email} adresine şifre sıfırlama linki gönderdik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Email&apos;inizdeki linke tıklayarak şifrenizi
                sıfırlayabilirsiniz. Link 1 saat geçerlidir.
              </p>

              {/* Tekrar gönder butonu */}
              <div className="flex flex-col items-center gap-2 p-4 bg-[#1f1f1f] rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>Email almadınız mı?</span>
                </div>
                <Button
                  onClick={handleResend}
                  disabled={resendCountdown > 0 || isTransitioning}
                  variant="outline"
                  className="w-full"
                >
                  {isTransitioning
                    ? "Gönderiliyor..."
                    : resendCountdown > 0
                      ? `Tekrar Gönder (${resendCountdown}s)`
                      : "Tekrar Gönder"}
                </Button>
              </div>

              <div className="text-center ">
                <Link
                  href="/login"
                  className="text-sm text-white underline flex items-center justify-center gap-1"
                >
                  <ArrowUpLeft className="w-4 h-4 text-white" />
                  Giriş Sayfasına Dön
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#171717]">
      <Card className="w-full max-w-md bg-[#171717]">
        <Logo width={40} height={50} className="self-center" />
        <CardHeader>
          <CardTitle>Şifremi Unuttum</CardTitle>
          <CardDescription>
            Email adresinizi girin, size şifre sıfırlama linki gönderelim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Email
              </label>
              <CostumInput
                name="email"
                type="email"
                placeholder="Email adresinizi girin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isTransitioning}
            >
              {isPending || isTransitioning
                ? "Gönderiliyor..."
                : "Sıfırlama Linki Gönder"}
            </Button>

            <div className="text-center text-sm ">
              <Link
                href="/login"
                className="text-white underline flex items-center justify-center gap-1"
              >
                <ArrowUpLeft className="w-4 h-4 text-white" />
                Giriş Sayfasına Dön
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
