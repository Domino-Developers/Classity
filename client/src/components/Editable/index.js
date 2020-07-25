import React from 'react';
import ContentEditable from 'react-contenteditable';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';

const pasteAsPlainText = event => {
    event.preventDefault();

    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
};

const Editable = props => {
    const { html, onChange, disabled, tagName, rich, className, block } = props;

    return rich && !disabled ? (
        <ReactQuill onChange={value => onChange({ target: { value } })} defaultValue={html} />
    ) : (
        <ContentEditable
            html={html}
            onChange={onChange}
            disabled={disabled}
            tagName={tagName}
            onPaste={pasteAsPlainText}
            style={{ display: block ? 'block' : 'inline-block', minWidth: '20rem' }}
            className={className}
        />
    );
};

Editable.propTypes = {
    html: PropTypes.string,
    className: PropTypes.string,
    tagName: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool
};

export default Editable;
