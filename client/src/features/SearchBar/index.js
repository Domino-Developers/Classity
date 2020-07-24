import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';

import courseStore from '../../api/course';
import userStore from '../../api/user';
import Html from '../../components/Html';

const SearchBar = ({ initial, small }) => {
    const history = useHistory();

    const [text, setText] = useState(initial || '');

    const { data: courses } = useSWR(`search-course-${text}`, () => courseStore.search(text));
    const { data: users } = useSWR(`search-user-${text}`, () =>
        userStore.getAllUsers({ name: text })
    );

    const regex = new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi');

    const submit = (e, search) => {
        e.preventDefault();
        e.target.closest('.search-bar').firstChild.blur();
        if (small) setText('');
        history.replace(`/search?q=${search || text}`);
    };

    const enhance = str => <Html tag='p'>{str.replace(regex, '<span>$&</span>')}</Html>;

    return (
        <form className={'search-bar' + (small ? ' search-bar--small' : '')} onSubmit={submit}>
            <input
                type='text'
                className='search-bar__input'
                placeholder='Search'
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <i className='fas fa-search search-bar__icon' onClick={submit}></i>
            <ul className='search-bar__suggestions'>
                {text &&
                    courses &&
                    courses.map((course, i) => (
                        <li
                            key={i}
                            onClick={e => {
                                setText(course.name);
                                submit(e, course.name);
                            }}>
                            {enhance(course.name)}
                        </li>
                    ))}
                {text &&
                    users &&
                    users.map((user, i) => (
                        <li
                            key={i}
                            onClick={e => {
                                setText(user.name);
                                submit(e, user.name);
                            }}>
                            {enhance(user.name)}
                        </li>
                    ))}
            </ul>
        </form>
    );
};

SearchBar.propTypes = {
    initial: PropTypes.string,
    small: PropTypes.bool
};

export default SearchBar;
