import React from 'react';
import moment from 'moment';
import doctorUserIcon from '../images/doctor-user.png';
import { Rate, Button } from 'antd';
import { Link } from 'react-router-dom';

function DoctorCard(props) {
    const doctor = props.doctor;
    const user = doctor.userId;
    const pic = user.photo ? `http://localhost:3038/${user.email}/${user.photo}` : doctorUserIcon;
    const experience = moment().diff(moment(doctor.practiseStartDate), 'years');
    const hospital = doctor.practisingAt;
    const daysAvailable = doctor.daysAvailable.map(day => <span key={day} className="days-available">{day.slice(0, 3)}</span>)
    return (

        <div key={user._id}
            className={props.selected ? 'doctor-card selected-doctor' : 'doctor-card'}
            onClick={() => props.handleDoctorSelected(user._id, doctor)}
        >
            <div className="image-container">
                <img className="card-image" src={pic} alt="doc-img" />
            </div>
            <div className="card-content">
                <h3>Dr. {user.name}</h3>
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
                    <Button type={props.selected ? 'default' : 'primary'}>
                        <Link to={{
                            pathname: `/patient/feedback`,
                            state:{doctor: props.doctor}
                            }}>
                            Give Feedback</Link>
                    </Button>
                </div>
                <div className="rate-container">
                    <Rate style={{ color: '#dede00' }} value={4} disabled /><span className="ant-rate-text"></span>(9)
                </div>
            </div>

        </div>
    );


}

export default DoctorCard;  