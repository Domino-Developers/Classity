import React, { Fragment } from 'react';
import ScoreChart from './ScoreChart';
import ContributionChart from './ContributionChart';

const Profile = () => {
    return (
        <Fragment>
            <ScoreChart />
            <ContributionChart />
        </Fragment>
    );
};

export default Profile;
