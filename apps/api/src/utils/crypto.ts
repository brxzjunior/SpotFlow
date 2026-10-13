import crypto from 'crypto';
import { env } from '../config/env.js';

// Deriva chave de 32 bytes do segredo configurado
const ALGORITHM = 'aes-256-gcm';
const KEY = crypto.createHash('sha256').update(env.JWT_SECRET).digest();

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Retorna iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptSecret(encryptedPayload: string): string {
  try {
    const [ivHex, authTagHex, encryptedHex] = encryptedPayload.split(':');
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error('Payload criptografado malformado');
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Falha ao descriptografar token em repouso');
  }
}
