const specializationsReducer = (specializations = [], action) => {

    switch (action.type) {
        case 'SET_SPECIALIZATIONS':
            
        return [...action.payload]
    
        default:
            return specializations;
    }
}

export default specializationsReducer;