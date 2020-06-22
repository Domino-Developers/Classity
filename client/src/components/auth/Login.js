import React, { useState } from 'react';
import './style.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const onSubmit = e => {
        e.preventDefault();
        console.log('SUCCESS');
    };

    const { email, password } = formData;
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
                    required
                />
            </div>
            <div className='auth-form-group'>
                <input type='submit' value='Submit' className='btn btn-full' />
            </div>
        </form>
    );
};

export default Login;
