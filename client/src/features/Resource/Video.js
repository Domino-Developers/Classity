import React, { useState, Fragment } from 'react';
import Loading from '../../components/Loading';

const Video = ({ payload }) => {
    const [loading, setLoading] = useState(true);

    const videoURL = new URL(payload.url);
    console.log(videoURL);
    let videoId = null;
    if (videoURL.hostname === 'www.youtube.com') {
        videoId = videoURL.searchParams.get('v');
    } else videoId = videoURL.pathname.split('/')[1];

    const embedURL = 'https://www.youtube.com/embed/' + videoId;

    return (
        <Fragment>
            <h2>
                <center>{payload.name}</center>
            </h2>

            <div className='video-container'>
                <div className='video-wrapper'>
                    {loading ? <Loading /> : null}
                    <iframe
                        title='video'
                        src={embedURL}
                        onLoad={() => {
                            console.log('hi');
                            setLoading(false);
                        }}
                        frameBorder='0'
                        allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen></iframe>
                </div>
            </div>
        </Fragment>
    );
};

export default Video;
