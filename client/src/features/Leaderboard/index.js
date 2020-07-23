import React, { useState } from 'react';
import useSWR from 'swr';
import { Link } from 'react-router-dom';

import userStore from '../../api/user';
import Loading from '../../components/Loading';

const Leaderboard = () => {
    const [sort, setSort] = useState('score');

    const { data: users } = useSWR(`get-users-${sort}`, () =>
        userStore.getAllUsers(
            sort === 'score' ? { score: -1, contribution: -1 } : { contribution: -1, score: -1 }
        )
    );

    if (!users) return <Loading />;

    const levels = [0, 10, 50, 100, 250, 500, 1000, 99999];
    const colors = ['gray', 'green', 'rgb(3,168,158)', 'blue', 'rgb(170,0,170)', 'rgb(255,140,0)'];

    return (
        <div className='container'>
            <h2>Leaderboard</h2>
            <table className='leaderboard__table'>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th
                            className={
                                'leaderboard__type' +
                                (sort === 'score' ? ' leaderboard__type--active' : '')
                            }
                            onClick={() => setSort('score')}>
                            Score <span className='leaderboard__arrow'>&#9662;</span>
                        </th>
                        <th
                            className={
                                'leaderboard__type' +
                                (sort === 'contribution' ? ' leaderboard__type--active' : '')
                            }
                            onClick={() => setSort('contribution')}>
                            Contributions <span className='leaderboard__arrow'>&#9662;</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, i) => {
                        let levelIndex = levels.findIndex(
                            (points, i) => user[sort] >= points && user[sort] < levels[i + 1]
                        );

                        if (levelIndex === -1) levelIndex = 0;

                        return (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td style={{ color: colors[levelIndex] }}>
                                    <Link className='leaderboard__link' to={`/profile/${user._id}`}>
                                        {user.name}
                                    </Link>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.score}</td>
                                <td>{user.contribution}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
export default Leaderboard;
