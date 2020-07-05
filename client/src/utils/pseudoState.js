export default function pseudoState(initChange = {}) {
    const changes = initChange;
    const change = (key, value) => {
        changes[key] = value;
    };

    return [changes, change];
}
