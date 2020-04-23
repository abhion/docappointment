import React from 'react';
import {Route, Link, Redirect} from 'react-router-dom';
import AppointmentList from './AppointmentsList';
import ReviewList from './ReviewsList';
import { Layout, Menu } from 'antd';
import { startGetDoctorFromId } from '../actions/doctorActions';
import {connect} from 'react-redux';

const {Sider, Content} = Layout;

class DoctorContainer extends React.Component{

    componentDidMount(){
        
        if(this.props.loggedInUser && this.props.loggedInUser._id){
            this.props.dispatch(startGetDoctorFromId(this.props.loggedInUser._id))
        }
    }

    componentDidUpdate(prevProps){
        
        if(!prevProps.loggedInUser || prevProps.loggedInUser._id !== this.props.loggedInUser._id){
            this.props.dispatch(startGetDoctorFromId(this.props.loggedInUser._id));
        }
    }

    render(){
        console.log(this.props);
        if(!this.props.loggedInUser){
            return <>Loading</>
        }
        
        return (
            <div className="content-container">
            <Layout>
                <Sider>
                    <Menu className="side-menu">
                        <Menu.Item key="1">
                            <Link to="/doctor/appointments">Appointments</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to={`/doctor/feedback/${this.props.loggedInUser._id}`}>Feedback</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="loggedin-content">
                    <Content>
                    <Route path="/doctor/appointments" component={AppointmentList} />
                    <Route path="/doctor/feedback/:doctorUserId" component={ReviewList} />
                    </Content>
                </Layout>
            </Layout>

            {/* {path ? <Redirect to={path} /> : ''} */}
        </div>
          
        );
    }
}

function mapStateToProps(state){
    console.log(state);
    return {
        loggedInUser: state.user,
        selectedDoctor: state.selectedDoctor
    }
}

export default connect(mapStateToProps)(DoctorContainer);