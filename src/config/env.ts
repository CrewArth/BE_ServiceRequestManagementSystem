export function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 24) throw new Error('JWT_SECRET must have at least 24 characters');
  return secret;
}
