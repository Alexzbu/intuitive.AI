import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { registerSchema } from "../schemas/registerSchema";

export function useRegister() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data) => {
    try {
      // TODO: connect to registration API
      console.log("Register payload:", data);
      toast.success("Registration successful!");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return { register, handleSubmit, errors, isSubmitting, onSubmit, showPassword, togglePassword };
}
