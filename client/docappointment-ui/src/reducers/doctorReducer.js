 const doctorReducer = (doctor = {}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_DOCTOR':{
            
            return action.payload
        }
            
    
        default:
            return doctor
    }
}

export default doctorReducer;