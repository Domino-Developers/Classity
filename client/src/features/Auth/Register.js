import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setAlert } from '../Alerts/alertSlice';
import Button from '../../components/Button';
import userStore from '../../api/user';
import { setNextTokenDate } from '../User/userSlice';
import Resend from './Resend';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const dispatch = useDispatch();
    const [warning, setWarning] = useState({ show: false, loading: false, userEmail: '' });

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const onSubmit = e => {
        e.preventDefault();
        if (password !== password2) {
            dispatch(setAlert("passwords don't match", 'danger', 2000));
            return;
        } else {
            register(name, email, password);
        }
    };

    const register = async (name, email, password) => {
        try {
            setWarning({ show: false, loading: true, userEmail: '' });
            const overide = false;
            const { nextTokenRequest } = await userStore.register({
                name,
                email,
                password,
                overide
            });

            if (!overide) {
                dispatch(setNextTokenDate(nextTokenRequest));
                setWarning({ show: true, loading: false, userEmail: email });
            } else {
                setWarning({ show: false, loading: false, userEmail: '' });
            }
            dispatch(setAlert('Registered Successfully', 'success', 2000));
        } catch (err) {
            const errors = err.errors;
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'));
            });
            setWarning({ show: false, loading: false, userEmail: '' });
            console.error(err);
        } finally {
            setFormData({
                name: '',
                email: '',
                password: '',
                password2: ''
            });
        }
    };

    const { name, email, password, password2 } = formData;
    return (
        <form onSubmit={onSubmit}>
            <div className='auth__field'>
                <input
                    className='auth__input auth__input--text input'
                    type='text'
                    name='name'
                    id='name'
                    placeholder='Name'
                    onChange={onChange}
                    value={name}
                    required
                />
                <label for='name' className='auth__label'>
                    Name
                </label>
            </div>
            <div className='auth__field'>
                <input
                    className='auth__input auth__input--text input'
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Email'
                    onChange={onChange}
                    value={email}
                    required
                />
                <label for='email' className='auth__label'>
                    Email
                </label>
            </div>
            <div className='auth__field'>
                <input
                    className='auth__input auth__input--text input'
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Password'
                    onChange={onChange}
                    value={password}
                    minLength='6'
                    required
                />
                <label for='password' className='auth__label'>
                    Password
                </label>
            </div>
            <div className='auth__field'>
                <input
                    className='auth__input auth__input--text input'
                    type='password'
                    name='password2'
                    id='password2'
                    placeholder='Confirm Password'
                    onChange={onChange}
                    value={password2}
                    minLength='6'
                    required
                />
                <label for='password2' className='auth__label'>
                    Confirm Password
                </label>
            </div>
            <div className='auth__field'>
                <div className='auth__input'>
                    <Button full value='Submit' loading={warning.loading && 'Loading'} />
                </div>
            </div>
            {warning.show && (
                <div className='auth__card__info'>
                    'Email send to <b>{warning.userEmail}.</b>
                    Please check your email for verification. Make sure to check your spam and junk
                    mail too! It may take upto 15 mins.'
                    <Resend requestFor={warning.userEmail} />
                </div>
            )}
        </form>
    );
};

export default Register;
