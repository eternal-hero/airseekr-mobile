import React, { Component } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Colors,
  mediaprovider,
  config,
  localStorage,
  localimag,
  Currentltlg,
  Lang_chg,
} from './utilslib/Utils';
import Icon2 from 'react-native-vector-icons/Entypo';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
export default class Mapprovider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible1: false,
      latitude: config.latitude,
      longitude: config.longitude,
      latdelta: '0.0922',
      longdelta: '0.0421',
      isConnected: true,
      addressbar: false,
      addressbar2: false,
      addressselected: 'Search',
      makermove: 0,
      username: '',
      address: '',
    };
    this.getcurrentlatlogn();
  }
  getcurrentlatlogn = async () => {
    let data = await Currentltlg.requestLocation();
    let latitude = data.coords.latitude;
    let longitude = data.coords.longitude;
    if (this.props.address_arr != 'NA') {
      this.setState({ latitude: latitude, longitude: longitude });
    } else {
      this.setState({ latitude: latitude, longitude: longitude });
    }
  };

  setMapRef = map => {
    this.map = map;
  };
  getCoordinates = region => {
    return {
      latitude: parseFloat(this.state.latitude),
      longitude: parseFloat(this.state.longitude),
      latitudeDelta: parseFloat(this.state.latdelta),
      longitudeDelta: parseFloat(this.state.longdelta),
    };
  };

  getadddressfromlatlong = event => {
    if (this.state.makermove != 0) {
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          event.latitude +
          ',' +
          event.longitude +
          '&key=' +
          config.mapkey +
          '&language=' +
          config.maplanguage,
      )
        .then(response => response.json())
        .then(resp => {
          let responseJson = resp.results[0];
          let city = '';
          let administrative_area_level_1 = '';
          for (let i = 0; i < responseJson.address_components.length; i++) {
            if (responseJson.address_components[i].types[0] == 'locality') {
              city = responseJson.address_components[i].long_name;
              break;
            } else if (
              responseJson.address_components[i].types[0] ==
              'administrative_area_level_2'
            ) {
              city = responseJson.address_components[i].long_name;
            }
          }
          for (let j = 0; j < responseJson.address_components.length; j++) {
            if (
              responseJson.address_components[j].types[0] ==
              'administrative_area_level_1'
            ) {
              administrative_area_level_1 =
                responseJson.address_components[j].long_name;
            }
          }
          let details = responseJson;
          let data2 = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            address: details.formatted_address,
            city: city,
            administrative_area_level_1: administrative_area_level_1,
          };
          this.GooglePlacesRef &&
            this.GooglePlacesRef.setAddressText(details.formatted_address);
          this.setState({
            latdelta: event.latitudeDelta,
            longdelta: event.longitudeDelta,
            latitude: event.latitude,
            longitude: event.longitude,
            addressselected: details.formatted_address,
          });
          return this.props.locationget(data2);
        });
    } else {
      this.setState({ makermove: 1 });
    }
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.mapmodal}
        onRequestClose={() => {
          this.setState({ makermove: 0 });
          this.props.canclemap();
        }}>
        <View style={styles.container}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              paddingTop: 10,
            }}>
            <TouchableOpacity
              style={{ paddingVertical: 15, width: '20%', alignSelf: 'center' }}
              onPress={() => {
                this.setState({ makermove: 0 });
                this.props.canclemap();
              }}>
              <View style={{ width: '100%', alignSelf: 'center' }}>
                <Image
                  source={localimag.arrowld}
                  style={{
                    alignSelf: 'center',
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </TouchableOpacity>
            <View style={{ paddingVertical: 15, width: '60%' }}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Piazzolla-Light',
                  fontSize: 17,
                  textAlign: 'center',
                }}>
                {Lang_chg.titlesearchlocation[config.language]}
              </Text>
            </View>
            <TouchableOpacity
              style={{ paddingVertical: 15, width: '20%', alignSelf: 'center' }}
              onPress={() => {
                this.state.profile == 'location'
                  ? this.locationupdatebtn()
                  : this.props.navigation.goBack();
              }}>
              <View style={{ width: '100%', alignSelf: 'center' }}>
                <Text
                  style={{
                    color: Colors.buttoncolor,
                    fontFamily: 'Piazzolla-Light',
                    fontSize: 13,
                    textAlign: 'center',
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <MapView
              followsUserLocation={true}
              style={{ flex: 1 }}
              region={this.getCoordinates(this)}
              zoomEnabled={true}
              provider={PROVIDER_GOOGLE}
              minZoomLevel={2}
              maxZoomLevel={20}
              rotateEnabled={true}
              pitchEnabled={true}
              showsUserLocation={true}
              userLocationPriority="high"
              moveOnMarkerPress={true}
              showsMyLocationButton={true}
              showsScale={true} // also this is not working
              showsCompass={true} // and this is not working
              showsPointsOfInterest={true} // this is not working either
              showsBuildings={true} // and finally, this isn't working either
              onMapReady={this.onMapReady}
              onRegionChangeComplete={event => {
                this.getadddressfromlatlong(event);
              }}
              draggable
              ref={this.setMapRef}>
              <Marker.Animated
                coordinate={{
                  latitude: parseFloat(this.state.latitude),
                  longitude: parseFloat(this.state.longitude),
                  latitudeDelta: parseFloat(this.state.latdelta),
                  longitudeDelta: parseFloat(this.state.longdelta),
                }}
                isPreselected={true}
                onDragEnd={e => {
                  console.log('dragEnd', e.nativeEvent.coordinate);
                }}
                draggable
                title={
                  this.state.username != null
                    ? this.state.username
                    : 'Guest user'
                }
                description={'Your are here location'}>
                > source={localimag.maplocation}
                style={{ height: 30, width: 30, resizeMode: 'contain' }}
                />
              </Marker.Animated>
            </MapView>
            <View style={{ position: 'absolute', width: '100%', top: 20 }}>
              <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <GooglePlacesAutocomplete
                  placeholder="Search location"
                  minLength={1} // minimum length of text to search
                  autoFocus={false}
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  listViewDisplayed="auto" // true/false/undefined
                  fetchDetails={true}
                  ref={instance => {
                    this.GooglePlacesRef = instance;
                  }}
                  renderDescription={row => row.description} // custom description render
                  onPress={(data, details = null) => {
                    let responseJson = details;
                    let city = '';
                    let administrative_area_level_1 = '';
                    for (
                      let i = 0;
                      i < responseJson.address_components.length;
                      i++
                    ) {
                      if (
                        responseJson.address_components[i].types[0] ==
                        'locality'
                      ) {
                        city = responseJson.address_components[i].long_name;
                        break;
                      } else if (
                        responseJson.address_components[i].types[0] ==
                        'administrative_area_level_2'
                      ) {
                        city = responseJson.address_components[i].long_name;
                      }
                    }
                    for (
                      let j = 0;
                      j < responseJson.address_components.length;
                      j++
                    ) {
                      if (
                        responseJson.address_components[j].types[0] ==
                        'administrative_area_level_1'
                      ) {
                        administrative_area_level_1 =
                          responseJson.address_components[j].long_name;
                      }
                    }
                    this.setState({
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      address: details.formatted_address,
                    });

                    let data2 = {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      address: details.formatted_address,
                      city: city,
                      administrative_area_level_1: administrative_area_level_1,
                    };

                    return this.props.locationget(data2);
                  }}
                  // getDefaultValue={() => {
                  //   return  mapaddress!='NA'?mapaddress.address:'' // text input default value
                  // }}
                  query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyA8piMVBD4O7W4z-eo4M046_20rk6iXdDg',
                    language: 'en', // language of the results
                    //   types: '(cities)',  default: 'geocode'
                  }}
                  styles={{
                    textInputContainer: {
                      backgroundColor: 'white',
                      marginTop: 10,
                      alignSelf: 'center',
                      height: 42,
                      alignItems: 'flex-end',
                      borderRadius: 50,
                    },
                    textInput: {
                      marginLeft: 7,
                      marginRight: 10,
                      textAlign: 'left',
                      fontFamily: 'Piazzolla-Bold',
                      height: 37,
                      borderRadius: 10,
                      color: '#5d5d5d',
                      fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                      color: Colors.statusbarcolor,
                    },
                    description: {
                      fontFamily: 'Piazzolla-Bold',
                    },
                    container: {
                      borderRadius: 10,
                    },
                    poweredContainer: {
                      backgroundColor: Colors.statusbarcolor,
                      borderRadius: 15,
                      color: '#FFFFFF',
                    },
                    listView: {
                      backgroundColor: '#FFFFFF',
                      marginTop: 30,
                      borderRadius: 15,
                      borderWidth: 1,
                      boderColor: 'black',
                    },
                  }}
                  currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                  currentLocationLabel="Current location"
                  nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                  GoogleReverseGeocodingQuery={
                    {
                      // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }
                  }
                  GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    types: 'food',
                  }}
                  filterReverseGeocodingByTypes={[
                    'locality',
                    'administrative_area_level_3',
                    'postal_code',
                    'sublocality',
                    'country',
                  ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                  //   predefinedPlaces={[homePlace, workPlace]}
                  debounce={100}
                  renderRightButton={() => (
                    <TouchableOpacity
                      style={{ alignSelf: 'center', paddingRight: 10 }}
                      onPress={() => {
                        this.GooglePlacesRef.setAddressText('');
                        this.setState({ addressselected: 'search' });
                      }}>
                      <Icon2
                        name="circle-with-cross"
                        size={25}
                        color="#c2cfc4"
                        style={{ alignSelf: 'center' }}
                      />
                    </TouchableOpacity>
                  )}
                  //   <Image source={require('./icons/location.png')} style={{alignContent:'center',alignSelf:'center',resizeMode:'contain',width:20,height:20,marginLeft:10}}/>}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles=StyleSheet.create({
    container:{
     flex:1,
     backgroundColor:'#FFFFFF'
    },
    button:{
        backgroundColor:'#00a1e4',
        width:180,
        borderRadius:45,
        paddingVertical:10
    },
    searchbutton:{
        backgroundColor:'#00a1e4',

        borderRadius:45,
        paddingVertical:11,
        marginTop:20,
        marginBottom:8,
        textAlign:'center',
        color:'#FFFFFF',
        position:"absolute",bottom:10,width:'80%',
    alignSelf:'center'
    },
    searchbar:{
        flexDirection:"row",
        width:'80%',
        marginHorizontal:20,
        backgroundColor:'#FFFFFF',
        marginTop:10,
        marginRight:10,
        elevation: 10,
        borderRadius:15,
        alignSelf:'center',
        shadowOffset: {
          height: 7,
          width: 0
        },
        shadowColor: "rgba(0,0,0,1)",
        shadowOpacity: 0.49,
        shadowRadius: 5,

    }
})
