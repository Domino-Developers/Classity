import React, { useState } from 'react';
import useSWR from 'swr';

import Tabs from '../../components/Tabs';
import UserList from '../../components/UserList';
import Loading from '../../components/Loading';
import { useQuery } from '../../utils/hooks';
import courseStore from '../../api/course';
import userStore from '../../api/user';
import CardsContainer from '../CardsContainer';

const Search = () => {
    const [userSort, setUserSort] = useState('score');
    const [query] = useQuery();
    const text = query.get('q') || '';

    const { data: courses } = useSWR(`search-course-${text}`, () => courseStore.search(text));
    const { data: users } = useSWR(`search-user-${text}`, () =>
        userStore.getAllUsers({ name: text })
    );

    if (userSort === 'score' && users) {
        users.sort((a, b) => b.score - a.score || b.contribution - a.contribution);
    } else if (users) {
        users.sort((a, b) => b.contribution - a.contribution || b.score - a.score);
    }

    return (
        <div className='container'>
            <h3>Search: {text}</h3>
            <Tabs.Container>
                <Tabs.Tab name='Courses'>
                    {courses ? (
                        courses.length ? (
                            <CardsContainer normal courses={courses} />
                        ) : (
                            <p>No results found.</p>
                        )
                    ) : (
                        <Loading />
                    )}
                </Tabs.Tab>
                <Tabs.Tab name='Users'>
                    {users ? (
                        users.length ? (
                            <UserList users={users} sort={userSort} setSort={setUserSort} />
                        ) : (
                            <p>No results found.</p>
                        )
                    ) : (
                        <Loading />
                    )}
                </Tabs.Tab>
            </Tabs.Container>
        </div>
    );
};

export default Search;
