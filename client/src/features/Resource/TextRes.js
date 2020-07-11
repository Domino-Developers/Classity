import React, { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import { useEdit } from '../../utils/hooks';
import { setAlert } from '../Alerts/alertSlice';
import Editable from '../../components/Editable';
import stripHtml from '../../utils/stripHtml';

const TextRes = ({ payload, instructor, update }) => {
    const dispatch = useDispatch();
    const [isSaving, setSave] = useState(false);
    const [text, setText] = useState(payload.text);

    const [editing, edit] = useEdit();
    if (editing && !instructor) edit(false);

    const save = async () => {
        if (!stripHtml(text)) {
            dispatch(setAlert('Please enter some text', 'danger'));
            return;
        }
        setSave(true);
        await update({ ...payload, text });
        setSave(false);
        edit(false);
    };

    const cancel = () => {
        setText(payload.text);
        edit(false);
    };

    return (
        <Fragment>
            <h2 className='text__heading'> {payload.name} </h2>
            {instructor && !editing && <Button text='Edit' onClick={() => edit(true)} />}
            {instructor && editing && (
                <Fragment>
                    <Button text='Save Text' onClick={save} loading={isSaving ? 'Saving' : null} />
                    <Button text='Cancel' onClick={cancel} />
                </Fragment>
            )}
            <div>
                <Editable
                    html={text}
                    onChange={e => setText(e.target.value)}
                    disabled={!editing}
                    rich
                />
            </div>
        </Fragment>
    );
};

export default TextRes;
