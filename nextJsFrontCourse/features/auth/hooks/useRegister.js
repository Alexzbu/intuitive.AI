import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import client from "@/utils/apolloClient";
import { registerSchema } from "../schemas/registerSchema";
import { REGISTER_MUTATION } from "../api/authMutations";

export function useRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser] = useMutation(REGISTER_MUTATION, { client });
  const router = useRouter();

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
    const toastId = toast.loading("Creating account...");
    try {
      const result = await registerUser({
        variables: {
          salutation: data.salutation,
          firstName: data.firstName,
          lastName: data.lastName,
          organization: data.organization,
          email: data.email,
          password: data.password,
          position: data.position,
        },
      });
      if (!result.data?.register?.objectId) {
        throw new Error("Registration failed. Please try again.");
      }
      localStorage.setItem("user", JSON.stringify({
        objectId: result.data.register.objectId,
        position: data.position,
        firstName: data.firstName,
      }));
      toast.success("Registration successful!", { id: toastId });
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.", { id: toastId });
    }
  };

  return { register, handleSubmit, errors, isSubmitting, onSubmit, showPassword, togglePassword };
}
