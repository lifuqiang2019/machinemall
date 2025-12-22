"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Github, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck, Zap, Globe } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await authClient.signIn.email({
                email,
                password,
                callbackURL: "/"
            }, {
                onError: (ctx) => setError(ctx.error.message || "Sign in failed"),
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
                                Powering Your <br />
                                <span className="text-secondary">Industrial Future</span>
                            </h1>
                            <p className="text-lg text-white/70 leading-relaxed font-light">
                                Access the world's most comprehensive marketplace for mechanical and electrical equipment. Join thousands of businesses driving global industry.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                                <div className="p-3 bg-secondary/20 rounded-xl text-secondary group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Verified Protection</h3>
                                    <p className="text-sm text-white/60 mt-1">Every supplier is rigorously vetted for quality and reliability.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                                <div className="p-3 bg-white/10 rounded-xl text-white group-hover:scale-110 transition-transform">
                                    <Globe size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Global Reach</h3>
                                    <p className="text-sm text-white/60 mt-1">Sourcing equipment from 120+ countries with logistics support.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-white/40 text-sm">
                    <p>© 2025 Machmall Industrial Group</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/30">
                <div className="w-full max-w-[460px]">
                    {/* Mobile Only Logo */}
                    <div className="lg:hidden text-center mb-10">
                        <Link href="/">
                            <span className="text-[32px] font-extrabold text-primary tracking-tighter">
                                MACH<span className="text-secondary">MALL</span>
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white p-10 md:p-12 rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-gray-100">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                            <p className="text-gray-500 mt-3 font-medium">Empowering your sourcing journey</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-5 py-4 rounded-2xl mb-8 text-sm border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-gray-700 ml-1 uppercase tracking-widest">Email Address</label>
                                <div className="relative group/field">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-primary transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="business@company.com"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-[15px] placeholder:text-gray-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[13px] font-bold text-gray-700 uppercase tracking-widest">Password</label>
                                    <Link href="#" className="text-[12px] text-primary hover:text-primary-hover font-bold transition-colors">Forgot Password?</Link>
                                </div>
                                <div className="relative group/field">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-primary transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-[15px] placeholder:text-gray-300"
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
                                className="w-full bg-[#0154A6] text-white py-4 rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:bg-primary-hover hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 mt-4 text-lg"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Sign In"}
                            </button>
                        </form>

                        <div className="relative my-10">
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
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-gray-700 active:scale-[0.98] group"
                            >
                                <Github size={22} className="group-hover:rotate-12 transition-transform" />
                                <span>Continue with GitHub</span>
                            </button>
                        </div>

                        <p className="text-center mt-10 text-gray-500 font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                                Join Machmall free
                            </Link>
                        </p>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-8 grayscale opacity-50">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Secure AES-256</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Zap size={16} />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Instant Access</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
