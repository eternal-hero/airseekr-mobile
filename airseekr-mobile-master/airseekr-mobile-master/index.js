/**
 * @format
 */

import 'react-native-gesture-handler';
import { Alert, AppRegistry } from "react-native";
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-community/async-storage";
import { firebaseprovider } from "./src/Provider/FirebaseProvider";
import { Lang_chg } from "./src/Provider/Language_provider";
 
messaging().onMessage(async remoteMessage => {
  console.log('=====================', global.navigation?.state?.routeName, remoteMessage)

  Alert.alert(remoteMessage?.notification?.title, remoteMessage?.notification?.body,
  //   [
  //   {
  //     text: "Cancel",
  //     onPress: () => console.log("Cancel Pressed"),
  //     style: "cancel"
  //   },
  //   { text: "Go Chat box", onPress: () => {
  //       global.navigation.navigate("Chat", {
  //         "data": {
  //           "other_user_id": remoteMessage?.data?.user_id,
  //           "other_user_name": remoteMessage?.data?.name,
  //           "image": remoteMessage?.data?.image,
  //         },
  //       });
  //     }
  //   }
  // ]
  )
})

messaging().getInitialNotification(async remoteMessage => {
  console.log('Message handled in the background! ===============adsf', remoteMessage);
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background! ===============adfrwer', remoteMessage);
});

messaging().onNotificationOpenedApp(async remoteMessage => {
  global.navigation.navigate('Chat', {data: {
      other_user_id: remoteMessage?.data?.send_user_id,
      other_user_name: remoteMessage?.data?.name,
      image: remoteMessage?.data?.image,
    }})
  console.log('Message handled in the background! ===============sbcbcxb', remoteMessage);
});

if (!__DEV__) {
    console.log = () => {};
}

AppRegistry.registerComponent(appName, () => App);
