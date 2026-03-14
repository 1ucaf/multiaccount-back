import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

@Injectable()
export class EncryptionService {
  private readonly key: Buffer;

  constructor() {
    const rawKey = process.env.ENCRYPTION_KEY;
    if (!rawKey || rawKey.length < 32) {
      this.key = Buffer.alloc(0);
      return;
    }
    if (rawKey.length === 64 && /^[0-9a-fA-F]+$/.test(rawKey)) {
      this.key = Buffer.from(rawKey, 'hex');
    } else {
      this.key = Buffer.from(rawKey, 'base64');
    }
    if (this.key.length !== KEY_LENGTH) {
      this.key = Buffer.alloc(0);
    }
  }

  private ensureKey(): void {
    if (!this.key || this.key.length !== KEY_LENGTH) {
      throw new Error(
        'ENCRYPTION_KEY must be set (64 hex or 44 base64 chars for 32 bytes)',
      );
    }
  }

  encrypt(plainText: string): string {
    this.ensureKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

  decrypt(cipherText: string): string {
    this.ensureKey();
    const buffer = Buffer.from(cipherText, 'base64');
    if (buffer.length < IV_LENGTH + AUTH_TAG_LENGTH) {
      throw new Error('Invalid cipher text');
    }
    const iv = buffer.subarray(0, IV_LENGTH);
    const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  }
}
