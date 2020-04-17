import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Drawer, Dropdown } from 'antd';
import Landing from './Landing';
import { Link, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setLoggedInFalse, setLoggedInTrue, startGetLoggedInUser, setLoggedInUser } from '../actions/usersAction';
import LoginForm from './LoginForm';
import RegisterComponent from './RegisterComponent';
import logo from '../images/doctor.svg';
import userIcon from '../images/user.svg';
import doctorUserIcon from '../images/doctor-user.png';
import AdminContainer from './AdminContainer';
import DoctorContainer from './DoctorContainer';
import PatientContainer from './PatientContainer';

import axios from 'axios';


const { Header, Content } = Layout;


class App extends React.Component {

  state = {
    loginDrawerVisible: false,
    registerDrawerVisible: false
  }
  unlisten = null;

  reqHeaders = {
    headers: {
      'x-auth': localStorage.getItem('authToken')
    }
  }

 

  componentDidMount() {
    
    if (localStorage.getItem('authToken') && !this.props.isLoggedIn) {
      this.props.dispatch(setLoggedInTrue());
      this.props.dispatch(startGetLoggedInUser())
    }
    else {
      this.props.dispatch(setLoggedInFalse());
      this.props.history.push('/');
    }

    this.unlisten = this.props.history.listen((location, action) => {
      console.log(location, action);
      if(location.pathname !== '/' && !localStorage.getItem('authToken')){
        this.props.history.push('/');
      }
    })

  }

  onClose = () => {
    this.setState({
      loginDrawerVisible: false,
      registerDrawerVisible: false
    })
  }

  logout = () => {
    
    axios.delete(`http://localhost:3038/logout`,  {
      headers: {
        'x-auth': localStorage.getItem('authToken')
      }
    })
      .then(response => {
        console.log(response);
        this.props.dispatch(setLoggedInFalse());
        this.props.dispatch(setLoggedInUser({}));
        this.props.history.push('/');
      })
      .catch(err => {
        console.log(err.response)
        if (err.response && err.response.status == 401) {
          this.props.dispatch(setLoggedInFalse());
        }
      })
      
  }

  render() {
    const user = this.props.user || {};
    const userIconPath =
      user.photo ? `http://localhost:3038/${user.email}/${user.photo}` : (user.role === 'Doctor' ? doctorUserIcon : '');

    const dropdownMenu = (
      <Menu>
        <Menu.Item onClick={this.logout}>Logout</Menu.Item>
      </Menu>
    );

    const navEl = this.props.isLoggedIn ? (
      <>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="2">
            <Dropdown overlay={dropdownMenu}>
              <div style={{ display: 'flex' }}>
              <div>
                  {this.props.user.name}
                </div>
                <div>
                  <img src={userIconPath} className="header-image" />
                </div>
               
              </div>

            </Dropdown>
          </Menu.Item>
        </Menu>
      </>
    ) :
      (
        <>
          <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
            <Menu.Item key="1" onClick={() => this.setState({ registerDrawerVisible: true })}>Create Account</Menu.Item>
            <Menu.Item key="2" onClick={() => this.setState({ loginDrawerVisible: true })}>Login</Menu.Item>
          </Menu>
        </>
      )
      let content = '', redirecTo = '';
      if(this.props.user.role){
        if(this.props.user.role === 'Doctor')
        {
          content = <Route path="/doctor" component={DoctorContainer} />
          redirecTo = <Redirect to="/doctor" />
        }
        else if(this.props.user.role === 'Patient'){
          content = <Route path="/patient" component={PatientContainer} />
          redirecTo = <Redirect to="/patient/search" />
        }
        else if(this.props.user.role === 'Admin'){
          content = (<Route path="/admin" component={AdminContainer} />)
          redirecTo = <Redirect to="/admin/doctors/verify" />
         
        }
      }

    return (
      <div className="App">
        <Layout>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <Link to="/">
              <div className="logo-container"  >
                <img src={logo} style={{ width: 35 }} alt="icon" />
                <h4>BookADoc</h4>
              </div>
            </Link>
            {navEl}
          </Header>
          <Content className="site-layout" style={{ padding: '0px', marginTop: 64 }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
              <Route path="/" component={Landing} exact />
             {
               content
             }
             {redirecTo}
            </div>
          </Content>
        </Layout>

        <Drawer
          title="Login"
          placement="right"
          width="420px"
          onClose={this.onClose}
          visible={this.state.loginDrawerVisible}
        >
          {
            <LoginForm history={this.props.history} closeDrawer={this.onClose} />
          }
        </Drawer>
        <Drawer
          title="Register"
          placement="right"
          width="420px"
          onClose={this.onClose}
          visible={this.state.registerDrawerVisible}
        >
          {
            <RegisterComponent
              closeDrawer={this.onClose}
              history={this.props.history}
              openLoginDrawer={() => this.setState({ loginDrawerVisible: true })} />
          }
        </Drawer>
      </div>
    );
  }


}

function mapStateToProps(state) {
  return {
    user: state.user,
    isLoggedIn: state.isLoggedIn
  }
}

export default connect(mapStateToProps)(App);
