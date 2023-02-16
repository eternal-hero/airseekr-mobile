import React, { Component } from "react";
import { Alert } from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import { AppProvider, AppConsumer } from "./src/Provider/context/AppProvider";
import Stacknav from "./src/Provider/Routenavigation";
import { Lang_chg } from "./src/Provider/Language_provider";
import { Linking } from "react-native";
import { firebaseprovider } from "./src/Provider/FirebaseProvider";
import messaging from '@react-native-firebase/messaging';

global.MapAddress = "NA";
console.disableYellowBox = true;

class App extends Component {


  async componentDidMount() {
    // firebaseprovider.getAllUsers();
    Lang_chg.language_get();
    // const token = await messaging().getToken();
    // console.log(token, '_+_+_+_+_++++++++++++++++++++++++');
    // await this.notificationConfigure();
    // this.message = messaging().onMessage(async remoteMessage => {
    //   console.log('=====================', remoteMessage)
    //   Alert.alert(remoteMessage?.notification?.title, remoteMessage?.body)
    // })
    //
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });
  }

  notificationConfigure = async () => {
    // check if we have permissions
    let enabled = await messaging().hasPermission();

    if (enabled === messaging.AuthorizationStatus.AUTHORIZED) {
      const fcmToken = await messaging().getToken();
      console.log("TOKEN", fcmToken);

      if (fcmToken) {
        console.log(fcmToken);
      } else {
        // user doesn't have a device token yet
        console.warn("no token");
      }
    } else {
      await messaging().requestPermission();
      console.log("requested");

      enabled = await messaging().hasPermission();
      console.log("done", enabled);
      if (!enabled) {
        return false;
      }
    }

    return true;
  };

  componentWillUnmount() {
    // this.message();
  }

  render() {


    // const linking = {
    //   prefixes: ["airseekr://"], //prefixes can be anything depend on what you have wrote in intent filter
    //   config: {
    //     initialRouteName: "Homepage",
    //     screens: {
    //       Homepage: {
    //         path: "Homepage/:",
    //       },
    //       Shareitemdetail: {    //define page name
    //         path:"Shareitemdetail/:ads_id",   //define url path pagename/:id ka name option h ydi aap is page pr use kr rhe ho to hi likhna h
    //       },
    //     }
    //   }
    // }


    return (
      <NavigationContainer>
        <AppProvider {...this.props}>
          <AppConsumer>{funcs => {
            global.props = { ...funcs };
            return <Stacknav {...funcs} />;
          }}
          </AppConsumer>
        </AppProvider>
      </NavigationContainer>

    );
  }
}

export default App;
