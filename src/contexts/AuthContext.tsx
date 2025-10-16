import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPremium: boolean;
  getFreeAnalysisCount: () => number;
  canStartAnalysis: () => boolean;
  incrementAnalysisCount: () => void;
  syncFreeAnalysisCount: (n: number) => void;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Check if user has premium access
  const checkPremiumStatus = (user: User | null) => {
    if (!user) {
      setIsPremium(false);
      return;
    }
    
    // Grant premium access to oficialzine@gmail.com
    const premiumEmails = ['oficialzine@gmail.com'];
    setIsPremium(premiumEmails.includes(user.email || ''));
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkPremiumStatus(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Session check failed:', error);
      // Clear invalid tokens by signing out
      supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsPremium(false);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkPremiumStatus(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // Get the number of analyses a free user has done (from localStorage)
  const getFreeAnalysisCount = (): number => {
    if (!user || isPremium) return 0;
    
    const storageKey = `analysis_count_${user.id}`;
    const count = localStorage.getItem(storageKey);
    return count ? parseInt(count, 10) : 0;
  };

  // Increment the analysis count in localStorage
  const incrementAnalysisCount = (): void => {
    if (!user || isPremium) return;
    
    const storageKey = `analysis_count_${user.id}`;
    const currentCount = getFreeAnalysisCount();
    localStorage.setItem(storageKey, (currentCount + 1).toString());
  };

  // Check if user can start a new analysis
  const canStartAnalysis = (): boolean => {
    if (isPremium) return true;
    const count = getFreeAnalysisCount();
    return count < 3;
  };

  // Sync the local analysis count to at least the provided value
  // This ensures consistency across devices/sessions
  const syncFreeAnalysisCount = (n: number): void => {
    if (!user || isPremium) return;
    
    const storageKey = `analysis_count_${user.id}`;
    const currentCount = getFreeAnalysisCount();
    const newCount = Math.max(currentCount, n);
    localStorage.setItem(storageKey, newCount.toString());
  };

  const value = {
    user,
    session,
    loading,
    isPremium,
    getFreeAnalysisCount,
    canStartAnalysis,
    incrementAnalysisCount,
    syncFreeAnalysisCount,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};