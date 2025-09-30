export function decodeJWT(token: string): { user_id: number; full_name: string; role_id: number; email: string } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      user_id: decoded.user_id,
      full_name: decoded.full_name,
      role_id: decoded.role_id,
      email: decoded.email,
    };
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    return null;
  }
}