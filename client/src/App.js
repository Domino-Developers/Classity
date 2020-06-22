import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Course from './components/Course';

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
                </Switch>
            </div>
        </Router>
    );
}

export default App;
