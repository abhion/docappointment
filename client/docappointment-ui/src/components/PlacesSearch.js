import React from 'react';
import {Input} from 'antd';
import PlacesAutocomplete, {  } from 'react-places-autocomplete';

export default class LocationSearchInput extends React.Component {
    

    state = {
        address: ''
    }

    handleAddressChange = (address) => {
        this.setState({address}, () => {this.props.onAddressSelect(address)})
    }

    onAddressSelect = (value) => {
        
        this.setState({
            address: value
        }, () => {this.props.onAddressSelect(value)})
        
    }



  
    render() {
     const setInpAddons = this.props.setInpAddons ? this.props.setInpAddons : {};
      return (
        <PlacesAutocomplete 
        searchOptions={this.props.searchOptions}
        onChange={this.handleAddressChange} 
        onSelect={this.onAddressSelect} 
        value={this.state.address}
        shouldFetchSuggestions={this.state.address.length > 4}
        >
          {({ getInputProps, getSuggestionItemProps, suggestions, loading }) => (
            <React.Fragment>
              <Input
                {...setInpAddons}
                placeholder={this.props.placeholder}
                {...getInputProps({
                  id: "searchInpBox"
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading ? <div>Loading...</div> : null}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer", padding: '10px 3px', color: 'white', transition: 'all 280ms' }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
  
                  const spread = {
                    ...getSuggestionItemProps(suggestion, {
                      className,
                      style
                    })
                  };
  
                  return (
                    <div {...spread} key={suggestion.id}>
                      <div>{suggestion.description}</div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          )}
        </PlacesAutocomplete>
      );
    }
  }