import React from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import AdmVerifyDoctor from './AdmVerifyDoctor';
import AdmSpecialization from './AdmSpecialization';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
const { Sider, Content } = Layout;

class AdminContainer extends React.Component {

    componentWillMount() {
        console.log(this.props);
    }
    render() {
        let path = '';
        if (this.props.history.location.pathname === '/admin' || this.props.history.location.pathname === '/admin/') {

            path = localStorage.getItem('current_path') || '/admin/doctors/verify';
        }
        
        return (
            <Layout>
                <Sider>
                    <Menu className="side-menu">
                        <Menu.Item key="1">
                            <Link to="/admin/doctors/verify">Verify Doctors</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/admin/specialization">Add Speciality</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="loggedin-content">
                    <Content>
                        <Route path="/admin/doctors/verify" component={AdmVerifyDoctor} />
                        <Route path="/admin/specialization" component={AdmSpecialization} />
                    </Content>
                </Layout>
                {path ? <Redirect to={path} /> : ''}
            </Layout>
        );
    }

}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(AdminContainer);