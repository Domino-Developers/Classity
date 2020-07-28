import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useQuery } from '../../utils/hooks';
import Loading from '../../components/Loading';
import { initAuth } from './authSlice';
import { setAlert } from '../Alerts/alertSlice';

const GoogleLogin = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [query] = useQuery();
    useEffect(() => {
        const token = query.get('_gtk_');
        const err = query.get('err');
        if (err) {
            dispatch(setAlert(err, 'danger'));
            history.replace('/?authMode=login');
        } else if (!token) {
            dispatch(setAlert('Error. Please try again!', 'danger'));
            history.replace('/');
        } else {
            sessionStorage.setItem('GTS_TOKEN', token);
            dispatch(setAlert('Logined Succesfully', 'success'));
            history.replace('/');
            dispatch(initAuth({ dontCommunicate: false }));
        }
    });

    return (
        <Fragment>
            <div className='container'>
                <Loading />
                Processing ...
            </div>
        </Fragment>
    );
};

export default GoogleLogin;
