import React, { Component } from 'react'
import {
  RefreshControl,
  I18nManager,
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
  handleback,
  Currentltlg,
} from './Provider/utilslib/Utils';
import CSSstyle from './css';
import Footer from './Provider/Footer';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';

import {
  InterstitialAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
} from '@react-native-firebase/admob';
var counter = 0;
import { categoryDefaultData } from './CategoryDefaultData';
import { Constants } from './utils/constants';
global.main_category_arr = '';
global.check_notification_num = 0;
global.match_price = 0;
global.ads_id = 0;
global.homerefresh = false;
global.current_detail_product = [];
export default class Homepage extends Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      check_cart_num: 0,
      user_id: 0,

      new_item: 'NA',
      category_arr: categoryDefaultData?.data,
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          handleback.handleBackPress,
        ),
    );
  }
  componentDidMount() {
    user_address = '';
    user_address_lat = '';
    user_address_long = '';
    categoryname = '';
    category_id = '';

    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleback.handleBackPress,
        ),
    );
    this.props.navigation.addListener('focus', () => {
      if (homerefresh == true) {
        this.getvalue();
      }
    });

    this.getvalue();
  }
  //------------------Get Notification player id---------------------------//
  onIds(device) {
    consolepro.consolelog('Device info: ', device);
    this.setState({
      player_id: device.userId,
    });
  }
  //------------------Open Notification---------------------------//
  onOpened = async openResult => {
    consolepro.consolelog('openResult: ', openResult);
    try {
      var datajson =
        openResult.notification.payload.additionalData.p2p_notification
          .action_json;
      var action_id = datajson.action_id;
      var action = datajson.action;
      var userdata = await localStorage.getItemObject('user_arr');

      if (userdata != null) {
        if (action == 'edit_ads') {
          this.props.navigation.navigate('Itemdetail', { ads_id: action_id });
        }
        if (
          action == 'reject_offer' ||
          action == 'accept_offer' ||
          action == 'accept_offer_user' ||
          action == 'edit_offer' ||
          action == 'send_offer'
        ) {
          this.props.navigation.navigate('Accept_reject_offer', {
            offer_id: action_id,
          });
        }
      } else {
        this.props.navigation.navigate('Login');
      }
    } catch (error) {
      consolepro.consolelog('error: ', error);
    }
  };

  //------------------Get User_details---------------------------//
  getvalue = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('user_details', user_details);
    if (user_details != null) {
      this.setState({
        user_id: user_details.user_id,
      });
    }
    const categoryData =
      (await localStorage.getItemObject('categoryData')) || 'NA';
    consolepro.consolelog('Home categoryDefaultData', categoryDefaultData);
    consolepro.consolelog('Home categoryData', categoryData);
    main_category_arr = categoryData?.data || categoryDefaultData?.data;
    this.setState({
      category_arr: categoryData?.data || categoryDefaultData?.data,
    });
    this.gethomedata();
  };
  //------------------Get All home Data---------------------------//
  gethomedata = async () => {
    let user_id = 0;
    let user_details = await localStorage.getItemObject('user_arr');
    if (user_details != null) {
      user_id = user_details.user_id;
      this.setState({
        user_id: user_details.user_id,
      });
    }

    let url = config.baseURL + 'home_data.php?user_id=' + user_id;
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url)
      .then(obj => {
        if (obj.success == 'true') {
          consolepro.consolelog('homedata', obj);

          (check_notification_num = obj.check_notification_num),
            //main_category_arr = obj.category_arr
            (config.content_arr = obj.content_arr);
          if (config.device_type == 'ios') {
            config.guest_status = obj.guest_status;
          } else {
            config.guest_status = false;
          }

          localStorage.setItemObject('user_arr', obj.user_details);
          console.log(obj, '-------------------------------');
          this.setState({
            //category_arr: obj.category_arr,
            new_item: obj.all_product,
          });
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
        consolepro.consolelog('err', err);
      });
  };
  //------------------Get Pull to refresh Data---------------------------//
  refreshdata = async () => {
    let user_id = 0;
    let user_details = await localStorage.getItemObject('user_arr');
    if (user_details != null) {
      user_id = user_details.user_id;
    }
    let url = config.baseURL + 'home_data.php?user_id=' + user_id;
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url, 1)
      .then(obj => {
        this.setState({ refresh: false });
        if (obj.success == 'true') {
          consolepro.consolelog('homedata', obj);

          (check_notification_num = obj.check_notification_num),
            //main_category_arr = obj.category_arr
            (config.content_arr = obj.content_arr);
          if (config.device_type == 'ios') {
            config.guest_status = obj.guest_status;
          } else {
            config.guest_status = false;
          }
          this.setState({
            //category_arr: obj.category_arr,

            new_item: obj.all_product,
          });
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
        consolepro.consolelog('err', err);
        this.setState({ refresh: false });
      });
  };
  //------------------Call Pull to refresh---------------------------//
  _onRefresh = async () => {
    this.setState({
      refresh: true,
    });
    setTimeout(() => {
      this.refreshdata();
    }, 200);
  };

  finishtime = index => {
    let data = this.state.new_item;
    data[index].recent_time = 'NA';
    this.setState({ new_item: data });
  };
  //-----------------go to detail page-------------------//
  godetailpage = (item, index) => {
    this.props.navigation.navigate('Itemdetail', { ads_id: item.ads_id });
  };
  //-------------------open notification screen------------------------//
  opennotification = () => {
    if (this.state.user_id == 0) {
      config.user_login_first(this.props.navigation);
    } else {
      this.props.navigation.navigate('Notification');
    }
  };
  //-------------------open notification screen------------------------//
  myoffer = () => {
    if (this.state.user_id == 0) {
      config.user_login_first(this.props.navigation);
    } else {
      this.props.navigation.navigate('Myoffer');
    }
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.newcolor }}>
        <SafeAreaView
          style={{ flex: 0, backgroundColor: Colors.newcolor }}
        />
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.newcolor}
          hidden={false}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />
        <ScrollView
          style={{}}
          ref={c => {
            this.scroll = c;
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this._onRefresh}
            />
          }>
          <BannerAd
            // unitId={TestIds.BANNER}
            unitId={
              Platform.OS === 'android'
                ? Constants.admob_android_unit_id
                : Constants.admob_ios_unit_id
            }
            size={BannerAdSize.SMART_BANNER}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.newcolor,
              paddingBottom: (windowHeight * 8) / 100,
            }}>
            <View style={CSSstyle.notification_header}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ justifyContent: 'center' }}
                onPress={() => {
                  this.opennotification();
                }}>
                {check_notification_num <= 0 ? (
                  <Image
                    resizeMode="contain"
                    style={CSSstyle.icons}
                    source={localimag.notificationicon}
                  />
                ) : (
                  <Image
                    resizeMode="contain"
                    style={CSSstyle.icons}
                    source={localimag.notificationss}
                  />
                )}
              </TouchableOpacity>
              <View style={{ justifyContent: 'center' }}>
                {/* <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.home[config.language]}</Text> */}

                <Text
                  style={[
                    CSSstyle.Notifications_title,
                    { color: Colors.theme_color1 },
                  ]}>
                  {'A I R S E E K R'}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ justifyContent: 'center' }}
                onPress={() => {
                  this.myoffer();
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    width: (windowWidth * 7) / 100,
                    height: (windowWidth * 7) / 100,
                    resizeMode: 'contain',
                  }}
                  source={localimag.blackoffericon}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingHorizontal: (windowWidth * 5.5) / 100,
                marginTop: (windowHeight * 2.3) / 100,
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.txtitem1, { color: Colors.blackColor }]}>
                {Lang_chg.adscategory[config.language]}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Allcategories');
                }}
                style={{
                  justifyContent: 'center',
                  paddingLeft: (windowWidth * 2.5) / 100,
                }}>
                <Text
                  style={[styles.txtitem11, { color: Colors.red_color }]}>
                  {Lang_chg.viewall[config.language]}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                justifyContent: 'center',
                marginTop: (windowHeight * 1) / 100,
                marginHorizontal: (windowWidth * 5) / 100,
                paddingLeft: (windowWidth * 1) / 100,
              }}>
              {this.state.category_arr != 'NA' && (
                <FlatList
                  data={this.state.category_arr}
                  horizontal={true}
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  inverted={false}
                  renderItem={({ item, index }) => {
                    if (index <= 4) {
                      const sourceImg =
                        item.image?.toString().indexOf('file://') > -1
                          ? { uri: item.image }
                          : item.image;
                      consolepro.consolelog('sourceUmgx', sourceImg);
                      return (
                        <View
                          key={item.category_id?.toString()}
                          style={{
                            width: (windowWidth * 18.3) / 100,
                            alignItems: 'center',
                            marginTop: (windowHeight * 0.5) / 100,
                            marginRight: (windowWidth * 4.2) / 100,
                            marginLeft: 2,
                          }}>
                          {index < 4 && (
                            <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.navigate(
                                  'Categorywise',
                                  {
                                    category_name: item.category_name,
                                    category_id: item.category_id,
                                  },
                                );
                              }}
                              style={{
                                shadowColor: '#000',
                                shadowOffset: {
                                  width: 2,
                                  height: 2,
                                },
                                shadowOpacity: 0.2,
                                elevation: 1,
                                width: (windowWidth * 18.3) / 100,
                                height: (windowHeight * 14) / 100,
                                alignItems: 'center',
                                borderColor: Colors.lightfontcolor,
                                borderWidth: 0,
                                borderRadius: 0,
                                justifyContent: 'center',
                                backgroundColor: Colors.newcolor1,
                                marginBottom: 2,
                              }}>
                              <View
                                style={{
                                  width: (windowWidth * 10) / 100,
                                  height: (windowWidth * 11) / 100,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                {/*<Image style={[{ width: windowWidth * 9 / 100, height: windowWidth * 11 / 100, resizeMode: 'contain', }]} source={{ uri: config.img_url3 + item.image }}></Image>*/}
                                <Image
                                  style={[
                                    {
                                      width: (windowWidth * 9) / 100,
                                      height: (windowWidth * 11) / 100,
                                      resizeMode: 'contain',
                                    },
                                  ]}
                                  source={sourceImg}
                                />
                              </View>
                              <Text
                                numberOfLines={1}
                                style={styles.txtitem2}>
                                {item.category_name}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    }
                  }}
                  keyExtractor={index => {
                    index.toString();
                  }}
                />
              )}
            </View>
            <View
              style={{
                paddingHorizontal: (windowWidth * 5.5) / 100,
                marginTop: (windowHeight * 2) / 100,
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.txtitem1, { color: Colors.blackColor }]}>
                {Lang_chg.recentAds[config.language]}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Alllisting');
                }}
                style={{
                  justifyContent: 'center',
                  paddingLeft: (windowWidth * 2.5) / 100,
                }}>
                <Text
                  style={[styles.txtitem11, { color: Colors.red_color }]}>
                  {Lang_chg.viewall[config.language]}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                paddingBottom: (windowHeight * 1) / 100,
                marginTop: (windowHeight * 1) / 100,
                paddingHorizontal: (windowWidth * 4) / 100,
              }}>
              {this.state.new_item != 'NA' && (
                <FlatList
                  data={this.state.new_item}
                  numColumns={2}
                  style={{ width: '100%', alignSelf: 'center' }}
                  showsHorizontalScrollIndicator={false}
                  inverted={false}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this.godetailpage(item, index);
                        }}
                        style={{
                          width: '46.5%',
                          backgroundColor: Colors.newcolor1,
                          elevation: 2,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 2,
                            height: 2,
                          },
                          shadowOpacity: 0.2,
                          alignItems: 'center',
                          alignSelf: 'center',
                          marginHorizontal: '2.5%',
                          marginBottom: (windowHeight * 1) / 100,
                          marginTop: (windowHeight * 1) / 100,
                          borderRadius: 5,
                        }}>
                        <View
                          style={{
                            position: 'absolute',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            backgroundColor:
                              item.for_sale === 0 ? '#100dc9' : '#c90d0d',
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12,
                            top: 10,
                            right: 0,
                            zIndex: 20,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Poppins_Bold,
                              color: 'white',
                              fontSize: 10,
                            }}>
                            {item.for_sale === 0
                              ? 'LOOKING FOR'
                              : 'FOR SALE'}
                          </Text>
                        </View>

                        <View
                          style={{
                            borderRadius: 5,
                            backgroundColor: Colors.border_color,
                            width: '100%',
                            height: (windowHeight * 17) / 100,
                            backgroundColor: Colors.newcolor1,
                          }}>
                          {/* <ImageBackground source={{ uri: config.img_url2 + item.product_detail.image[0].image }} imageStyle={{ borderRadius: 10, }} style={{ width: '100%', height: windowHeight * 27 / 100, backgroundColor: Colors.white_light }} > */}
                          <ImageBackground
                            source={
                              item.image_arr != 'NA'
                                ? {
                                  uri:
                                    config.img_url2 +
                                    item.image_arr[0].image,
                                }
                                : localimag.nopreview
                            }
                            imageStyle={{
                              resizeMode: 'cover',
                              borderTopLeftRadius: 5,
                              borderTopRightRadius: 5,
                            }}
                            style={{
                              width: '100%',
                              height: (windowHeight * 17) / 100,
                              backgroundColor: Colors.white_light,
                            }}>
                            <View
                              style={{
                                width: '100%',
                                flexDirection: 'row',
                                padding: (windowHeight * 1) / 100,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            />
                          </ImageBackground>
                        </View>

                        <View
                          style={{
                            marginLeft: (windowWidth * 3) / 100,
                            height: (windowHeight * 9) / 100,
                            width: '100%',
                            paddingTop: (windowHeight * 1) / 100,
                          }}>
                          <Text numberOfLines={2} style={styles.txtitem}>
                            {item.ads_title}
                          </Text>
                          <Text numberOfLines={1} style={[styles.txtadd]}>
                            {item.address}
                          </Text>
                        </View>
                        <Text style={styles.txtprice}>$ {item.price}</Text>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={index => {
                    index.toString();
                  }}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <Footer
          navigation={this.props.navigation}
          page={'home'}
          user_id={this.state.user_id}
          chatcount={count_inbox}
        />
      </View>
    );
  }
}



