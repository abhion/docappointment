import React from 'react';
import {Input} from 'antd';
import PlacesAutocomplete, {  } from 'react-places-autocomplete';

export default class LocationSearchInput extends React.Component {
    

    state = {
        address: ''
    }

    handleAddressChange = (address) => {
        console.log(address);
        this.setState({address})
    }

    onAddressSelect = (value) => {
        
        this.setState({
            address: value
        })
        this.props.onAddressSelect(value)
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
                    ? { backgroundColor: "#fafafa", cursor: "pointer", padding: 25 }
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