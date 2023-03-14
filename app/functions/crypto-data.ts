
import * as crypto from 'crypto';

const fillSecret = (secret: string) => {

        if (secret.length < 16) {

            let add = '';

            for (let i = 0; i < 32 - secret.length; i++) {

                add += '1';      

            }
            
            return secret + add;

        }else{
            return secret.substring(0, 32);
        }

    };


const encryptData = (text: string, secret: string) => {

        const secretKey = fillSecret(secret);

        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex'),
        };
    };

    function decryptData(hash: { iv: string, content: string }, secret: string) {


         const secretKey = fillSecret(secret);

        const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, Buffer.from(hash.iv, 'hex'));

        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

        return decrpyted.toString();

    }

    

export {
    encryptData,
    decryptData
}