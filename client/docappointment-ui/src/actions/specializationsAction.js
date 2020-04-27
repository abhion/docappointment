import axios from 'axios';
import { setLoggedInFalse } from './usersAction';

const reqHeaders = {
    headers: {
        'x-auth': localStorage.getItem('authToken')
    }
}

export const setSpecializations = (payload) => {
    return {
        type: 'SET_SPECIALIZATIONS',
        payload
    }
}

export const addSpecialization = (payload, message, onAddFinish) => {
    return (dispatch) => {
        axios.post(`/specialization`, payload, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response);
                if(response.data.message){
                    message.success(response.data.message);
                    onAddFinish();
                }
                dispatch(startGetSpecializations());
            })
            .catch(err => {
                console.log(err.response)
                if (err.response && err.response.status === 401) {
                    this.props.dispatch(setLoggedInFalse());
                }
            })
    }
}

export const startGetSpecializations = () => {

    return (dispatch) => {
        axios.get(`/specializations`)
            .then(response => {
                // console.log(response);
                dispatch(setSpecializations(response.data))
            })
            .catch(err => {
                console.log(err.response)
                if (err.response && err.response.status === 401) {
                    this.props.dispatch(setLoggedInFalse());
                }
            })
    }
}