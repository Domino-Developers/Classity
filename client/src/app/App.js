import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import loadable from '@loadable/component';

import Navbar from '../features/Navbar';
import Loading from '../components/Loading';
import Topic from '../features/Topic';
import store from './store';
import './App.css';
import Alerts from '../features/Alerts';
import { loadUser, authRejected } from '../features/Auth/authSlice';
import { initTokenCom } from '../utils/storageCom';

// loadable components
const Course = loadable(() => import('../features/Course'), {
    fallback: <Loading />
});
const Landing = loadable(() => import('../components/Landing'), {
    fallback: <Loading />
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
                        <Route
                            exact
                            path='/course/:courseId'
                            component={Course}
                        />
                        <Route exact path='/topic' component={Topic} />
                    </Switch>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
