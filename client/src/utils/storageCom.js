export function sendTokenReq() {
    localStorage.setItem('GTS_TOKEN_REQ', Date.now());
    localStorage.removeItem('GTS_TOKEN_REQ');
}
export function sendFlushReq() {
    localStorage.setItem('GTS_FLUSH_REQ', Date.now());
    localStorage.removeItem('GTS_FLUSH_REQ');
}
export function sendTokenRes(token) {
    localStorage.setItem('GTS_TOKEN_RES', token);
    localStorage.removeItem('GTS_TOKEN_RES');
}
export function initTokenCom(setAuth, removeAuth) {
    let token = localStorage.getItem('GTS_TOKEN') || sessionStorage.getItem('GTS_TOKEN');

    if (token) {
        sessionStorage.setItem('GTS_TOKEN', token);
        setAuth();
    } else {
        removeAuth();
        sendTokenReq();
    }

    window.addEventListener('storage', event => {
        token = sessionStorage.getItem('GTS_TOKEN');

        if (event.key === 'GTS_TOKEN_REQ' && token) {
            sendTokenRes(token);
        }
        if (event.key === 'GTS_TOKEN_RES' && !token) {
            sessionStorage.setItem('GTS_TOKEN', event.newValue);
            setAuth();
        }
        if (event.key === 'GTS_FLUSH_REQ' && token) {
            removeAuth();
        }
    });
}
