import React from 'react';
import { connect } from 'react-redux';
import { PageHeader } from 'antd';
import DoctorCard from './DoctorCard';
// import axios from 'axios';
import BookAppointment from './BookAppointment';

class DoctorSearchList extends React.Component {

    state = {
        selectedDoctor: '',
        selectedDoctorUserId: ''
    }

    handleDoctorSelected = (selectedDoctorUserId, selectedDoctor) => {
        this.setState({
            selectedDoctor,
            selectedDoctorUserId
        })
    }

    render() {
        // console.log(this.props);
        const data = this.props.location.state.data;
        const text = this.props.location.state.text;
        const searchedLocation = text.selectedLocation.split(',')[0];
        let selectedSpecialization = this.props.specializations.find(sp => sp._id === text.specialization);
        selectedSpecialization = selectedSpecialization ? selectedSpecialization.name : 'doctors';
        console.log(data);
        let doctorCard = null;
        if (data) {
            doctorCard = data.map(doctor => {
                
                return (
                    <DoctorCard
                        selected={this.state.selectedDoctorUserId === doctor.userId._id ? true: false}
                        key={doctor.userId._id}
                        doctor={doctor}
                        handleDoctorSelected={this.handleDoctorSelected} />
                );
            })
        }
        return (
            <div className="doctor-searchlist-container" >
                <PageHeader
                    className="page-header"
                    title={`Showing ${selectedSpecialization} near ${searchedLocation}`}
                    onBack={() => this.props.history.goBack()}
                />
                <div style={{ marginTop: 25, display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{ flexBasis: '56%' }}>
                        {doctorCard}

                    </div>
                    <div style={{ flexBasis: '44%' }}>
                        <BookAppointment selectedDoctor={this.state.selectedDoctor} selectedDoctorUserId={this.state.selectedDoctorUserId} />
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.user,
        specializations: state.specializations
    }
}

export default connect(mapStateToProps)(DoctorSearchList);