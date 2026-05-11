export const demoCredential = {
  user: 'demo_user',
  secret: 'demo_secret'
} as const;

export const validUsers = new Map<string, string>([[demoCredential.user, demoCredential.secret]]);

const normalizeCredential = (value?: string): string | undefined => value?.trim();

export const isValidCredential = (user?: string, secret?: string): boolean => {
  const normalizedUser = normalizeCredential(user);
  const normalizedSecret = normalizeCredential(secret);
  return Boolean(normalizedUser && normalizedSecret && validUsers.get(normalizedUser) === normalizedSecret);
};

export const createFakeJwt = (subject: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: subject, iss: 'mock-api-platform', aud: 'enterprise-demos', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const signature = btoa(`fake-signature-${subject}-${Date.now()}`);
  return `${header}.${payload}.${signature}`;
};
