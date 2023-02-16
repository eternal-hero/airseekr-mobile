import React, { Component } from 'react'
import {PermissionsAndroid, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import Geolocation from '@react-native-community/geolocation';
import Icon2 from 'react-native-vector-icons/Entypo';
import MapView, {Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Location extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading:false,
            modalVisible1:false,
            latitude:config.latitude,
            longitude:config.longitude,
            latdelta:'0.0922',
            longdelta:'0.0421',
            isConnected:true,
            addressbar:false,
            addressbar2:false,
            addressselected:'Search',
            makermove:0,
            username:'',
            address:'',
            address2:'',
          };
          this.getcurrentlatlogn();

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
          this.setState({address:'',address2:''})
          //  config.newlatitude="";
          //  config.newlongitude="";
          //  config.newaddress="";
         });
    }
    getcurrentlatlogn=async()=>{
        
      let permission= await localStorage.getItemString('permission')
      if(permission!='denied')
       {
        var that =this;
        //Checking for the permission just after component loaded
        if(Platform.OS === 'ios'){
        this.callLocation(that);
      }else{
        // this.callLocation(that);
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'This App needs to Access your location'
              }
            )
            console.log('granted',PermissionsAndroid.RESULTS.GRANTED)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                that.callLocation(that);
            } else {
               let position={'coords':{'latitude':that.state.latitude,'longitude':that.state.longitude}}
               localStorage.setItemString('permission','denied')
               that.getalldata(position)
          }} catch (err) { console.warn(err) }
            }
          requestLocationPermission();
        }
      } else{
        let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}
        this.getalldata(position)
      }

    }

      setMapRef = (map) => {
        this.map = map;
      }
      getCoordinates=(region)=>{
          return({
          latitude: parseFloat(this.state.latitude),
          longitude: parseFloat(this.state.longitude),
          latitudeDelta: parseFloat(this.state.latdelta),
          longitudeDelta:parseFloat(this.state.longdelta),
          }
        );
       }

       getadddressfromlatlong=(event)=>{
        if(this.state.makermove!=0)
        {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + config.mapkey+'&language='+config.maplanguage)

        .then((response) => response.json())
                .then((resp) => {
                  consolepro.consolelog('resp',resp)
                  let responseJson=resp.results[0]
                  let city='';
                  let administrative_area_level_1='';
                  for(let i=0; i<responseJson.address_components.length; i++)
                  {
                    if(responseJson.address_components[i].types[0]=="locality")
                      {
                         city=responseJson.address_components[i].long_name
                           break;
                      }
                      else if(responseJson.address_components[i].types[0]=="administrative_area_level_2"){
                          city=responseJson.address_components[i].long_name
                      }

                  }
                  for(let j=0; j<responseJson.address_components.length; j++)
                  {
                     if(responseJson.address_components[j].types[0]=="administrative_area_level_1"){
                        administrative_area_level_1=responseJson.address_components[j].long_name
                      }

                  }
                  let details=responseJson
                  let  data2={'latitude':details.geometry.location.lat,'longitude':details.geometry.location.lng,'address':details.formatted_address,'city':city,'administrative_area_level_1':administrative_area_level_1}
                   this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
                  this.setState({latdelta:event.latitudeDelta,longdelta:event.longitudeDelta,latitude:event.latitude,longitude:event.longitude,addressselected:details.formatted_address})
                  // config.newlatitude=event.latitude;
                  // config.newlongitude=event.longitude;
                  // config.newaddress=details.formatted_address;
                  //   return  this.props.locationget(data2);
        })

      }
      else{
        this.setState({makermove:1})
      }

        }


        callLocation=async(that)=>{
          this.setState({loading:true})
        localStorage.getItemObject('position').then((position)=>{
          console.log('position',position)
         if(position!=null)
         {
          var pointcheck1=0
          this.getalldata(position)
            Geolocation.getCurrentPosition(
              //Will give you the current location
                  (position) => {
  
                localStorage.setItemObject('position',position)
                this.getalldata(position);
                pointcheck1=1
                  },
                (error) => { let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}
  
                this.getalldata(position)},
                { enableHighAccuracy:true, timeout: 10000000, maximumAge: 10000 }
              );
              that.watchID = Geolocation.watchPosition((position) => {
              //Will give you the location on location change
                 console.log('data',position);
  
                 if(pointcheck1!=1)
                 {
                  localStorage.setItemObject('position',position)
                  this.getalldata(position)
                 }
  
               });
  
         }
         else{
          console.log('helo gkjodi')
          var pointcheck=0
            Geolocation.getCurrentPosition(
              //Will give you the current location
               (position) => {
  
               localStorage.setItemObject('position',position)
  
                this.getalldata(position)
                pointcheck=1
                  },
                (error) => {let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}
  
                this.getalldata(position)},
                { enableHighAccuracy:true, timeout: 1500000, maximumAge: 1000 }
              );
              that.watchID = Geolocation.watchPosition((position) => {
                 //Will give you the location on location change
                 console.log('data',position);
                 if(pointcheck!=1)
                 {
                  localStorage.setItemObject('position',position)
                  this.getalldata(position)
                 }
               });
         }
        })
        }


        getalldata=(position)=>{
          let longitude=position.coords.longitude
          let latitude=position.coords.latitude
            console.log('positionlatitude',latitude)
            console.log('positionlongitude',longitude)
            this.setState({latitude:latitude,longitude:longitude,loading:false})
            config.newlatitude=latitude;
                  config.newlongitude=longitude;
                  // config.newaddress=details.formatted_address;
       }
       done=()=>{
         if(this.state.address !=""){
          user_address=this.state.address;
          user_address2=this.state.address2;
          this.props.navigation.goBack()
         }else{
          msgProvider.toast('Please enter address', 'center')
          return false;
         }
       }
       goback=()=>{
     
         this.props.navigation.goBack()
        }
      

    render() {

        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.whiteColor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
               
                    <View style={{ flex: 1, backgroundColor: Colors.border_color, }}>
                        <View style={CSSstyle.notification_header}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.goback() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.selectlocation[config.language]}</Text>
                           
                            {/* <TouchableOpacity onPress={()=>{this.done()}} > */}
                           
                            <Text style={[CSSstyle.Notifications_title, {}]}>{'    '}</Text>
                
                        {/* </TouchableOpacity> */}
                        </View>


                        <View style={{flex:1}}>
    <MapView
     followsUserLocation={true}
       style={{flex:1}}
      region={
        this.getCoordinates(this)
        }
      zoomEnabled={true}
      provider={PROVIDER_GOOGLE}
      minZoomLevel={2}
      maxZoomLevel={20}
      rotateEnabled={true}
      pitchEnabled={true}
      showsUserLocation={true}
      userLocationPriority='high'
      moveOnMarkerPress={true}
      showsMyLocationButton={true}
      showsScale={true} // also this is not working
      showsCompass={true} // and this is not working
      showsPointsOfInterest={true} // this is not working either
      showsBuildings={true} // and finally, this isn't working either
      onMapReady={this.onMapReady}
      onRegionChangeComplete ={(event)=>{}}
      draggable
      ref={this.setMapRef}
    >
            {/* <Marker.Animated
                    coordinate={{
                    latitude:parseFloat(this.state.latitude),
                    longitude:parseFloat(this.state.longitude),
                    latitudeDelta: parseFloat(this.state.latdelta),
                    longitudeDelta:parseFloat(this.state.longdelta),
                  }}
                  isPreselected={true}
                  onDragEnd={(e) => {console.log("dragEnd",(e.nativeEvent.coordinate))}}
                  draggable
                  title={this.state.username!=null?this.state.username:'Guest user'}
                  description={'Your are here location'}
        
              >
           <Image source={localimag.maplocation} style={{height: 30, width:30 ,resizeMode:'contain',}} />
         </Marker.Animated> */}
       </MapView>
           <TouchableOpacity onPress={() => {this.done() }} style={[{position:'absolute', bottom:windowHeight*5/100,   width: '85%', paddingVertical: windowHeight*1.5/100, backgroundColor: Colors.theme_color1, alignSelf: 'center',  justifyContent: 'center', borderRadius: windowHeight * 4 / 100 , marginTop: windowHeight * 10 / 100, }]}>
                  <Text style={styles.txtlogin1}>{Lang_chg.Continue[config.language]}</Text>
           </TouchableOpacity>
       <View style={{position:'absolute',width:'100%',top:10,justifyContent:'center',}}>
        <View style={{flex:1,paddingHorizontal:20,alignItems:'center'}}>

            <GooglePlacesAutocomplete
            placeholder='Search location'
            minLength={1} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed='auto' // true/false/undefined
            fetchDetails={true}
            ref={(instance) => { this.GooglePlacesRef = instance }}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
                  let responseJson=details
                  consolepro.consolelog('new',details)
                  let city='';
                  let country='';
                  let states='';
                  let administrative_area_level_1='';
                  for(let i=0; i<responseJson.address_components.length; i++)
                  {
                    if(responseJson.address_components[i].types[0]=="locality")
                      {
                         city=responseJson.address_components[i].long_name
                          //  break;
                      }
                      if(responseJson.address_components[i].types[0]=="administrative_area_level_1")
                      {
                        states=responseJson.address_components[i].short_name
                          //  break;
                      }
                      if(responseJson.address_components[i].types[0]=="country")
                      {
                        country=responseJson.address_components[i].long_name
                          //  break;
                      }
                      // else if(responseJson.address_components[i].types[0]=="administrative_area_level_2"){
                      //     city=responseJson.address_components[i].long_name
                      // }

                  }
                  for(let j=0; j<responseJson.address_components.length; j++)
                  {
                     if(responseJson.address_components[j].types[0]=="administrative_area_level_1"){
                        administrative_area_level_1=responseJson.address_components[j].long_name
                      }

                  }
                  this.setState({'latitude':details.geometry.location.lat,'longitude':details.geometry.location.lng,'address':details.formatted_address,})
                 
                  let  data2={'latitude':details.geometry.location.lat,'longitude':details.geometry.location.lng,'address':details.formatted_address,'city':city,'administrative_area_level_1':administrative_area_level_1}
                 
                  let address2= ""+city+" "+states+", "+country

                  consolepro.consolelog('address2',address2)
                  // config.newlatitude=data2.latitude;
                  // config.newlongitude=data2.longitude;
                  // config.newaddress=data2.address;
                  user_address_lat=data2.latitude;
                  user_address_long=data2.longitude;
                  
                  this.setState({address:data2.address,address2:address2})
                
                        // return  this.props.locationget(data2);

              }}
            // getDefaultValue={() => {
            //   return  mapaddress!='NA'?mapaddress.address:'' // text input default value
            // }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key:'AIzaSyA8piMVBD4O7W4z-eo4M046_20rk6iXdDg',
              language: 'en', // language of the results
            //   types: '(cities)',  default: 'geocode'
            }}
            styles={{
                textInputContainer: {
                        backgroundColor:'white',
                        marginTop:8,
                        alignSelf:'center',
                        height:42,
                       alignItems:'flex-end',
                       borderRadius:8
                },
                textInput: {
                  marginLeft: 7,
                  marginRight: 10,
                  textAlign:'left',
                  fontFamily:Font.Poppins_Bold,
                  height:30,
                  borderRadius:10,
                  color: '#5d5d5d',
                  fontSize: 15,
                  alignSelf:'center',
                  marginTop:5
                 
                },
                predefinedPlacesDescription: {
                  color: Colors.statusbarcolor,
                  },
                description: {
                    fontFamily:Font.Poppins_Bold,
                  },
                  container:{
                     borderRadius:10
                  },
                  poweredContainer:{
                    backgroundColor:Colors.statusbarcolor,
                    borderRadius:15,
                    color:'#FFFFFF'
                  },
                  listView:{
                    backgroundColor:'#FFFFFF',
                    marginTop:30,borderRadius:15,borderWidth:1,boderColor:'black'
                  }}}
                        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                        currentLocationLabel="Current location"
                        nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        GoogleReverseGeocodingQuery={{
                 // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }}
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
              'country' ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          //   predefinedPlaces={[homePlace, workPlace]}
            debounce={100}
            renderRightButton={()  => 
            (config.device_type != 'ios' &&<TouchableOpacity style={{alignSelf:'center',paddingRight:10}} onPress={()=>{this.GooglePlacesRef.setAddressText("");this.setState({addressselected:'search',address:''})}}>
                <Icon2 name='circle-with-cross' size={25} color='#c2cfc4' style={{alignSelf:'center'}} />
            </TouchableOpacity>)
             }
          //   <Image source={require('./icons/location.png')} style={{alignContent:'center',alignSelf:'center',resizeMode:'contain',width:20,height:20,marginLeft:10}}/>}
          />
         </View>    
         </View>
         </View>



                        {/* <View style={{marginTop:windowHeight*2/100, width:'100%',flexDirection:'row',paddingHorizontal:windowWidth*4/100,alignItems:'center'}}>
                           <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.searchb}></Image>
                           <Text style={styles.txtitem4}>{Lang_chg.searchlocation[config.language]}</Text>
                        </View>
                         <Image resizeMode="cover" style={{width:'100%',height:'90%'}} source={localimag.map}></Image>
                        

                            <TouchableOpacity onPress={() => {  }} style={[ {width:'90%',paddingVertical:10, flexDirection:'row',backgroundColor:Colors.logingreen_color,alignSelf:'center',justifyContent:'center',position:'absolute',bottom:30}]}>

                                <Text style={styles.txtlogin11}>{Lang_chg.Continue[config.language]}</Text>
                            </TouchableOpacity> */}
                      

                    </View>
               
               
            </View>
        )
    }
}
const styles = StyleSheet.create({
  txtlogin1: {
    fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
},
    txtlogin11: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    },
    couponaplly: {
        alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '92%', flexDirection: 'row', borderRadius: 20, borderWidth: 1, borderColor: Colors.theme_color2, paddingHorizontal: windowWidth * 2 / 100, marginTop: windowHeight * .5 / 100, marginBottom: windowHeight * 1 / 100, paddingVertical: windowHeight * 1 / 100
    },
    viewmore: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight * .5 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100 },

    txtlogin: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtchange: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color3,
    },
    // txtlogin: {
    //     fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    // },
    // icon: {
    //     width: windowWidth * 5 / 100,
    //     height: windowWidth * 5 / 100,
    //     resizeMode: 'contain'
    // },
    // mainview: { width: '90%', paddingVertical: 10, borderColor: Colors.border_color, borderWidth: 1, flexDirection: 'row', backgroundColor: Colors.whiteColor, alignSelf: 'center', },

    txtitem2: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor, marginHorizontal: windowWidth * 2 / 100,
    },
    txtitem3: {
        fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1, marginHorizontal: windowWidth * 2 / 100, marginTop: -windowHeight * 1 / 100
    },
    txtitem4: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.greyColor, marginHorizontal: windowWidth * 2 / 100, marginTop:0
    },
    txtitem5: {
        fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1, marginHorizontal: windowWidth * 2 / 100, alignSelf: 'flex-end'
    },
    txtitem6: {
        fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor,
    },
    txtitem7: {
        fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtitem8: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1,
    },



});