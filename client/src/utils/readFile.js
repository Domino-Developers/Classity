export default function readFile(file) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort();
            reject();
        };

        reader.onload = () => {
            const base64 = reader.result.split(',').pop();
            resolve(base64);
        };

        reader.readAsDataURL(file);
    });
}
