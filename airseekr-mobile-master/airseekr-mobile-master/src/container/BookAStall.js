import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../Provider/Colorsfont';
import Header from './components/Header';
import {
  apifuntion,
  config,
  consolepro,
  localStorage,
  msgProvider,
  msgTitle,
  notification,
  slugConverter,
  SocialLogin,
  validation,
} from '../Provider/utilslib/Utils';

import messaging from '@react-native-firebase/messaging';
import { firebaseprovider } from '../Provider/FirebaseProvider';
import { localimag } from '../Provider/Localimage';
import moment from 'moment';
import { Languageprovider } from '../Provider/Languageprovider';

const MARKETS = ['lizard-log-markets', 'blacktown-markets'];

import {
  InterstitialAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
} from '@react-native-firebase/admob';
import { Constants } from '../utils/constants';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class BookAStall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      email: null,
      password: null,
      userDetail: '',
      events: [],
      eventsSelected: [],
      marketSelected: MARKETS[1],
      dateSelected: '',
    };
  }

  async componentDidMount() {
    // await this.checkSocial();
    await this.authenticateSession();
    await this.getEvent();
    this.props.navigation.addListener('focus', async () => {
      await this.authenticateSession();
    });
  }

  authenticateSession = async () => {
    let skip_status = await localStorage.getItemObject('skip_status');
    let user_login = await localStorage.getItemObject('user_login');
    let user_details = await localStorage.getItemObject('user_arr');

    this.setState({
      isLoggedIn: user_login && user_details,
      userDetail: user_details,
    });
  };

  login = () => {
    Keyboard.dismiss();
    let email = this.state.email?.trim();
    if (email?.length <= 0) {
      msgProvider.toast(validation.emptyEmail[config.language], 'center');

      return false;
    }
    if (config.regemail.test(email) !== true) {
      msgProvider.toast(validation.validEmail[config.language], 'center');
      return false;
    }

    let password = this.state.password?.trim();
    if (password?.length <= 0) {
      msgProvider.toast(validation.emptyPassword[config.language], 'center');
      return false;
    }
    if (password.length <= 5) {
      msgProvider.toast(validation.lengthPassword[config.language], 'center');
      return false;
    }

    let url = config.baseURL + 'login.php';
    const data = new FormData();

    data.append('email', this.state.email);
    data.append('password', this.state.password);
    data.append('action', 'normal');
    data.append('device_type', config.device_type);
    data.append('player_id', player_id_me1);
    apifuntion
      .postApi(url, data)
      .then(async obj => {
        consolepro.consolelog('url:', url);
        if (obj.success === 'true') {
          const user_details = obj.user_details;
          localStorage.setItemObject('user_arr', user_details);
          const formData = new FormData();
          const fcmToken = await messaging().getToken();
          formData.append('user_id', user_details.user_id);
          formData.append('app_device_token', fcmToken);
          const tokenUrl = config.baseURL + 'api/update_user_device_token.php';

          apifuntion
            .postApi(tokenUrl, formData)
            .then(obj => {})
            .catch(err => {
              consolepro.consolelog('err===========', err);
            });
          const uservalue = {
            login_type: user_details.login_type,
            email: this.state.email,
            password: password,
          };
          localStorage.setItemObject('user_login', uservalue);
          this.setState({ userotp: user_details.otp });
          if (user_details.otp_verify == 0) {
            setTimeout(() => {
              if (obj.showotp == true) {
                this.setState({ otpstatus: user_details.otp });
              }

              this.setState({ show: true, user_id: user_details.user_id });
              this.onButtonStart();
            }, 100);
          } else {
            if (obj.notification_arr != 'NA') {
              notification.notification_arr(obj.notification_arr);
            }
            this.setState({ email: '', password: '' });
            await localStorage.setItemObject('skip_status', 'yes');
            await firebaseprovider.firebaseUserCreate();
            await firebaseprovider.getMyInboxAllData();
          }
          await this.authenticateSession();
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

  checkSocial = async () => {
    let user_login = await localStorage.getItemObject('user_login');
    if (user_login != null) {
      if (user_login.login_type == 'google') {
        localStorage.setItemObject('user_login', null);
        SocialLogin.socaillogout('google', this.props.navigation);
      }
      if (user_login.login_type == 'facebook') {
        localStorage.setItemObject('user_login', null);
        SocialLogin.socaillogout('facebook', this.props.navigation);
      }
    }
  };

  avatar = () => {
    let imagePath = '',
      coverImage = '';
    const user_details = this.state.userDetail;
    if (user_details?.image && user_details?.image != 'NA') {
      imagePath = config.img_url1 + user_details.image;
    }
    if (user_details?.cover_image && user_details?.cover_image != 'NA') {
      coverImage = config.img_url2 + user_details.cover_image;
    }

    return { imagePath, coverImage };
  };

  getEventDetail = (tickets, eventId: number) => {
    let url =
      config.baseAPI + `event/${eventId}?market=${encodeURI(tickets.venue)}`;
    consolepro.consolelog('getEventDetail url', url);
    apifuntion
      .getApi(url)
      .then(obj => {
        consolepro.consolelog('getEventDetail', obj);
        if (obj.success === 'true' && obj.data?.tickets?.length) {
          if (obj.data?.tickets?.length) {
            this.props.navigation.navigate('Ticket', {
              tickets: obj.data?.tickets,
              event: {
                id: tickets.id,
                name: tickets.name,
                dateEvent: tickets.dateEvent,
                venue: tickets.venue,
                start_time: tickets.start_time,
              },
            });
          } else {
            Alert.alert(
              msgTitle.empty_ticket_title[config.language],
              msgTitle.empty_ticket_content[config.language],
              [
                {
                  text: msgTitle.ok[config.language],
                },
              ],
              { cancelable: false },
            );
          }
        } else {
          //this.setState({ events: null });
        }
        this.setState({ refresh: false });
      })
      .catch(err => {
        consolepro.consolelog('err', err);
        this.setState({ events: null });
        this.setState({ refresh: false });
      });
  };
  getEvent = () => {
    let url = config.baseAPI + 'events';
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success === 'true' && obj.data?.length) {
          const eventData = obj.data;
          for (const row of eventData) {
            row.venueSlug = slugConverter(row.venue);
            row.dateEvent = row.name?.replace(`${row.venue}`, '')?.trim();
          }

          //tickets?.allRegistrants?.length
          const eventsSelected = eventData.filter(
            e => e.venueSlug === this.state.marketSelected,
          );

          this.setState({
            events: eventData,
            eventsSelected,
            dateSelected: eventsSelected[0]?.dateEvent,
          });
        } else {
          this.setState({ events: null });
        }
        this.setState({ refresh: false });
      })
      .catch(err => {
        consolepro.consolelog('err', err);
        this.setState({ events: null });
        this.setState({ refresh: false });
      });
  };

  marketChoose = market => {
    const eventsSelected = this.state.events.filter(
      e => e.venueSlug === market,
    );
    this.setState({ marketSelected: market, dateSelected: '', eventsSelected });
  };

  gotoTicket = (dateSelected: any = null) => {
    let tickets = this.state.events.filter(
      e => e.venueSlug === this.state.marketSelected,
    );

    if (!tickets || !tickets?.length) {
      return;
    }

    dateSelected = dateSelected || this.state.dateSelected;
    if (!dateSelected) {
      dateSelected = this.state.eventsSelected[0]?.dateEvent;
    }

    tickets = this.state.events.find(e => e.dateEvent === dateSelected);
    this.getEventDetail(tickets, tickets?.id);
  };

  renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ dateSelected: item.dateEvent });
          this.gotoTicket(item.dateEvent);
        }}
        style={[
          styles.dateItem,
          this.state.dateSelected?.localeCompare(item.dateEvent) === 0 ||
          (index === 0 && !this.state.dateSelected)
            ? styles.dateSelected
            : null,
        ]}>
        <Text style={styles.dateLabel}>
          {moment(item.dateEvent, 'Do of MMMM, YYYY').format('MMM, Do-YY')}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const avatar = this.avatar();
    return (
      <View style={styles.container}>
        <BannerAd
          // unitId={TestIds.BANNER}
          unitId={
            Platform.OS === 'android'
              ? Constants.admob_android_unit_id
              : Constants.admob_ios_unit_id
          }
          size={BannerAdSize.SMART_BANNER}
        />
        <Header
          backOnPress={() => this.props.navigation.goBack()}
          title={Languageprovider.t('BOOKASTALL', language_key)}
          nextOnPress={() => this.gotoTicket(this.state.dateSelected)}
        />
        <View style={styles.bannerImg}>
          <Image
            style={styles.backgroundBannerImage}
            source={require('../assets/book-a-stall2.png')}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.body}>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={styles.bodyContent}>
              {this.state.isLoggedIn ? (
                <View style={styles.profile}>
                  <Text style={styles.welcome}>
                    {Languageprovider.t('WELCOME', language_key)}
                  </Text>
                  <View style={styles.profileInfo}>
                    <Image
                      style={styles.avatar}
                      source={
                        avatar.imagePath?.length > 10
                          ? { uri: avatar.imagePath }
                          : require('../assets/default-avatar.png') //localimag.user_profile1
                      }
                    />
                    <Text style={styles.profileName}>
                      {this.state.userDetail.name}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.signup}>
                  <Text style={styles.signupTitle}>
                    {Languageprovider.t('SIGNINSIGNUP', language_key)}
                  </Text>
                  <View style={styles.signupForm}>
                    <TextInput
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoCompleteType="email"
                      onChangeText={email => this.setState({ email })}
                      style={styles.signupInput}
                      placeholder={'email'}
                      placeholderTextColor={Colors.colorTicketDescription}
                    />
                    <TextInput
                      onChangeText={password => this.setState({ password })}
                      secureTextEntry={true}
                      style={styles.signupInput}
                      placeholder={'password'}
                      placeholderTextColor={Colors.colorTicketDescription}
                    />
                  </View>
                  <Text style={styles.orUse}>
                    {Languageprovider.t('ORUSE', language_key)}
                  </Text>

                  <View style={styles.social}>
                    <TouchableOpacity
                      style={styles.socialItem}
                      onPress={async () => {
                        SocialLogin.Socialfunction(
                          this.props.navigation,
                          'google',
                          'google',
                          async res => {
                            await this.authenticateSession();
                          },
                        );
                      }}>
                      <Image
                        resizeMode={'contain'}
                        style={{
                          width: 30,
                          height: 30,
                          alignSelf: 'center',
                        }}
                        source={require('../assets/Google.png')}
                        width={30}
                        height={30}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.socialItem}
                      onPress={async () => {
                        SocialLogin.Socialfunction(
                          this.props.navigation,
                          'facebook',
                          'facebook',
                          async res => {
                            await this.authenticateSession();
                          },
                        );
                      }}>
                      <Image
                        resizeMode={'contain'}
                        style={{
                          width: 30,
                          height: 30,
                          alignSelf: 'center',
                        }}
                        source={require('../assets/facebook.png')}
                        width={30}
                        height={30}
                      />
                    </TouchableOpacity>

                    {Platform.OS === 'ios' &&
                      parseInt(Platform.Version) >= 13 && (
                        <TouchableOpacity
                          style={styles.socialItem}
                          onPress={async () => {
                            SocialLogin.Socialfunction(
                              this.props.navigation,
                              'apple',
                              'apple',
                              async res => {
                                await this.authenticateSession();
                              },
                            );
                          }}>
                          <Image
                            resizeMode={'contain'}
                            style={{
                              width: 30,
                              height: 30,
                              alignSelf: 'center',
                            }}
                            source={require('../assets/apple-login.png')}
                            width={35}
                            height={35}
                          />
                        </TouchableOpacity>
                      )}
                  </View>
                  <TouchableOpacity
                    style={styles.signupButton}
                    onPress={this.login}>
                    <Text style={styles.signupButtonLabel}>
                      {Languageprovider.t('SIGNIN', language_key)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.chooseMarketplace}>
                <Text style={styles.marketplaceTitle}>
                  {Languageprovider.t('CHOOSEMARKETPLACE', language_key)}
                </Text>
                <View style={styles.marketplaceList}>
                  {/*<TouchableOpacity*/}
                  {/*  onPress={() => this.marketChoose(MARKETS[0])}*/}
                  {/*  style={[*/}
                  {/*    styles.marketplaceImageBlock,*/}
                  {/*    this.state.marketSelected.localeCompare(MARKETS[0]) === 0*/}
                  {/*      ? styles.borderSelected*/}
                  {/*      : null,*/}
                  {/*  ]}>*/}
                  {/*  <Image*/}
                  {/*    style={styles.marketplaceImage}*/}
                  {/*    resizeMode={'contain'}*/}
                  {/*    source={require('../assets/lizard-market.png')}*/}
                  {/*  />*/}
                  {/*</TouchableOpacity>*/}
                  {/*<View style={styles.sepration} />*/}
                  <TouchableOpacity
                    onPress={() => this.marketChoose(MARKETS[1])}
                    style={[
                      styles.marketplaceImageBlock,
                      this.state.marketSelected.localeCompare(
                        MARKETS[1],
                      ) === 0
                        ? styles.borderSelected
                        : null,
                    ]}>
                    <Image
                      style={styles.marketplaceImage}
                      resizeMode={'contain'}
                      source={require('../assets/cropped-designcrowd.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.chooseDate}>
                <Text style={styles.dateTitle}>
                  {Languageprovider.CHOOSEADATE[language_key]}
                </Text>
                <View style={styles.dateList}>
                  {this.state.eventsSelected?.length ? (
                    <FlatList
                      data={this.state.eventsSelected}
                      extraData={this.state}
                      keyExtractor={item => item.id}
                      renderItem={this.renderItem}
                      numColumns={2}
                      columnWrapperStyle={styles.dateRow}
                    />
                  ) : (
                    <Text style={styles.noDataFound}>No date found</Text>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorTicketBlue01,
  },
  bannerImg: {
    width: windowWidth,
    height: (467 / 1240) * windowWidth,
  },
  backgroundBannerImage: {
    width: windowWidth,
    height: (467 / 1240) * windowWidth,
    borderWidth: 0,
    alignSelf: 'center',
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -10,
    backgroundColor: Colors.whiteColor,
    padding: 15,
  },
  bodyContent: {
    flex: 1,
  },
  profile: { marginTop: 5 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  profileName: { marginLeft: 15 },
  welcome: { fontWeight: 'bold', fontSize: 20 },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 10,
  },
  chooseMarketplace: { marginTop: 30 },
  marketplaceList: {
    flexDirection: 'row',
    maxHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketplaceImageBlock: {
    borderRadius: 5,
    backgroundColor: Colors.colorTicket,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: (0.43 * windowWidth * 1) / 2,
    width: 0.9 * windowWidth,
  },
  marketplaceImage: {
    maxHeight: (0.43 * windowWidth * 1) / 2,
    flex: 1,
  },
  borderSelected: {
    borderWidth: 1.5,
    borderColor: Colors.colorTicketSelected,
  },
  marketplaceTitle: { fontWeight: 'bold', fontSize: 20, marginBottom: 20 },
  dateTitle: { fontWeight: 'bold', fontSize: 20 },
  dateSelected: {
    backgroundColor: Colors.colorTicketSelected,
  },
  dateLabel: {
    fontWeight: 'normal',
    fontSize: 19,
    color: Colors.whiteColor,
    textAlign: 'center',
  },
  dateList: {
    marginTop: 15,
    padding: 5,
  },
  dateItem: {
    flex: 0.5,
    maxWidth: Dimensions.get('window').width / 2,
    borderRadius: 5,
    backgroundColor: Colors.colorDateItem,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    height: (0.45 * windowWidth * 1) / 2,
  },
  chooseDate: {
    flex: 1,
    marginTop: 30,
  },
  dateRow: {
    flex: 1,
    justifyContent: 'space-around',
  },
  signup: {},
  signupTitle: { fontWeight: 'bold', fontSize: 20 },
  signupForm: { padding: 10 },
  social: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  socialItem: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.colorTicket,
    marginRight: 15,
    borderRadius: 4,
  },
  orUse: { textAlign: 'center' },
  signupInput: {
    backgroundColor: Colors.colorTicketItem,
    padding: 6,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.colorTicket,
    textTransform: 'lowercase',
    color: Colors.blackColor,
  },
  signupButton: {
    borderRadius: 20,
    height: 45,
    backgroundColor: Colors.red_color,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 10,
    flex: 1,
  },
  signupButtonLabel: {
    color: Colors.whiteColor,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  sepration: {
    width: '5%',
  },
  noDataFound: {
    borderColor: Colors.colorTicketButtonRed,
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
  },
});
