import React, { Fragment } from 'react';
import ContentEditable from 'react-contenteditable';
import PropTypes from 'prop-types';

import './Editable.css';

const pasteAsPlainText = event => {
    event.preventDefault();

    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
};

const makeRich = (event, command, argument) => {
    event.preventDefault();

    document.execCommand(command, false, argument);
};

const Editable = props => {
    const { html, onChange, disabled, tagName, rich } = props;

    return (
        <Fragment>
            <ContentEditable
                html={html}
                onChange={onChange}
                disabled={disabled}
                tagName={tagName}
                onPaste={pasteAsPlainText}
            />
            {rich && (
                <div className='rich-buttons'>
                    <div className='left'>
                        <a
                            href='#!'
                            onClick={e => makeRich(e, 'formatBlock', 'h1')}
                        >
                            Heading
                        </a>
                        <a
                            href='#!'
                            onClick={e => makeRich(e, 'formatBlock', 'h3')}
                        >
                            SubHeading
                        </a>
                        <a
                            href='#!'
                            onClick={e => makeRich(e, 'formatBlock', 'p')}
                        >
                            Normal
                        </a>
                    </div>
                    <div className='right'>
                        <a href='#!' onClick={e => makeRich(e, 'bold')}>
                            Bold
                        </a>
                        <a href='#!' onClick={e => makeRich(e, 'italic')}>
                            Italic
                        </a>
                        <a href='#!' onClick={e => makeRich(e, 'underline')}>
                            Underline
                        </a>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

Editable.propTypes = {
    html: PropTypes.string,
    tagName: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
};

export default Editable;
