const fetch = require('node-fetch');
const FormData = require('form-data');

const uploadImage = async file => {
    const key = process.env.IMGBB_KEY;
    const url = `https://api.imgbb.com/1/upload?key=${key}`;

    const formData = new FormData();
    formData.append('image', file);

    const reqOpts = {
        method: 'POST',
        body: formData,
        redirect: 'follow'
    };

    const res = await fetch(url, reqOpts);
    const resJson = await res.json();

    return resJson;
};

module.exports = uploadImage;
