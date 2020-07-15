export default function stripHtml(html) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText.trim() || '';
}
