"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdminContext } from "@/context/AdminContext";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const { fetchUserProfile } = useAdminContext();

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
        toast.error(result.detail || "Login failed", { duration: 4000 });
        throw new Error(result.detail || "Login failed");
      }

      // ⛔ Only allow admin login
      if (result.role !== "admin") {
        toast.error("Only admin can login.", { duration: 4000 });
        throw new Error("Unauthorized: Admin access only.");
      }

      localStorage.setItem("token", result.access_token);

      await fetchUserProfile();

      toast.success("Login successful! Welcome Admin.", { duration: 3000 });
      router.push("/admin/profile");

    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardContent className="login-content">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div className="form-group">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ReloadIcon className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {errors.root && (
              <p className="form-error text-center">{errors.root.message}</p>
            )}
          </form>

          <div className="login-footer">
   
            <p className="signup-note">
              Don’t have an account?
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
