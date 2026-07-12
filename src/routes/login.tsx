import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, Loader2, Lock, Mail, User, Building, Moon, Sun, ArrowRight, ShieldCheck } from "lucide-react";
import { demoOk } from "@/lib/demo-actions";
import { login, signup } from "@/lib/api";
import { setUser } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Theme toggle state
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial document state
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!email.endsWith("@insurance.in")) {
        setError("For this demo, email must be an @insurance.in address.");
        return;
      }
      if (password.length < 8 || password.length > 12) {
        setError("Password must be exactly between 8 and 12 characters.");
        return;
      }
    } else {
      if (!email || !password) {
        setError("Please enter your email and password.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const user = await signup({ email, password, name, company });
        setUser(user);
        demoOk(`Welcome to LegalOS, ${name || "User"}!`, "Account created successfully.");
      } else {
        const user = await login({ email, password });
        setUser(user);
        demoOk("Welcome back!", "Signed in successfully to Command Center.");
      }
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    setUser({ id: "demo", name: "Anita Nair", email: "anita.nair@novainsurance.in", company: "Nova Insurance Ltd." });
    demoOk("Demo Mode Initiated", "Bypassing authentication for demo showcase.");
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      {/* Left Side - Branding & Description (Hidden on mobile) */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between border-r border-border bg-secondary/30 p-12 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10">
          <img
            src={isDark ? "/logo-dark.png" : "/logo-light.png"}
            alt="LegalOS Logo"
            className="h-20 object-contain mb-12"
          />
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            The Intelligent Operating System for Insurance Legal Teams.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
            LegalOS powers the backend of modern insurance disputes. Manage case portfolios, track risk, extract cross-document intelligence, and automate workflows in one unified platform.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              Powered by Gemma-2 on AMD Instinct™ MI300X
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent">
                <ShieldCheck className="h-4 w-4" />
              </div>
              Bank-grade security & enterprise compliance
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground font-semibold uppercase tracking-widest">
          LegalOS Enterprise v2.4
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img
              src={isDark ? "/logo-dark.png" : "/logo-light.png"}
              alt="LegalOS Logo"
              className="h-16 object-contain mb-4"
            />
            <h2 className="text-2xl font-bold">LegalOS</h2>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSignUp ? "Join the next generation of legal intelligence." : "Sign in to access your Command Center."}
              </p>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/50 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/50 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Nova Insurance Ltd."
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                Email Address {isSignUp && <span className="text-xs normal-case font-normal text-muted-foreground/70">(Must be @insurance.in)</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/50 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder={isSignUp ? "name@insurance.in" : "name@company.com"}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Password {isSignUp && <span className="text-xs normal-case font-normal text-muted-foreground/70">(8-12 chars)</span>}
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => demoOk("Reset Link Sent", "Check your email for instructions.")}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/50 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Authenticating..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Button */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground uppercase tracking-widest font-semibold">Or</span>
              </div>
            </div>

            <button
              onClick={handleDemo}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-bold text-foreground hover:bg-secondary/80 transition-all"
            >
              Explore Live Demo <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Toggle Link */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="font-semibold text-primary hover:underline focus:outline-none"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
