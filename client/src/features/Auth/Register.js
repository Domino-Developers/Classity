import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setAlert } from '../Alerts/alertSlice';
import { register } from './authSlice';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading);

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
            dispatch(register(name, email, password));
        }
        setFormData({
            name: '',
            email: '',
            password: '',
            password2: ''
        });
    };

    const { name, email, password, password2 } = formData;
    return (
        <form className='auth-form' onSubmit={onSubmit}>
            <div className='auth-form-group'>
                <label htmlFor='name'>Name</label>
                <input
                    type='text'
                    name='name'
                    placeholder='Name'
                    onChange={onChange}
                    value={name}
                    required
                />
            </div>
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
                <label htmlFor='password2'>Confirm Password</label>
                <input
                    type='password'
                    name='password2'
                    placeholder='Confirm Password'
                    onChange={onChange}
                    value={password2}
                    minLength='6'
                    required
                />
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

export default Register;
