export const demoCredential = {
  user: 'demo_user',
  secret: 'demo_secret'
} as const;

export const validUsers = new Map<string, string>([[demoCredential.user, demoCredential.secret]]);

type FakeJwtPayload = {
  sub: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
};

const textDecoder = new TextDecoder();

const credentialCandidates = (value?: string): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((candidate) => candidate.trim())
    .filter(Boolean);
};

const toBase64Url = (value: string): string => btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const fromBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  return textDecoder.decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
};

const decodeJson = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(fromBase64Url(value)) as T;
  } catch {
    return undefined;
  }
};

export const isValidCredential = (user?: string, secret?: string): boolean => {
  const users = credentialCandidates(user);
  const secrets = credentialCandidates(secret);
  return users.some((userCandidate) => secrets.some((secretCandidate) => validUsers.get(userCandidate) === secretCandidate));
};

export const createFakeJwt = (subject: string): string => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = toBase64Url(JSON.stringify({ sub: subject, iss: 'mock-api-platform', aud: 'enterprise-demos', iat: issuedAt, exp: issuedAt + 3600 }));
  const signature = toBase64Url(`fake-signature-${subject}-${issuedAt}`);
  return `${header}.${payload}.${signature}`;
};

export const getBearerToken = (authorization?: string): string | undefined => {
  const [scheme, ...tokenParts] = authorization?.trim().split(/\s+/) ?? [];
  if (scheme?.toLowerCase() !== 'bearer') return undefined;
  return tokenParts.join(' ').trim() || undefined;
};

export const validateFakeJwt = (token?: string): { valid: true; subject: string } | { valid: false; reason: string } => {
  if (!token) return { valid: false, reason: 'Token ausente.' };

  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) return { valid: false, reason: 'Token JWT deve conter header, payload e assinatura.' };

  const header = decodeJson<{ alg?: string; typ?: string }>(encodedHeader);
  const payload = decodeJson<FakeJwtPayload>(encodedPayload);
  if (!header || header.typ !== 'JWT') return { valid: false, reason: 'Header JWT inválido.' };
  if (!payload?.sub || payload.iss !== 'mock-api-platform' || payload.aud !== 'enterprise-demos') return { valid: false, reason: 'Payload JWT inválido.' };
  if (payload.exp < Math.floor(Date.now() / 1000)) return { valid: false, reason: 'Token expirado.' };

  let signature = '';
  try {
    signature = fromBase64Url(encodedSignature);
  } catch {
    return { valid: false, reason: 'Assinatura fake malformada.' };
  }
  if (!signature.startsWith(`fake-signature-${payload.sub}-`)) return { valid: false, reason: 'Assinatura fake inválida.' };

  return { valid: true, subject: payload.sub };
};
