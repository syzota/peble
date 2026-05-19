import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Users, X, BookOpen, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '../context/AuthContext';
import { InfiniteGrid } from '../components/ui/InfiniteGrid';

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "file:text-foreground placeholder:text-slate-400 selection:bg-sky-500 selection:text-white border-slate-200 flex h-11 w-full min-w-0 rounded-xl border bg-white/50 px-3 py-2 text-sm shadow-sm transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-sky-500 focus-visible:ring-sky-500/20 focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  )
}

const Modal = ({ isOpen, onClose, title, icon: Icon, children }: { isOpen: boolean, onClose: () => void, title: string, icon: any, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-all"
          >
            <X className="w-6 h-6 text-slate-900" />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-instrument italic text-slate-900">{title}</h3>
            </div>
          </div>

          <div className="space-y-6 text-slate-600">
            {children}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100/50">
            <button
              onClick={onClose}
              className="w-full bg-slate-900 text-white py-4 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(username, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login gagal');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-white flex items-center justify-center p-4">
      {/* Background Component */}
      <div className="absolute inset-0 z-0">
        <InfiniteGrid />
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full backdrop-blur-md bg-white/40 border border-slate-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-slate-600 hover:text-slate-900 group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-30"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative group">
            {/* Card glow effect */}
            <div className="absolute -inset-[0.5px] rounded-[2.5rem] bg-gradient-to-r from-sky-500/10 via-sky-500/20 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glass card background */}
            <div className="relative bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="text-center space-y-2 mb-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center relative overflow-hidden shadow-lg shadow-sky-200"
                >
                  <ShieldCheck className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-slate-900 font-instrument italic"
                >
                  Portal Kontributor
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-500 text-sm font-medium"
                >
                  Masuk ke arsip fakta nasional
                </motion.p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 text-red-600 text-xs py-3 px-4 rounded-xl text-center font-medium mb-6 border border-red-100"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Email/Username input */}
                  <div className="relative group/input">
                    <Mail className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 z-10",
                      focusedInput === "email" ? "text-sky-600" : "text-slate-400"
                    )} />
                    <Input
                      type="text"
                      placeholder="ID Pengguna"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      className="pl-11"
                      required
                    />
                  </div>

                  {/* Password input */}
                  <div className="relative group/input">
                    <Lock className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 z-10",
                      focusedInput === "password" ? "text-sky-600" : "text-slate-400"
                    )} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Kata Sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      className="pl-11 pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-400 hover:text-sky-600 transition-colors" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400 hover:text-sky-600 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-200 text-sky-600 focus:ring-sky-500/20 transition-all caret-sky-600"
                    />
                    <label htmlFor="remember-me" className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      Ingat saya
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[10px] text-sky-600 font-bold hover:underline uppercase tracking-tighter"
                  >
                    Lupa sandi?
                  </button>
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/button overflow-hidden"
                >
                  <div className="absolute inset-0 bg-sky-400/20 blur-lg opacity-0 group-hover/button:opacity-100 transition-opacity" />
                  <div className="relative bg-sky-600 text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-100">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Masuk Sekarang</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/button:translate-x-1" />
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="relative flex items-center gap-4">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">Atau</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                {/* System Guide */}
                <button
                  type="button"
                  onClick={() => setShowGuide(true)}
                  className="w-full h-12 rounded-xl border border-slate-100 bg-white/50 text-slate-600 text-sm font-bold flex items-center justify-center gap-3 hover:bg-white hover:border-slate-200 transition-all active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Panduan Sistem Informasi</span>
                </button>

                <p className="text-center text-[10px] text-slate-400 font-medium leading-relaxed">
                  Hanya kontributor terdaftar yang dapat melakukan <br />
                  perubahan pada arsip data nasional.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <Modal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        title="Panduan Sistem Peble"
        icon={BookOpen}
      >
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-sky-600/10 flex items-center justify-center shrink-0">
              <span className="font-bold text-sky-600">1</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Akses Dashboard</h4>
              <p className="text-sm leading-relaxed">
                Gunakan akun kontributor yang diberikan oleh administrator untuk mengelola database hoaks nasional.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-sky-600/10 flex items-center justify-center shrink-0">
              <span className="font-bold text-sky-600">2</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Verifikasi Data</h4>
              <p className="text-sm leading-relaxed">
                Lakukan validasi pada temuan baru dengan menyertakan bukti primer sebelum publikasi ke portal publik.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-sky-600/10 flex items-center justify-center shrink-0">
              <span className="font-bold text-sky-600">3</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Keamanan Akun</h4>
              <p className="text-sm leading-relaxed">
                Pastikan keluar dari sistem (Logout) setelah selesai melakukan sesi penginputan data.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Bantuan Akses"
        icon={AlertCircle}
      >
        <div className="text-center py-4">
          <p className="text-slate-600 font-medium leading-relaxed">
            Demi alasan keamanan data nasional, pengaturan ulang kata sandi tidak dapat dilakukan secara mandiri.
          </p>
          <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-amber-800 font-bold text-sm">
              Silakan hubungi administrator sistem untuk meriset kata sandi Anda.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
