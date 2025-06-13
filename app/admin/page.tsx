'use client';
import { useState } from 'react';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const login = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      window.location.href = '/admin/dashboard';
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 border rounded shadow max-w-sm w-full space-y-4">
        <h2 className="text-2xl font-bold">Admin Login</h2>
        <input
          placeholder="Email"
          className="w-full border p-2 rounded text-black"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          className="w-full border p-2 rounded text-black"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={login}>
          Login
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
}
