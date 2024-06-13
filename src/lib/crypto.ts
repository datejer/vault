import {
  createCipheriv,
  createDecipheriv,
  randomFill,
  scrypt,
  scryptSync,
} from "crypto";

const algorithm = "aes-256-cbc";

export const encrypt = (text: string, password: string) => {
  return new Promise<string>((resolve, reject) => {
    // First, we'll generate the key. The key length is dependent on the algorithm.
    // In this case for aes192, it is 24 bytes (192 bits).
    scrypt(password, process.env.JWT_SECRET!, 32, (err, key) => {
      if (err) throw err;
      // Then, we'll generate a random initialization vector
      randomFill(new Uint8Array(16), (err, iv) => {
        if (err) throw err;

        // Once we have the key and iv, we can create and use the cipher...
        const cipher = createCipheriv(algorithm, key, iv);

        let encrypted = "";
        cipher.setEncoding("hex");

        cipher.on("data", (chunk) => (encrypted += chunk));
        cipher.on("end", () => resolve(encrypted));

        cipher.write(text);
        cipher.end();
      });
    });
  });
};

export const decrypt = (encrypted: string, password: string) => {
  return new Promise<string>((resolve, reject) => {
    // Key length is dependent on the algorithm. In this case for aes192, it is
    // 24 bytes (192 bits).
    // Use the async `crypto.scrypt()` instead.
    const key = scryptSync(password, process.env.JWT_SECRET!, 32);
    // The IV is usually passed along with the ciphertext.
    const iv = Buffer.alloc(16, 0); // Initialization vector.

    const decipher = createDecipheriv(algorithm, key, iv);

    let decrypted = "";
    decipher.on("readable", () => {
      let chunk;
      while (null !== (chunk = decipher.read())) {
        decrypted += chunk.toString("utf8");
      }
    });
    decipher.on("end", () => {
      resolve(decrypted);
    });

    // Encrypted with same algorithm, key and iv.
    decipher.write(encrypted, "hex");
    decipher.end();
  });
};
