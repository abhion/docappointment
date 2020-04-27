import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Input, message } from 'antd';
import axios from '../utility-functions/axiosConfig';
import { setLoggedInUser, setLoggedInTrue } from '../actions/usersAction';
import io from 'socket.io-client';

class LoginForm extends React.Component {


    state = {
        btnLoading: false
    }
    loginFormRef = React.createRef();

    onFinish = (loginData) => {
        this.setState({ btnLoading: true })
        axios.post('/login', loginData)
            .then(response => {
                if (response.data.message) {
                    this.setState({ btnLoading: false })
                    this.props.closeDrawer();
                    localStorage.setItem('authToken', response.headers['x-auth']);
                    this.props.dispatch(setLoggedInTrue());
                    this.props.dispatch(setLoggedInUser(response.data.user));
                    if (response.data.user.role === 'Doctor') {
                        
                        io('/chat',
                            {
                                query:{
                                    action: 'createRoom',
                                    doctorUserId: response.data.user._id
                                }
                            });
                        this.props.history.push('/doctor/appointments');

                    }
                    else if (response.data.user.role === 'Patient') {
                        this.props.history.push('/patient/search')
                    }
                    else if (response.data.user.role === 'Admin') {
                        this.props.history.push('/admin/doctors/verify');
                    }
                    // response.headers
                }
                else if (response.data.errMessage) {
                    message.error(response.data.errMessage);
                    this.setState({ btnLoading: false })
                }
            })
    }
    componentDidMount() {

    }
    render() {
        console.log(this.props);

        return (
            <>
                <Form layout="vertical"
                    hideRequiredMark
                    ref={this.loginFormRef}
                    onFinish={this.onFinish}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, type: "email", message: 'Please enter email' }]}
                            >
                                <Input placeholder="Please enter email" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please enter password' }]}
                            >
                                <Input.Password placeholder="Enter Password" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row >
                        <Form.Item >
                            <Button type="primary" loading={this.state.btnLoading} htmlType="submit">
                                Submit
                        </Button>
                        </Form.Item>

                    </Row>
                </Form>

            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(LoginForm);