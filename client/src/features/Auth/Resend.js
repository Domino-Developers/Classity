import React, { Fragment, useState, useEffect } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import Loading from '../../components/Loading';
import userStore from '../../api/user';
import { setInactive } from './authSlice';
import { setAlert } from '../Alerts/alertSlice';

const sel = createSelector(
    state => state.user.nextTokenRequest,
    t => t
);

const getTimeLeft = till => {
    const diff = till - Date.now();
    const seconds = Math.floor(diff / 1000);
    return {
        mins: Math.floor(seconds / 60),
        secs: seconds % 60
    };
};

const Resend = ({ requestFor }) => {
    const date = useSelector(sel);
    const till = new Date(date).getTime();
    const [time, setTime] = useState(getTimeLeft(till));
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let myInterval;
        if (till > Date.now()) {
            myInterval = setInterval(() => {
                setTime(getTimeLeft(till));
                if (till <= Date.now()) {
                    clearInterval(myInterval);
                }
            }, 1000);
        }

        return () => {
            clearInterval(myInterval);
            dispatch(setInactive({ inactive: false }));
        };
    }, [till, dispatch]);

    const resend = async () => {
        try {
            setLoading(true);
            await userStore.rerequestLink('email-verify', requestFor);
            setLoading(false);
            dispatch(setInactive({ inactive: false }));
        } catch (err) {
            const errors = err.errors;
            if (errors) {
                errors.forEach(e => {
                    dispatch(setAlert(e.msg, 'danger'));
                });
            }
            console.error(err);
        }
    };

    if (till <= Date.now())
        return (
            <Fragment>
                Did not get email ?{' '}
                {loading ? (
                    <Loading inline size='4' />
                ) : (
                    <span onClick={resend} className='resend__link'>
                        Resend
                    </span>
                )}
            </Fragment>
        );

    return (
        <Fragment>
            Did not get email? Resend email in {time.mins} : {time.secs}{' '}
        </Fragment>
    );
};

Resend.propTypes = {
    requestFor: PropTypes.string.isRequired
};

export default Resend;
