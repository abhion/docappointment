import React from 'react';
import { PageHeader, Form, Row, Col, Input, Modal, Button, Rate, message } from 'antd';
import { startGetDoctorFromId } from '../actions/doctorActions';
import ReviewBox from './ReviewBox';
import { connect } from 'react-redux';
import axios from 'axios';


const { TextArea } = Input;

class ReviewsList extends React.Component {

    reqHeaders = {
        headers: {
            'x-auth': localStorage.getItem('authToken')
        }
    }

    state = {
        reviews: [],
        addModalVisible: false,
        submitLoading: false,
        feedbackAlreadyGiven: false
    }

    addFeedbackFormRef = React.createRef();

    componentDidMount() {

        const doctorUserId = this.props.match.params.doctorUserId;
        if (!this.props.location.state) {
            startGetDoctorFromId(doctorUserId);
        }
        else {
            this.fetchDoctorReviews();

        }
    }

    componentDidUpdate(prevProps) {

        if (prevProps.doctor.user && prevProps.doctor.user._id !== this.props.doctor.user._id) {
            this.fetchDoctorReviews();

        }
    }

    fetchDoctorReviews = () => {

        const doctor = (this.props.location.state && this.props.location.state.doctor) || this.props.doctor;
        axios.get(`http://localhost:3038/reviews/${doctor.userId._id}`)
            .then(response => {
                console.log(response, "Review");
            
                let loggedInUserReview = {}, feedbackAlreadyGiven = false;
                const reviews = response.data.reviews.filter(review => {
                    if (review.patientId._id === this.props.loggedInUser._id) {
                        feedbackAlreadyGiven = true;
                        loggedInUserReview = review;
                    }
                    return review.patientId._id !== this.props.loggedInUser._id
                });

                if (!feedbackAlreadyGiven) {
                    const showAddPopupOnLoad = this.props.location.search && this.props.location.search.split('?')[1];
                    
                    if (showAddPopupOnLoad) {
                        this.setState({ addModalVisible: true, reviews });

                    }
                }
                else {
                    this.setState({ reviews: [loggedInUserReview].concat(reviews) });
                }



            })
            .catch(err => console.log(err))
    }

    onAddFeedback = (values) => {

        console.log(values);
        const { rating, addFeedbackText } = values;

        this.setState({ submitLoading: true })
        axios.post(`http://localhost:3038/review`, {
            doctorUserId: this.doctorUserId,
            patientId: this.props.loggedInUser._id,
            rating,
            description: addFeedbackText

        }, this.reqHeaders)
            .then(response => {
                console.log(response);
                if (response.data.message) {
                    message.success(response.data.message);
                    this.setState({ submitLoading: true, addModalVisible: false });
                    this.fetchDoctorReviews();
                }

            })
            .catch(err => console.log(err))
    }

    render() {

        const stateFromRouter = this.props.location.state.doctor;
        const doctor = stateFromRouter ? stateFromRouter : this.props.doctor;
        let user = {};
        console.log(doctor, doctor.reviews);
        if (doctor.userId) {
            user = doctor.userId;
            this.doctorUserId = user._id;
        }
        else {
            return <></>
        }

        const reviewsEl = this.state.reviews.map(review => {
            
            return (
                <ReviewBox
                    key={review._id}
                    review={review}
                 />
            );
        })

        return <div>

            <PageHeader
                className="page-header"
                title={`Feedback for Dr. ${user.name}`}
                onBack={() => this.props.history.goBack()}

            />

            <div>
                {reviewsEl}
            </div>

            <Modal
                title="Add Feedback"
                centered
                visible={this.state.addModalVisible}
                onCancel={() => this.setState({ addModalVisible: false })}
                footer={[
                    <Button key="back" onClick={() => this.setState({ addModalVisible: false })}>
                        Cancel
                        </Button>,
                    <Button form="addFeedbackForm" key="submit" type="primary" htmlType="submit" loading={this.state.submitLoading}>
                        Submit
                        </Button>,
                ]}
            >
                <Form id="addFeedbackForm" layout="vertical"
                    hideRequiredMark
                    ref={this.addFeedbackFormRef}
                    onFinish={this.onAddFeedback}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="rating"
                                label="Rate your experience"
                                rules={[{ required: true, message: 'Please rate your experience' }]}
                            >
                                <Rate allowHalf />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="addFeedbackText"
                                label="Feedback"
                                rules={[{ required: true, message: 'Please enter feedback' }]}
                            >
                                <TextArea
                                    placeholder="Please enter feedback" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal>


        </div>
    }
}

function mapStateToProps(state) {
    return {
        doctor: state.selectedDoctor,
        loggedInUser: state.user
    }
}

export default (connect(mapStateToProps)((ReviewsList)));