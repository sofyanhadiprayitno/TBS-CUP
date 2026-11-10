/**
 * Client-Side E2E Encryption & Security Utility
 * Simulates AES-256 GCM encryption envelopes for secure export/import and cloud sync
 */

export interface EncryptedPayload {
  cipherText: string;
  iv: string;
  algorithm: 'AES-256-GCM';
  checksum: string;
  timestamp: string;
  version: string;
}

// Simple deterministic hash for password check & checksum
export function hashString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'sec_' + Math.abs(hash).toString(16) + '9bfa';
}

export function simulateEncryptData(data: unknown): EncryptedPayload {
  const jsonStr = JSON.stringify(data);
  // Base64 encode as mock AES envelope
  const encoded = btoa(encodeURIComponent(jsonStr));
  const iv = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    cipherText: encoded,
    iv,
    algorithm: 'AES-256-GCM',
    checksum: hashString(jsonStr),
    timestamp: new Date().toISOString(),
    version: '2.0.0-E2EE'
  };
}

export function simulateDecryptData<T>(payload: EncryptedPayload): T | null {
  try {
    const decoded = decodeURIComponent(atob(payload.cipherText));
    const currentChecksum = hashString(decoded);
    if (currentChecksum !== payload.checksum) {
      console.error('Checksum mismatch: Data may have been tampered with');
    }
    return JSON.parse(decoded) as T;
  } catch (err) {
    console.error('Failed to decrypt payload:', err);
    return null;
  }
}
