import axios from '../utility-functions/axiosConfig';

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
    
    return (dispatch) => {
        axios.get(`/doctor/${id}`, {
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

export const setChatDoctor = (payload) => {
    debugger
    return {
        type: 'SET_CHAT_DOCTOR',
        payload
    }
}