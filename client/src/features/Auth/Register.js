import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setAlert } from '../Alerts/alertSlice';
import { register } from './authSlice';
import Button from '../../components/Button';

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
        <form onSubmit={onSubmit}>
            <label className='auth__label'>
                Name
                <input
                    className='auth__input auth__input--text'
                    type='text'
                    name='name'
                    placeholder='Name'
                    onChange={onChange}
                    value={name}
                    required
                />
            </label>
            <label className='auth__label'>
                Email:
                <input
                    className='auth__input auth__input--text'
                    type='email'
                    name='email'
                    placeholder='Email'
                    onChange={onChange}
                    value={email}
                    required
                />
            </label>
            <label className='auth__label'>
                Password
                <input
                    className='auth__input auth__input--text'
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={onChange}
                    value={password}
                    minLength='6'
                    required
                />
            </label>
            <label className='auth__label'>
                Confirm Password
                <input
                    className='auth__input auth__input--text'
                    type='password'
                    name='password2'
                    placeholder='Confirm Password'
                    onChange={onChange}
                    value={password2}
                    minLength='6'
                    required
                />
            </label>
            <div className='auth__input'>
                <Button value='Submit' loading={loading && 'Loading'} />
            </div>
        </form>
    );
};

export default Register;
