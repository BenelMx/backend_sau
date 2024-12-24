// utils/password.js

const argon2 = require('argon2');

const password = {
    async hash(plainPassword) {
        try {
            return await argon2.hash(plainPassword);
        } catch (error) {
            console.error('Error hashing password:', error);
            throw error;
        }
    },

    async verify(hashedPassword, plainPassword) {
        try {
            return await argon2.verify(hashedPassword, plainPassword);
        } catch (error) {
            console.error('Error verifying password:', error);
            throw error;
        }
    }
};

module.exports = password;