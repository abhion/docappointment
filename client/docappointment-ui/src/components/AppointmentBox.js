import React from 'react';
import moment from 'moment';
import { Button, Popconfirm, message } from 'antd';
import userIcon from '../images/user.svg';

function AppointmentBox(props) {

    if (!props.appointment) {
        return <>Loading</>
    }

    const loggedInUserRole = props.user.role;
    let userId = {};
    const appointment = props.appointment;
    const appointmentDate = moment(props.appointment.date);
    
    const opposite = loggedInUserRole === 'Patient' ? appointment.doctorUserId : appointment.patientId;
    
    
    let button = '';
    if(loggedInUserRole === 'Patient'){
        button = props.isUpcoming
            ? <Popconfirm
                title="Are you sure you want to cancel the appointment?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => props.deleteAppointment(appointment._id)}
            >
                <Button type="primary" danger>Cancel</Button>
            </Popconfirm>
            : <Button onClick={() => props.setDoctorToBook(appointment.doctorUserId)} type="primary">Book Again</Button>

    }
        const photo = opposite.photo ? `/userfiles/${opposite.email}/${opposite.photo}` : userIcon;
    return (
        <div
            title={props.isCancelled ? 'This appointment was cancelled' : ''}
            className={props.isCancelled ? 'appointment-box cancelled-appointment' : 'appointment-box'}>
            <div className="appointment-box-header">
                <div>
                    <img className="header-image" src={photo} alt="user" />
                </div>
                <h3 style={{marginLeft: 10}}>
                    {loggedInUserRole === 'Patient' ? `Dr. ${opposite.name}` : opposite.name}
                </h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <h4>{appointmentDate.format('ddd, DD MMM YYYY')}</h4>
                <div style={{ fontWeight: 500 }}>
                    <span><i className="far fa-clock"></i> </span>
                    {appointmentDate.format('hh:mm A')}
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12}}>
            <div>
            <i className="fas fa-mobile-alt"></i> <span style={{fontWeight: 500, marginLeft: 4}}>{opposite.phone}</span>
            </div>
            <div style={{ textAlign: 'right', margin: 10 }}>

                {button}

            </div>

            </div>
        </div>
    );
}

export default AppointmentBox;