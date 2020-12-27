import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import Form from './Form';
import Button from '../Button';

const Footer = () => {
    const [feedback, setFeedback] = useState(false);

    return (
        <Fragment>
            {feedback && <Form close={() => setFeedback(false)} />}
            <footer className='footer'>
                <Button full text='Feedback' onClick={() => setFeedback(true)} />
                <div className='footer__social'>
                    <Link to='#!' className='footer__nav-link'>
                        <i className='fab fa-facebook-f'></i>
                    </Link>
                    <Link to='#!' className='footer__nav-link'>
                        <i className='fab fa-twitter'></i>
                    </Link>
                    <a href='mailto: dominodevelopers@outlook.com' className='footer__nav-link'>
                        <i className='fas fa-envelope'></i>
                    </a>
                </div>
                <p>&copy; 2020 Domino Developers. All rights reserved.</p>
                <div>
                    <Link to='/#explore' className='footer__nav-link footer__nav-link--text'>
                        Courses
                    </Link>
                    <Link to='/leaderboard' className='footer__nav-link footer__nav-link--text'>
                        Leaderboard
                    </Link>
                    <Link to='/help' className='footer__nav-link footer__nav-link--text'>
                        Help
                    </Link>
                    <a href='mailto: dominodevelopers@outlook.com' className='footer__nav-link'>
                        Contact
                    </a>
                </div>
            </footer>
        </Fragment>
    );
};

export default Footer;
