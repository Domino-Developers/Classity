import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { setAlert } from '../Alerts/alertSlice';
import Button from '../../components/Button';

const ImageUploader = ({ upload, uploading, courseChanges, close }) => {
    const dispatch = useDispatch();
    const [file, setFile] = useState();
    const [link, setLink] = useState(courseChanges.current.imageURL);

    const uploadImage = async () => {
        if (!file) {
            dispatch(setAlert('Please Select an Image', 'danger'));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            dispatch(setAlert('File size should be < 5 MB', 'danger'));
            return;
        }

        const newLink = await upload(file);
        if (newLink) {
            setLink(newLink);
            courseChanges.current.imageURL = newLink;
        }
    };

    return (
        <div className='overlay'>
            <a href='#!' className='overlay__close' onClick={close}>
                <i className='fas fa-times'></i>
            </a>
            <div className='overlay__container'>
                <img src={link} alt='Course Image' className='image-uploader__image' />

                <div className='u-center-text'>
                    <label>
                        Enter URL of Image
                        <input
                            type='text'
                            className='input image-uploader__input--link'
                            defaultValue={link}
                            onChange={e => {
                                setLink(e.target.value);
                                courseChanges.current.imageURL = e.target.value;
                            }}
                        />
                    </label>
                    <p className='u-margin-bottom-small u-margin-top-medium'>OR</p>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={e => setFile(e.target.files[0])}
                    />
                    <Button
                        full
                        text='Upload Image'
                        loading={uploading && 'Uploading'}
                        onClick={uploadImage}
                        className='u-margin-left-small'
                    />
                </div>
            </div>
        </div>
    );
};

ImageUploader.propTypes = {
    upload: PropTypes.func.isRequired,
    uploading: PropTypes.bool.isRequired,
    courseChanges: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
};

export default ImageUploader;
