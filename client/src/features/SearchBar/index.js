import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';

import courseStore from '../../api/course';
import userStore from '../../api/user';
import Html from '../../components/Html';
import stripHtml from '../../utils/stripHtml';

const SearchBar = ({ initial, small }) => {
    const history = useHistory();

    const [text, setText] = useState(initial || '');
    const selected = useRef(-1);

    const { data: newCourses } = useSWR(`search-course-${text}`, () => courseStore.search(text));
    const { data: newUsers } = useSWR(`search-user-${text}`, () =>
        userStore.getAllUsers({ name: text })
    );

    const courses = useRef();
    const users = useRef();

    if (newCourses) courses.current = newCourses;
    if (newUsers) users.current = newUsers;

    const regex = new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi');

    const submit = (e, search) => {
        if (search) setText(search);
        e.preventDefault();
        e.target.closest('.search-bar').firstChild.blur();
        history.replace(`/search?q=${search || text}`);
    };

    const enhance = str => (
        <Html>{str.replace(regex, '<span class="search-bar__found">$&</span>')}</Html>
    );

    return (
        <form
            onKeyDown={e => {
                const suggestionList = e.target.closest('.search-bar').childNodes[2];
                const noOfSuggestions = suggestionList.childNodes.length;

                if (e.keyCode === 38) {
                    if (selected.current === -1) {
                        suggestionList.childNodes[noOfSuggestions - 1].classList.add('selected');
                        selected.current = noOfSuggestions - 1;
                    } else {
                        if (selected.current < noOfSuggestions)
                            suggestionList.childNodes[selected.current].classList.remove(
                                'selected'
                            );
                        if (selected.current >= 0) {
                            selected.current -= 1;
                            if (selected.current >= 0)
                                suggestionList.childNodes[selected.current].classList.add(
                                    'selected'
                                );
                        }
                    }
                } else if (e.keyCode === 40) {
                    if (selected.current >= 0 && selected.current < noOfSuggestions)
                        suggestionList.childNodes[selected.current].classList.remove('selected');
                    if (selected.current < noOfSuggestions) {
                        selected.current += 1;
                        if (selected.current < noOfSuggestions) {
                            suggestionList.childNodes[selected.current].classList.add('selected');
                        } else {
                            selected.current = -1;
                        }
                    }
                } else if (e.keyCode === 13 && selected.current !== -1) {
                    const search = stripHtml(suggestionList.childNodes[selected.current].innerHTML);
                    submit(e, search);
                }
            }}
            className={'search-bar' + (!text && small ? ' search-bar--small' : '')}
            onSubmit={submit}>
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
                    courses.current &&
                    courses.current.map((course, i) => (
                        <li
                            key={i}
                            onClick={e => {
                                submit(e, course.name);
                            }}>
                            <i className='fas fa-book'></i>
                            {enhance(course.name)}
                        </li>
                    ))}
                {text &&
                    users.current &&
                    users.current.map((user, i) => (
                        <li
                            key={i}
                            onClick={e => {
                                submit(e, user.name);
                            }}>
                            <i className='fas fa-user'></i>
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
