import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../layout/Button';
import Rating from '../layout/Rating';
import Editable from '../layout/Editable';

const Header = props => {
    const { instructor, edit, editing } = props;
    const [name, changeName] = useState(
        'GitHub Ultimate: Master Git and GitHub - Beginner to Expert'
    );

    return (
        <div className='course-header'>
            <div className='header-title'>
                <Editable
                    html={name}
                    tagName='h2'
                    onChange={e => changeName(e.target.value)}
                    disabled={!editing}
                />
            </div>
            <div className='header-description'>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                    cursus odio vitae orci feugiat, id maximus elit mollis.
                    Phasellus venenatis tincidunt mauris, at commodo nunc
                    consectetur eget.
                </p>
            </div>
            <div className='header-rating'>
                <Rating rating='2' />
                <p>2.0 (236 ratings)</p>
            </div>
            <div>1024 students enrolled</div>
            <div>
                Created by <em>Sanchit</em>
            </div>
            <div>Last update 06/2020</div>
            <div className='header-enroll'>
                {!instructor && <Button text='Enroll' full />}
                {instructor && !editing && (
                    <Button
                        text='Edit Course'
                        full
                        onClick={() => edit(true)}
                    />
                )}
                {instructor && editing && (
                    <Button
                        text='Save Course'
                        full
                        onClick={() => edit(false)}
                    />
                )}
            </div>
        </div>
    );
};

Header.propTypes = {
    instructor: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    edit: PropTypes.func.isRequired
};

export default Header;