const styles = StyleSheet.create({

  txtitem1: {
    fontSize: windowWidth * 5.5 / 100, fontFamily: Font.Poppins_Bold,
  },
  txtitem11: {
    fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold,
  },
  txtitem2: {
    fontSize: windowWidth * 2.8 / 100, marginTop: windowHeight * 0 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, paddingHorizontal: 2
  },
  txtitem3: {
    fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1, alignSelf: 'flex-end', marginHorizontal: windowWidth * 1.2 / 100
  },
  txtitem: {
    fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: windowWidth * 1.2 / 100
  },
  txtprice: {
    marginLeft: windowWidth * 3 / 100, paddingBottom: 3, fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'flex-start', marginHorizontal: windowWidth * 1.5 / 100
  },
  txtadd: {
    fontSize: windowWidth * 2.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1, alignSelf: 'flex-start', marginHorizontal: windowWidth * 1.5 / 100
  },
  count: {





  },
  banertext: { alignSelf: 'flex-end', paddingHorizontal: windowWidth * 7 / 100, justifyContent: 'center', height: windowHeight * 20 / 100, alignItems: 'center' },
  banertext1: { alignSelf: 'flex-start', paddingHorizontal: windowWidth * 7 / 100, justifyContent: 'center', height: windowHeight * 20 / 100, alignItems: 'center' },


  txttime: {
    fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.whiteColor, marginHorizontal: 5, alignSelf: 'center', marginTop: 1
  },

  Notifications_title: {
    fontFamily: Font.Poppins_SemiBold,
    fontSize: windowWidth * 5 / 100,
    color: Colors.blackColor,
    alignSelf: 'center'
  },
  icons: {
    width: windowWidth * 7 / 100,
    height: windowWidth * 7 / 100,
    resizeMode: 'contain'
  },

  txtitem4: {
    fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor, alignSelf: 'center'
  },
});



