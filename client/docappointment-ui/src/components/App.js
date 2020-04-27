import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Drawer, Dropdown, Modal, message, Button } from 'antd';
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
import axios from '../utility-functions/axiosConfig';
import { Widget, toggleWidget, addResponseMessage, renderCustomComponent, setBadgeCount } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { setupSocket, acceptRejectChatRequest, setEssentialMethods, sendMessage, leaveChat } from '../utility-functions/setupSocket';
import { setChatDoctor } from '../actions/doctorActions';

const { Header, Content } = Layout;

class Leave extends React.Component{

  render(){
    return <Button 
    onClick={leaveChat}
    style={{position: 'absolute', top: 0, right: 0}}>Leave</Button>
  }
}

class App extends React.Component {

  state = {
    loginDrawerVisible: false,
    registerDrawerVisible: false,
    chatRequestPopupVisible: false,
    socketId: '',
    requestingUser: '',
    chatWidgetVisible: false
  }
  unlisten = null;

  reqHeaders = {
    headers: {
      'x-auth': localStorage.getItem('authToken')
    }
  }

  showChatRequestPopup = (data) => {
    debugger
    
    this.setState({
      chatRequestPopupVisible: true,
      socketId: data.socketId,
      requestingUser: data.requestingUser
    })
  }

  handleRequestAccepted = () => {
    console.log("req acc");
    message.info('Doctor has accepted');
    this.setState({chatWidgetVisible: true}, () => {toggleWidget();
      setBadgeCount(0);})
    
    
  }

  handleRequestRejected = () => {
    console.log("req rej");
    // message.info('The doctor could not connect at this moment')
  }

  handleLeaveChat = () => {
    this.setState({
      chatWidgetVisible: false
    })
    
  }

  handleOppositeUserLeftChat = () => {
    debugger
    message.info('The other user has left the chat');
    const doctorUserId = this.props.user.role === 'Doctor' ? this.props.user._id : this.props.selectedDoctorForChat.userId._id;
    leaveChat(doctorUserId);
    // this.props.dispatch(setChatDoctor({}));
    // this.handleLeaveChat();
  }

  componentDidUpdate(prev) {
    if (!prev.user._id || prev.user._id !== this.props.user._id) {
      if (this.props.user.role === 'Doctor'){
        setupSocket(this.props.user._id, this.showChatRequestPopup, this.handleRequestAccepted,
          this.handleRequestRejected);
      }
      setEssentialMethods(this.showChatRequestPopup, this.handleRequestAccepted, 
        this.handleRequestRejected, this.onMessageReceived, this.handleLeaveChat, this.handleOppositeUserLeftChat, this.props.user)
    }
    renderCustomComponent(Leave)
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
      if (location.pathname !== '/' && !localStorage.getItem('authToken')) {
        this.props.history.push('/');
      }
      if (this.props.history.location.pathname !== '/'
        && this.props.history.location.pathname !== '/admin'
        && this.props.history.location.pathname !== '/patient'
        && this.props.history.location.pathname !== '/doctor'
      ) {

        localStorage.setItem('current_path', this.props.history.location.pathname || '');
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

    const selectedDoctorForChat = this.props.selectedDoctorForChat.userId && this.props.selectedDoctorForChat.userId._id;
        if(selectedDoctorForChat){
          leaveChat(this.props.selectedDoctorForChat.userId);
        }
        else{
          if(this.props.user.role === 'Doctor'){
            leaveChat(this.props.user && this.props.user._id);
          }
        }

    axios.delete(`/logout`, {
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
        if (err.response && err.response.status === 401) {
          this.props.dispatch(setLoggedInFalse());
        }
      })

  }

  handleNewUserMessage = (newMessage) => {
    debugger
    console.log(this.props.selectedDoctorForChat);
    if(this.props.selectedDoctorForChat.userId && this.props.selectedDoctorForChat.userId._id){
      sendMessage(newMessage, this.props.selectedDoctorForChat.userId._id);
    }
    else{
      if(this.props.user.role === 'Doctor'){
        sendMessage(newMessage, this.props.user._id);
      }
    }
    
  }



  onMessageReceived = message => {
    console.log("Addres");
    addResponseMessage(message);
  }

  render() {
    const user = this.props.user || {};
    debugger
    const userIconPath =
      user.photo ? `/${user.email}/${user.photo}` : (user.role === 'Doctor' ? doctorUserIcon : userIcon);
    let chatWidgetOptions = user.role === 'Doctor' ? 
    {
      title: this.state.requestingUser && this.state.requestingUser.name,
      profileAvatar: this.state.requestingUser && 
          this.state.requestingUser.photo ? `/${this.state.requestingUser.email}/${this.state.requestingUser.photo}`: userIconPath
    } : 
    {
      title: this.props.selectedDoctorForChat.userId && this.props.selectedDoctorForChat.userId.name,
      profileAvatar: this.props.selectedDoctorForChat.userId && this.props.selectedDoctorForChat.userId.photo ? 
        `/${this.props.selectedDoctorForChat.userId.email}/${this.props.selectedDoctorForChat.userId.photo}`
        : doctorUserIcon
    }
    

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
                  {this.props.user.role === 'Doctor' ? 'Dr. ' : ''}{this.props.user.name}
                </div>
                <div>
                  <img src={userIconPath} className="header-image" alt="header-img" />
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
    if (this.props.user.role) {

      if (this.props.user.role === 'Doctor') {
        content = <Route path="/doctor" component={DoctorContainer} />
        if (this.props.history.location.pathname === '/' || this.props.history.location.pathname.split('/')[1] !== 'doctor') {
          redirecTo = <Redirect to="/doctor" />
        }
      }
      else if (this.props.user.role === 'Patient') {
        content = <Route path="/patient" component={PatientContainer} />
        if (this.props.history.location.pathname === '/' || this.props.history.location.pathname.split('/')[1] !== 'patient') {
          redirecTo = <Redirect to="/patient" />
        }
      }
      else if (this.props.user.role === 'Admin') {
        content = (<Route path="/admin" component={AdminContainer} />)
        if (this.props.history.location.pathname === '/' || this.props.history.location.pathname.split('/')[1] !== 'admin') {
          redirecTo = <Redirect to="/admin" />
        }
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

        {this.state.chatWidgetVisible &&

          <Widget
            style={{position: 'relative'}}
            subtitle=""
            renderCustom
            {...chatWidgetOptions}
            handleNewUserMessage={this.handleNewUserMessage}
          />
        }

        <Modal
          title="Chat request"
          visible={this.state.chatRequestPopupVisible}
          onOk={() => {
            debugger
            acceptRejectChatRequest('accept-request', this.state.socketId, this.props.user._id);
            this.setState({ chatRequestPopupVisible: false, chatWidgetVisible: true })
          }}
          onCancel={() => {
            acceptRejectChatRequest('reject-request', this.state.socketId, this.props.user._id);
            this.setState({ chatRequestPopupVisible: false })
          }

          }
        >
          {/* A patient ({this.state.requestingUser.name}) wants to chat with you. Confirm? */}
        </Modal>
      </div>
    );
  }


}

function mapStateToProps(state) {
  console.log(state);

  return {
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    chatWidgetStatus: state.chatWidgetStatus,
    selectedDoctorForChat: state.selectedDoctorForChat
  }
}

export default connect(mapStateToProps)(App);
