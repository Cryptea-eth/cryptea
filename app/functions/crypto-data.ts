
import * as crypto from 'crypto';

const encryptData = (text: string, secret: string) => {

        const secretKey = secret.substring(0, 32);

        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex'),
        };
    };

    function decryptData(hash: { iv: string, content: string }, secret: string) {

         const secretKey = secret.substring(0, 32);

        const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, Buffer.from(hash.iv, 'hex'));

        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

        return decrpyted.toString();

    }


module.exports = {
    encryptData,
    decryptData
}