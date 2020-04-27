import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import AppointmentBox from './AppointmentBox';
import BookAppointment from './BookAppointment';
import moment from 'moment';
import { message, Empty, Drawer } from 'antd';
import { startGetDoctorFromId } from '../actions/doctorActions';

class AppointmentsList extends React.Component {
    state = {
        upcomingAppointments: [],
        prevAppointments: [],
        bookAppointmentDrawerVisible: false

    }

    reqHeaders = {
        headers: {
            'x-auth': localStorage.getItem('authToken')
        }
    }

    deleteAppointment = (appointmentId) => {
        axios.put(`/appointment/${appointmentId}/1`, {
            isCancelled: true,
            reason: 'none'
        }, this.reqHeaders)
            .then(response => {
                console.log(response);
                if (response.data.message) {
                    message.success(response.data.message);
                    this.fetchAppointments();
                }
            })
            .catch(err => console.log(err))
    }

    componentDidMount() {
        this.fetchAppointments();
    }

    fetchAppointments = () => {
        
        axios.get(`/appointments/${this.props.user._id}`, this.reqHeaders)
            .then(response => {
                console.log(response);
                const upcomingAppointments = [], prevAppointments = [];
                const appointments = response.data;
                appointments.forEach(appointment => {
                    moment(appointment.date).isAfter(moment()) && !appointment.cancellationDetails.isCancelled
                        ? upcomingAppointments.push(appointment)
                        : prevAppointments.push(appointment)
                });
                this.setState({
                    upcomingAppointments,
                    prevAppointments
                })
            })
    }

    setDoctorToBook = (doctor) => {
        
        this.props.dispatch(startGetDoctorFromId(doctor._id));
        this.setState({
            bookAppointmentDrawerVisible: true
        })
    }

    onBookDrawerClosed = () => {
        this.fetchAppointments();
        this.setState({
            bookAppointmentDrawerVisible: false
        })
    }


    render() {
        if (!this.props.user) {
            return <>Loading</>
        }
        
        const upcomingAppointments = this.state.upcomingAppointments.map(appointment => {

            return <AppointmentBox
                key={appointment._id}
                isUpcoming
                deleteAppointment={this.deleteAppointment}
                appointment={appointment}
                user={this.props.user} />
        })

        const prevAppointments = this.state.prevAppointments.map(appointment => {

            return <AppointmentBox
                key={appointment._id}
                setDoctorToBook={this.setDoctorToBook}
                isCancelled={appointment.cancellationDetails.isCancelled}
                appointment={appointment}
                user={this.props.user} />
        })

    
        return (
            <div>
                <h3>Upcoming Appointments</h3>
                {
                    upcomingAppointments.length ?
                        <>
                            <div className="appointment-container">
                                {upcomingAppointments}
                            </div>
                        </>
                        : <Empty />
                }

                <hr />

                <h3 style={{ marginTop: 25 }}>Previous/Cancelled appointments</h3>
                {
                    prevAppointments.length ?
                        <>
                            <div className="appointment-container">
                                {prevAppointments}
                            </div>
                        </>
                        : <Empty />
                }

                <Drawer
                    title="Book Appointment"
                    width="40%"
                    visible={this.state.bookAppointmentDrawerVisible}
                    onClose={() => this.onBookDrawerClosed()}
                >
                    <BookAppointment 
                    onBookComplete={this.onBookDrawerClosed}
                    selectedDoctor={this.props.selectedDoctor}
                    selectedDoctorUserId={this.props.selectedDoctor.userId && this.props.selectedDoctor.userId._id}
                     />
                </Drawer>

            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        user: state.user,
        selectedDoctor: state.selectedDoctor
    }
}

export default connect(mapStateToProps)(AppointmentsList);