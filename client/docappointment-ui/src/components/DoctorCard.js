import React from 'react';
import moment from 'moment';
import doctorUserIcon from '../images/doctor-user.png';
import { Rate, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { requestChat } from '../utility-functions/setupSocket';
import { setChatDoctor } from '../actions/doctorActions';

function DoctorCard(props) {

    const showRequestSendMessage = () => {
        message.info('Request has been sent. You can start chatting once the doctor accepts');
      }

      const makeRequest = (e, doctorUserId, requestingUser, showRequestSendMessage) => {
        e.stopPropagation();
        requestChat(doctorUserId, requestingUser, showRequestSendMessage);
        props.dispatch(setChatDoctor(props.doctor));
      }

    const doctor = props.doctor;
    const user = doctor.userId;
    const pic = user.photo ? `http://localhost:3038/${user.email}/${user.photo}` : doctorUserIcon;
    const experience = moment().diff(moment(doctor.practiseStartDate), 'years');
    const hospital = doctor.practisingAt;
    const daysAvailable = doctor.daysAvailable.map(day => <span key={day} className="days-available">{day.slice(0, 3)}</span>);
    const selected = props.selectedDoctorFromList.userId && props.selectedDoctorFromList.userId._id === props.doctor.userId._id;
    const chatStatus = doctor.userId && doctor.userId.chatStatus === 'Online';

    return (

        <div key={user._id}
            className={selected ? 'doctor-card selected-doctor' : 'doctor-card'}
            onClick={() => props.handleDoctorSelected(doctor)}
        >
            <div className="image-container">
                <img className="card-image" src={pic} alt="doc-img" />
            </div>
            <div className="card-content">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3>Dr. {user.name}</h3>
                    {chatStatus ?
                        <div className="pulsating-circle" title="Available for chat">

                        </div> : ''
                    }
                </div>
                <div className="sub-content">
                    <h4 style={{ color: 'rgb(11, 117, 112)', fontWeight: 450 }}>
                        {hospital.length > 120 ? hospital.slice(0, 121) + '...' : hospital}
                    </h4>
                    <h4 style={{ color: '#716e6e' }}>{experience} years experience </h4>
                    <div style={{ display: 'flex' }}>
                        <div className="days-available-cal">
                            <span style={{ color: '#8c8d8d' }}> <i className="fas fa-calendar-alt"></i>
                            </span> {daysAvailable}
                        </div>
                        <div style={{ marginLeft: 32 }}>
                            <i className="far fa-clock"></i> {doctor.fromTo.from} - {doctor.fromTo.to}
                        </div>
                    </div>
                    <h3 style={{ fontSize: 15, marginTop: 5 }}><i className="fas fa-rupee-sign"></i> {doctor.fee}</h3>

                </div>
                <div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Button type={selected ? 'default' : 'primary'}>
                        <Link
                            to={{
                                pathname: `/patient/feedback/${user._id}`,
                                search: `?givefeedback=1`
                            }}>
                            Give Feedback</Link>
                    </Button>
                    {chatStatus ?
                        <Button onClick={(e) => makeRequest(e, doctor.userId._id, props.loggedInUser, showRequestSendMessage)}>
                            Start chat
                    </Button> : ''
                    }


                </div>
                <div className="rate-container">

                    <Link
                        title="Click to view feedback given by other users"
                        to={
                            {
                                pathname: `/patient/feedback/${user._id}`,
                                state: { doctor: props.doctor }
                            }
                        }>
                        <Rate style={{ color: '#dede00' }}
                            allowHalf
                            value={doctor.avgRating.avgRating}
                            disabled />
                        <span className="ant-rate-text"></span>({doctor.avgRating.numberOfReviews})

                </Link>
                </div>
            </div>

        </div>
    );


}

function mapStateToProps(state) {

    return {
        selectedDoctorFromList: state.selectedDoctor,
        loggedInUser: state.user
    }
}

export default connect(mapStateToProps)(DoctorCard);  