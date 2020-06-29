import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { login } from './authSlice';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading);

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const checkBoxChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.checked
        });
    };

    const { email, password, remember } = formData;
    const onSubmit = e => {
        e.preventDefault();
        dispatch(login(email, password, remember));
    };
    return (
        <form className='auth-form' onSubmit={onSubmit}>
            <div className='auth-form-group'>
                <label htmlFor='email'>Email: </label>
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    onChange={onChange}
                    value={email}
                    required
                />
            </div>
            <div className='auth-form-group'>
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={onChange}
                    value={password}
                    minLength='6'
                    required
                />
            </div>
            <div className='auth-form-group'>
                <input
                    type='checkbox'
                    name='remember'
                    checked={remember}
                    onChange={checkBoxChange}
                />{' '}
                Remember me
            </div>
            <div className='auth-form-group'>
                {loading ? (
                    'Loading ...'
                ) : (
                    <input
                        type='submit'
                        value='Submit'
                        className='btn btn-full'
                    />
                )}
            </div>
        </form>
    );
};

export default Login;
