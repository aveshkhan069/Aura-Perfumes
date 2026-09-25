import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { getFriendlyAuthError } from '../lib/supabaseErrors';
import { ShippingAddress, User } from '../types';

interface AuthResult {
  success: boolean;
  message: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  updateProfile: (name: string, phone: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUserAddresses: (address: ShippingAddress) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapAuthUser(authUser: SupabaseUser, profile?: Record<string, unknown> | null, savedAddresses: ShippingAddress[] = []): User {
  const metadataName = typeof authUser.user_metadata?.full_name === 'string'
    ? authUser.user_metadata.full_name
    : '';

  return {
    id: authUser.id,
    name: typeof profile?.full_name === 'string' && profile.full_name
      ? profile.full_name
      : metadataName || authUser.email?.split('@')[0] || 'AURA Client',
    email: authUser.email || '',
    phone: typeof profile?.phone === 'string' ? profile.phone : '',
    avatarUrl: typeof profile?.avatar_url === 'string' ? profile.avatar_url : undefined,
    role: profile?.role === 'admin' ? 'admin' : 'customer',
    joinedDate: new Date(authUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    savedAddresses,
  };
}

function mapAddress(row: Record<string, unknown>, email: string): ShippingAddress {
  return {
    fullName: String(row.full_name || ''),
    phone: String(row.phone || ''),
    email,
    address: String(row.address_line_1 || ''),
    apartment: String(row.address_line_2 || ''),
    city: String(row.city || ''),
    state: String(row.state || ''),
    pinCode: String(row.postal_code || ''),
    country: String(row.country || 'India'),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (authUser: SupabaseUser) => {
    if (!supabase) return;

    const [profileResult, addressResult] = await Promise.all([
      supabase.from('profiles').select('full_name, role, phone, avatar_url').eq('id', authUser.id).maybeSingle(),
      supabase.from('addresses')
        .select('full_name, phone, address_line_1, address_line_2, city, state, postal_code, country, is_default, created_at')
        .eq('user_id', authUser.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false }),
    ]);

    const addresses = (addressResult.data || []).map((address) =>
      mapAddress(address as Record<string, unknown>, authUser.email || '')
    );
    setUser(mapAuthUser(authUser, profileResult.data as Record<string, unknown> | null, addresses));
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const initialize = async () => {
      const { data, error } = await client.auth.getSession();
      if (!active) return;
      if (error) {
        setUser(null);
      } else if (data.session?.user) {
        await loadProfile(data.session.user);
      }
      if (active) setIsLoading(false);
    };

    void initialize();
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) {
        setUser(mapAuthUser(session.user));
        window.setTimeout(() => {
          if (active) void loadProfile(session.user);
        }, 0);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase || !isSupabaseConfigured) {
      return { success: false, message: 'Sign-in is temporarily unavailable. Please try again later.' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error
      ? { success: false, message: getFriendlyAuthError(error, 'We could not sign you in. Please try again.') }
      : { success: true, message: 'Welcome back to AURA Perfumes.' };
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (!supabase || !isSupabaseConfigured) {
      return { success: false, message: 'Registration is temporarily unavailable. Please try again later.' };
    }
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    if (error) {
      if (import.meta.env.DEV) {
        console.error('[AURA auth] Sign-up failed', {
          code: error.code,
          status: error.status,
          message: error.message,
        });
      }
      return { success: false, message: getFriendlyAuthError(error, 'We could not create your account. Please try again.') };
    }
    return {
      success: true,
      message: data.session ? 'Your AURA account is ready.' : 'Please check your email to verify your new account.',
    };
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    if (!supabase || !isSupabaseConfigured) {
      return { success: false, message: 'Social sign-in is temporarily unavailable.' };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    });
    return error
      ? { success: false, message: getFriendlyAuthError(error, 'Google sign-in is unavailable right now.') }
      : { success: true, message: 'Continuing with Google…' };
  };

  const requestPasswordReset = async (email: string): Promise<AuthResult> => {
    if (!supabase || !isSupabaseConfigured) {
      return { success: false, message: 'Password recovery is temporarily unavailable.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error
      ? { success: false, message: getFriendlyAuthError(error, 'We could not send a recovery email. Please try again.') }
      : { success: true, message: 'If an account exists for that email, a recovery link is on its way.' };
  };

  const updatePassword = async (password: string): Promise<AuthResult> => {
    if (!supabase || !isSupabaseConfigured) {
      return { success: false, message: 'Password updates are temporarily unavailable.' };
    }
    const { error } = await supabase.auth.updateUser({ password });
    return error
      ? { success: false, message: getFriendlyAuthError(error, 'We could not update your password. Please try again.') }
      : { success: true, message: 'Your password has been updated securely.' };
  };

  const updateProfile = async (name: string, phone: string): Promise<AuthResult> => {
    if (!supabase || !user) return { success: false, message: 'Please sign in to update your profile.' };
    const { error } = await supabase.from('profiles')
      .update({ full_name: name.trim(), phone: phone.trim(), updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) return { success: false, message: 'We could not save your profile. Please try again.' };
    setUser((current) => current ? { ...current, name: name.trim(), phone: phone.trim() } : current);
    return { success: true, message: 'Your profile has been updated.' };
  };

  const updateUserAddresses = async (address: ShippingAddress): Promise<AuthResult> => {
    if (!supabase || !user) return { success: false, message: 'Please sign in to save a delivery address.' };

    const addressValues = {
      full_name: address.fullName.trim(),
      phone: address.phone.trim(),
      address_line_1: address.address.trim(),
      address_line_2: address.apartment?.trim() || null,
      city: address.city.trim(),
      state: address.state.trim(),
      postal_code: address.pinCode.trim(),
      country: address.country.trim() || 'India',
      updated_at: new Date().toISOString(),
    };
    const { data: existing, error: lookupError } = await supabase.from('addresses')
      .select('id')
      .eq('user_id', user.id)
      .eq('address_line_1', addressValues.address_line_1)
      .eq('city', addressValues.city)
      .maybeSingle();
    if (lookupError) return { success: false, message: 'We could not save this address. Please try again.' };

    const result = existing
      ? await supabase.from('addresses').update(addressValues).eq('id', existing.id)
      : await supabase.from('addresses').insert({ ...addressValues, user_id: user.id, is_default: !user.savedAddresses?.length });
    if (result.error) return { success: false, message: 'We could not save this address. Please try again.' };

    const savedAddresses = [address, ...(user.savedAddresses || []).filter((saved) =>
      saved.address !== address.address || saved.city !== address.city
    )];
    setUser({ ...user, savedAddresses });
    return { success: true, message: 'Your delivery address has been saved.' };
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    signInWithGoogle,
    requestPasswordReset,
    updatePassword,
    updateProfile,
    logout,
    updateUserAddresses,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
