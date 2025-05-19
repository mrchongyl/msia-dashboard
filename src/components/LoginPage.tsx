import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';

const LoginPage: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && onLogin) {
        onLogin();
      }
    });
    return () => unsubscribe();
  }, [onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will trigger on success
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError(null);
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      setShowSignup(false);
      setEmail(signupEmail);
      setPassword(signupPassword);
      setSignupEmail('');
      setSignupPassword('');
    } catch (err: any) {
      setSignupError(err.message || 'Signup failed');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage(null);
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      setResetMessage(err.message || "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  if (showReset) {
    return (
      <div className="slide-in flex items-center justify-center min-h-screen bg-slate-100">
        <form
          onSubmit={handleResetPassword}
          className="card p-8 w-full max-w-md shadow-lg bg-white border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center flex items-center justify-center">Reset Password</h2>
          <div className="mb-6">
            <label className="block text-blue-900 mb-2 font-medium" htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              type="email"
              className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-900/60 text-blue-900 bg-slate-50 placeholder:text-blue-300"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              required
              autoFocus
              placeholder="Enter your email"
            />
          </div>
          {resetMessage && <ErrorMessage message={resetMessage} />}
          <div className="flex gap-2">
            <button
              type="button"
              className="w-1/2 bg-slate-200 hover:bg-slate-300 text-blue-900 font-semibold py-2 rounded transition shadow-sm"
              onClick={() => setShowReset(false)}
              disabled={resetLoading}
            >
              Back to Login
            </button>
            <button
              type="submit"
              className="w-1/2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded transition shadow-sm"
              disabled={resetLoading}
            >
              {resetLoading ? <LoadingSpinner /> : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (showSignup) {
    return (
      <div className="slide-in flex items-center justify-center min-h-screen bg-slate-100">
        <form
          onSubmit={handleSignup}
          className="card p-8 w-full max-w-md shadow-lg bg-white border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center flex items-center justify-center">Sign Up</h2>
          <div className="mb-4">
            <label className="block text-blue-900 mb-2 font-medium" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-900/60 text-blue-900 bg-slate-50 placeholder:text-blue-300"
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
              required
              autoFocus
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-blue-900 mb-2 font-medium" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-900/60 text-blue-900 bg-slate-50 placeholder:text-blue-300"
              value={signupPassword}
              onChange={e => setSignupPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {signupError && <ErrorMessage message={signupError} />}
          <div className="flex gap-2">
            <button
              type="button"
              className="w-1/2 bg-slate-200 hover:bg-slate-300 text-blue-900 font-semibold py-2 rounded transition shadow-sm"
              onClick={() => setShowSignup(false)}
              disabled={signupLoading}
            >
              Back to Login
            </button>
            <button
              type="submit"
              className="w-1/2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded transition shadow-sm"
              disabled={signupLoading}
            >
              {signupLoading ? <LoadingSpinner /> : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="slide-in flex items-center justify-center min-h-screen bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="card p-8 w-full max-w-md shadow-lg bg-white border border-slate-200"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center flex items-center justify-center">Login</h2>
        <div className="mb-4">
          <label className="block text-blue-900 mb-2 font-medium" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-900/60 text-blue-900 bg-slate-50 placeholder:text-blue-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-blue-900 mb-2 font-medium" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-900/60 text-blue-900 bg-slate-50 placeholder:text-blue-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        {error && <ErrorMessage message={error} />}
        <div className="flex gap-2 mb-4 justify-end">
          <button
            type="button"
            className="text-blue-700 hover:underline text-sm"
            onClick={() => setShowReset(true)}
            disabled={loading}
          >
            Forgot Password?
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="w-1/2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded transition shadow-sm"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Login'}
          </button>
          <button
            type="button"
            className="w-1/2 bg-slate-200 hover:bg-slate-300 text-blue-900 font-semibold py-2 rounded transition shadow-sm"
            onClick={() => setShowSignup(true)}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
