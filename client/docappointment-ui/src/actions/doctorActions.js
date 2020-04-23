import axios from 'axios';

const reqHeaders = {
    headers: {
        'x-auth': localStorage.getItem('authToken')
    }
}

export const setSelectedDoctor = (payload) => {
    
    return {
        type: 'SET_SELECTED_DOCTOR',
        payload
    }
}

export const startGetDoctorFromId = (id) => {
    debugger
    return (dispatch) => {
        axios.get(`http://localhost:3038/doctor/${id}`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                
                console.log(response);
                dispatch(setSelectedDoctor(response.data[0]))
            })
            .catch(err => console.log(err))

    }
}