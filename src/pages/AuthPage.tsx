import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FileText, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseSetupHelper } from '../components/SupabaseSetupHelper';
import toast from 'react-hot-toast';

export function AuthPage() {
  const { user, signIn, signUp, hasCredentials, connectionError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Show setup helper if credentials are missing
  if (!hasCredentials) {
    return <SupabaseSetupHelper onRetry={() => window.location.reload()} />;
  }

  if (user) {
    return <Navigate to="/ocr" replace />;
  }

  // Show connection error if there's an issue
  if (connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Connection Error</h2>
            <p className="mt-2 text-sm text-gray-600">{connectionError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-yellow-400 text-yellow-900 py-2 px-4 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        if (result?.user && !result?.session) {
          toast.success('Account created! Please check your email to verify your account before signing in.');
        } else {
          toast.success('Account created successfully!');
        }
      } else {
        await signIn(email, password);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = 'Authentication failed';
      
      // Handle configuration errors
      if (error.message?.includes('Supabase not configured')) {
        errorMessage = 'Please configure Supabase credentials first';
      } else if (error.message?.includes('Connection failed')) {
        errorMessage = 'Connection failed. Please check your Supabase configuration and internet connection.';
      } else if (error.message && error.message !== 'CONFIRMATION_REQUIRED') {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setEmail('test@inseyab.com');
    setPassword('test123');
    setLoading(true);
    
    try {
      await signIn('test@inseyab.com', 'test123');
      toast.success('Signed in with test account!');
    } catch (error: any) {
      // If test account doesn't exist, create it
      try {
        await signUp('test@inseyab.com', 'test123');
        toast.success('Test account created! You can now sign in.');
      } catch (signUpError: any) {
        toast.error('Failed to create test account: ' + signUpError.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="w-8 h-8 text-yellow-900" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Inseyab Doc</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:z-10 sm:text-sm"
                  placeholder="Password (min. 6 characters)"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-yellow-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <User className="h-5 w-5 group-hover:text-yellow-800" />
              </span>
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleTestLogin}
              disabled={loading}
              className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Use Test Account
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}