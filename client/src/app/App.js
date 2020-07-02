import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import Navbar from '../features/Navbar';
import Topic from '../features/Topic';
import store from './store';
import './App.css';
import Alerts from '../features/Alerts';
import { loadUser } from '../features/Auth/authSlice';
import loadable from '@loadable/component';

// loadable components
const Course = loadable(() => import('../features/Course'));
const Landing = loadable(() => import('../components/Landing'), {
    fallback: <div> Loading .. </div>
});

function App() {
    useEffect(() => {
        store.dispatch(loadUser());
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
                            path='/course'
                            render={() => (
                                <Course
                                    instructor
                                    fallback={<div> Loading ... </div>}
                                />
                            )}
                        />
                        <Route exact path='/topic' component={Topic} />
                    </Switch>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
