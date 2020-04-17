export const setLoggedInUserReducer = (user = {}, action) => {
    switch (action.type) {
        case 'SET_LOGGEDIN_USER':
            
            return action.payload;
    
        default:
            return user;
    }
}

export const setLoggedInStatusReducer = (status = false, action) => {
    switch (action.type) {
        case 'LOGGEDIN_TRUE':
            return true;

        case 'LOGGEDIN_FALSE':
            localStorage.removeItem('authToken');
            return false;
    
        default:
            return status;
    }
}
