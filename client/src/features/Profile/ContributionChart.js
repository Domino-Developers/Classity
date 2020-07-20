import React from 'react';
import loadable from '@loadable/component';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { getxycoordinates } from './helper';
import Loading from '../../components/Loading';

const LineChart = loadable(() => import('./LineChart'), { fallback: <Loading /> });

const sel = createSelector(
    [state => state.user.loading, state => state.user.contribution],
    (loading, contributions) => ({ loading, contributions })
);

const ContributionChart = () => {
    const { loading, contributions } = useSelector(sel);

    if (loading) return <Loading />;

    console.log(contributions);

    const data = {
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

    const xyData = getxycoordinates(data);

    return (
        <div className='profile__chart'>
            <LineChart xyData={xyData} label='Contributions' />
        </div>
    );
};

export default ContributionChart;
