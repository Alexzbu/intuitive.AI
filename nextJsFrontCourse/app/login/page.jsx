"use client";

import { LoginForm } from "@/features/auth";
import { useLogin } from "@/features/auth";

export default function LoginPage() {
  const form = useLogin();

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">Welcome Back!</h1>
        <LoginForm {...form} />
      </div>
    </div>
  );
}
