import React from 'react';
import { Rate } from 'antd';
import moment from 'moment';

function ReviewBox(props){
    
    return (
        <div className="review-box-cl">
        <div className="review-header">
            <div className="review-header-left">
                <h3 className="reviewer-name">{props.review.patientId.name}</h3>
                <h4 className="review-date">{moment(props.review.Date).local().format('DD MMM YYYY')}</h4>
            </div>
            <div>
                <Rate  value={props.review.rating} allowHalf disabled />
            </div>
        </div>
        <div className="review-text-container">
            {props.review.description}
        </div>

    </div>
    );
}

export default ReviewBox;