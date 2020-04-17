import React from 'react';
import { Form, Row, Col, Button, Input, Radio, DatePicker, Upload, Select, Checkbox } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { TimePicker, message } from 'antd';
import axios from 'axios';
import { geocodeByAddress } from 'react-places-autocomplete';
import PlacesSearch from './PlacesSearch';

const { RangePicker } = TimePicker;

const { Option } = Select;

class RegisterComponent extends React.Component {

    state = {
        btnLoading: false,
        fileList: [],
        docFileList: [],
        usertype: 'Patient',
        location: '',
        practisingAt: ''
    }
    registerFormRef = React.createRef();
    todaysDate = moment();
    daysInWeek = [
        { label: 'Sun', value: 'Sunday' }, { label: 'Mon', value: 'Monday' }, { label: 'Tue', value: 'Tuesday' }, { label: 'Wed', value: 'Wednesday' },
        { label: 'Thu', value: 'Thursday' }, { label: 'Fri', value: 'Friday' }, { label: 'Sat', value: 'Saturday' }
    ];

    searchAutocompleteOptions = {
        componentRestrictions: { country: 'in' },
        types: ['establishment']
    }

    disabledDate = (date) => {
        return date > this.todaysDate;
    }
    onFinish = (values) => {
        console.log(values);

    }
    customRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    }
    profileUploadChanged = (file) => {
        this.setState({
            fileList: [file.file]
        })
    }
    docFileUploadChanged = ({ fileList }) => {

        this.setState({
            docFileList: fileList
        }, () => console.log(this.state.docFileList))


    }
    usertypeChanged = (event) => {
        this.setState({
            usertype: event.target.value
        })
    }

    onAddressSelect = (value) => {
        geocodeByAddress(value)
            .then(results =>{
                console.log(results);
                const locationResult = results[0].geometry.location;
                const location = {
                    type: 'Point',
                    coordinates: [locationResult.lat(), locationResult.lng()]
                }
               this.setState({
                location,
                practisingAt: value
               })
               console.log(location, "LOCAT");
            })
              
            .catch(err => console.log(err))
    }

    onSubmit = (values) => {
        console.log(values);
        console.log(this.state.fileList);

        if(!this.state.practisingAt){
            message.warn('Please enter hospital name.');
            return;
        }

        const formData = new FormData();
        const { name, email, phone, password } = values;
        const dob = values.dob.toISOString();
        const photo = this.state.fileList.length ? this.state.fileList[0].name : '';
        const profilePic = this.state.fileList.length ? this.state.fileList[0] : '';

        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        formData.append('dob', dob);
        formData.append('photo', photo);
        formData.append('role', this.state.usertype);
        formData.append('profilePic', profilePic);

        const documents = this.state.docFileList.map(file => file.name);

        if (this.state.usertype === 'Doctor') {
            const {
                fee, specialization, practisingAt,
                daysAvailable,
                appointmentDuration,
                schoolOfMedicine } = values;

            const practiseStartDate = values.practiseStartDate.toISOString();

            const fromTo = {
                from: values.fromTo[0].format('HH:MM'),
                to: values.fromTo[1].format('HH:MM')
            }

            formData.append('fee', fee);
            formData.append('specialization', specialization);
            formData.append('practisingAt', this.state.practisingAt);
            formData.append('practiseStartDate', practiseStartDate);
            formData.append('daysAvailable', JSON.stringify(daysAvailable));
            formData.append('appointmentDuration', appointmentDuration);
            formData.append('schoolOfMedicine', schoolOfMedicine);
            formData.append('fromTo', JSON.stringify(fromTo));
            formData.append('documents', documents);
            formData.append('isVerified', false);
            formData.append('location', JSON.stringify(this.state.location))

            this.state.docFileList.forEach(docFile => {

                formData.append('docs', docFile.originFileObj);
            })

        }
        this.setState({ btnLoading: true })
        axios.post('http://localhost:3038/user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                if (response.data.message) {
                    message.success(response.data.message);
                    this.props.closeDrawer();
                    this.props.openLoginDrawer();
                    this.registerFormRef.current.resetFields();
                    this.setState({ fileList: [], docFileList: [], btnLoading: false })
                } else {
                    this.setState({ btnLoading: false })
                    message.error(response.data.errmsg);
                }

            })
            .catch(err => console.log(err));
    }

    render() {

        console.log(this.props.specializations);

        const specializations = this.props.specializations.map(specialization => {
            return <Option key={specialization._id} value={specialization._id}>{specialization.name}</Option>
        })
        const doctorForm = this.state.usertype === 'Doctor' ? (
            <>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="specialization"
                            label="Select specialization"
                            rules={[{ required: true, message: 'Select your specialization' }]}
                        >
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select your specialization"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {specializations}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="schoolOfMedicine"
                            label="Medical School"
                            rules={[{ required: true, message: 'Enter a value' }]}
                        >
                            <Input placeholder="Enter a value" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="fee"
                            label="Fee"
                            rules={[{ required: true, message: 'Enter how much you charge for a session' }]}
                        >
                            <Input placeholder="Enter how much you charge for a session" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="practiseStartDate"
                            label="Practising from"
                            rules={[{ required: true, message: 'Please select date' }]}
                        >
                            <DatePicker
                                format={'DD/MM/YYYY'}
                                disabledDate={this.disabledDate}
                                onChange={() => { }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="practisingAt"
                            label="Practising at"
                            rules={[{ required: false, message: 'Enter the hospital name' }]}
                        >
                            <PlacesSearch
                                placeholder="Enter hospital name"
                                onAddressSelect={this.onAddressSelect}
                                searchOptions={this.searchAutocompleteOptions} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="daysAvailable"
                            label="Available on"
                            rules={[{ required: true, message: 'Select days' }]}
                        >
                            <Checkbox.Group options={this.daysInWeek} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="fromTo"
                            label="Available from"
                            rules={[{ required: true, message: 'Select time' }]}
                        >
                            <RangePicker />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="appointmentDuration"
                            label="Appointment duration (in minutes)"
                            rules={[{ required: true, message: 'Enter duration of an appointment' }]}
                        >
                            <Input addonAfter="minutes" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="docs"
                            label="Enter documents for verification"
                            rules={[{ required: true, message: 'Please upload documents for verification' }]}
                        >
                            <Upload
                                multiple={true}
                                fileList={this.state.docFileList}
                                onChange={this.docFileUploadChanged}
                                customRequest={this.customRequest}
                                beforeUpload={_ => false} >
                                <Button> Click to Upload
                                    </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </>
        ) : ''



        return (
            <>
                <Form layout="vertical"
                    hideRequiredMark
                    initialValues={{ "usertype": "Patient" }}
                    ref={this.registerFormRef}
                    onFinish={this.onSubmit}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="usertype"

                                style={{ display: 'flex' }}
                                label="I'm a"

                            >
                                <Radio.Group buttonStyle="solid" value="Patient" onChange={this.usertypeChanged}>
                                    <Radio.Button value="Patient">Patient</Radio.Button>
                                    <Radio.Button value="Doctor">Doctor</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="upload"
                                label="Upload profile image"
                                rules={[{ required: false }]}
                            >
                                <Upload
                                    multiple={false}
                                    fileList={this.state.fileList}
                                    onChange={this.profileUploadChanged}
                                    customRequest={this.customRequest}
                                    beforeUpload={_ => false} >
                                    <Button> Click to Upload
                                    </Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: 'Please enter name' }]}
                            >
                                <Input placeholder="Please enter name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Please enter email' }]}
                            >
                                <Input placeholder="Please enter email" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="phone"
                                label="Phone"
                                rules={[{ required: true, message: 'Please enter 10 digit number', len: 10 }]}
                            >
                                <Input placeholder="Enter Phone number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="dob"
                                label="Date of Birth"
                                rules={[{ required: true, message: 'Please select date' }]}
                            >
                                <DatePicker
                                    format={'DD/MM/YYYY'}
                                    disabledDate={this.disabledDate}
                                    onChange={() => { }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    {
                        doctorForm
                    }
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please enter password' }]}
                            >
                                <Input.Password placeholder="Enter Password" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row >
                        <Form.Item >
                            <Button type="primary" loading={this.state.btnLoading} loading={this.state.btnLoading} htmlType="submit">
                                {this.state.usertype === 'Patient' ? 'Create Account' : 'Submit details for approval'}
                            </Button>
                        </Form.Item>

                    </Row>
                </Form>

            </>
        );
    }
}

function mapStateToProps(state) {

    return {
        specializations: state.specializations
    }
}

export default connect(mapStateToProps)(RegisterComponent);