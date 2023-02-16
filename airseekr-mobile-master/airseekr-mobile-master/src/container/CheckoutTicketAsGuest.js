import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
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
import Modal from 'react-native-modal';
import { config } from '../Provider/configProvider';
import { apifuntion } from '../Provider/Apicallingprovider/apiProvider';
import { consolepro } from '../Provider/Messageconsolevalidationprovider/Consoleprovider';
import { StripeProvider } from '@stripe/stripe-react-native/src/components/StripeProvider';
import { CardField, createToken } from '@stripe/stripe-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Languageprovider } from '../Provider/Languageprovider';
import Guest from './components/Checkout/guest';
import {
  msgProvider,
  msgTitle,
} from '../Provider/Messageconsolevalidationprovider/messageProvider';
import { Lang_chg } from '../Provider/Language_provider';
import { WebView } from 'react-native-webview';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CheckoutTicketAsGuest = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [discountPercent, setDiscountPercent] = useState(
    route?.params?.discountPercent,
  );
  const [tickets, setTickets] = useState(route?.params?.tickets);
  const [ticketsRegister, setTicketsRegister] = useState(
    route?.params?.ticketsRegister,
  );
  const [signInFormOpen, setSignInFormOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [events, setEvents] = useState(route?.params?.event);
  const [paymentMethod, setPaymentMethod] = useState(
    route?.params?.paymentMethod || 'card',
  );
  const [configs, setConfigs] = useState();
  const [cardName, setCardName] = useState();
  const [userDetail, setUserDetail] = useState();
  const [paypalUrl, setPaypalUrl] = useState();
  const [promotionCode, setPromotionCode] = useState(
    route?.params?.promotionCode,
  );
  const scrollRef = useRef();

  useEffect(() => {
    (async () => {
      getPaymentMethod();
    })();
  }, []);

  const getPaymentMethod = () => {
    let url = config.baseAPI + 'config';
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url, 1)
      .then(obj => {
        consolepro.consolelog('config', obj);
        if (obj.success === 'true') {
          setConfigs(obj.data);
        } else {
          setConfigs(null);
        }
      })
      .catch(err => {
        consolepro.consolelog('err', err);
        setConfigs(null);
      });
  };

  const apiTicketsRegister = ticketsRegister => {
    let url = config.baseAPI + `purchase/${events.id}`;
    let params = new FormData();

    for (let i = 0; i < ticketsRegister.length; i++) {
      params.append(`checkoutArr[${i}][ticketId]`, ticketsRegister[i].ticketId);
      params.append(`checkoutArr[${i}][qty]`, ticketsRegister[i].qty);
    }

    params.append('full_name', userDetail?.full_name);
    params.append('email', userDetail?.email);
    params.append('phone_number', userDetail?.phone_number);
    params.append('is_paypal', paymentMethod === 'paypal');
    if (promotionCode) {
      params.append('promo_code', promotionCode);
    }
    consolepro.consolelog('url', url, params);
    apifuntion
      .postApi(url, params)
      .then(obj => {
        if (obj.success === 'true' && obj.data) {
          if (paymentMethod === 'card') {
            createToken({ type: 'Card' })
              .then(result => {
                if (result?.token.id) {
                  apiTicketPayment(obj.data.id, result.token.id);
                } else {
                  Alert.alert(
                    msgTitle.payment_failed_title[config.language],
                    msgTitle.payment_failed_content[config.language],
                    [
                      {
                        text: msgTitle.ok[config.language],
                      },
                    ],
                    { cancelable: false },
                  );
                }
              })
              .catch(error => {
                Alert.alert(
                  msgTitle.payment_failed_title[config.language],
                  msgTitle.payment_failed_content[config.language],
                  [
                    {
                      text: msgTitle.ok[config.language],
                    },
                  ],
                  { cancelable: false },
                );
              });
          } else if (paymentMethod === 'paypal' && obj?.paypal_url) {
            setPaypalUrl(obj?.paypal_url);
          }
        } else {
          Alert.alert(
            msgTitle.payment_failed_title[config.language],
            msgTitle.payment_failed_content[config.language],
            [
              {
                text: msgTitle.ok[config.language],
              },
            ],
            { cancelable: false },
          );
        }
      })
      .catch(err => {
        Alert.alert(
          msgTitle.payment_failed_title[config.language],
          msgTitle.payment_failed_content[config.language],
          [
            {
              text: msgTitle.ok[config.language],
            },
          ],
          { cancelable: false },
        );
        consolepro.consolelog('err', err);
      });
  };

  const apiTicketPayment = (purchase_id, stripeToken) => {
    let url = config.baseAPI + 'payment/stripe';
    let params = new FormData();

    params.append('purchase_id', purchase_id);
    params.append('stripeToken', stripeToken);
    consolepro.consolelog('url', url, params);
    apifuntion
      .postApi(url, params)
      .then(obj => {
        if (obj.success === 'true') {
          navigation.navigate('OrderSuccess', {
            msg: Languageprovider.PAYMENTSUCCESS[language_key],
          });
        } else {
          navigation.navigate('OrderSuccess', {
            msg: Languageprovider.PAYMENTFAILED[language_key],
          });
        }
      })
      .catch(err => {
        consolepro.consolelog('err', err);
      });
  };

  const getTotalPrice = () => {
    let total = 0;
    for (const item of tickets) {
      total += item.qtyValue * item.ticket.price;
    }
    return total;
  };

  const handlePayPress = async () => {
    if (
      !userDetail?.full_name ||
      !userDetail?.email ||
      !userDetail?.phone_number
    ) {
      setSignInFormOpen(true);
      return;
    }
    apiTicketsRegister(ticketsRegister);
  };

  const _onNavigationStateChange = webViewState => {
    if (webViewState.loading == false) {
      const t = webViewState.url
        .split('/')
        .pop()
        .split('?')[0];
      if (typeof t != null) {
        if (t == 'notify') {
          setPaypalUrl(null);
          navigation.navigate('OrderSuccess');
        } else if (t == 'cancel') {
          setPaypalUrl(null);
          msgProvider.toast(Lang_chg.paymentcancel[config.language], 'center');
        }
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <>
        <View style={styles.titleBlock}>
          <Text style={styles.name}>{item.ticket.name.split('-')[0]}</Text>
          <View style={styles.quantity}>
            <Text style={styles.quantityLabel}>{item.qtyValue}</Text>
          </View>
          <Text style={styles.price}>
            AU${item.qtyValue * item.ticket.price}
          </Text>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionContent}>
            {item.ticket.description}
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        backOnPress={() => navigation.goBack()}
        title={Languageprovider.CHECKOUTASGUEST[language_key]}
        backgroundStyle={{ backgroundColor: Colors.colorTicketE2 }}
      />

      <View style={styles.body}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}>
            <View style={styles.bodyContent}>
              <View style={styles.blackTowerMarket}>
                <View style={styles.blackTowerMarketBlock}>
                  <Image
                    style={styles.blackTowerMarketImage}
                    source={
                      events.venue?.toLowerCase().indexOf('lizard') === -1
                        ? require('../assets/cropped-designcrowd.png')
                        : require('../assets/lizard-market.png')
                    }
                  />
                </View>
                <Text style={styles.title}>{events.venue}</Text>
                <Text style={styles.dateLabel}>
                  {events.name.replace(events.venue, '')}
                </Text>
              </View>

              <View style={styles.tickets}>
                <View style={[styles.ticketItem]}>
                  <View>
                    <FlatList
                      data={tickets}
                      //extraData={state}
                      keyExtractor={(index, item) => index.toString()}
                      renderItem={renderItem}
                    />

                    <View style={{ marginTop: 30 }}>
                      <View style={styles.total}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={[styles.price, styles.totalPrice]}>
                          AU${getTotalPrice()}
                        </Text>
                      </View>

                      {configs?.is_promo ? (
                        <View style={styles.discount}>
                          <Text style={styles.moneyLabel}>
                            {Languageprovider.t('DISCOUNT', language_key)}
                          </Text>
                          <Text style={[styles.price, styles.totalPrice]}>
                            AU$
                            {Math.round(
                              getTotalPrice() * (discountPercent / 100),
                              2,
                            )}
                          </Text>
                        </View>
                      ) : (
                        <View />
                      )}

                      {configs?.is_promo ? (
                        <View style={styles.totalCheckout}>
                          <Text style={styles.moneyLabel}>
                            {Languageprovider.t('TOTAL_CHECKOUT', language_key)}
                          </Text>
                          <Text style={[styles.price, styles.totalPrice]}>
                            AU$
                            {getTotalPrice() -
                              Math.round(
                                getTotalPrice() * (discountPercent / 100),
                                2,
                              )}
                          </Text>
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>

                    {userDetail?.email ? (
                      <TouchableOpacity onPress={() => setSignInFormOpen(true)}>
                        <View style={styles.profile}>
                          <Text style={styles.welcome}>
                            {Languageprovider.WELCOME[language_key]}
                          </Text>
                          <View style={styles.profileInfo}>
                            <Image
                              style={styles.avatar}
                              source={require('../assets/default-avatar.png')}
                            />
                            <Text style={styles.profileName}>
                              {userDetail?.full_name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setSignInFormOpen(true)}
                        style={styles.signIn}>
                        <View style={styles.circle} />
                        <View style={styles.signInText}>
                          <Text style={styles.signInLabel}>
                            {Languageprovider.MOREABOUTYOU[language_key]}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {paymentMethod === 'card' && (
                <View style={styles.card}>
                  <StripeProvider
                    publishableKey={configs?.stripe?.public_key}
                    merchantIdentifier="com.airseekr">
                    <TextInput
                      value={cardName}
                      placeholder={'Card Name'}
                      style={styles.cardName}
                      onChangeText={name => setCardName(name)}
                      placeholderTextColor={Colors.colorTicketDescription}
                      onFocus={() => {
                        scrollRef.current.scrollToEnd({ animated: true });
                      }}
                    />
                    <CardField
                      postalCodeEnabled={false}
                      placeholder={{
                        number: '4242 4242 4242 4242',
                      }}
                      cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                      }}
                      style={styles.cardNumber}
                      onCardChange={cardDetails => {}}
                      // onFocus={() => {
                      //   scrollRef.current.scrollToEnd({ animated: true });
                      // }}
                    />
                  </StripeProvider>
                  <TouchableOpacity
                    style={styles.signupButton}
                    onPress={handlePayPress}>
                    <Text style={styles.signupButtonLabel}>
                      {Languageprovider.SUBMIT[language_key]}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {paymentMethod === 'paypal' && (
                <View style={styles.card}>
                  <TouchableOpacity
                    style={styles.signupButton}
                    onPress={handlePayPress}>
                    <Text style={styles.signupButtonLabel}>
                      {Languageprovider.SUBMIT[language_key]}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {paypalUrl && (
              <View style={styles.webview}>
                <WebView
                  onNavigationStateChange={_onNavigationStateChange}
                  source={{ uri: paypalUrl }}
                  style={{ marginTop: 0 }}
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Modal
        isVisible={signInFormOpen}
        onSwipeComplete={() => {
          setSignInFormOpen(false);
        }}
        onBackdropPress={() => {
          setSignInFormOpen(false);
        }}>
        <Guest
          full_name={userDetail?.full_name}
          email={userDetail?.email}
          phone_number={userDetail?.phone_number}
          fullNameOnChang={value =>
            setUserDetail({
              ...userDetail,
              full_name: value,
            })
          }
          emailOnChang={value =>
            setUserDetail({
              ...userDetail,
              email: value,
            })
          }
          phoneOnChang={value =>
            setUserDetail({
              ...userDetail,
              phone_number: value,
            })
          }
          submitOnPress={() => {
            if (
              !userDetail?.full_name ||
              !userDetail?.email ||
              !userDetail?.phone_number
            ) {
              return;
            }
            setSignInFormOpen(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default CheckoutTicketAsGuest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorTicketE2,
  },
  backgroundBannerImage: {
    width: '100%',
    height: 250,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.colorTicketE2,
    padding: 15,
  },
  bodyContent: {
    flex: 1,
  },
  blackTowerMarket: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  blackTowerMarketBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackTowerMarketImage: { width: 90, height: 90 },
  blackTowerMarketEditIcon: {
    width: 15,
    height: 15,
    left: 30,
    position: 'absolute',
  },
  title: { fontSize: 21, fontWeight: 'bold', marginTop: 10 },
  dateLabel: { color: Colors.colorTicketSelected, fontSize: 12 },
  tickets: { marginTop: 20 },
  ticketItem: {
    marginTop: 10,
    padding: 1,
  },
  ticketSelected: {
    borderWidth: 1,
    borderColor: Colors.colorTicketSelected,
  },
  titleBlock: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { fontWeight: 'bold', fontSize: 15, flex: 3 },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    color: Colors.colorTicketSelected,
    textAlign: 'right',
  },
  quantity: {
    backgroundColor: Colors.colorTicketE2,
    width: 25,
    height: 25,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  quantityLabel: {
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.colorTicketTotal,
    borderRadius: 2,
    padding: 3,
  },
  quantityLabelClear: { fontSize: 14, marginLeft: 15, width: 15, height: 15 },
  description: { marginLeft: 10, marginRight: 10, marginTop: 5 },
  detail: { marginTop: 10 },
  detailContent: { backgroundColor: Colors.colorTicketItem, padding: 10 },
  descriptionItem: { marginBottom: 20 },
  descriptionTitle: { fontWeight: 'bold', fontSize: 11 },
  descriptionContent: { marginTop: 5, fontSize: 10 },
  total: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    backgroundColor: Colors.colorTicketTotal,
  },
  totalLabel: { flex: 1, alignItems: 'flex-start', fontWeight: 'bold' },
  totalPrice: { flex: 1, alignItems: 'flex-end', textAlign: 'right' },
  signIn: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  circle: {
    backgroundColor: Colors.colorTicketD5,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  signInText: { marginLeft: 15 },
  signInLabel: { fontWeight: 'bold' },
  modalSignIn: {
    backgroundColor: Colors.whiteColor,
    height: 400,
    width: '100%',
    borderRadius: 5,
  },
  profile: { marginTop: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  profileName: { marginLeft: 15 },
  welcome: { fontWeight: 'bold', fontSize: 20 },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 10,
  },
  card: {
    marginTop: 30,
    marginBottom: 250,
  },
  cardName: {
    backgroundColor: Colors.colorTicketItem,
    padding: 6,
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.colorTicket,
    height: 40,
  },
  cardNumber: {
    width: '100%',
    height: 40,
  },
  signupButton: {
    borderRadius: 6,
    height: 45,
    backgroundColor: Colors.red_color,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  signupButtonLabel: {
    color: Colors.whiteColor,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  webview: {
    width: '100%',
    height: (windowHeight * 89) / 100,
    position: 'absolute',
  },
  discount: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    marginTop: 0,
    backgroundColor: Colors.colorTicketTotal,
  },
  totalCheckout: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    marginTop: 0,
    backgroundColor: Colors.colorTicketTotal,
  },
});
