// utils\cryptoUtils.js

const crypto = require('crypto');

function encryptData(data) {
    const algorithm = 'aes-256-cbc';  // Algoritmo de encriptación
    const key = crypto.randomBytes(32);  // Clave secreta (debería ser almacenada de forma segura)
    const iv = crypto.randomBytes(16);  // Vector de inicialización
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return { encryptedData: encrypted, iv: iv.toString('hex'), key: key.toString('hex') };
}
