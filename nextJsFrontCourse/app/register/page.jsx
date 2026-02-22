"use client";

import { RegisterForm } from "@/features/auth";
import { useRegister } from "@/features/auth";

export default function RegisterPage() {
  const form = useRegister();

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">Get Started</h1>
        <RegisterForm {...form} />
      </div>
    </div>
  );
}
