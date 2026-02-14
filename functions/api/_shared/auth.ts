/**
 * Firebase ID Token Verification for Cloudflare Workers
 *
 * Verifies Firebase ID tokens without firebase-admin SDK.
 * Uses Google's JWKS endpoint + Web Crypto API (RS256).
 */

const FIREBASE_PROJECT_ID = 'candle-master-d4bbd';
const GOOGLE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

// In-memory cache for Google's public keys (per Worker isolate)
let cachedKeys: Record<string, CryptoKey> | null = null;
let cacheExpiry = 0;

export interface DecodedToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
}

/**
 * Decode base64url string to Uint8Array (Workers-compatible, no atob issues)
 */
function base64urlDecode(str: string): Uint8Array {
  // Convert base64url to base64
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';

  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Fetch and cache Google's public keys from JWKS endpoint.
 * Keys are cached in memory for 1 hour (they rotate ~every 6 hours).
 */
async function getPublicKeys(): Promise<Record<string, CryptoKey>> {
  if (cachedKeys && Date.now() < cacheExpiry) {
    return cachedKeys;
  }

  const response = await fetch(GOOGLE_JWKS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS: ${response.status}`);
  }

  const { keys: jwks } = (await response.json()) as {
    keys: Array<{
      kid: string;
      kty: string;
      alg: string;
      n: string;
      e: string;
      use: string;
    }>;
  };

  const imported: Record<string, CryptoKey> = {};

  for (const jwk of jwks) {
    imported[jwk.kid] = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256' },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
  }

  cachedKeys = imported;
  cacheExpiry = Date.now() + 3600 * 1000; // 1 hour
  return imported;
}

/**
 * Verify a Firebase ID token from the Authorization header.
 *
 * @param authHeader - The full Authorization header value (e.g. "Bearer xxx")
 * @returns Decoded token with uid/email, or null if invalid
 */
export async function verifyFirebaseToken(
  authHeader: string | null,
): Promise<DecodedToken | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    // Decode header and payload
    const header = JSON.parse(
      new TextDecoder().decode(base64urlDecode(parts[0])),
    );
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(parts[1])),
    );

    // Validate algorithm
    if (header.alg !== 'RS256') return null;

    // Validate claims (fast fail before signature verification)
    const now = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < now) return null; // Expired
    if (!payload.iat || payload.iat > now + 300) return null; // Future (5min tolerance)
    if (payload.aud !== FIREBASE_PROJECT_ID) return null;
    if (
      payload.iss !==
      `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`
    )
      return null;
    if (!payload.sub || typeof payload.sub !== 'string') return null;
    if (payload.sub.length === 0 || payload.sub.length > 128) return null;

    // Fetch the signing key matching the token's kid
    const keys = await getPublicKeys();
    const key = keys[header.kid];
    if (!key) return null; // Unknown key ID

    // Verify RS256 signature
    const signatureInput = new TextEncoder().encode(
      `${parts[0]}.${parts[1]}`,
    );
    const signature = base64urlDecode(parts[2]);

    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      signature,
      signatureInput,
    );

    if (!valid) return null;

    return {
      uid: payload.sub,
      email: payload.email,
      email_verified: payload.email_verified,
    };
  } catch {
    return null;
  }
}
