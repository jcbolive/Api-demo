export const demoCredential = {
  user: 'demo_user',
  secret: 'demo_secret'
} as const;

export const validUsers = new Map<string, string>([[demoCredential.user, demoCredential.secret]]);

const credentialCandidates = (value?: string): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((candidate) => candidate.trim())
    .filter(Boolean);
};

export const isValidCredential = (user?: string, secret?: string): boolean => {
  const users = credentialCandidates(user);
  const secrets = credentialCandidates(secret);
  return users.some((userCandidate) => secrets.some((secretCandidate) => validUsers.get(userCandidate) === secretCandidate));
};

export const createFakeJwt = (subject: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: subject, iss: 'mock-api-platform', aud: 'enterprise-demos', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const signature = btoa(`fake-signature-${subject}-${Date.now()}`);
  return `${header}.${payload}.${signature}`;
};
