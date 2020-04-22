import React from 'react';
import { Select, message } from 'antd';
import { connect } from 'react-redux';
import PlacesSearch from './PlacesSearch';
// import { geocodeByAddress } from 'react-places-autocomplete';
import axios from 'axios';
import Loader from 'react-loader-spinner';
const { Option } = Select;


class SearchDoctor extends React.Component {

    state = {
        selectedLocation: '',
        selectedSpecialization: '',
        loadSpinner: false
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
        //     
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
        // message.info('Please click on Allow to search for doctors near you.')
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function success(position) {
                    self.userLocation = [position.coords.latitude, position.coords.longitude];
                    console.log('latitude', position.coords.latitude,
                        'longitude', position.coords.longitude);
                        if(!self.state.selectedSpecialization){
                            message.warn('Please select type of doctor');
                            return
                        }
                    const location = {type: 'Point'};
                    location.coordinates = [position.coords.latitude, position.coords.longitude];
                   self.fetchDoctorsFromPoint(location);
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
        if (!this.state.selectedLocation || !this.state.selectedSpecialization) {
            message.warn('Please enter locality and type of doctor you are looking for');
            return
        }
        this.setState({ loadSpinner: true });
        this.fetchDetailsOfSelectedPlace(this.state.selectedLocation);
    }

    fetchDetailsOfSelectedPlace = () => {
        const address = this.state.selectedLocation;
        console.log(address);
        axios.get(`https://nominatim.openstreetmap.org/search.php?q=${address}&polygon_geojson=1&format=json`)
            .then(response => {
                console.log(response);
                const data = response.data[0];
                if (response.data.length) {
                    const locationType = data.geojson.type;
                    const coord = data.geojson.coordinates;
                    const [lng, lat] = [coord[1], coord[0]]
                    data.geojson.coordinates = [lng, lat];
                    if (locationType === 'Point') {

                        this.fetchDoctorsFromPoint(data.geojson, response.data);
                    } else if (locationType === 'Polygon') {
                        this.fetchDoctorsFromPolygon(data.geojson);
                    }
                    else if (locationType === 'MultiPolygon') {
                        message.warn('Please select a more specific place');
                    }
                }
                else {
                    message.error('Could not find doctors at that location. Change the search text and try again');
                    this.setState({loadSpinner: false});
                }

            })
            .catch(err => console.log(err))
    }

    fetchDoctorsFromPolygon = (location) => {
        const lngLatCoords = [];

        if (location.type === 'Polygon') {
            location.coordinates[1].forEach(coord => {
                lngLatCoords.push([coord[1], coord[0]])
            });
        }

        location.coordinates = lngLatCoords;

        axios.post(`http://localhost:3038/search/locality`, {
            specialization: this.state.selectedSpecialization,
            location: location
        })
            .then(response => {
                console.log(response);
                const data = response.data;
                this.setState({ loadSpinner: false });
                if (!data.length) {
                    message.info('Could not find doctors at that location. Change the search text and try again');
                    this.setState({loadSpinner: false});
                }
                else {

                    this.props.history.push({
                        pathname: '/patient/search/results',
                        state: {
                            data,
                            text: {
                                selectedLocation: this.state.selectedLocation,
                                specialization: this.state.selectedSpecialization
                            }

                        }
                    })
                }
            })
            .catch(err => console.log(err))
    }

    fetchDoctorsFromPoint = (location) => {
        const coords = [location.coordinates[1], location.coordinates[0]]
        location.coordinates = coords;
        axios.post(`http://localhost:3038/search/sublocality`, {
            specialization: this.state.selectedSpecialization,
            location: location
        })
            .then(response => {
                console.log(response);
                const data = response.data;
                this.setState({ loadSpinner: false });
                if (!data.length) {
                    message.info('Could not find doctors at that location. Change the search text and try again');
                    this.setState({loadSpinner: false})
                } else {
                    this.props.history.push({
                        pathname: '/patient/search/results',
                        state: {
                            data,
                            text: {
                                selectedLocation: this.state.selectedLocation,
                                specialization: this.state.selectedSpecialization
                            }

                        }
                    })
                }
            })
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
                {
                    this.state.loadSpinner ? <Loader className="full-loader" type="ThreeDots" color="#00BFFF" height={80} width={80} /> : ''
                }
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