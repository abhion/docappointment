import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';

import SearchDoctor from './SearchDoctor';
import ReviewsList from './ReviewsList';
import DoctorSearchList from './DoctorSearchList';
import { Layout, Menu } from 'antd';
import AppointmentsList from './AppointmentsList';
const { Sider, Content } = Layout;

class PatientContainer extends React.Component {
    render() {

        
        let path = '';
        if (this.props.history.location.pathname === '/patient' || this.props.history.location.pathname === '/patient/') {

            path = localStorage.getItem('current_path') || '/patient/search';
        }
        else{
            // path = this.props.history.location.pathname;
        }
        return (
            <div className="content-container">
                <Layout>
                    <Sider>
                        <Menu className="side-menu">
                            <Menu.Item key="1" 
                            className={path === '/patient/search' ? 'selected-menu-item': ''}>
                                <Link to="/patient/search">Search Doctors</Link>
                            </Menu.Item>
                            <Menu.Item
                            className={path === '/patient/appointments' ? 'selected-menu-item': ''}
                             key="2">
                                <Link to="/patient/appointments">My Appointments</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="loggedin-content">
                        <Content>
                            <Route path="/patient/search" exact component={SearchDoctor} />
                            <Route path="/patient/feedback/:doctorUserId" component={ReviewsList} />
                            <Route path="/patient/search/results" component={DoctorSearchList} />
                            <Route path="/patient/appointments" component={AppointmentsList} />
                        </Content>
                    </Layout>
                </Layout>

                {path ? <Redirect to={path} /> : ''}
            </div>
        );
    }
}

export default PatientContainer;