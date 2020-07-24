import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../../utils/hooks';
import { useEffect } from 'react';
import userStore from '../../api/user';
import { useDispatch } from 'react-redux';
import { setAlert } from '../Alerts/alertSlice';
import Loading from '../../components/Loading';

const EmailVerify = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [query] = useQuery();
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = query.get('_tk_');
                const id = query.get('_id_');

                if (!token || !id) {
                    dispatch(setAlert('test', 'success'));
                    history.replace('/');
                    return;
                }

                const res = await userStore.verifyEmailToken(token, id);

                dispatch(setAlert(res.msg, 'success'));
                history.replace('/?authMode=login');
            } catch (err) {
                const errors = err.errors;
                if (errors) {
                    [...errors].forEach(e => dispatch(setAlert(e.msg, 'danger')));
                }
                history.replace('/?authMode=login');
                console.error(err);
            }
        };

        verifyToken();
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

export default EmailVerify;
