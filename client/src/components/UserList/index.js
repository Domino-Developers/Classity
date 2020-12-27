import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserList = ({ rank, users, sort, setSort }) => {
    const levels = [0, 10, 50, 100, 250, 500, 1000, 99999];
    const colors = ['gray', 'green', 'rgb(3,168,158)', 'blue', 'rgb(170,0,170)', 'rgb(255,140,0)'];

    const trimText = (text, maxLen = 20) => text.length <= maxLen ? text : text.slice(0, maxLen - 3) + '...'

    return (
        <table className='user-list__table'>
            <thead>
                <tr>
                    {rank && <th>Rank</th>}
                    <th>Name</th>
                    <th className='user-list__email'>Email</th>
                    <th
                        className={
                            'user-list__type' + (sort === 'score' ? ' user-list__type--active' : '')
                        }
                        onClick={() => setSort('score')}>
                        Score <span className='user-list__arrow'>&#9662;</span>
                    </th>
                    <th
                        className={
                            'user-list__type' +
                            (sort === 'contribution' ? ' user-list__type--active' : '')
                        }
                        onClick={() => setSort('contribution')}>
                        Contrib.<span className='user-list__arrow'>&#9662;</span>
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
                            {rank && <td>{i + 1}</td>}
                            <td style={{ color: colors[levelIndex] }}>
                                <Link className='user-list__link' to={`/profile/${user._id}`}>
                                    {trimText(user.name)}
                                </Link>
                            </td>
                            <td className='user-list__email'>{trimText(user.email)}</td>
                            <td>{user.score}</td>
                            <td>{user.contribution}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

UserList.propTypes = {
    rank: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    sort: PropTypes.string.isRequired,
    setSort: PropTypes.func.isRequired
};

export default UserList;
