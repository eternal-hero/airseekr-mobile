import React, { Component } from 'react';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {
  msgProvider,
  msgText,
  msgTitle,
  config,
  localStorage,
  apifuntion,
  Lang_chg,
  notification,
} from '../utilslib/Utils';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
global.navigatefunction = '';
class SocialLoginProvider extends Component {
  constructor(props) {
    super(props);
    GoogleSignin.configure({
      scopes: ['email', 'profile'],
      webClientId:
        '661155938267-h7gnch5gacnu2omgs2fl3grq0s4tmlrq.apps.googleusercontent.com',
      iosClientId:
        '661155938267-m0k2t69muea86lkbvr091poe0prkq6gf.apps.googleusercontent.com',
    });
    this.callbackFunction = null;
  }

  goHomePage = navigation => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'Home' }],
      }),
    );
  };

  Socialfunction = (navigation, btn, type, callbackFunction = null) => {
    this.callbackFunction = callbackFunction ? callbackFunction : null;
    if (type == 'normal') {
      var social_type = btn;
      var login_type = btn;
      var social_id = '001942.7f1a8d2b59354833977cc59e439459a3.0507';
      var social_name = 'UploadingApp';
      var social_first_name = 'UploadingApp';
      var social_middle_name = '';
      var social_last_name = 'YoungDecade';
      var social_email = 'uploadingapp.youngdecade@gmail.com';
      // var social_image_url = 'img/no_image_found.png';
      var social_image_url =
        'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';
      var result = {
        social_id: social_id,
        social_type: social_type,
        login_type: login_type,
        social_name: social_name,
        social_first_name: social_first_name,
        social_last_name: social_last_name,
        social_middle_name: social_middle_name,
        social_email: social_email,
        social_image: social_image_url,
      };
      this.callsocailweb(result, navigation);
    } else {
      if (btn == 'facebook') {
        this.FacebookLogin(navigation);
      } else if (btn == 'google') {
        this.GoogleLogin(navigation);
      } else if (btn == 'apple') {
        this.Applelogin(navigation);
      }
    }
  };

  FacebookLogin = async navigation => {
    navigatefunction = navigation;
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          console.log('result', result);
          console.log('Login cancelled');
          // alert('login cancel')
          (async () => {
            await this.callbackFunction(null);
          })();
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const processRequest = new GraphRequest(
              '/me?fields=id,name,email,first_name,middle_name,last_name,picture.type(large)',
              null,
              this.get_Response_Info,
            );
            new GraphRequestManager().addRequest(processRequest).start();
          });
          (async () => {
            await this.callbackFunction(null);
          })();
        }
      },
    );
  };
  get_Response_Info = (error, result) => {
    if (error) {
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      console.log('aa gya kya bhai');
      var socaildata = {
        social_id: result.id,
        social_name: result.name,
        social_first_name: result.first_name,
        social_last_name: result.last_name,
        social_middle_name: '',
        social_email: result.email,
        social_image: result.picture.data.url,
        social_type: 'facebook',
        logintype: 'facebook',
      };
      const uservalue = {
        login_type: 'facebook',
        social_email: result.email,
        social_id: result.id,
      };
      localStorage.setItemObject('user_login', uservalue);
      this.callsocailweb(socaildata, navigatefunction);
    }
  };

  GoogleLogin = async navigation => {
    //Prompts a modal to let the user sign in into your application.
    try {
      console.log('Google login');
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      var result = {
        social_name: userInfo.user.name,
        social_first_name: userInfo.user.givenName,
        social_last_name: userInfo.user.familyName,
        social_email: userInfo.user.email,
        social_image: userInfo.user.photo,
        social_type: 'google',
        logintype: 'google',
        social_id: userInfo.user.id,
      };

      const uservalue = {
        login_type: 'google',
        social_email: userInfo.user.email,
        social_id: userInfo.user.id,
      };
      localStorage.setItemObject('user_login', uservalue);
      this.callsocailweb(result, navigation);
    } catch (error) {
      (async () => {
        await this.callbackFunction(null);
      })();
      // alert('Message'+error.message)
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };
  Applelogin = async navigation => {
    await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then(
        res => {
          var result = {
            social_name: res.fullName.familyName,
            social_first_name: res.fullName.givenName,
            social_last_name: res.fullName.familyName,
            social_email: res.email,
            social_image: 'NA',
            social_type: 'apple',
            logintype: 'apple',
            social_id: res.user,
          };
          this.callsocailweb(result, navigation);
        },
        error => {
          (async () => {
            await this.callbackFunction(null);
          })();
          console.log('error come', error);
        },
      );

    // TODO: Send the token to backend
  };

  socaillogout = async (type, navigation) => {
    if (type == 'facebook') {
      LoginManager.logOut();
      localStorage.clear();
      navigation.navigate('Login');
    } else if (type == 'google') {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (error) {
        console.log('errorr');
      }
      localStorage.clear();
      navigation.navigate('Login');
    }
  };
  callsocailweb = (result, navigation) => {
    console.log('result', result);
    console.log('result', navigation);
    var data = new FormData();
    data.append('social_email', result.social_email);
    // data.append("social_name", result.social_name);
    data.append('social_id', result.social_id);
    data.append('device_type', config.device_type);
    data.append('player_id', player_id_me1);
    data.append('social_type', result.social_type);
    localStorage.setItemObject('socialdata', result);
    var url = config.baseURL + 'social_login.php';
    apifuntion
      .postApi(url, data)
      .then(obj => {
        console.log('socialonj', obj);
        if (obj.success == 'true') {
          if (obj.user_exist == 'no') {
            user_address = '';
            (async () => {
              await this.callbackFunction(obj?.user_details);
            })();
            if (!result?.social_email) {
              Alert.alert(
                'Confirm',
                "You did not share email. So You can't login with Social account",
                [
                  {
                    text: msgTitle.cancel[0],
                  },
                  {
                    text: msgTitle.ok[0],
                    // onPress: () =>  this.btnPageLoginCall(),
                    onPress: async () => {
                      await localStorage.setItemObject('skip_status', 'no');
                      navigation.navigate('Signup');
                    },
                  },
                ],
                { cancelable: false },
              );
              return false;
            }
            navigation.navigate('Socialsignup', { social_data: result });
          } else {
            const uservalue = {
              login_type: result.social_type,
              social_email: result.social_email,
              social_id: result.social_id,
            };
            localStorage.setItemObject('user_login', uservalue);
            localStorage.setItemObject('user_arr', obj.user_details);

            if (this.callbackFunction) {
              (async () => {
                await this.callbackFunction(obj.user_details);
              })();
            } else {
              navigation.navigate('HomeTicket');
            }
          }
        } else {
          (async () => {
            await this.callbackFunction(obj?.user_details);
          })();
          if (
            obj.active_status == '0' ||
            obj.msg[config.language] == msgTitle.usernotexit[config.language]
          ) {
            config.checkUserDeactivate(navigation);
          } else {
            navigation.replace('Login');
          }
          return false;
        }
      })
      .catch(error => {
        msgProvider.alert(
          msgTitle.server[config.language],
          msgText.servermessage[config.language],
          false,
        );
        this.setState({ loading: false });
      });
  };
}

export const SocialLogin = new SocialLoginProvider();
