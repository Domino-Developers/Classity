import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import Navbar from '../features/Navbar';
import Landing from '../components/Landing';
import Course from '../features/Course';
import Topic from '../features/Topic';
import store from './store';

import './App.css';
import Alerts from '../features/Alerts';
import { loadUser } from '../features/Auth/authSlice';

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
                            render={() => <Course instructor />}
                        />
                        <Route exact path='/topic' component={Topic} />
                    </Switch>
                </div>
            </Router>
        </Provider>
    );
}

export default App;
