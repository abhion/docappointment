import React from 'react';
import { Input, Select, message } from 'antd';
import { connect } from 'react-redux';
import PlacesSearch from './PlacesSearch';
import { geocodeByAddress } from 'react-places-autocomplete';

const { Option } = Select;


class SearchDoctor extends React.Component {

    state = {
        selectedLocation: '',
        selectedSpecialization: ''
    }

    searchBoxRef = React.createRef();
    searchAutocompleteOptions = {
        types: ['(regions)'],
        componentRestrictions: { country: 'in' }
    }

    onAddressSelect = (v) => {
        console.log(v, this.state.selectedSpecialization);
        this.setState({ selectedLocation: v })

    }

    componentDidMount() {
        // const google = window.google;
        // const autocomplete = new google.maps.places.Autocomplete(this.searchBoxRef, this.searchAutocompleteOptions);
        // autocomplete.setFields(['geometry', 'geometry.viewport', 'geometry.location']);
        // autocomplete.addListener('place_changed', () => {
        //     debugger
        //     const place = autocomplete.getPlace();
        //     if (!place.geometry) {
        //         message.info('No details available for searched text');

        //     }
        //     if (place.geometry.viewport) {
        //         this.setState({
        //             selectedLocation: place.geometry.viewport
        //         })
        //     }
        // })
    }

    userLocation = null;

    getUserLocation = () => {
        const self = this;
        message.info('Please click on Allow to search for doctors near you.')
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function success(position) {
                    self.userLocation = [position.coords.latitude, position.coords.longitude];
                    console.log('latitude', position.coords.latitude,
                        'longitude', position.coords.longitude);
                },
                function error(error_message) {
                    console.error('An error has occured while retrieving location', error_message)
                    message.error('An error has occured while retrieving location', error_message)
                })
        }
        else {
            console.log('geolocation is not enabled on this browser');
            message.error('This browser does not support option to get location');
        }
    }

    searchSubmit = () => {
        console.log(this.state);
        if(!this.state.selectedLocation || !this.state.selectedSpecialization){
            message.warn('Please enter locality and type of doctor you are looking for');
            return
        }
        geocodeByAddress(this.state.selectedLocation)
            .then(results => console.log(results))
            .catch(err => console.log(err))
    }

    handleSpecializationChange = (value) => {
        
        this.setState({
            selectedSpecialization: value
        })

    }


    render() {
        const detectLocationAdd = (
            <>
                <span style={{ cursor: 'pointer' }} onClick={this.getUserLocation}>Current location</span>
                <span className="searchAddonBtn" onClick={this.searchSubmit}> Find Doctors </span>

            </>
        );
        const specializations = this.props.specializations.map(specialization => {
            return <Option key={specialization._id} value={specialization._id}>{specialization.name}</Option>
        })
        const specializationsDropdown = (
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Looking for"
                onChange={this.handleSpecializationChange}
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {specializations}
            </Select>
        );



        return (
            <div className="patient-search-box">
                <div className="search-box-container">
                    <PlacesSearch
                        placeholder="Enter the locality in which you're looking for a doctor"
                        onAddressSelect={this.onAddressSelect}
                        searchOptions={this.searchAutocompleteOptions}
                        setInpAddons={{ addonBefore: specializationsDropdown, addonAfter: detectLocationAdd }} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        specializations: state.specializations
    }
}

export default connect(mapStateToProps)(SearchDoctor);