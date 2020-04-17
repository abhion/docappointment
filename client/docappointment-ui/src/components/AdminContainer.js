import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AdmVerifyDoctor from './AdmVerifyDoctor';
import { startGetLoggedInUser } from '../actions/usersAction';
import {connect} from 'react-redux';

class AdminContainer extends React.Component {

    componentWillMount(){
        console.log(this.props);
    }
    render() {
        return (
            <>
                <Route path="/admin/doctors/verify" component={AdmVerifyDoctor} />
            </>
        );
    }

}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(AdminContainer);