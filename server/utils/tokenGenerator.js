const crypto = require('crypto');

const getToken = bytes =>
    new Promise((res, rej) => {
        crypto.randomBytes(bytes, (err, buf) => {
            if (err) {
                rej(err);
            }
            res(buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, ''));
        });
    });

module.exports = getToken;
