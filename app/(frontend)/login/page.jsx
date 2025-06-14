'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.detail || "Login failed");
        throw new Error(result.detail || "Login failed");
      }

      localStorage.setItem("token", result.access_token);
      window.dispatchEvent(new Event("tokenSet"));
      toast.success("Login successful!");
      router.push("/profile");

    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-content">
          <div className="login-heading">
            <h1>Welcome Back</h1>
            <p>Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-btn">
              {isSubmitting ? (
                <>
                  <ReloadIcon className="loading-icon" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            {errors.root && (
              <p className="error-text center">{errors.root.message}</p>
            )}
          </form>

          <div className="login-footer">
            <Link href="/forgot-password" className="link">
              Forgot password?
            </Link>
            <div>
              Don’t have an account?{" "}
              <Link href="/signup" className="link">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
