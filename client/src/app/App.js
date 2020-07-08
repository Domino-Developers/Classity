import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import loadable from '@loadable/component';

import Navbar from '../features/Navbar';
import Loading from '../components/Loading';
import store from './store';
import './App.css';
import Alerts from '../features/Alerts';
import { loadUser, authRejected } from '../features/Auth/authSlice';
import { initTokenCom } from '../utils/storageCom';
import ClassroomRoute from '../features/ClassroomRoute';
import PrivateRoute from '../components/PrivateRoute';

// loadable components
const Course = loadable(() => import('../features/Course'), {
    fallback: <Loading />
});
const Landing = loadable(() => import('../components/Landing'), {
    fallback: <Loading />
});
const ContentContainer = loadable(() => import('../components/ContentContainer'), {
    fallback: <Loading />
});

const Dashboard = loadable(() => import('../features/Dashboard'), {
    fallback: <div>Dashboard Loading ... </div>
});

function App() {
    useEffect(() => {
        initTokenCom(
            () => {
                store.dispatch(loadUser({ dontCommunicate: true }));
            },
            () => {
                store.dispatch(authRejected({ dontComunicate: true }));
            }
        );
    }, []);
    return (
        <Provider store={store}>
            <Router>
                <Navbar />
                <Alerts />
                <div className='main'>
                    <Switch>
                        <Route exact path='/' component={Landing} />
                        <Route exact path='/course/:courseId' component={Course} />
                        <ClassroomRoute
                            path='/course/:courseId/topic/:topicId'
                            render={props => <ContentContainer {...props} />}
                        />
                        <PrivateRoute exact path='/dashboard' component={Dashboard} />
                    </Switch>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
