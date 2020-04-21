import axios from 'axios';

const reqHeaders = {
    headers: localStorage.getItem('authToken')
}

export const setSelectedDoctor = (payload) => {
    
    return {
        type: 'SET_SELECTED_DOCTOR',
        payload
    }
}

export const startGetDoctorFromId = (id) => {

    return (dispatch) => {
        axios.get(`http://localhost:3038/doctor/${id}`, reqHeaders)
            .then(response => {
                console.log(response);
                dispatch(setSelectedDoctor(response.data))
            })
            .catch(err => console.log(err))

    }
}