import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import AppointmentBox from './AppointmentBox';
import moment from 'moment';
import { message, Empty } from 'antd';

class AppointmentsList extends React.Component {
    state = {
        upcomingAppointments: [],
        prevAppointments: []

    }

    reqHeaders = {
        headers: {
            'x-auth': localStorage.getItem('authToken')
        }
    }

    deleteAppointment = (appointmentId) => {
        axios.put(`http://localhost:3038/appointment/${appointmentId}/1`, {
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
        axios.get(`http://localhost:3038/appointments/${this.props.user._id}`, this.reqHeaders)
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

    render() {

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
                isCancelled={appointment.cancellationDetails.isCancelled}
                appointment={appointment}
                user={this.props.user} />
        })

        if (!this.props.user) {
            return <>Loading</>
        }
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

            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(AppointmentsList);