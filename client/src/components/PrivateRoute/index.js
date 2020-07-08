import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Loading from '../Loading';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useSelector(state => state.auth);

    return (
        <Route
            {...rest}
            render={props =>
                loading ? (
                    <Loading />
                ) : isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to='/?authMode=register' />
                )
            }
        />
    );
};

export default PrivateRoute;
