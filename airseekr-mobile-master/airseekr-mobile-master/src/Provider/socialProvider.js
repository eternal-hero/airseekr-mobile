import { Platform } from "react-native";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from 'react-native-google-signin';
// import { LoginManager,AccessToken,GraphRequestManager,GraphRequest } from 'react-native-fbsdk'
import  {config}  from './configProvider';
class SocialLogin {
  constructor() {
//     GoogleSignin.configure({
//       // Mandatory method to call before calling signIn()
//        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
//       // Repleace with your webClientId
//       // Generated from Firebase console
//        webClientId: '469097977015-sl9cs23n0q8p2m92t7gr4t5gc8gm6iue.apps.googleusercontent.com',
//       });
//     // Check if user is already signed in
//     //this._isSignedIn();
//      }
//     GoogleLogin = async () => {
//     //Prompts a modal to let the user sign in into your application.
//     try {
//       await GoogleSignin.hasPlayServices({
//         showPlayServicesUpdateDialog: true,
//       });
//       const userInfo = await GoogleSignin.signIn();
//       //this.callsocailweb(userInfo, 'google')
//         console.log('userinfo', userInfo)
//         console.log('userinfoemail', userInfo.user.email)
//        let sendData = {
//         name: userInfo.user.name,
//         email: userInfo.user.email,
//         google_id: userInfo.user.id
//       }
//       return userInfo;
//     } catch (error) {
//       // alert('Message'+error.message)
     
//       console.log('Message', error.message);
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         console.log('User Cancelled the Login Flow');
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         console.log('Signing In');
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         console.log('Play Services Not Available or Outdated');
//       } else {
//         console.log('Some Other Error Happened', error);
//       }
//     }
//   };

//   googlesignOut = async () => {
//     try {
//       await GoogleSignin.revokeAccess();
//       await GoogleSignin.signOut();
//       console.log('google signout');
//       return true
//     } catch (error) {
//       console.error(error);
//       return false
//     }
//   }; 
//   facebooksignOut = async () => {
//     LoginManager.logOut()
//   }; 

//   FacebookLogin =async () => {
//     LoginManager.logInWithPermissions([
//         'public_profile', "email"
//     ]).then((result) => {
//         if (result.isCancelled) {
//             console.log('Login cancelled');
//             // alert('login cancel')
//         } else {

//            AccessToken.getCurrentAccessToken().then(data => {
//                 // alert('hello');
//                 const processRequest = new GraphRequest(
//                     '/me?fields=id,name,email,birthday,first_name,middle_name,last_name,picture.type(large)',
//                     null,
//                      this.get_Response_Info()
//                 );
//                 // Start the graph request.
                
//                 new GraphRequestManager().addRequest(processRequest).start();
//                 // console.log('processRequest='+JSON.stringify(processRequest))
//             });
            
            
//         }
//     })
// }

// get_Response_Info = (error, result) => {
//     if (error) {
//         //Alert for the Error
//         Alert.alert('Error fetching data: ' + error.toString());
//     } else {
//       console.log('sendData', result);
//         config.data=result;
//     }
// };



//   _callSignup = (sendData) => {
//     console.log('sendData', sendData);
//     fetch('http://46.101.160.90/app/webservice/get_all_content.php?user_id=0', {
//       method: 'POST',
//       headers: {
//          Accept: 'application/json',
//          'Content-Type': 'multipart/form-data',
//          'Cache-Control': 'no-cache,no-store,must-revalidate',
//          'Pragma': 'no-cache',
//          'Expires': 0
//       },
//       body:sendData
//     }).then((obj) => {
//       return obj.json();
//     }).then((obj) => {
//       console.log('signup true',obj);
//     }).catch((error) => {
//       console.log('signup error',error);
//     })
   }
}

export const socialLogin = new SocialLogin();