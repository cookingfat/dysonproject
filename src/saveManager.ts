

const SECRET_KEY = 'a-very-secret-salt-for-the-stellar-forge-42';

/**
 * A simple symmetric cipher function (XOR-based).
 * @param data The string to process.
 * @param key The key to use.
 * @returns The processed string.
 */
function processString(data: string, key: string): string {
    let output = '';
    for (let i = 0; i < data.length; i++) {
        output += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return output;
}

/**
 * Creates a SHA-256 hash of a string using the Web Crypto API.
 * @param data The string to hash.
 * @returns A promise that resolves to the hex-encoded hash string.
 */
async function createHash(data: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(data + SECRET_KEY); // Salt the hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Encodes the game state object into a secure, tamper-resistant string.
 * @param gameState The game state object to save.
 * @returns A promise that resolves to the encoded save string.
 */
export async function encodeSaveData(gameState: object): Promise<string> {
  const jsonString = JSON.stringify(gameState);
  const hash = await createHash(jsonString);
  const dataToStore = {
    data: jsonString,
    hash: hash,
  };
  const payload = JSON.stringify(dataToStore);
  // "Encrypt" the payload and then Base64 encode it to ensure it's a valid string.
  const encrypted = processString(payload, SECRET_KEY);
  return btoa(encrypted); 
}

/**
 * Decodes a save string, verifies its integrity, and returns the game state object.
 * @param encodedString The save string to load.
 * @returns A promise that resolves to the game state object, or null if invalid.
 */
export async function decodeSaveData(encodedString: string): Promise<any | null> {
  try {
    const fromB64 = atob(encodedString);
    const decryptedPayload = processString(fromB64, SECRET_KEY);
    
    if (!decryptedPayload) return null;

    const { data, hash } = JSON.parse(decryptedPayload);
    
    const expectedHash = await createHash(data);

    if (hash === expectedHash) {
      return JSON.parse(data);
    } else {
      console.warn("Save data tampered. Checksum mismatch.");
      return null;
    }
  } catch (error) {
    console.error("Failed to decode save data:", error);
    return null;
  }
}