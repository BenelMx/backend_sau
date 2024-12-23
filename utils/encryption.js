// utils/encryption.js

const crypto = require('crypto');

// Función para generar o normalizar la clave a 32 bytes
function getEncryptionKey() {
    const storedKey = process.env.ENCRYPTION_KEY;
    if (!storedKey) {
        // Si no hay clave, genera una nueva de 32 bytes
        return crypto.randomBytes(32);
    }
    
    // Si hay una clave en las variables de entorno, asegúrate de que tenga 32 bytes
    const key = crypto.createHash('sha256').update(String(storedKey)).digest();
    return key;
}

const ENCRYPTION_KEY = getEncryptionKey();
const IV_LENGTH = 16;

const encryption = {
    encrypt(text) {
        if (!text) return text;
        try {
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
            let encrypted = cipher.update(text.toString());
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return iv.toString('hex') + ':' + encrypted.toString('hex');
        } catch (error) {
            console.error('Encryption error:', error);
            return text; // En caso de error, devuelve el texto sin encriptar
        }
    },

    decrypt(text) {
        if (!text || !text.includes(':')) return text;
        try {
            const textParts = text.split(':');
            if (textParts.length !== 2) return text;
            
            const iv = Buffer.from(textParts[0], 'hex');
            const encryptedText = Buffer.from(textParts[1], 'hex');
            const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (error) {
            console.error('Decryption error:', error);
            return text; // En caso de error, devuelve el texto encriptado
        }
    },

    encryptFields(obj, fields) {
        if (!obj || typeof obj !== 'object') return obj;
        
        const encryptedObj = { ...obj };
        fields.forEach(field => {
            if (encryptedObj[field]) {
                try {
                    encryptedObj[field] = this.encrypt(encryptedObj[field]);
                } catch (error) {
                    console.error(`Error encrypting field ${field}:`, error);
                }
            }
        });
        return encryptedObj;
    },

    decryptFields(obj, fields) {
        if (!obj || typeof obj !== 'object') return obj;
        
        const decryptedObj = { ...obj };
        fields.forEach(field => {
            if (decryptedObj[field]) {
                try {
                    decryptedObj[field] = this.decrypt(decryptedObj[field]);
                } catch (error) {
                    console.error(`Error decrypting field ${field}:`, error);
                }
            }
        });
        return decryptedObj;
    }
};

module.exports = encryption;
