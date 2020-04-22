import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

class AppointmentsList extends React.Component{
    stat = {
        myAppointments: []
    }

    reqHeaders = {
        headers: {
            'x-auth': localStorage.getItem('authToken')
        }
    }

    componentDidMount(){
        axios.get(`http://localhost:3038/appointments/${this.props.user._id}`, reqHeaders)
            .then(response => {
                console.log(response);
                this.setState({
                    myAppointments: response.data
                })
            })
    }
    
    render(){

        const myAppointments

        if(!this.props.user){
            return <>Loading</>
        }
        return (
            <div>
                
            </div>
        );
    }

}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(AppointmentsList);