import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, message, Col, Row, Input, Form } from 'antd';
import { addSpecialization } from '../actions/specializationsAction';


class AdmSpecialization extends React.Component {

    state = {
        addModalVisible: false,
        addSpecialityLoading: false
    }
    addSpecialityFormRef = React.createRef();

    onAddFinish = () => {
        this.setState({
            addSpecialityLoading: false,
            addModalVisible: false
        })
    }

    onAddSpeciality = (values) => {
        this.props.dispatch(addSpecialization(values, message, this.onAddFinish));
    }

    showAddModal = () => {
        setTimeout(() => {
            this.addSpecialityFormRef.current.resetFields()
        }, 20);
    }

    render() {
        const specialityBoxes = this.props.specializations.map(specialization => {
            return (
                <div className="speciality-box" key={specialization._id}>{specialization.name}</div>
            );
        })
        return (
            <>
                <div className="page-header">
                    <h1 style={{ fontSize: 19 }}>Specialities</h1>
                    <Button  
                    onClick={() => this.setState({ addModalVisible: true }, () => this.showAddModal())}> <i className="fas fa-plus" style={{ marginRight: 8 }}></i>  Add speciality</Button>
                </div>
                <div className="speciality-box-container">
                    {specialityBoxes}
                </div>
                <Modal
                    title="Add Speciality"
                    centered
                    visible={this.state.addModalVisible}
                    onCancel={() => this.setState({ addModalVisible: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ addModalVisible: false })}>
                            Cancel
                        </Button>,
                        <Button form="addSpecialityForm" key="submit" type="primary" htmlType="submit" loading={this.state.addSpecialityLoading}>
                            Submit
                        </Button>,
                    ]}
                >
                    <Form id="addSpecialityForm" layout="vertical"
                        hideRequiredMark
                        ref={this.addSpecialityFormRef}
                        onFinish={this.onAddSpeciality}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label="Speciality name"
                                    rules={[{ required: true, message: 'Please enter speciality name' }]}
                                >
                                    <Input placeholder="Please enter speciality name" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                </Modal>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        specializations: state.specializations
    }
}

export default connect(mapStateToProps)(AdmSpecialization);