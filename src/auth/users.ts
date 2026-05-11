export const validUsers = new Map<string, string>([
  ['dealer_user', 'dealer_secret'],
  ['hospital_user', 'hospital_secret'],
  ['services_user', 'services_secret']
]);

export const isValidCredential = (user?: string, secret?: string): boolean => Boolean(user && secret && validUsers.get(user) === secret);

export const createFakeJwt = (subject: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: subject, iss: 'mock-api-platform', aud: 'enterprise-demos', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const signature = btoa(`fake-signature-${subject}-${Date.now()}`);
  return `${header}.${payload}.${signature}`;
};
