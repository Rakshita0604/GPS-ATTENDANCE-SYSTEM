import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "../components/UI";
import { loginUser, saveSession } from "../services/authService";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // Validate input
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("[LOGIN] Attempting login for:", email);
      const response = await loginUser({ email: email.trim(), password });
      console.log("[LOGIN] Success, user role:", response.user.role);
      
      saveSession(response);
      toast.success("Login successful");
      
      const redirectPath = response.user.role === "admin" ? "/app/admin-dashboard" : "/app/dashboard";
      console.log("[LOGIN] Redirecting to:", redirectPath);
      
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      console.error("[LOGIN] Error:", error);
      const errorMessage = error?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-slate-50 lg:flex lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <MapPin className="h-24 w-24 text-indigo-600" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-slate-900">GeoTrack Attendance</h1>
          <p className="text-lg text-slate-600">
            GPS-based attendance with location verification and photo capture.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <MapPin className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500">Use your employee or admin account.</p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-900">Email</label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-900">Password</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError("");
                }}
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            New here?{" "}
            <Link className="font-medium text-indigo-600 hover:underline" to="/signup">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
