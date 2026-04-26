'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
    Shield,
    Mail,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Users,
    Heart,
    MessageCircle,
    Eye,
    Play,
    UserPlus,
    Music,
    Send,
    Link as LinkIcon,
    IndianRupee,
    Phone,
    FileText,
    LogOut,
    Sparkles,
} from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────
const ADMIN_EMAIL = 'admin@fastxera.com';
const AUTH_KEY = 'admin_auth';
const SESSION_TTL = 60 * 60 * 1000; // 1 hour

// ─── Types ────────────────────────────────────────────────────────
interface AuthData {
    email: string;
    expiry: number;
}

interface OrderFormData {
    serviceId: string;
    link: string;
}

// ─── Service Options ──────────────────────────────────────────────
const SERVICE_TYPES = [
    { id: 'followers', label: 'Followers', icon: Users, color: 'bg-violet-500', lightBg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
    { id: 'likes', label: 'Likes', icon: Heart, color: 'bg-rose-500', lightBg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
    { id: 'comments', label: 'Comments', icon: MessageCircle, color: 'bg-blue-500', lightBg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    { id: 'views', label: 'Views', icon: Eye, color: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    { id: 'story_views', label: 'Story Views', icon: Play, color: 'bg-pink-500', lightBg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    { id: 'subscribers', label: 'Subscribers', icon: UserPlus, color: 'bg-red-500', lightBg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    { id: 'streams', label: 'Streams', icon: Music, color: 'bg-emerald-500', lightBg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    { id: 'members', label: 'Members', icon: Send, color: 'bg-sky-500', lightBg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
];

const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', emoji: '📷', gradient: 'from-pink-500 to-purple-600' },
    { id: 'youtube', label: 'YouTube', emoji: '▶️', gradient: 'from-red-500 to-red-700' },
    { id: 'facebook', label: 'Facebook', emoji: '👥', gradient: 'from-blue-500 to-blue-700' },
    { id: 'twitter', label: 'Twitter/X', emoji: '𝕏', gradient: 'from-slate-700 to-slate-900' },
    { id: 'spotify', label: 'Spotify', emoji: '🎵', gradient: 'from-green-500 to-green-700' },
    { id: 'telegram', label: 'Telegram', emoji: '✈️', gradient: 'from-sky-400 to-sky-600' },
];

// ─── Helpers ──────────────────────────────────────────────────────
function getAuth(): AuthData | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = sessionStorage.getItem(AUTH_KEY);
        if (!raw) return null;
        const data: AuthData = JSON.parse(raw);
        if (Date.now() > data.expiry) {
            sessionStorage.removeItem(AUTH_KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

function setAuth(email: string) {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ email, expiry: Date.now() + SESSION_TTL }));
}

function clearAuth() {
    sessionStorage.removeItem(AUTH_KEY);
}

// ═══════════════════════════════════════════════════════════════════
// EMAIL GATE
// ═══════════════════════════════════════════════════════════════════
function EmailGate({ onVerified }: { onVerified: () => void }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const val = email.trim().toLowerCase();
            if (val === ADMIN_EMAIL || val === 'admin123') {
                setAuth(val);
                onVerified();
            } else {
                setError('Access denied. This email is not authorized.');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Decorative top bar */}
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl" />

                <div className="bg-white rounded-b-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-bold text-center text-slate-800 mb-1">
                        Admin Access Required
                    </h1>
                    <p className="text-sm text-slate-500 text-center mb-6">
                        Enter your authorized email to access the order panel.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address or Admin ID</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@fastxera.com or admin123"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition bg-slate-50/50"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2.5 rounded-lg border border-red-100">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-60"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Verify & Continue
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-[11px] text-slate-400 text-center mt-5">
                        🔒 Access is restricted to authorized administrators only.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// ORDER FORM
// ═══════════════════════════════════════════════════════════════════
function OrderForm({ onLogout }: { onLogout: () => void }) {
    const [form, setForm] = useState<OrderFormData>({
        serviceId: '602',
        link: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);


    const update = (field: keyof OrderFormData, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setResult(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null);

        let mappedCategory = 'views';
        if (form.serviceId === '602') mappedCategory = 'views';
        if (form.serviceId === '670') mappedCategory = 'comments';
        if (form.serviceId === '12587') mappedCategory = 'likes';
        if (form.serviceId === '10183') mappedCategory = 'followers';

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: parseInt(form.serviceId),
                    link: form.link,
                    quantity: 1000,
                    amount: 0,
                    serviceCategory: mappedCategory,
                    remark: `[Manual Order][Admin] Service: ${form.serviceId}`,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setResult({ success: true, message: `Order created! ID: ${data.data?.orderId || 'N/A'}` });
                setForm((prev) => ({ ...prev, link: '' }));
            } else {
                setResult({ success: false, message: data.message || 'Order failed' });
            }
        } catch (err) {
            setResult({ success: false, message: 'Network error — is the backend running?' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Manual Orders</h1>
                    </div>
                    <p className="text-sm text-slate-500">Place orders directly as admin</p>
                </div>
                <button
                    onClick={() => { clearAuth(); onLogout(); }}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Gradient accent bar */}
                <div className={`h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600`} />

                <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
                    {/* ── Service Type Selector ── */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2.5">Service Details</label>
                        <select
                            name="serviceId"
                            value={form.serviceId}
                            onChange={(e) => update('serviceId', e.target.value)}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition bg-slate-50/50"
                        >
                            <option value="602">602 - Reel Views (Supportive)</option>
                            <option value="670">670 - Comments (Supportive)</option>
                            <option value="12587">12587 - Likes (TNT SMM)</option>
                            <option value="10183">10183 - Followers (TNT SMM)</option>
                        </select>
                    </div>

                    {/* ── URL Input ── */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Profile / Post URL
                        </label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="url"
                                value={form.link}
                                onChange={(e) => update('link', e.target.value)}
                                placeholder="https://www.instagram.com/username"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition bg-slate-50/50"
                            />
                        </div>
                    </div>



                    {/* ── Result Feedback ── */}
                    {result && (
                        <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${result.success
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                            {result.success ? (
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span>{result.message}</span>
                        </div>
                    )}

                    {/* ── Submit ── */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-lg disabled:opacity-60 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]`}
                    >
                        {submitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                Place Order
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>


                </form>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export default function AdminOrdersPage() {
    const [isAuthed, setIsAuthed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const auth = getAuth();
        if (auth) setIsAuthed(true);
    }, []);

    // Avoid SSR hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            </div>
        );
    }

    if (!isAuthed) {
        return <EmailGate onVerified={() => setIsAuthed(true)} />;
    }

    return <OrderForm onLogout={() => setIsAuthed(false)} />;
}
