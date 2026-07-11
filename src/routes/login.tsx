import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Scale, Sparkles, Loader2, Lock, Mail } from "lucide-react";
import { demoOk } from "@/lib/demo-actions";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("anita.nair@novainsurance.in");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      demoOk("Welcome back, Anita!", "Signed in successfully to Command Center.");
      navigate({ to: "/" });
    }, 1200);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[oklch(0.12_0.02_258)] px-4 py-12 sm:px-6 lg:px-8">
      {/* Dynamic Background with floating glow effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-[oklch(0.28_0.06_258)]/20 blur-3xl animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-[oklch(0.62_0.14_55)]/10 blur-3xl animate-pulse duration-[8000ms]" />

      <div className="relative w-full max-w-md space-y-8">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.62_0.14_55)] to-[oklch(0.7_0.15_65)] shadow-lg shadow-[oklch(0.62_0.14_55)]/20 animate-bounce duration-[3000ms]">
            <Scale className="h-7 w-7 text-[oklch(0.15_0.02_258)]" strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            LegalOS
          </h1>
          <p className="mt-2 text-sm text-[oklch(0.88_0.015_250)]/70 tracking-wide font-medium">
            From Documents to Decisions
          </p>
        </div>

        {/* Login Card */}
        <div className="card-elevated border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.62_0.14_55)] to-transparent" />
          
          <form className="mt-4 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.88_0.015_250)]/60 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[oklch(0.88_0.015_250)]/40 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-[oklch(0.88_0.015_250)]/30 focus:border-[oklch(0.62_0.14_55)] focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.14_55)]/20 transition-all"
                    placeholder="name@novainsurance.in"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.88_0.015_250)]/60 block">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      demoOk("Reset Link Sent", "Check your email for instructions.");
                    }}
                    className="text-[11px] font-semibold text-[oklch(0.62_0.14_55)] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[oklch(0.88_0.015_250)]/40 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-[oklch(0.88_0.015_250)]/30 focus:border-[oklch(0.62_0.14_55)] focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.14_55)]/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Remember me (Visual only) */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-[oklch(0.62_0.14_55)] focus:ring-[oklch(0.62_0.14_55)]/20"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-[oklch(0.88_0.015_250)]/60">
                Keep me signed in on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[oklch(0.62_0.14_55)] to-[oklch(0.7_0.15_65)] text-sm font-bold text-[oklch(0.15_0.02_258)] hover:shadow-lg hover:shadow-[oklch(0.62_0.14_55)]/20 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5" />
                  Sign In to Command Center
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-center space-y-2 text-center text-[10px] uppercase tracking-widest text-[oklch(0.88_0.015_250)]/40">
          <div>LegalOS Enterprise v2.4</div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Gemma-2 (Fireworks AI) Online
          </div>
        </div>
      </div>
    </div>
  );
}
