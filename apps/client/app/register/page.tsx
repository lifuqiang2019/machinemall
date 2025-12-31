"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Github, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, Award, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // Add success state

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    // Timer state
    const [timer, setTimer] = useState(0);

    const handleSendCode = () => {
        if (!email) {
            setError("Please enter email address");
            return;
        }
        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        
        setError("");
        // Start Mock Timer
        setTimer(60);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Basic Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (!verificationCode) {
            setError("Please enter verification code");
            setIsLoading(false);
            return;
        }

        try {
            await authClient.signUp.email({
                email,
                password,
                name: email.split("@")[0], // Auto-fill name
                callbackURL: "/"
            }, {
                onError: (ctx) => setError(ctx.error.message || "Registration failed"),
                onSuccess: () => {
                    setSuccess("Registration successful! Redirecting...");
                    setTimeout(() => {
                        router.push("/");
                    }, 2000);
                }
            });
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "github" | "google") => {
        await authClient.signIn.social({
            provider,
            callbackURL: "/"
        });
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden">
            {/* Left Side: Creative Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0154A6] relative overflow-hidden flex-col justify-between p-16 text-white">
                {/* Abstract background decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                <div className="relative z-10">
                    <Link href="/">
                        <span className="text-[32px] font-extrabold tracking-tighter text-white">
                            MACH<span className="text-secondary text-shadow-glow">MALL</span>
                        </span>
                    </Link>

                    <div className="mt-24 space-y-12">
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold leading-tight mb-6">
                                Start Your <br />
                                <span className="text-secondary">Success Story</span>
                            </h1>
                            <p className="text-lg text-white/70 leading-relaxed font-light">
                                Join the world's fastest-growing B2B industrial hub. Get direct access to verified manufacturers and premium trade services.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors w-fit">
                                <div className="p-2 bg-secondary/20 rounded-lg text-secondary group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={24} />
                                </div>
                                <span className="text-sm font-bold">100% Secure Trade Protection</span>
                            </div>

                            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors w-fit">
                                <div className="p-2 bg-white/10 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <Award size={24} />
                                </div>
                                <span className="text-sm font-bold">Verified Global Manufacturers</span>
                            </div>
                        </div>

                        {/* Social Proof */}
                        <div className="pt-4 flex flex-col gap-3">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0154A6] bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 45}`} alt="user" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-bold border-2 border-[#0154A6]">
                                    10k+
                                </div>
                            </div>
                            <p className="text-sm font-medium text-white/60">Join over 10,000 global buyers today</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-white/40 text-[12px] uppercase tracking-widest font-bold">
                    <p>© 2025 Machmall Industrial Group</p>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/30">
                <div className="w-full max-w-[460px]">
                    <div className="lg:hidden text-center mb-10">
                        <Link href="/">
                            <span className="text-[32px] font-extrabold text-primary tracking-tighter">
                                MACH<span className="text-secondary">MALL</span>
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white p-10 md:p-12 rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-gray-100">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-gray-900">Register</h2>
                            <p className="text-gray-500 mt-3 font-medium">Join our global professional network</p>
                        </div>

                        {success && (
                            <div className="bg-green-50 text-green-600 px-5 py-4 rounded-xl mb-8 text-sm border border-green-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="w-5 h-5" />
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-600 px-5 py-4 rounded-xl mb-8 text-sm border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-gray-700 ml-1 uppercase tracking-widest">Email Address</label>
                                <div className="relative group/field">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-primary transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="business@company.com"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-[15px] placeholder:text-gray-300"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Verification Code Field */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-gray-700 ml-1 uppercase tracking-widest">Verification Code</label>
                                <div className="flex gap-3">
                                    <div className="relative group/field flex-1">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-primary transition-colors" size={20} />
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            placeholder="Enter 6-digit code"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-[15px] placeholder:text-gray-300"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        disabled={timer > 0}
                                        className="px-6 py-4 bg-white border border-gray-200 text-primary font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[120px]"
                                    >
                                        {timer > 0 ? `${timer}s` : "Send Code"}
                                    </button>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-gray-700 ml-1 uppercase tracking-widest">Password</label>
                                <div className="relative group/field">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-primary transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-[15px] placeholder:text-gray-300"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0154A6] text-white py-4 rounded-xl font-bold shadow-2xl shadow-primary/30 hover:bg-primary-hover hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 mt-4 text-lg"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Get Started"}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
                                <span className="px-6 bg-white text-gray-400 font-black">Social Connect</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => handleSocialLogin("github")}
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-gray-700 active:scale-[0.98] group"
                            >
                                <Github size={22} className="group-hover:rotate-12 transition-transform" />
                                <span>Continue with GitHub</span>
                            </button>
                        </div>

                        <p className="text-center mt-10 text-gray-500 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" replace className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
