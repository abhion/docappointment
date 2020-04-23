import axios from 'axios';

const reqHeaders = {
    headers: {
        'x-auth': localStorage.getItem('authToken')
    }
}

export const setLoggedInUser = (payload) => {
    return {
        type: 'SET_LOGGEDIN_USER',
        payload
    }
}

export const setLoggedInTrue = () => {

    return {
        type: 'LOGGEDIN_TRUE',
        payload: true
    }
}
export const setLoggedInFalse = () => {

    return {
        type: 'LOGGEDIN_FALSE',
        payload: false
    }
}

export const startGetLoggedInUser = () => {

    return (dispatch) => {
        axios.get(`http://localhost:3038/user/current`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log("this be the logged iu", response);
                
                if(response.data){
                    dispatch(setLoggedInUser(response.data));
                }
            })
    }
}