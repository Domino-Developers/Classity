import React from 'react';
import ContentEditable from 'react-contenteditable';
import PropTypes from 'prop-types';

import './Editable.css';

const pasteAsPlainText = event => {
    event.preventDefault();

    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
};

// const toNormal = text => {
//     // text = text.replace('<br>', '');
//     text = text.replace('<div>', '');
//     text = text.replace('</div>', '');
//     return text;
// };

const Editable = props => {
    const { html, text, onChange, disabled, tagName } = props;
    const showHtml = html || text;

    return (
        <ContentEditable
            html={showHtml}
            onChange={onChange}
            disabled={disabled}
            tagName={tagName}
            onPaste={pasteAsPlainText}
        />
    );
};

Editable.propTypes = {
    html: PropTypes.string,
    text: PropTypes.string,
    tagName: PropTypes.string,
    onChange: PropTypes.bool,
    disabled: PropTypes.bool
};

export default Editable;
