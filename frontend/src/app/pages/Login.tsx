import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button, Input } from "../components/UI";
import { motion } from "motion/react";
import { loginUser } from "../services/authService"; // ✅ ADD THIS

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser({
        email,
        password,
      });

      console.log(res);

      if (res.message === "Login successful") {
        // ✅ store user in localStorage
        localStorage.setItem("user", JSON.stringify(res.user));

        alert("Login successful");

        // ✅ redirect
        navigate("/app/dashboard");
      } else {
        alert(res);
      }
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Illustration */}
      <motion.div
        className="hidden w-1/2 bg-slate-50 lg:block relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-indigo-600/10 mix-blend-multiply" />
        <div className="relative flex h-full items-center justify-center p-12">
          <motion.div
            className="max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className="mb-8 flex justify-center"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <MapPin className="h-24 w-24 text-indigo-600" />
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold text-slate-900">
              Welcome to GeoTrack SaaS
            </h1>
            <p className="text-lg text-slate-600">
              GPS-based attendance management system for modern enterprises.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Login form */}
      <motion.div
        className="flex w-full items-center justify-center p-8 lg:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h1>
            <p className="text-sm text-slate-500">
              Enter your credentials to access your dashboard
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleLogin}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-900">
                Email
              </label>
              <Input
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-900">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full mt-2" size="lg">
              Sign In
            </Button>
          </motion.form>

          <div className="text-center text-sm text-slate-500">
            Need an account? Contact your HR administrator.
          </div>
        </div>
      </motion.div>
    </div>
  );
}