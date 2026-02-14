/**
 * Input Validation Utilities
 *
 * Shared validation helpers for API endpoints.
 */

/**
 * Validate stock symbol format.
 * Allows alphanumeric, dots, hyphens (e.g. "AAPL", "BTC.USD", "MSFT-US")
 */
const SYMBOL_REGEX = /^[A-Za-z0-9._\-]{1,20}$/;

export function isValidSymbol(symbol: string): boolean {
  return SYMBOL_REGEX.test(symbol);
}

/**
 * Validate Firebase UID format.
 * Firebase UIDs are 20-128 character alphanumeric strings.
 */
const FIREBASE_UID_REGEX = /^[a-zA-Z0-9]{20,128}$/;

export function isValidFirebaseUid(uid: string): boolean {
  return FIREBASE_UID_REGEX.test(uid);
}
