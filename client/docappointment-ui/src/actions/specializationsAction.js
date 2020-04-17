import axios from 'axios';
import { setLoggedInFalse } from './usersAction';

export const setSpecializations = (payload) => {
    return {
        type: 'SET_SPECIALIZATIONS',
        payload
    }
}

export const startGetSpecializations = () => {

    return (dispatch) => {
        axios.get(`http://localhost:3038/specializations`)
            .then(response => {
                // console.log(response);
                dispatch(setSpecializations(response.data))
            })
            .catch(err => {
                console.log(err.response)
                if (err.response && err.response.status == 401) {
                    this.props.dispatch(setLoggedInFalse());
                }
            })
    }
}