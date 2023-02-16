import React, { Component } from 'react';
import {
  Text,
  BackHandler,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  View,
  StyleSheet,
  Keyboard,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  config,
  Otpprovider,
  Mapprovider,
  apifuntion,
  Colors,
  Font,
  validation,
  mobileH,
  mobileW,
  SocialLogin,
  Cameragallery,
  mediaprovider,
  localStorage,
  Lang_chg,
  consolepro,
  msgProvider,
  msgTitle,
  msgText,
  Currentltlg,
} from './Provider/utilslib/Utils';
import CSSstyle from './css';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-banner-carousel';
import CountDown from 'react-native-countdown-component';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from './Provider/Localimage';
import { color } from 'react-native-reanimated';
import { Linking } from 'react-native';

export default class Paypalverification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      cameramodalon: false,
      imagepath: 'NA',
      takeimage: false,
      email: '',
      image_previous: '',
    };
  }
  async componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getvalue();
    });
    await this.getvalue();
  }

  _openCamera = () => {
    mediaprovider.launchCamera().then(obj => {
      consolepro.consolelog('imageobj', obj);
      this.setState({ cameramodalon: false });
      this.setState({
        imagepath: obj.path,
        takeimage: true,
      });
    });
  };

  _openGellery = () => {
    mediaprovider.launchGellery().then(obj => {
      consolepro.consolelog('imageobj', obj);
      this.setState({ cameramodalon: false });
      if (obj.mime == 'image/jpeg') {
        this.setState({
          imagepath: obj.path,
          takeimage: true,
        });
      } else {
        this.setState({
          imagepath: 'NA',
          takeimage: false,
        });
      }
    });
  };

  getvalue = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('user_details', user_details);
    if (user_details != null) {
      this.setState({ email: user_details.paypal_email && user_details.paypal_email != 'null' ? user_details.paypal_email : '' });
    }
  };

  continuepress = async () => {
    Keyboard.dismiss();

    if (!this.state.email || config.regemail.test(this.state.email) !== true) {
      msgProvider.toast(validation.validEmail[config.language], 'center');
      return false;
    }

    let user_details = await localStorage.getItemObject('user_arr');
    if (user_details != null) {
      let url = config.baseAPI + 'payment-ads/paypal-account';
      var data = new FormData();
      data.append('user_id', user_details.user_id);
      data.append('email', this.state.email);
      consolepro.consolelog('continuepress', url);
      apifuntion
        .postApi(url, data)
        .then(async obj => {
          consolepro.consolelog('test', obj);
          if (obj.success == 'true') {
            msgProvider.toast('Update Successfully', 'top');
            await localStorage.setItemObject('user_arr', obj.data);
            await this.getvalue();
            this.props.navigation.navigate('Profile');
          } else {
            msgProvider.alert(
                msgTitle.information[config.language],
                'Update failed, please fill a invalid email',
                false,
            );
            return false;
          }
        })
        .catch(err => {
          consolepro.consolelog('err', err);
        });
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <SafeAreaView
          style={{ flex: 0, backgroundColor: Colors.theme_color1 }}
        />
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.theme_color1}
          hidden={false}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView>
            <View
              style={{
                backgroundColor: Colors.whiteColor,
                paddingBottom: (windowHeight * 2) / 100,
              }}>
              <View
                style={[
                  CSSstyle.notification_header,
                  { paddingTop: 10, paddingBottom: 5 },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ padding: 5 }}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}>
                  <Image
                    resizeMode="contain"
                    style={CSSstyle.hole_top_l1}
                    source={localimag.backarrowicon}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ width: '90%', alignSelf: 'center' }}>
                <Text
                  style={[
                    styles.txttext1,
                    { marginTop: (windowHeight * 4) / 100 },
                  ]}>
                  Paypal Verification (optional)
                </Text>
                <Text style={[styles.txttext2, {}]}>
                  Please provide your verified PayPal e-mail address
                </Text>

                <TextInput
                  value={'' + this.state.email + ''}
                  onChangeText={txt => {
                    this.setState({ email: txt });
                  }}
                  keyboardType="email-address"
                  maxLength={30}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  style={[styles.txteditemail, {}]}
                  placeholderTextColor={Colors.lightfontcolor}
                  placeholder={'Enter e-mail'}
                />

                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.theme_color1,
                    height: 1,
                    marginTop: (-windowHeight * 1) / 100,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.continuepress();
                  }}
                  style={[
                    CSSstyle.mainbutton,
                    {
                      marginTop: (windowHeight * 13) / 100,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: '4%',
                    },
                  ]}>
                  <Text style={styles.txtlogin}>{'   '}</Text>
                  <Text style={styles.txtlogin}>
                    {Lang_chg.Continue[config.language]}
                  </Text>
                  <Image
                    resizeMode="cover"
                    style={styles.iconsback}
                    source={localimag.arroww}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txttext1: {
    fontSize: (windowWidth * 5) / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.blackColor,
  },
  txttext2: {
    fontSize: (windowWidth * 3.8) / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.lightfontcolor,
  },
  txtlogin: {
    fontSize: (windowWidth * 3.9) / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.whiteColor,
    alignSelf: 'center',
  },
  icons: {
    width: (windowWidth * 12) / 100,
    height: (windowWidth * 12) / 100,
    resizeMode: 'cover',
  },
  iconcross: {
    width: (windowWidth * 8) / 100,
    height: (windowWidth * 8) / 100,
    resizeMode: 'cover',
  },
  iconsback: {
    width: (windowWidth * 6) / 100,
    height: (windowWidth * 4) / 100,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },

  txteditemail: {
    marginTop: (windowHeight * 2.5) / 100,
    fontSize: (windowWidth * 3.7) / 100,
    width: '100%',
    fontFamily: Font.Poppins_Bold,
    color: Colors.blackColor,
    height: (windowHeight * 6) / 100,
  },
  txtamount: {
    marginTop: (windowHeight * 1) / 100,
    fontSize: (windowWidth * 5) / 100,
    width: '100%',
    fontFamily: Font.Poppins_Bold,
    color: Colors.lightfontcolor,
  },
  txtlink: {
    marginBottom: (windowHeight * 1) / 100,
    fontSize: (windowWidth * 3.8) / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.blackColor,
  },
});
