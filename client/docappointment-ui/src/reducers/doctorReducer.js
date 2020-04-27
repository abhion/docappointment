 const doctorReducer = (doctor = {}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_DOCTOR':{
            
            return action.payload
        }
            
    
        default:
            return doctor
    }
}

export const doctorChatReducer = (selectedDoctorForChat = {}, action) => {
    switch (action.type) {
        case 'SET_CHAT_DOCTOR':
            return action.payload
    
        default:
            return selectedDoctorForChat;
    }
}

export default doctorReducer;