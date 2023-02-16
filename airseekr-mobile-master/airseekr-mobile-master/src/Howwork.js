import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, Alert, View, TouchableOpacity } from 'react-native'
import { config, Colors, localStorage, consolepro, msgTitle, msgText, apifuntion } from "./Provider/utilslib/Utils";

import { firebaseprovider } from './Provider/FirebaseProvider';
import NetInfo from '@react-native-community/netinfo';
import Video from 'react-native-video';
import messaging from "@react-native-firebase/messaging";


export default class Howwork extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: false,
      player_id: 12345,
    }
  }

  authenticateSession = async () => {
    //  this.props.navigation.replace('Login')
    let skip_status = await localStorage.getItemObject('skip_status');
    let user_login = await localStorage.getItemObject('user_login');
    let user_details = await localStorage.getItemObject('user_arr');
    localStorage.setItemString('is_skipped_video', 'yes')
    if (skip_status != null) {
      if (skip_status == 'yes') {
        localStorage.setItemObject('user_arr', null)
        //this.props.navigation.replace('Homepage')
        this.props.navigation.replace('HomeTicket');
      } else {
        if (user_login != null) {
          if (user_login.login_type == 'app') {
            if (user_details != null && user_details.otp_verify == 0) {
              this.props.navigation.replace('Login')
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

  social_login = async (social_type, social_email, social_name, social_id) => {
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
          body: data
        }).then((response) => {
          consolepro.consolelog('response', response)
          return response.json();
        })
          .then((obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == 'true') {
              if (obj.user_exist == 'no') {
                user_address = ''

                this.props.navigation.replace('Login')

              } else {

                localStorage.setItemObject('user_arr', obj.user_details)
                firebaseprovider.firebaseUserCreate();
                firebaseprovider.getMyInboxAllData();
                //this.props.navigation.replace('Homepage')
                this.props.navigation.replace('HomeTicket');

              }
            } else {
              if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
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
    }).catch((error) => {
      consolepro.consolelog('error1', error)
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
          body: data
        }).then((response) => {
          consolepro.consolelog('response', response)
          return response.json();
        })
          .then(async (obj) => {
            consolepro.consolelog('obj', obj)
            if (obj.success == 'true') {
              var user_details = obj.user_details;
              let enabled = await messaging().hasPermission();

              console.log(enabled, '==================')
              const formData = new FormData();
              const fcmToken = await messaging().getToken();
              formData.append('user_id', user_details.user_id);
              formData.append('app_device_token', fcmToken);
              const tokenUrl = config.baseURL + "api/update_user_device_token.php";
              apifuntion.postApi(tokenUrl, formData).then((obj) => {
                consolepro.consolelog('obj==================', obj);
              }).catch(err => {
                consolepro.consolelog('err===========', err);
              });
              localStorage.setItemObject('user_arr', user_details);
              firebaseprovider.firebaseUserCreate();
              firebaseprovider.getMyInboxAllData();
              //this.props.navigation.replace('Homepage')
              this.props.navigation.replace('HomeTicket');
            } else {
              if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                config.checkUserDeactivate(this.props.navigation)
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
    })
  }



  render() {

    return (
      <View style={{ flex: 1, }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.statusbarcolor }} />
        <StatusBar barStyle='light-content' backgroundColor={Colors.whiteColor} hidden={false} translucent={false}
          networkActivityIndicatorVisible={true} />

        <Video
          source={require('../assets/how_it_work.mp4')}
          shouldPlay={this.state.shouldPlay}
          resizeMode="contain"
          style={{ left: 0, right: 0, flex: 1 }}
          ignoreSilentSwitch={"ignore"}

        />

        <TouchableOpacity
          onPress={() => {
            this.authenticateSession();
          }}
          style={{ right: 16, bottom: 16, alignItems: 'flex-end' }}
        >
          <Text>Next  &gt; </Text>
        </TouchableOpacity>

      </View>

    )
  }
}
