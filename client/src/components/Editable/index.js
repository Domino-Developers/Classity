import React, { Fragment } from 'react';
import ContentEditable from 'react-contenteditable';
import PropTypes from 'prop-types';

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
    const { html, onChange, disabled, tagName, rich, className, block } = props;

    return (
        <Fragment>
            <ContentEditable
                html={html}
                onChange={onChange}
                disabled={disabled}
                tagName={tagName}
                onPaste={pasteAsPlainText}
                style={{ display: block ? 'block' : 'inline-block', minWidth: '20rem' }}
                className={className}
            />
            {rich && !disabled && (
                <div className='editable__rich-btns'>
                    <div>
                        <a
                            className='editable__btn'
                            href='#!'
                            onClick={e => makeRich(e, 'formatBlock', 'h1')}>
                            Heading
                        </a>
                        <a
                            className='editable__btn'
                            href='#!'
                            onClick={e => makeRich(e, 'formatBlock', 'h3')}>
                            SubHeading
                        </a>
                        <a
                            className='editable__btn'
                            href='#!'
                            onClick={e => makeRich(e, 'formatBlock', 'p')}>
                            Normal
                        </a>
                    </div>
                    <div className='editable__rich-btns--right'>
                        <a className='editable__btn' href='#!' onClick={e => makeRich(e, 'bold')}>
                            Bold
                        </a>
                        <a className='editable__btn' href='#!' onClick={e => makeRich(e, 'italic')}>
                            Italic
                        </a>
                        <a
                            className='editable__btn'
                            href='#!'
                            onClick={e => makeRich(e, 'underline')}>
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
    className: PropTypes.string,
    tagName: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool
};

export default Editable;
