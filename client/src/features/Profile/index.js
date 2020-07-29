import React from 'react';
import loadable from '@loadable/component';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import Loading from '../../components/Loading';
import { getxycoordinates } from './helper';
import userStore from '../../api/user';

const LineChart = loadable(() => import('./LineChart'), { fallback: <Loading /> });

// Assumption: score or contribution will NOT be >= 1000

const sel = createSelector([state => state.user], myUser => myUser);

const Bar = ({ start, end, exact, progress }) => (
    <div className='profile-bar'>
        <div className='profile-bar__filled' style={{ width: `${progress}%` }}>
            <span className='profile-bar__text profile-bar__text--exact'>{exact}</span>
        </div>
        <span className='profile-bar__text profile-bar__text--start'>{start}</span>
        <span className='profile-bar__text profile-bar__text--end'>{end}</span>
    </div>
);

const Profile = () => {
    const { userId } = useParams();
    const myUser = useSelector(sel);

    let { data: user } = useSWR(myUser._id !== userId ? `get-user-${userId}` : null, () =>
        userStore.getUserById(userId)
    );

    if (userId === myUser._id) user = myUser;

    if (!user) return <Loading />;

    let score = 0;
    let contribution = 0;

    if (user.score) Object.values(user.score).forEach(point => (score += point));
    if (user.contribution)
        Object.values(user.contribution).forEach(point => (contribution += point));

    const levels = [0, 10, 50, 100, 250, 500, 1000, 99999];
    const levelNames = ['Newbie', 'Pupil', 'Specialist', 'Expert', 'Master', 'Legendary'];
    const colors = ['gray', 'green', 'rgb(3,168,158)', 'blue', 'rgb(170,0,170)', 'rgb(255,140,0)'];

    let contributionLevel = levels.findIndex(
        (points, i) => contribution >= points && contribution < levels[i + 1]
    );
    if (contributionLevel === -1) contributionLevel = 0;

    const contributionPercent =
        contribution >= 0
            ? (100 * (contribution - levels[contributionLevel])) /
              (levels[contributionLevel + 1] - levels[contributionLevel])
            : 0;

    const scoreLevel = levels.findIndex((points, i) => score >= points && score < levels[i + 1]);

    const scorePercent =
        (100 * (score - levels[scoreLevel])) / (levels[scoreLevel + 1] - levels[scoreLevel]);

    return (
        <div className='container'>
            <h2>{user.name}</h2>
            <p className='profile__email'>{user.email}</p>
            <div className='profile__level-container'>
                <div className='profile__level'>
                    <p className='u-margin-bottom-small' style={{ color: colors[scoreLevel] }}>
                        {levelNames[scoreLevel]} Learner
                    </p>
                    <Bar
                        progress={scorePercent}
                        start={levels[scoreLevel]}
                        end={levels[scoreLevel + 1]}
                        exact={score}
                    />
                </div>
                <div className='profile__level'>
                    <p
                        className='u-margin-bottom-small'
                        style={{ color: colors[contributionLevel] }}>
                        {levelNames[contributionLevel]} Contributor
                    </p>
                    <Bar
                        progress={contributionPercent}
                        start={Math.min(contribution, levels[contributionLevel])}
                        end={levels[contributionLevel + 1]}
                        exact={contribution}
                    />
                </div>
            </div>
            <p className='profile__title'>
                Score&nbsp;
                <Link to='/help#score' className='profile__learn-more'>
                    (Learn more)
                </Link>
            </p>
            <LineChart xyData={getxycoordinates(user.score)} label='Score' />
            <p className='profile__title'>
                Contributions&nbsp;
                <Link to='/help#contribution' className='profile__learn-more'>
                    (Learn more)
                </Link>
            </p>
            <LineChart xyData={getxycoordinates(user.contribution)} label='Contributions' />
        </div>
    );
};

export default Profile;

/**
 * Temp variables for lines 105 & 112
 * tempScore <=> user.score
 * tempContribution <=> user.contribution
 */

const tempScore = {
    '29/7/2020': 9,
    '6/8/2020': 2,
    '20/10/2020': 11,
    '12/9/2020': 16,
    '18/8/2020': 19,
    '10/9/2020': 10,
    '30/9/2020': 14,
    '13/8/2020': 7,
    '19/10/2020': 15,
    '15/7/2020': 20,
    '4/7/2020': 11,
    '26/9/2020': 4,
    '5/8/2020': 16,
    '8/10/2020': 10,
    '27/10/2020': 16
};

const tempContribution = {
    '29/7/2020': 9,
    '6/8/2020': 2,
    '20/10/2020': 11,
    '12/9/2020': 16,
    '18/8/2020': 19,
    '10/9/2020': 10,
    '30/9/2020': 14,
    '13/8/2020': -10,
    '19/10/2020': 15,
    '15/7/2020': 20,
    '4/7/2020': 3,
    '26/9/2020': -50,
    '5/8/2020': 16,
    '8/10/2020': 10,
    '27/10/2020': 16
};
