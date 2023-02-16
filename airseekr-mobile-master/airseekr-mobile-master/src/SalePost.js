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
  Platform,
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import Footer from './Provider/Footer';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
} from '@react-native-firebase/admob';
import DropDownPicker from 'react-native-dropdown-picker';
import { Constants } from './utils/constants';

const photodata = [
  { id: 0, image: 'NA', file: 'NA', status: false },
  { id: 1, image: 'NA', file: 'NA', status: false },
  { id: 2, image: 'NA', file: 'NA', status: false },
  { id: 3, image: 'NA', file: 'NA', status: false },
  { id: 4, image: 'NA', file: 'NA', status: false },
];
export default class SalePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      cateagoryname: 'Choose Category',
      seeekingitem: '',
      budget: '',
      specificitem: '',
      latitude: config.latitude,
      longitude: config.longitude,
      location: null,
      location2: '',
      photodata: photodata,
      cameramodalon: false,
      currencyOpen: 0,
      currencySelected: '$',
      currencyList: [
        { label: 'AUD ($)', value: '$' },
        { label: 'AED (د.إ)', value: 'د.إ' },
        { label: 'AFN (Af)', value: 'Af' },
        { label: 'ALL (Lek)', value: 'Lek' },
        { label: 'ANG (ƒ)', value: 'ƒ' },
        { label: 'AOA (Kz)', value: 'Kz' },
        { label: 'ARS ($)', value: '$' },
        { label: 'AWG (ƒ)', value: 'ƒ' },
        { label: 'AZN (ман)', value: 'ман' },
        { label: 'BAM (KM)', value: 'KM' },
        { label: 'BBD ($)', value: '$' },
        { label: 'BDT (৳)', value: '৳' },
        { label: 'BGN (лв)', value: 'лв' },
        { label: 'BHD (.د.ب)', value: '.د.ب' },
        { label: 'BIF (FBu)', value: 'FBu' },
        { label: 'BMD ($)', value: '$' },
        { label: 'BND ($)', value: '$' },
        { label: 'BOB ($b)', value: '$b' },
        { label: 'BRL (R$)', value: 'R$' },
        { label: 'BSD ($)', value: '$' },
        { label: 'BTN (Nu.)', value: 'Nu.' },
        { label: 'BWP (P)', value: 'P' },
        { label: 'BYR (p.)', value: 'p.' },
        { label: 'BZD (BZ$)', value: 'BZ$' },
        { label: 'CAD ($)', value: '$' },
        { label: 'CDF (FC)', value: 'FC' },
        { label: 'CHF (CHF)', value: 'CHF' },
        { label: 'CLP ($)', value: '$' },
        { label: 'CNY (¥)', value: '¥' },
        { label: 'COP ($)', value: '$' },
        { label: 'CRC (₡)', value: '₡' },
        { label: 'CUP (⃌)', value: '⃌' },
        { label: 'CVE ($)', value: '$' },
        { label: 'CZK (Kč)', value: 'Kč' },
        { label: 'DJF (Fdj)', value: 'Fdj' },
        { label: 'DKK (kr)', value: 'kr' },
        { label: 'DOP (RD$)', value: 'RD$' },
        { label: 'DZD (دج)', value: 'دج' },
        { label: 'EGP (£)', value: '£' },
        { label: 'ETB (Br)', value: 'Br' },
        { label: 'EUR (€)', value: '€' },
        { label: 'FJD ($)', value: '$' },
        { label: 'FKP (£)', value: '£' },
        { label: 'GBP (£)', value: '£' },
        { label: 'GEL (ლ)', value: 'ლ' },
        { label: 'GHS (¢)', value: '¢' },
        { label: 'GIP (£)', value: '£' },
        { label: 'GMD (D)', value: 'D' },
        { label: 'GNF (FG)', value: 'FG' },
        { label: 'GTQ (Q)', value: 'Q' },
        { label: 'GYD ($)', value: '$' },
        { label: 'HKD ($)', value: '$' },
        { label: 'HNL (L)', value: 'L' },
        { label: 'HRK (kn)', value: 'kn' },
        { label: 'HTG (G)', value: 'G' },
        { label: 'HUF (Ft)', value: 'Ft' },
        { label: 'IDR (Rp)', value: 'Rp' },
        { label: 'ILS (₪)', value: '₪' },
        { label: 'INR (₹)', value: '₹' },
        { label: 'IQD (ع.د)', value: 'ع.د' },
        { label: 'IRR (﷼)', value: '﷼' },
        { label: 'ISK (kr)', value: 'kr' },
        { label: 'JEP (£)', value: '£' },
        { label: 'JMD (J$)', value: 'J$' },
        { label: 'JOD (JD)', value: 'JD' },
        { label: 'JPY (¥)', value: '¥' },
        { label: 'KES (KSh)', value: 'KSh' },
        { label: 'KGS (лв)', value: 'лв' },
        { label: 'KHR (៛)', value: '៛' },
        { label: 'KMF (CF)', value: 'CF' },
        { label: 'KPW (₩)', value: '₩' },
        { label: 'KRW (₩)', value: '₩' },
        { label: 'KWD (د.ك)', value: 'د.ك' },
        { label: 'KYD ($)', value: '$' },
        { label: 'KZT (лв)', value: 'лв' },
        { label: 'LAK (₭)', value: '₭' },
        { label: 'LBP (£)', value: '£' },
        { label: 'LKR (₨)', value: '₨' },
        { label: 'LRD ($)', value: '$' },
        { label: 'LSL (L)', value: 'L' },
        { label: 'LTL (Lt)', value: 'Lt' },
        { label: 'LVL (Ls)', value: 'Ls' },
        { label: 'LYD (ل.د)', value: 'ل.د' },
        { label: 'MAD (د.م.)', value: 'د.م.' },
        { label: 'MDL (L)', value: 'L' },
        { label: 'MGA (Ar)', value: 'Ar' },
        { label: 'MKD (ден)', value: 'ден' },
        { label: 'MMK (K)', value: 'K' },
        { label: 'MNT (₮)', value: '₮' },
        { label: 'MOP (MOP$)', value: 'MOP$' },
        { label: 'MRO (UM)', value: 'UM' },
        { label: 'MUR (₨)', value: '₨' },
        { label: 'MVR (.ރ)', value: '.ރ' },
        { label: 'MWK (MK)', value: 'MK' },
        { label: 'MXN ($)', value: '$' },
        { label: 'MYR (RM)', value: 'RM' },
        { label: 'MZN (MT)', value: 'MT' },
        { label: 'NAD ($)', value: '$' },
        { label: 'NGN (₦)', value: '₦' },
        { label: 'NIO (C$)', value: 'C$' },
        { label: 'NOK (kr)', value: 'kr' },
        { label: 'NPR (₨)', value: '₨' },
        { label: 'NZD ($)', value: '$' },
        { label: 'OMR (﷼)', value: '﷼' },
        { label: 'PAB (B/.)', value: 'B/.' },
        { label: 'PEN (S/.)', value: 'S/.' },
        { label: 'PGK (K)', value: 'K' },
        { label: 'PHP (₱)', value: '₱' },
        { label: 'PKR (₨)', value: '₨' },
        { label: 'PLN (zł)', value: 'zł' },
        { label: 'PYG (Gs)', value: 'Gs' },
        { label: 'QAR (﷼)', value: '﷼' },
        { label: 'RON (lei)', value: 'lei' },
        { label: 'RSD (Дин.)', value: 'Дин.' },
        { label: 'RUB (руб)', value: 'руб' },
        { label: 'RWF (ر.س)', value: 'ر.س' },
        { label: 'SAR (﷼)', value: '﷼' },
        { label: 'SBD ($)', value: '$' },
        { label: 'SCR (₨)', value: '₨' },
        { label: 'SDG (£)', value: '£' },
        { label: 'SEK (kr)', value: 'kr' },
        { label: 'SGD ($)', value: '$' },
        { label: 'SHP (£)', value: '£' },
        { label: 'SLL (Le)', value: 'Le' },
        { label: 'SOS (S)', value: 'S' },
        { label: 'SRD ($)', value: '$' },
        { label: 'STD (Db)', value: 'Db' },
        { label: 'SVC ($)', value: '$' },
        { label: 'SYP (£)', value: '£' },
        { label: 'SZL (L)', value: 'L' },
        { label: 'THB (฿)', value: '฿' },
        { label: 'TJS (TJS)', value: 'TJS' },
        { label: 'TMT (m)', value: 'm' },
        { label: 'TND (د.ت)', value: 'د.ت' },
        { label: 'TOP (T$)', value: 'T$' },
        { label: 'TRY (₤)', value: '₤' },
        { label: 'TTD ($)', value: '$' },
        { label: 'TWD (NT$)', value: 'NT$' },
        { label: 'UAH (₴)', value: '₴' },
        { label: 'UGX (USh)', value: 'USh' },
        { label: 'USD ($)', value: '$' },
        { label: 'UYU ($U)', value: '$U' },
        { label: 'UZS (лв)', value: 'лв' },
        { label: 'VEF (Bs)', value: 'Bs' },
        { label: 'VND (₫)', value: '₫' },
        { label: 'VUV (VT)', value: 'VT' },
        { label: 'WST (WS$)', value: 'WS$' },
        { label: 'XAF (FCFA)', value: 'FCFA' },
        { label: 'XCD ($)', value: '$' },
        { label: 'XPF (F)', value: 'F' },
        { label: 'YER (﷼)', value: '﷼' },
        { label: 'ZAR (R)', value: 'R' },
        { label: 'ZMK (ZK)', value: 'ZK' },
        { label: 'ZWL (Z$)', value: 'Z$' },
      ],
      checkboxes: [
        {
          name: 'Quick delivery for',
          isChecked: false,
          cost: null,
          var: 'quick_delivery',
        },
        {
          name: 'Express Post',
          isChecked: false,
          cost: null,
          var: 'express_post',
        },
        {
          name: 'Standard Post',
          isChecked: false,
          cost: null,
          var: 'standard_post',
        },
      ],
    };
  }

  componentDidMount() {
    let pic_arr = this.state.photodata;
    for (let i = 0; i < pic_arr.length; i++) {
      pic_arr[i].image = 'NA';
    }
    this.setState({ photodata: pic_arr });

    this.props.navigation.addListener('focus', () => {
      this.getvalue();
      this.getaddress();
      // this.setState({ photodata: photodata });
    });
    // this.getvalue()
  }

  //--------------------------get user detail from local database---------------------//
  getvalue = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('user_details', user_details);
    if (user_details != null) {
      this.setState({
        user_id: user_details.user_id,
      });
    }
  };
  //--------------------------get user selected address---------------------//
  getaddress = async () => {
    if (user_address != '') {
      this.setState({
        location: user_address,
        location2: user_address2,
        latitude: user_address_lat,
        longitude: user_address_long,
      });
    }
  };

  _openCamera = () => {
    mediaprovider.launchCamera().then(obj => {
      consolepro.consolelog('imageobj', obj);
      this.setState({ cameramodalon: false });
      let data = this.state.photodata;
      for (let i = 0; i < data.length; i++) {
        if (data[i].image == 'NA') {
          data[i].image = obj.path;
          break;
        }
      }
      this.setState({
        photodata: data,
      });
    });
  };

  _openGellery = () => {
    mediaprovider.launchGellery().then(obj => {
      consolepro.consolelog('imageobj', obj);
      this.setState({ cameramodalon: false });
      if (obj.mime === 'image/jpeg') {
        let data = this.state.photodata;
        for (let i = 0; i < data.length; i++) {
          if (data[i].image === 'NA') {
            data[i].image = obj.path;

            break;
          }
        }
        this.setState({
          photodata: data,
        });
      }
    });
  };
  //-----------------check already image or not-----------------//
  cameraclcik = (item, index) => {
    if (item.image == 'NA') {
      this.setState({ cameramodalon: true });
    }
  };
  //--------------------------delete images---------------------//
  deleteiamage = index => {
    let data = this.state.photodata;
    data[index].image = 'NA';
    this.setState({
      photodata: data,
    });
  };
  //--------------------------Create new ads---------------------//
  newpostadd = async () => {
    Keyboard.dismiss();
    let user_details = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('user_details', user_details);
    if (user_details != null) {
      let user_id = user_details.user_id;

      if (category_id == '' || category_id == null) {
        msgProvider.toast(validation.emptycategory[config.language], 'center');
        return false;
      }
      let title = this.state.title.trim();
      if (title.length <= 0) {
        msgProvider.toast(validation.emptySellTitle[config.language], 'center');
        return false;
      }
      let budget = this.state.budget.trim();
      if (budget.length <= 0) {
        msgProvider.toast(validation.emptybudget[config.language], 'center');
        return false;
      }
      let description = this.state.specificitem.trim();
      if (description.length <= 0) {
        msgProvider.toast(validation.emptyspecific[config.language], 'center');
        return false;
      }

      if (!this.state.isAgree) {
        msgProvider.toast(
          'You should agree our Terms and Conditions',
          'center',
        );
        return false;
      }
      let image_arr = this.state.photodata;
      let imageavailable = false;
      for (let j = 0; j < image_arr.length; j++) {
        if (image_arr[j].image != 'NA') {
          imageavailable = true;
        }
      }
      // if (imageavailable == false) {
      //     msgProvider.toast(validation.emptyadsimage[config.language], 'center')
      //     return false;
      // }

      let location = user_address;
      let location2 = user_address2;
      if (location.length <= 0) {
        msgProvider.toast(validation.emptyAddress[config.language], 'center');
        return false;
      }

      const info = {};
      const items = [...this.state.checkboxes];

      console.log(JSON.parse(JSON.stringify(info)), 'inf================');
      let url = config.baseURL + 'api/add_new_post.php';
      var data = new FormData();
      data.append('user_id', user_id);
      data.append('category_id', category_id);
      data.append('item_title', title);
      data.append('currency', this.state.currencySelected);
      data.append('price', this.state.budget);
      data.append('address', location);
      data.append('address2', location2);
      data.append('latitude', this.state.latitude);
      data.append('longitude', this.state.longitude);
      data.append('item_description', description);
      data.append('for_sale', '1');
      // data.append("delivery_info", JSON.parse(JSON.stringify(info)));

      items.map(c => {
        data.append(`delivery_info[${c.var}][valid]`, c.isChecked);
        data.append(`delivery_info[${c.var}][price]`, parseFloat(c.cost));
      });
      for (let i = 0; i < image_arr.length; i++) {
        if (image_arr[i].image != 'NA') {
          data.append('ads_image[]', {
            uri: image_arr[i].image,
            type: 'image/jpg',
            name: 'image.jpg',
          });
        }
      }

      consolepro.consolelog('send data', JSON.stringify(data, null, 2));

      apifuntion
        .postApi(url, data)
        .then(obj => {
          consolepro.consolelog(
            'test111',
            JSON.stringify(obj, null, 2),
          );
          if (obj.success == 'true') {
            homerefresh = true;

            msgProvider.toast(obj.msg[config.language], 'center');
            user_address = '';
            user_address2 = '';
            category_id = '';
            this.props.navigation.navigate('Homepage');
          } else {
            if (
              obj.active_status == '0' ||
              obj.msg[config.language] == msgTitle.usernotexit[config.language]
            ) {
              config.checkUserDeactivate(this.props.navigation);
            } else {
              msgProvider.alert(
                msgTitle.information[config.language],
                obj.msg[config.language],
                false,
              );
            }
            return false;
          }
        })
        .catch(err => {
          consolepro.consolelog('err11', err);
        });
    }
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <BannerAd
          // unitId={TestIds.BANNER}
          unitId={
            Platform.OS === 'android'
              ? Constants.admob_android_unit_id
              : Constants.admob_ios_unit_id
          }
          size={BannerAdSize.SMART_BANNER}
        />
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.newcolor1 }} />
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.newcolor1}
          hidden={false}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />

        <Cameragallery
          mediamodal={this.state.cameramodalon}
          Camerapopen={() => {
            this._openCamera();
          }}
          Galleryopen={() => {
            this._openGellery();
          }}
          Canclemedia={() => {
            this.setState({ cameramodalon: false });
          }}
        />

        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: Colors.whiteColor }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView>
            <View
              style={{
                backgroundColor: Colors.newcolor,
                paddingBottom: (windowHeight * 2) / 100,
              }}>
              <View
                style={[
                  CSSstyle.notification_header,
                  {
                    backgroundColor: Colors.newcolor1,
                    elevation: 1,
                    shadowColor: '#000',
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.2,
                    paddingTop: 10,
                    paddingBottom: 10,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ padding: 5, width: 70 }}
                  onPress={() => {
                    this.setState({ photodata: photodata });
                    this.props.navigation.goBack();
                  }}>
                  <Image
                    resizeMode="contain"
                    style={CSSstyle.hole_top_l1}
                    source={localimag.leftarrow}
                  />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center' }}>
                  <Text
                    style={[CSSstyle.Notifications_title, { fontSize: 17 }]}
                    numberOfLines={1}
                  >
                    Post What You're Selling
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingHorizontal: 0 / 100,
                    width: 70,
                  }}>
                  <TouchableOpacity
                    style={{ paddingHorizontal: (windowWidth * 2) / 100 }}
                    onPress={() => {
                      this.newpostadd();
                    }}>
                    <Text style={[styles.edittext1]}>{'Submit'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Selectcategorie');
                  }}
                  style={[
                    styles.mainview,
                    {
                      marginTop: (windowHeight * 0.5) / 100,
                      backgroundColor: Colors.newcolor,
                    },
                  ]}>
                  <Text style={[styles.txtitem1, {}]}>
                    What is the item that you are selling?
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={styles.txtview}>
                      {category_id == '' || category_id == null ? (
                        <Text style={[styles.edittext, {}]}>
                          {this.state.cateagoryname}{' '}
                        </Text>
                      ) : (
                        <Text style={[styles.edittext, {}]}>
                          {categoryname}{' '}
                        </Text>
                      )}
                    </View>
                    <View style={styles.imageview}>
                      <Image
                        style={styles.icon}
                        source={localimag.selectarrowicon}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    paddingHorizontal: 10,
                    backgroundColor: Colors.newcolor1,
                    paddingBottom: 20,
                  }}>
                  <TextInput
                    value={this.state.title}
                    onChangeText={txt => {
                      this.setState({ title: txt });
                    }}
                    keyboardType="default"
                    maxLength={70}
                    returnKeyLabel="done"
                    returnKeyType="done"
                    onSubmitEditing={() => { }}
                    style={[
                      styles.edittext,
                      { height: (windowHeight * 5) / 100 },
                    ]}
                    placeholderTextColor={Colors.lightfontcolor}
                    placeholder={Lang_chg.txtTitle[config.language]}
                  />
                </View>

                <View
                  style={[
                    styles.mainview1,
                    { backgroundColor: Colors.newcolor },
                  ]}>
                  <Text style={[styles.txtitem1, {}]}>
                    What are the specifics of the item you're selling
                  </Text>

                  <View style={{ width: '100%', alignSelf: 'center' }}>
                    <TextInput
                      value={'' + this.state.specificitem + ''}
                      onChangeText={txt => {
                        this.setState({ specificitem: txt });
                      }}
                      keyboardType="default"
                      maxLength={150}
                      multiline={true}
                      returnKeyLabel="done"
                      returnKeyType="done"
                      onSubmitEditing={() => { }}
                      style={[
                        styles.edittext,
                        {
                          textAlignVertical: 'top',
                          height: (windowHeight * 7) / 100,
                        },
                      ]}
                      placeholderTextColor={Colors.lightfontcolor}
                      placeholder={'Enter description'}
                    />
                  </View>
                  <View style={styles.imageview}>
                    <Image
                      style={styles.icon}
                      source={localimag.editarrowicon}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.mainview,
                    {
                      backgroundColor: Colors.newcolor1,
                    },
                  ]}>
                  <Text style={[styles.txtitem1, {}]}>What's your price</Text>

                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <TextInput
                      value={'' + this.state.budget + ''}
                      onChangeText={txt => {
                        this.setState({ budget: txt });
                      }}
                      keyboardType="number-pad"
                      maxLength={70}
                      returnKeyLabel="done"
                      returnKeyType="done"
                      onSubmitEditing={() => { }}
                      style={[
                        styles.edittext,
                        {
                          height: (windowHeight * 5) / 100,
                          marginLeft: '35%',
                          marginTop: 20,
                        },
                      ]}
                      placeholderTextColor={Colors.lightfontcolor}
                      placeholder={'0.00'}
                    />
                  </View>
                </View>

                <DropDownPicker
                  open={this.state.currencyOpen == 1}
                  setOpen={value =>
                    value
                      ? this.setState({ currencyOpen: 1 })
                      : this.setState({ currencyOpen: 0 })
                  }
                  value={this.state.currencySelected}
                  items={this.state.currencyList}
                  listMode="SCROLLVIEW"
                  onSelectItem={item => {
                    this.setState({ currencySelected: item.value });
                  }}
                  // searchable={true}
                  // searchPlaceholder={I18n.t('search.title')}
                  placeholder={'Select Currency'}
                  placeholderStyle={styles.placeholderStyle}
                  style={styles.DropDownPicker}
                  dropDownContainerStyle={[styles.dropDownContainerStyle, {

                  }]}
                  // containerStyle={{ height: 50 }}
                  textStyle={styles.textStyle}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Location');
                  }}
                  style={[
                    styles.mainview,
                    { backgroundColor: Colors.newcolor, zIndex: 0 },
                  ]}>
                  <Text style={[styles.txtitem1, {}]}>
                    Suburb - free pickup location
                  </Text>

                  <View style={[styles.txtview]}>
                    <Text style={[styles.edittext, {}]}>
                      {this.state.location || 'Enter your Suburb'}
                    </Text>
                  </View>
                  <View style={styles.imageview}>
                    <Image
                      style={styles.icon}
                      source={localimag.locationicon}
                    />
                  </View>
                </TouchableOpacity>
                {this.state.checkboxes?.map((c, i) => (
                  <View
                    key={i}
                    style={{
                      marginVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginHorizontal: 13,
                    }}>
                    <TouchableOpacity
                      style={{
                        flex: 2,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        const items = [...this.state.checkboxes];
                        items[i].isChecked = !items[i].isChecked;
                        this.setState({ checkboxes: items });
                      }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderWidth: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 20,
                          borderColor: this.state.checkboxes[i].isChecked
                            ? '#6600ed'
                            : 'lightgray',
                          backgroundColor: this.state.checkboxes[i].isChecked
                            ? '#6600ed'
                            : 'white',
                        }}>
                        <Image
                          source={localimag.check}
                          style={{
                            width: 10,
                            height: 10,
                            marginTop: 3,
                            resizeMode: 'contain',
                            tintColor: 'white',
                          }}
                        />
                      </View>
                      <Text style={{ marginLeft: 10 }}>{c.name}</Text>
                    </TouchableOpacity>
                    <TextInput
                      value={c.cost}
                      onChangeText={txt => {
                        const items = [...this.state.checkboxes];
                        items[i].cost = txt;
                        this.setState({ checkboxes: items });
                      }}
                      keyboardType="number-pad"
                      returnKeyLabel="done"
                      returnKeyType="done"
                      style={[
                        styles.edittext,
                        { height: (windowHeight * 3) / 100, flex: 1 },
                      ]}
                      placeholderTextColor={Colors.lightfontcolor}
                      placeholder={'Enter the cost'}
                    />
                  </View>
                ))}
                <Text
                  style={[
                    styles.txtitem1,
                    {
                      marginTop: (windowHeight * 3) / 100,
                      paddingHorizontal: (windowWidth * 3) / 100,
                    },
                  ]}>
                  Do you have any images as an example?
                </Text>

                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    paddingLeft: 10,
                    alignItems: 'flex-start',
                    marginTop: (windowHeight * 1.2) / 100,
                  }}>
                  <Text style={[styles.edittext, { textAlign: 'left' }]}>
                    {"Upload example photos of what you're selling"}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: Colors.newcolor,
                    paddingHorizontal: (windowWidth * 3) / 100,
                    flexDirection: 'row',
                    width: '100%',
                    alignSelf: 'center',
                    marginTop: (windowHeight * 2) / 100,
                    paddingBottom: (windowHeight * 2) / 100,
                  }}>
                  <FlatList
                    data={this.state.photodata}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          style={{
                            marginHorizontal: (windowWidth * 3) / 100,
                            width: (windowWidth * 18) / 100,
                            height: (windowWidth * 16) / 100,
                          }}
                          onPress={() => {
                            this.cameraclcik(item, index);
                          }}>
                          {item.image == 'NA' ? (
                            <View
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#e3d8d8',
                                justifyContent: 'center',
                              }}>
                              <Image
                                style={{
                                  width: (windowWidth * 4) / 100,
                                  height: (windowWidth * 4) / 100,
                                  resizeMode: 'cover',
                                  alignSelf: 'center',
                                }}
                                source={localimag.plus}
                              />
                            </View>
                          ) : (
                            <View
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#e3d8d8',
                                justifyContent: 'center',
                              }}>
                              <ImageBackground
                                imageStyle={{}}
                                style={{
                                  width: (windowWidth * 18) / 100,
                                  height: (windowWidth * 16) / 100,
                                  resizeMode: 'cover',
                                  alignSelf: 'center',
                                }}
                                source={{ uri: item.image }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.deleteiamage(index);
                                  }}>
                                  <Image
                                    style={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: 50,
                                      alignSelf: 'flex-end',
                                    }}
                                    source={localimag.crossicon}
                                  />
                                </TouchableOpacity>
                              </ImageBackground>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    marginTop: 30,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({ isAgree: !this.state.isAgree });
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 3,
                      borderColor: this.state.isAgree ? '#6600ed' : 'lightgray',
                      backgroundColor: this.state.isAgree ? '#6600ed' : 'white',
                    }}>
                    <Image
                      source={localimag.check}
                      style={{
                        width: 10,
                        height: 10,
                        marginTop: 3,
                        resizeMode: 'contain',
                        tintColor: 'white',
                      }}
                    />
                  </View>
                  <Text style={{ marginLeft: 10 }}>
                    I agree to the{' '}
                    <Text style={{ textDecorationLine: 'underline' }}>
                      Terms of Service
                    </Text>{' '}
                    and{' '}
                    <Text style={{ textDecorationLine: 'underline' }}>
                      Privacy Policy
                    </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.newpostadd();
                  }}
                  style={[
                    CSSstyle.mainbutton,
                    { marginTop: (windowHeight * 10) / 100 },
                  ]}>
                  <Text style={styles.txtlogin}>
                    {Lang_chg.submit[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  edittext: {
    fontSize: (windowWidth * 3.4) / 100,
    width: '50%',
    paddingVertical: (windowWidth * 0.1) / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.lightfontcolor,
  },
  edittext1: {
    fontSize: (windowWidth * 3.5) / 100,
    paddingVertical: (windowWidth * 0.1) / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.theme_color1,
  },

  img: {
    width: (windowWidth * 24) / 100,
    height: (windowWidth * 24) / 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  txtlogin: {
    fontSize: (windowWidth * 3.8) / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.whiteColor,
    alignSelf: 'center',
  },
  mainview1: {
    paddingHorizontal: (windowWidth * 3) / 100,
    width: '100%',
    height: (windowHeight * 13) / 100,
    paddingVertical: (windowHeight * 1.5) / 100,
    backgroundColor: Colors.newcolor1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  mainview: {
    paddingHorizontal: (windowWidth * 3) / 100,
    height: (windowHeight * 13) / 100,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  imageview: {
    width: '10%',
    paddingTop: (windowHeight * 0.6) / 100,
    alignItems: 'center',
  },
  txtview: {
    width: '100%',
    paddingVertical: (windowHeight * 1) / 100,
    alignSelf: 'center',
  },

  icon: {
    width: (windowWidth * 4) / 100,
    height: (windowWidth * 4) / 100,
    resizeMode: 'cover',
    alignSelf: 'center',
  },

  txteditemail: {
    paddingVertical: (windowHeight * 0.1) / 100,
    fontSize: (windowWidth * 3.7) / 100,
    width: '100%',
    fontFamily: Font.Poppins_Bold,
    color: Colors.lightfontcolor,
  },
  txtitem: {
    width: '100%',
    paddingVertical: (windowWidth * 0.1) / 100,
    fontSize: (windowWidth * 4.4) / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.blackColor,
    alignSelf: 'flex-start',
    marginHorizontal: (windowWidth * 0) / 100,
  },
  txtitem1: {
    width: '100%',
    paddingVertical: (windowWidth * 0.1) / 100,
    fontSize: (windowWidth * 3.8) / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.blackColor,
    alignSelf: 'flex-start',
    marginHorizontal: (windowWidth * 0) / 100,
  },
  ///////////////////////////////////////////////////////
  DropDownPicker: {
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.greyColor,
    marginVertical: 3,
    width: '30%',
    marginLeft: (windowWidth * 3) / 100,
    marginTop: -60,
    // backfaceVisibility: 'visible',
    backgroundColor: '#00000000',
  },
  placeholderStyle: {
    // color: Colors.dark_grey,
    fontFamily: Font.Poppins_Regular,
    fontSize: 12,
  },
  dropDownContainerStyle: {
    marginTop: -60,
    // height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.greyColor,
    backgroundColor: Colors.whiteColor,
    elevation: 1000,
    zIndex: 10,
    // width: 80,
    width: '25%',
    marginLeft: (windowWidth * 3) / 100,
    // marginRight: 200,
    // left: 20,
    // right: 20,
  },
  textStyle: {
    fontFamily: Font.Poppins_Regular,
    fontSize: 12,
    color: Colors.blackColor,
  },
});
