import React from 'react';
import axios from '../utility-functions/axiosConfig';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import { Modal, message } from 'antd';
import { connect } from 'react-redux';

class BookAppointment extends React.Component {

    reqHeaders = {
        headers: {
            'x-auth': localStorage.getItem('authToken')
        }
    }

    state = {
        selectedDay: 0,
        bookedAppointments: [],
        timeSlots: [],
        daysAvailable: [],
        loadSpinner: false,
        confirmPopupVisible: false,
        selectedAppointmentTime: ''
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.selectedDoctorForBooking.userId || 
            (prevProps.selectedDoctorForBooking.userId._id !== this.props.selectedDoctorForBooking.userId._id)) {
            this.setState({ loadSpinner: true });
            this.fetchUpcomingAppointments();
        }
    }

    fetchUpcomingAppointments = () => {
        axios.get(`/appointments/available/${this.props.selectedDoctorForBooking.userId._id}`, this.reqHeaders)
        .then(response => {
            console.log(response, "Appointemnts");
            const appointments = response.data.map(appointment => {
             const momentDate =  moment(appointment.date).local();
             momentDate.isCancelled = appointment.cancellationDetails.isCancelled;
             return momentDate;
            });

            this.setState({
                selectedDay: 1,
                loadSpinner: false,
                bookedAppointments: appointments,
                confirmPopupVisible: false
            }, () => this.setDaysAvailable());
            console.log(appointments);
        })
        .catch(err => console.log(err))
    }

    setDaysAvailable = () => {
        const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const doctor = this.props.selectedDoctorForBooking;
        const today = moment();
        const days = [];
        const todaysIndex = doctor.daysAvailable.findIndex(day => day === today.format('dddd'));
        
        if (todaysIndex >= 0) {
            days.push(moment(today));
            let nextIndex = todaysIndex + 1;
            
            if (doctor.daysAvailable[nextIndex]) {
                days.push(moment().day(daysInWeek.indexOf(doctor.daysAvailable[nextIndex])));

                nextIndex = nextIndex + 1;
                if (doctor.daysAvailable[nextIndex]) {
                    days.push(moment().day(daysInWeek.indexOf(doctor.daysAvailable[nextIndex])));
                }
                else {
                    days.push(moment().day(daysInWeek.indexOf(doctor.daysAvailable[0])).add(1, 'week'));
                }
            }
            else {
                days.push(moment().day(doctor.daysAvailable[0]).add(1, 'week'));
                if (doctor.daysAvailable[1]){
                    days.push(moment().day(daysInWeek.indexOf(doctor.daysAvailable[1])).add(1, 'week'));
                }
                else{
                    days.push(moment().day(daysInWeek.indexOf(doctor.daysAvailable[1])).add(2, 'week'));
                }

            }

        }
        else {
            for (let i = 0; i < 3; i++) {
                
                if (!doctor.daysAvailable[i]) {
                    const day = moment().day(doctor.daysAvailable[0]);
                    day.add(i+1, 'week')
                    days.push(day);
                    continue;
                }
                const day = moment().day(doctor.daysAvailable[i]);
                if (today.isAfter(day, 'day')) {
                    day.add(1, 'week')
                    days.push(day);
                }
                else if (today.isBefore(day, 'day')) {
                    days.push(day)
                }

            }
            days.sort((a, b) => a.isAfter(b, 'days') ? 1 : -1);
        }
        console.log("DAYs available", days);
        this.setState({ daysAvailable: days });
        this.createTimeSlots(days[0]);
    }





    createTimeSlots = (date) => {

        const doctor = this.props.selectedDoctorForBooking;
        const appointmentDuration = doctor.appointmentDuration;
        const from = moment(date.format('YYYY-MM-DD') + ' ' + doctor.fromTo.from);
        const to = moment(date.format('YYYY-MM-DD') + ' ' + doctor.fromTo.to);
        const timeSlots = [[], [], []];
        let timeToPush = moment(from);
        const noon = moment(date.format('YYYY-MM-DD') + ' 12:00');
        const evening = moment(date.format('YYYY-MM-DD') + ' 16:00')
        while (timeToPush <= to) {
            debugger
            const isThisTimeBooked = 
                this.state.bookedAppointments
                    .find(app => !app.isCancelled && app.isSame(timeToPush)) || timeToPush.isBefore(moment()) ? true : false;

            const time = moment(timeToPush);
            time.isBooked = isThisTimeBooked;

            if (timeToPush < noon) {
                timeSlots[0].push(time);
            }
            else if (timeToPush >= noon && timeToPush < evening) {
                debugger
                timeSlots[1].push(time);
            }
            else {
                timeSlots[2].push(time);
            }
            timeToPush.add(appointmentDuration, "minutes");
        }
        this.setState({ timeSlots });
        console.log(timeSlots, "Timeslots");

    }

    showConfirmPopup = (selectedAppointmentTime) => {
        if(selectedAppointmentTime.isBooked){
            return
        }
        console.log(selectedAppointmentTime);
        this.setState({confirmPopupVisible: true, selectedAppointmentTime});
    }

    createAppointment = () => {
        this.setState({submitLoading: true});
        axios.post(`/appointment`, 
        {
            date: this.state.selectedAppointmentTime.toISOString(),
            doctorUserId: this.props.selectedDoctorForBooking.userId._id,
            patientId: this.props.loggedInUser._id
        }, this.reqHeaders
               )
                .then(response => {
                    console.log(response);
                    if(response.data.message){
                        message.success(response.data.message);
                        this.setState({submitLoading: false});
                        this.fetchUpcomingAppointments();
                        if(typeof this.props.onBookComplete === 'function'){
                            this.props.onBookComplete();
                        }
                    }

                    else if(response.data.errMessage){
                        message.error(response.data.errMessage);
                        
                    }

                })
                .catch(err => console.log(err))
    }

    isObjectEmpty = (obj) => {
        return Object.keys(obj).length ? false : true;
    }

    render() {

        console.log(this.props);
        
        const doctor = this.props.selectedDoctorForBooking;
        const user = doctor && doctor.userId;
        let bookHeader = '';
        
        if(user){
             bookHeader = (
                <div>
                    <h3 style={{ textAlign: 'left' }}>Dr. {user.name}</h3>
                </div>
            );
        }
       

        const dayTimeSlots = [];
        let availableCount = 0;
        this.state.timeSlots.forEach(timeOfDay => dayTimeSlots.push(timeOfDay.map(time => {
            
            availableCount = !time.isBooked ? availableCount + 1 : availableCount
            return <div
                onClick={() => this.showConfirmPopup(time)}
                className={time.isBooked ? 'unavailable-appointment appointment-time' : 'appointment-time'}
                key={time._d}>
                {time.format('HH:mm')}
            </div>
        })));

        const appointmentDays = this.state.daysAvailable.map((day, i) => {

            return (
                <div
                    className={this.state.selectedDay === i + 1 ? 'selected-day day' : 'day'}
                    key={day._d}
                    onClick={() => { this.createTimeSlots(day); this.setState({ selectedDay: i + 1 }) }}>
                    <div>{day.format('DD MMM YYYY')}</div>
                    {this.state.selectedDay === i + 1 ?<h4>{ !availableCount ? 'No' : availableCount} slots available</h4> : ''}
                </div>
            );
        })

        const morning = dayTimeSlots[0] && dayTimeSlots[0].length ? (
            <div style={{ display: 'flex', margin: 13, alignItems: 'center' }}>
                <div style={{ flexBasis: '20%' }}>Morning</div>
                <div style={{ flexBasis: '80%', display: 'flex', flexWrap: 'wrap' }}>{dayTimeSlots[0]}</div>
            </div>
        ) : '';

        const afternoon = dayTimeSlots[1] && dayTimeSlots[1].length ? (
            <div style={{ display: 'flex', margin: 13, alignItems: 'center' }}>
                <div style={{ flexBasis: '20%' }}>Afternoon</div>
                <div style={{ flexBasis: '80%', display: 'flex', flexWrap: 'wrap' }}>{dayTimeSlots[1]}</div>
            </div>
        ) : '';

        const evening = dayTimeSlots[2] && dayTimeSlots[2].length ? (
            <div style={{ display: 'flex', margin: 13, alignItems: 'center', }}>
                <div style={{ flexBasis: '20%' }}>Evening</div>
                <div style={{ flexBasis: '80%', display: 'flex', flexWrap: 'wrap' }}>{dayTimeSlots[2]}</div>
            </div>
        ) : '';
            
        return (
            <div className="book-box">
                <div className="book-header">
                    {
                        this.isObjectEmpty(doctor) ? <h3>Select a doctor to show available slots</h3> :
                            <div>{bookHeader}</div>
                    }
                </div>
                <div className="book-days" style={!doctor ? { display: 'none' } : {}}>
                    {appointmentDays}
                </div>
                <div className="appointments-container" style={!doctor ? { display: 'none' } : {}}>
                    {morning}
                    {afternoon}
                    {evening}
                </div>
                {
                    this.state.loadSpinner ? <Loader className="full-loader" type="ThreeDots" color="#00BFFF" height={80} width={80} /> : ''
                }
                <Modal
                    title="Confirm"
                    centered
                    visible={this.state.confirmPopupVisible}
                    onOk={() => this.createAppointment()}
                    onCancel={() => this.setState({confirmPopupVisible: false})}
                >
                    <div>
                        Book Appointment with <strong> Dr. {user && user.name}</strong> on 
                        {this.state.selectedAppointmentTime && <strong> {this.state.selectedAppointmentTime.format('dddd DD MMM YYYY hh:mm A')}</strong>}
                    </div>
                </Modal>
            </div>

        );
    }
}

function mapStateToProps(state){
    return {
        loggedInUser: state.user,
        selectedDoctorForBooking: state.selectedDoctor
    }
}

export default connect(mapStateToProps)(BookAppointment);