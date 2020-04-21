import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';

import SearchDoctor from './SearchDoctor';
import DoctorSearchList from './DoctorSearchList';
import { Layout, Menu } from 'antd';
const { Sider, Content } = Layout;

class PatientContainer extends React.Component {
    render() {
        let path = '';
        if (this.props.history.location.pathname === '/patient') {

            path = localStorage.getItem('current_path') || '/patient/search';
        }

        return (
            <div className="content-container">
                <Layout>
                    <Sider>
                        <Menu className="side-menu">
                            <Menu.Item key="1">
                                <Link to="/patient/search">Search Doctors</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/admin/specialization">My Appointments</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="loggedin-content">
                        <Content>
                            <Route path="/patient/search" exact component={SearchDoctor} />
                            <Route path="/patient/search/results" component={DoctorSearchList} />
                        </Content>
                    </Layout>
                </Layout>

                {path ? <Redirect to={path} /> : ''}
            </div>
        );
    }
}

export default PatientContainer;