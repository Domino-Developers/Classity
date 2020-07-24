import React, { useState } from 'react';
import useSWR from 'swr';

import userStore from '../../api/user';
import Loading from '../../components/Loading';
import UserList from '../../components/UserList';

const Leaderboard = () => {
    const [sort, setSort] = useState('score');

    const { data: users } = useSWR(`get-users-${sort}`, () =>
        userStore.getAllUsers({
            sort:
                sort === 'score' ? { score: -1, contribution: -1 } : { contribution: -1, score: -1 }
        })
    );

    if (!users) return <Loading />;

    return (
        <div className='container'>
            <h2>Leaderboard</h2>
            <UserList rank users={users} sort={sort} setSort={setSort} />
        </div>
    );
};

export default Leaderboard;
