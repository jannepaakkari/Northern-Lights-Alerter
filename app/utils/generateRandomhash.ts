import * as crypto from 'crypto';

// Function to generate a random hash
export function generateRandomHash(): string {
    const randomData = crypto.randomBytes(16);
    return crypto.createHash('sha256')
        .update(new Uint8Array(randomData))
        .digest('hex');
}
