import React from 'react';
import  { Route } from 'react-router-dom';

import SearchDoctor from './SearchDoctor';

class PatientContainer extends React.Component{

    render(){
        return (
            <div className="content-container">
                <Route path="/patient/search" component={SearchDoctor} />
            </div>
        );
    }
}

export default PatientContainer;