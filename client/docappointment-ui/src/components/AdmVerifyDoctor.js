import React from 'react';
import axios from '../utility-functions/axiosConfig';
import { Table, Popconfirm, message } from 'antd';
import { connect } from 'react-redux';
import { setLoggedInFalse } from '../actions/usersAction';
import doctorUserIcon from '../images/doctor-user.png';

class AdmVerifyDoctor extends React.Component {
    state = {
        doctorList: []
    }

    reqHeaders = {
        headers: {
            'x-auth': localStorage.getItem('authToken')
        }
    }

    tableColumns = [
        {
            title: 'Photo',
            key:"0",
            render: (record) => {
              const photo = record.userId.photo ? `/userfiles/${record.userId.email}/${record.userId.photo}` : doctorUserIcon;
              return <img src={photo} key="photo" />
            }
        },
        {
            title: 'Name',
            render: (record) => <>{record.userId.name}</>,
            key: '1'
        },
        {
            title: 'Specialization',
            key: "2",
            render: (text, record) => <>{record.specialization.name}</>
        },
        {
            title: 'School',
            key: "3",
            dataIndex: 'schoolOfMedicine'
        },
        {
            title: 'Documents',
            key: '4',
            render: (record) => {
                debugger
                return record.documents[0].split(',').map(document => {
                    debugger
                  return  <a key="document" target="_blank" href={`/userfiles/${record.userId.email}/${document}`}>{document + ' '}</a>
                })
            }
        },
        {
            title: 'Action',
            key: "5",
            render: (text, record) => {
                return <>
                    <Popconfirm title="Are you sure"
                        onConfirm={(e) => { this.acceptDoctor(record) }}
                    >
                        <span className="table-action-text">Accept | </span>
                    </Popconfirm>
                    <Popconfirm
                        onConfirm={(e) => { this.rejectDoctor(record) }}
                        title="Are you sure">
                        <span className="table-action-text">Reject</span>
                    </Popconfirm>
                </>
            }
        }
    ];

    acceptDoctor = (doctor) => {
        
        axios.put(`/doctor/${doctor.userId._id}/1`, { verificationStatus: 'Verified' }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response);
                if (response.data.message) {
                    message.success(response.data.message);
                    this.fetchPendingDoctors();
                }
                else {
                    message.error(response.data.errMessage);
                }
            })
            .catch(err => {
                console.log(err.response)
                if (err.response && err.response.status === 401) {
                    this.props.dispatch(setLoggedInFalse());
                }
            })
    }
    rejectDoctor = (doctor) => {
        axios.put(`/doctor/${doctor.userId._id}/1`, { verificationStatus: 'Rejected' }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response);
                if (response.data.message) {
                    message.success(response.data.message);
                    this.fetchPendingDoctors();
                }
                else {
                    message.error(response.data.errMessage);
                }
            })
            .catch(err => {
                console.log(err.response)
                if (err.response && err.response.status === 401) {
                    this.props.dispatch(setLoggedInFalse());
                }
            })
    }

    fetchPendingDoctors = () => {
        
        axios.get(`/doctors/pending`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response.data);
                this.setState({ doctorList: response.data })
            })
            .catch(err => {
                console.log(err.response)
                if (err.response && err.response.status === 401) {
                    this.props.dispatch(setLoggedInFalse());
                }
            })
    }

    componentDidMount() {
        this.fetchPendingDoctors();
    }
    render() {
        return (
            <>
                <h2>Doctors</h2>
                <Table columns={this.tableColumns} dataSource={this.state.doctorList} rowKey="_id" />
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(AdmVerifyDoctor);