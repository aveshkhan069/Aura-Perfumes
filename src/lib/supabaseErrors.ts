export function getFriendlyAuthError(error: unknown, fallback: string): string {
  const code = typeof error === 'object' && error && 'code' in error
    ? String((error as { code?: unknown }).code ?? '')
    : '';
  const message = error instanceof Error ? error.message.toLowerCase() : '';

  if (message.includes('database error saving new user') || message.includes('database error querying schema')) {
    return 'AURA account setup is incomplete. Apply the Supabase profile migration, then try again.';
  }
  if (code === 'signup_disabled' || message.includes('signups not allowed')) {
    return 'New account registration is currently disabled for this store.';
  }
  if (code === 'email_provider_disabled' || message.includes('email signups are disabled')) {
    return 'Email registration is not enabled in the Supabase Auth settings yet.';
  }
  if (code === 'weak_password' || message.includes('password is too weak') || message.includes('password should be at least')) {
    return 'Choose a stronger password that meets the store password requirements.';
  }
  if (message.includes('invalid api key') || code === 'bad_jwt') {
    return 'Supabase is not configured correctly. Check the public project URL and anon key.';
  }
  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return "That email or password doesn't look right.";
  }
  if (code === 'user_already_exists' || message.includes('user already registered')) {
    return 'This email is already registered. Try signing in instead.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please check your email to verify your account before signing in.';
  }
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please wait a little and try again.';
  }

  return fallback;
}
