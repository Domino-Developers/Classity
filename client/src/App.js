import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Course from './components/Course';
import Topic from './components/Topic';

import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
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
    );
}

export default App;
