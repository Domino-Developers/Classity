import React, { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { useEdit } from '../../utils/hooks';
import { setAlert } from '../Alerts/alertSlice';

const Video = ({ payload, instructor, update }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [isSaving, setSave] = useState(false);
    const [url, setUrl] = useState(payload.url);

    const [editing, edit] = useEdit();
    if (editing && !instructor) edit(false);

    const [videoUrl, setVideoUrl] = useState(new URL(payload.url));
    let videoId = null;
    if (videoUrl.hostname === 'www.youtube.com') {
        videoId = videoUrl.searchParams.get('v');
    } else videoId = videoUrl.pathname.split('/')[1];

    const embedUrl = 'https://www.youtube.com/embed/' + videoId;

    const save = async () => {
        const newUrl = new URL(url);
        if (!newUrl) {
            dispatch(setAlert('Please enter a valid YouTube video url', 'danger'));
            return;
        }
        setSave(true);
        await update({ ...payload, url }, () => setVideoUrl(newUrl));
        setSave(false);
        edit(false);
    };

    const cancel = () => {
        setUrl(payload.url);
        edit(false);
    };

    return (
        <Fragment>
            <h2 className='u-center-text'>{payload.name}</h2>
            {instructor && !editing && (
                <Button text='Edit' onClick={() => edit(true)} className='u-margin-bottom-medium' />
            )}
            {instructor && editing && (
                <Fragment>
                    <Button text='Save Video' onClick={save} loading={isSaving ? 'Saving' : null} />
                    <Button text='Cancel' onClick={cancel} className='u-margin-left-small' />
                </Fragment>
            )}

            {editing ? (
                <form>
                    <label>
                        Video url
                        <input
                            className='video__input'
                            type='text'
                            value={url}
                            onChange={e => setUrl(e.target.value)}></input>
                    </label>
                </form>
            ) : (
                <div className='video__container'>
                    {loading && <Loading />}
                    <iframe
                        className='video__frame'
                        title='video'
                        src={embedUrl}
                        onLoad={() => {
                            setLoading(false);
                        }}
                        frameBorder='0'
                        allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen></iframe>
                </div>
            )}
        </Fragment>
    );
};

export default Video;
