import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const algorithm = "aes-256-ctr";

export function encrypt(text: string, password: string) {
  const key = Buffer.concat([Buffer.from(password), Buffer.alloc(32)], 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + encrypted.toString("hex");
}

export function decrypt(text: string, password: string) {
  const key = Buffer.concat([Buffer.from(password), Buffer.alloc(32)], 32);
  const iv = Buffer.from(text.substring(0, 32), "hex");
  const encryptedText = Buffer.from(text.substring(32), "hex");
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
