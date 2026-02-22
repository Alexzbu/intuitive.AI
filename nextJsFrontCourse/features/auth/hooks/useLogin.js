import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema } from "../schemas/loginSchema";

export function useLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Signing in...");
    try {
      // TODO: connect to login API
      console.log("Login payload:", data);
      toast.success("Welcome back!", { id: toastId });
    } catch (err) {
      toast.error("Invalid credentials. Please try again.", { id: toastId });
    }
  };

  return { register, handleSubmit, errors, isSubmitting, onSubmit, showPassword, togglePassword };
}
