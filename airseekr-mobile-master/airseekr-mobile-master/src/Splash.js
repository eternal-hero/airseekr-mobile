import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, RefreshControl, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {firebaseprovider}  from './Provider/FirebaseProvider';
import AsyncStorage from "@react-native-community/async-storage";
import { localimag } from '../src/Provider/Localimage';
import NetInfo from '@react-native-community/netinfo';
import messaging from "@react-native-firebase/messaging";

global.user_address = ''
global.user_address2 = ''
global.user_address_id = ''
global.user_address_lat = ''
global.user_address_long = ''
global.orderid = ''
global.transactionid = ''
global.categoryname=''
global.category_id=''
global.chatcount=0
global.isseller=false
global.navigation = null;

export default class Splash extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: false,
      player_id: 12345,
      main: true,
    }

    // this.checklan()




  }
  // checklan = async () => {
  //   let item = await AsyncStorage.getItem('language_change');

  //   if (item != null && item == 1) {
  //     // this.setState({main:true})
  //     localStorage.setItemObject('language_change', 0)
  //     this.props.navigation.replace('Setting')
  //   }
  //   else {
  //     this.setState({ main: true })
  //   }
  // }

  notificationConfigure = async () => {
    // check if we have permissions
    let enabled = await messaging().hasPermission();

    if (enabled === messaging.AuthorizationStatus.AUTHORIZED) {
      const fcmToken = await messaging().getToken();
      console.log("TOKEN:", fcmToken);

      if (fcmToken) {
        console.log(fcmToken);
      } else {
        // user doesn't have a device token yet
        console.warn("no token");
      }
    } else {
      try {
        const granted = await messaging().requestPermission({
          alert: true,
          announcement: false,
          badge: true,
          carPlay: true,
          provisional: false,
          sound: true,
        });

        if(granted) {
          await messaging().registerDeviceForRemoteMessages();
        }
        enabled = await messaging().hasPermission();

        if (!enabled) {
          return false;
        }
      } catch (e) {

      }
    }

    return true;
  };
  async componentDidMount() {
    console.log(this.props.navigation, 'navigation)_)))))))))))))))))))))))')
    global.navigation = this.props.navigation;
    await AsyncStorage.setItem('airseekr_navigation', JSON.stringify(this.props.navigation))
    const navigation = await AsyncStorage.getItem('airseekr_navigation');
    console.log(navigation, '=============')
    try {
      await this.notificationConfigure();
    } catch (e) {
      console.log("notificationConfigure", e)
    }
    let item = await AsyncStorage.getItem('language_change');

    if (item != null && item == 1) {
      localStorage.setItemObject('language_change', 0)
      // this.props.navigation.navigate('Setting')

    } else {
      const timer = setTimeout(() => {


        this.authenticateSession();
      }, 500);
      return () => clearTimeout(timer);
    }

  }
  authenticateSession = async () => {
    //  this.props.navigation.replace('Login')
    //  this.props.navigation.replace('Login')
    let skip_status = await localStorage.getItemObject('skip_status');
    let user_login = await localStorage.getItemObject('user_login');
    let user_details = await localStorage.getItemObject('user_arr');

    const isSkipped = await localStorage.getItemString('is_skipped_video');
    console.log("user_details:",user_details);
    if (isSkipped !== 'yes') {
      this.props.navigation.replace('Howwork')
    } else {
      if (skip_status !== null){
        if (skip_status === 'yes' && user_details) {
          localStorage.setItemObject('user_arr',null)
          const formData = new FormData();
          const fcmToken = await messaging().getToken();
          formData.append('user_id', user_details.user_id);
          formData.append('app_device_token', fcmToken);
          const tokenUrl = config.baseURL + "api/update_user_device_token.php";
          apifuntion.postApi(tokenUrl, formData).then((obj) => {
            consolepro.consolelog('register device token==================', obj);
          }).catch(err => {
            consolepro.consolelog('register device token err===========', err);
          });
          //this.props.navigation.replace('Homepage')
          this.props.navigation.replace('HomeTicket');
        } else {
          console.log(user_login, 'login')
          if(  user_login !== null){
            if (user_login.login_type === 'app') {
              console.log(user_details, 'details')
              if (user_details != null && user_details.otp_verify === 0) {
                this.props.navigation.replace('Login');
              } else {
                this.normal_login(user_login.email, user_login.password)
              }
            } else {
              this.social_login(user_login.login_type, user_login.social_email, user_login.social_id)
            }
          } else {
            this.props.navigation.replace('Login')
          }
        }
      } else {
        this.props.navigation.replace('Login')
      }
    }

  }

  social_login = async (social_type, social_email,social_name,social_id) => {
    consolepro.consolelog('social_login')
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
      let url = config.baseURL + "social_login.php";
      var data = new FormData();


      data.append("social_email", social_email);
      data.append("social_id", social_id);
      data.append("device_type", config.device_type);
      data.append("player_id", this.state.player_id);
      data.append("social_type", social_type);
      consolepro.consolelog('social_login')
      fetch(url, {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': 0,
           Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
         },
         body:data
       }).then((response) =>  {
        consolepro.consolelog('response',response)
       return response.json();})
        .then((obj) => {
          consolepro.consolelog('obj',obj)
          if (obj.success == 'true') {
            if(obj.user_exist=='no'){
              user_address=''

                this.props.navigation.replace('Login')

            }else{

                  localStorage.setItemObject('user_arr',obj.user_details)
                  firebaseprovider.firebaseUserCreate();
                  firebaseprovider.getMyInboxAllData();

              this.props.navigation.replace('HomeTicket');
                   //this.props.navigation.replace('Homepage')

                }
        } else {
          if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
            config.AppLogout(this.props.navigation)
          } else {
            this.props.navigation.replace('Login')
            }
          return false;
        }
        })


    }
    else {
      consolepro.consolelog('elsesplash')
      Alert.alert(
        msgTitle.internet[config.language],
        msgText.networkconnection[config.language],
        [
          {
            text: msgTitle.ok[config.language],
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false },
      );
    }
  }).catch((error)=>{
    consolepro.consolelog('error1',error)
  })
  }


  normal_login = async (email, password) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
      let url = config.baseURL + "login.php";
      var data = new FormData();
      data.append('email', email)
      data.append('password', password)
      data.append('action', 'auto')
      data.append("device_type", config.device_type)
      data.append("player_id", this.state.player_id)
      consolepro.consolelog('test', data)

      fetch(url, {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': 0,
           Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
         },
         body:data
       }).then((response) =>  {
        console.log('response=======>',response)
       return response.json();})
        .then(async (obj) => {
          consolepro.consolelog('obj',obj)
          if (obj.success == 'true') {
            var user_details = obj.user_details;
            localStorage.setItemObject('user_arr', user_details);
            firebaseprovider.firebaseUserCreate();
            firebaseprovider.getMyInboxAllData();

            const formData = new FormData();
            const fcmToken = await messaging().getToken();
            formData.append('user_id', user_details.user_id);
            formData.append('app_device_token', fcmToken);
            const tokenUrl = config.baseURL + "api/update_user_device_token.php";
            console.log(tokenUrl, formData, '=============================adfasdfsfasdf')
            apifuntion.postApi(tokenUrl, formData).then((obj) => {
              consolepro.consolelog('obj==================', obj);
            }).catch(err => {
              consolepro.consolelog('err===========', err);
            });
            //this.props.navigation.replace('Homepage')
            this.props.navigation.replace('HomeTicket');
          } else {
            if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
              config.checkUserDeactivate(this.props.navigation)
            } else {
              this.props.navigation.replace('Login')
             }
            return false;
          }
        })
        .catch(e => console.log(e))

    }
    else {
      consolepro.consolelog('elsesplash')
      Alert.alert(
        msgTitle.internet[config.language],
        msgText.networkconnection[config.language],
        [
          {
            text: msgTitle.ok[config.language],
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false },
      );

    }
  })
  }



  render() {

    return (
      <View style={{ flex: 1, }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.statusbarcolor }} />
        <StatusBar barStyle='light-content' backgroundColor={Colors.whiteColor} hidden={false} translucent={false}
          networkActivityIndicatorVisible={true} />
        {this.state.main == true && <ImageBackground source={localimag.splash}  style={{ flex: 1, backgroundColor: Colors.whiteColor, alignItems: 'center', justifyContent: 'center' }}>
          {/*<Image style={styles.logo} source={localimag.splash}></Image>*/}
        </ImageBackground>}
        {/* {this.state.main == false && <View style={{ flex: 1, backgroundColor: Colors.whiteColor, alignItems: 'center', justifyContent: 'center' }}>

          <Text style={{ color: Colors.blackColor }}>loading ....</Text>
        </View>} */}

      </View>

    )
  }
}



const styles = StyleSheet.create({

  logo: {
    width: windowWidth * 90 / 100,
    height: windowWidth * 70 / 100,
    resizeMode: 'cover'
  },



});
