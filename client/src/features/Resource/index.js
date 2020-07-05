import React from 'react';
import { useParams } from 'react-router-dom';

const Resource = () => {
    const params = useParams();

    return <div>{params}</div>;
};

export default Resource;
