import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import client from "@/utils/apolloClient";
import { loginSchema } from "../schemas/loginSchema";
import { LOGIN_MUTATION } from "../api/authMutations";

export function useLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser] = useMutation(LOGIN_MUTATION, { client });

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
      const result = await loginUser({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
      if (!result.data?.login?.objectId) {
        throw new Error("Login failed. Please try again.");
      }
      localStorage.setItem("user", JSON.stringify({
        objectId: result.data.login.objectId,
        position: result.data.login.position,
        firstName: result.data.login.firstName,
      }));
      toast.success("Welcome back!", { id: toastId });
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err.message || "Invalid credentials. Please try again.", { id: toastId });
    }
  };

  return { register, handleSubmit, errors, isSubmitting, onSubmit, showPassword, togglePassword };
}
