import React from 'react';
import {Route, Link, Redirect} from 'react-router-dom';
import AppointmentList from './AppointmentsList';
import ReviewList from './ReviewsList';
import { Layout, Menu } from 'antd';

const {Sider, Content} = Layout;

class DoctorContainer extends React.Component{

    render(){
        return (
            <div className="content-container">
            <Layout>
                <Sider>
                    <Menu className="side-menu">
                        <Menu.Item key="1">
                            <Link to="/doctor/appointments">Appointments</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/doctor/feedback">Feedback</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="loggedin-content">
                    <Content>
                    <Route path="/doctor/appointments" component={AppointmentList} />
                    <Route path="/doctor/feedback" component={ReviewList} />
                    </Content>
                </Layout>
            </Layout>

            {/* {path ? <Redirect to={path} /> : ''} */}
        </div>
          
        );
    }
}

export default DoctorContainer;