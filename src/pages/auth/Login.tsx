"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { z } from "zod";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { EyeIcon, EyeOffIcon, BookOpen, KeyRound, Mail } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import axios from "axios";

// Skema validasi Zod
const signInSchema = z.object({
  email: z
    .string()
    .email("Email tidak valid")
    .refine(
      (email) =>
        email.endsWith("@student.unri.ac.id") ||
        email.endsWith("@lecturer.unri.ac.id") ||
        email.endsWith("@eng.unri.ac.id"),
      {
        message:
          "Gunakan email kampus Universitas Riau (student.unri.ac.id atau lecturer.unri.ac.id)",
      }
    ),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type FormErrors = {
  email?: string;
  password?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (formErrors.password) {
      setFormErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleRecaptchaVerify = (token: string | null) => {
    if (token) {
      setRecaptchaToken(token);
    } else {
      toast.error("Harap Selesaikan Verifikasi ReCAPTCHA");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = signInSchema.safeParse({ email, password });
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        setFormErrors({
          email: errors.email?.[0],
          password: errors.password?.[0],
        });
        setIsLoading(false);
        return;
      }

      // Cek ReCAPTCHA
      if (!recaptchaToken) {
        toast.error("Harap Selesaikan Verifikasi ReCAPTCHA");
        setIsLoading(false);
        return;
      }

      // Panggil API login
      const response = await axios.post(
        "http://localhost:5500/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      login(token, user);
      setTimeout(() => {
        toast.success("Login berhasil");

        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Terjadi kesalahan: ", error);
      toast.error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.error
          : "Terjadi kesalahan saat login"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">LATEST</h1>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-4xl font-heading font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Masukkan kredensial untuk mengakses akun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {(formErrors.email || formErrors.password) && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    {formErrors.email || formErrors.password}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Masukkan email kampus"
                      className="pl-9"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="pl-9"
                      value={password}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={handleRecaptchaVerify}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sedang masuk..." : "Masuk"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register disini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
