"use client";

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
import { useRouter, useSearchParams } from "next/navigation";
import {
  PasswordInput,
  PasswordInputAdornmentToggle,
  PasswordInputInput,
} from "@/components/ui/password-input";
import { resetPasswordAction } from "@/app/action/reset-password-action";
import { ArrowUpLeft } from "lucide-react";

export function ResetPasswordFrom() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    null
  );
  const [isTransitioning, startTransition] = useTransition();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Geçersiz veya eksik sıfırlama tokeni");
    }
  }, [token]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      // Clear password inputs on error
      setNewPassword("");
      setConfirmPassword("");
    } else if (state?.success) {
      toast.success(
        "Şifre başarıyla sıfırlandı! Giriş sayfasına yönlendiriliyorsunuz..."
      );
      // Clear inputs on success
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [state, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (!token) {
      toast.error("Geçersiz sıfırlama tokeni");
      return;
    }

    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#171717]">
      <Card className="w-full max-w-md bg-[#171717]">
        <Logo width={40} height={50} className="self-center" />
        <CardHeader>
          <CardTitle>Şifre Sıfırla</CardTitle>
          <CardDescription>Yeni şifrenizi aşağıya girin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="token" value={token || ""} />

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Yeni Şifre
              </label>
              <PasswordInput>
                <PasswordInputInput
                  name="newPassword"
                  placeholder="Yeni şifrenizi girin (min 6 karakter)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-white"
                  required
                />
                <PasswordInputAdornmentToggle />
              </PasswordInput>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Şifreyi Onayla
              </label>
              <PasswordInput>
                <PasswordInputInput
                  placeholder="Yeni şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-white"
                  required
                />
                <PasswordInputAdornmentToggle />
              </PasswordInput>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isTransitioning || !token}
            >
              {isPending || isTransitioning
                ? "Sıfırlanıyor..."
                : "Şifreyi Sıfırla"}
            </Button>

            <div className="text-center text-sm">
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
