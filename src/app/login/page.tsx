'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signUpWithEmail } from '@/services/auth-service';
import { useAppStore } from '@/store';

export default function LoginPage() {
  const router = useRouter();
  const setUserId = useAppStore((s) => s.setUserId);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNickname('');
    setError('');
  };

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('请输入邮箱');
      return false;
    }
    if (!password) {
      setError('请输入密码');
      return false;
    }
    if (password.length < 6) {
      setError('密码至少需要 6 位');
      return false;
    }
    if (mode === 'signup') {
      if (!nickname.trim()) {
        setError('请输入昵称');
        return false;
      }
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setError('');
    setLoading(true);

    try {
      const user =
        mode === 'login'
          ? await signInWithEmail(email, password)
          : await signUpWithEmail(email, password, nickname.trim());

      if (user) {
        setUserId(user.id);
        router.push('/');
      } else {
        // signUp returns null when email confirmation is required
        setMode('login');
        setError('');
        alert('注册成功！请查看邮箱确认链接后再登录。');
      }
    } catch (err) {
      const msg = (err as Error).message || '操作失败';
      // Friendly error messages
      if (msg.includes('Invalid login credentials')) {
        setError('邮箱或密码错误');
      } else if (msg.includes('email_not_confirmed') || msg.includes('Email not confirmed')) {
        setError('邮箱未确认，请去 Supabase Dashboard → Authentication → 关闭 Email confirmation');
      } else if (msg.includes('already registered')) {
        setError('该邮箱已注册，请直接登录');
      } else if (msg.includes('valid email')) {
        setError('请输入有效的邮箱地址');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    resetForm();
  };

  return (
    <div className="flex flex-col h-full justify-center">
      {/* Logo */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">FoodVault</h1>
        <p className="text-xs text-gray-400 mt-1">你的私人美食库</p>
      </div>

      {/* Mode tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => { setMode('login'); resetForm(); }}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
            mode === 'login' ? 'bg-white text-black shadow-sm' : 'text-gray-400'
          }`}
        >
          登录
        </button>
        <button
          onClick={() => { setMode('signup'); resetForm(); }}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
            mode === 'signup' ? 'bg-white text-black shadow-sm' : 'text-gray-400'
          }`}
        >
          注册
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">昵称</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none"
              placeholder="给自己取个名字"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="text-xs text-gray-500 block mb-1">邮箱</label>
          <input
            type="email"
            required
            className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">密码</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none"
            placeholder="至少 6 位"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode === 'signup' && password.length > 0 && (
            <p className={`text-[10px] mt-1 ${password.length >= 6 ? 'text-green-500' : 'text-gray-400'}`}>
              {password.length >= 6 ? '✓ 密码长度合格' : `还需要 ${6 - password.length} 位`}
            </p>
          )}
        </div>

        {mode === 'signup' && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">确认密码</label>
            <input
              type="password"
              required
              className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none"
              placeholder="再输入一次密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword.length > 0 && (
              <p className={`text-[10px] mt-1 ${
                password === confirmPassword ? 'text-green-500' : 'text-red-400'
              }`}>
                {password === confirmPassword ? '✓ 密码一致' : '✗ 密码不一致'}
              </p>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-2xl text-sm disabled:opacity-50 mt-2"
        >
          {loading ? '处理中...' : mode === 'login' ? '登录' : '创建账号'}
        </button>
      </form>
    </div>
  );
}
