import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User as UserIcon, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    // Only set default username if current username is empty or is one of the defaults
    if (!username || username === 'admin' || username === 'kementerian') {
      setUsername(newRole === 'admin' ? 'admin' : 'kementerian');
    }
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login gagal');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white/60 hover:text-white group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-heading italic text-white lowercase">p</span>
          </div>
          <h1 className="text-3xl font-heading italic tracking-tight mb-2">Selamat Datang</h1>
          <p className="text-white/60 font-body font-light">Masuk ke Pebble Executive Information System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-medium text-white/40 uppercase tracking-widest pl-1">
              Pilih Role Akses
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-3 border transition-all ${
                  role === 'admin'
                    ? 'bg-white border-white text-black'
                    : 'liquid-glass border-white/10 text-white/60 hover:border-white/30'
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
                <span className="text-sm font-medium">BEM Center</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('user')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-3 border transition-all ${
                  role === 'user'
                    ? 'bg-white border-white text-black'
                    : 'liquid-glass border-white/10 text-white/60 hover:border-white/30'
                }`}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm font-medium">Kementerian</span>
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ID Pengguna"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-body"
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-body"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
              loading
                ? 'bg-white/50 text-black cursor-wait'
                : 'bg-white text-black hover:bg-white/90 active:scale-95'
            }`}
          >
            {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/30 font-body leading-relaxed">
            Hanya pengguna terverifikasi yang diberikan akses oleh <br />
            Kementerian PRK BEM-KM Unmul 2026.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
