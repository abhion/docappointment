export const chatWidgetReducer = (status = false, action) => {
    switch (action.type) {
        case 'SHOW_HIDE':
            return status;
    
        default:
            return status
    }
}