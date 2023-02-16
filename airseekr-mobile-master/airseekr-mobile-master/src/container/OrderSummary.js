import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../Provider/Colorsfont';
import Header from './components/Header';
import Radio from './components/Control/radio';
import { Languageprovider } from '../Provider/Languageprovider';
import { config } from '../Provider/configProvider';
import { consolepro } from '../Provider/Messageconsolevalidationprovider/Consoleprovider';
import { apifuntion } from '../Provider/Apicallingprovider/apiProvider';
import {
  msgProvider,
  msgTitle,
} from '../Provider/Messageconsolevalidationprovider/messageProvider';

export default class OrderSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.route?.params?.event,
      tickets: this.props.route?.params?.tickets,
      signInFormOpen: true,
      ticketDescriptionSelectedId: 0,
      valuePaymentMethod: 'card', //card, paypal
      configs: null,
      ticketsRegister: [],
      promotionCode: '',
      discount: 0,
      discountPercent: 0,
    };
  }

  async componentDidMount() {
    if (this.props.route?.params?.tickets?.length) {
      const ticketsRegister = [];
      for (const item of this.props.route?.params?.tickets) {
        ticketsRegister.push({
          ticketId: item.ticket.id,
          qty: item.qtyValue,
        });
      }
      this.setState({ ticketsRegister });
    }
    await this.getConfigs();
    consolepro.consolelog('config data', this.state.configs);
  }

  getConfigs = () => {
    let url = config.baseAPI + 'config';
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url, 1)
      .then(obj => {
        consolepro.consolelog('config', obj);
        if (obj.success === 'true') {
          this.setState({ configs: obj.data });
        } else {
          this.setState({ configs: null });
        }
      })
      .catch(err => {
        consolepro.consolelog('err', err);
        this.setState({ configs: null });
      });
  };

  applyPromoCode = code => {
    if (!code?.trim()) {
      msgProvider.alert(
        msgTitle.information[config.language],
        'Please enter your promotion code and press Apply button',
        false,
      );
      return false;
    }
    let url = config.baseAPI + `check-promo/${code}`;
    consolepro.consolelog('url', url);
    const data = new FormData();
    //data.append('code', code);
    apifuntion
      .postApi(url, data)
      .then(async obj => {
        consolepro.consolelog('applyPromoCode', obj);
        if (obj.success === 'true') {
          const percent = Number(obj.data?.percent);
          const totalPrice = this.getTotalPrice();
          const discount = Math.round(totalPrice * (percent / 100), 2);
          this.setState({ discount, discountPercent: percent });
        } else {
          this.setState({ discount: 0, discountPercent: 0 });
          msgProvider.alert(
            msgTitle.information[config.language],
            obj?.msg[0] ||
              'Your promotion code is not correct, please try again',
            false,
          );
        }
      })
      .catch(err => {
        consolepro.consolelog('err', err);
        this.setState({ discount: 0, totalCheckout: 0 });
      });
  };

  removeTicket = item => {
    if (!item) {
      return;
    }
    const tickets = this.props.route?.params?.tickets;
    const idx = tickets.findIndex(t => t.ticket.id === item.ticket.id);
    if (idx >= 0) {
      tickets.splice(idx, 1);
    }
    this.setState({ tickets });
  };

  getTotalPrice = () => {
    let total = 0;
    for (const item of this.state.tickets) {
      total += item.qtyValue * item.ticket.price;
    }
    return total;
  };

  renderItem = ({ item }) => {
    return (
      <>
        <View style={styles.titleBlock}>
          <Text style={styles.name}>{item.ticket.name.split('-')[0]}</Text>
          <View style={styles.quantity}>
            <Text style={styles.quantityLabel}>{item.qtyValue}</Text>
            <TouchableOpacity onPress={() => this.removeTicket(item)}>
              <Text style={styles.quantityLabelClear}>x</Text>
            </TouchableOpacity>
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

  render() {
    return (
      <View style={styles.container}>
        <Header
          backOnPress={() => this.props.navigation.goBack()}
          title={Languageprovider.t('ORDERSUMMARY', language_key)}
          nextOnPress={() =>
            this.props.navigation.navigate('CheckoutTicket', {
              event: this.state.event,
              tickets: this.state.tickets,
              ticketsRegister: this.state.ticketsRegister,
              paymentMethod: this.state.valuePaymentMethod,
              discountPercent: this.state.discountPercent,
              promotionCode: this.state.promotionCode,
            })
          }
          backgroundStyle={{ backgroundColor: Colors.colorTicketE2 }}
        />

        <View style={styles.body}>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={styles.bodyContent}>
              <View style={styles.blackTowerMarket}>
                <View style={styles.blackTowerMarketBlock}>
                  <Image
                    style={styles.blackTowerMarketImage}
                    source={
                      this.state.event.venue
                        ?.toLowerCase()
                        .indexOf('lizard') === -1
                        ? require('../assets/cropped-designcrowd.png')
                        : require('../assets/lizard-market.png')
                    }
                  />
                </View>
                <Text style={styles.title}>{this.state.event.venue}</Text>
                <Text style={styles.dateLabel}>
                  {this.state.event.dateEvent}
                </Text>
              </View>

              <View style={styles.tickets}>
                <View style={[styles.ticketItem]}>
                  <View>
                    <FlatList
                      data={this.state.tickets}
                      extraData={this.state}
                      keyExtractor={item => item.ticket.id.toString()}
                      renderItem={this.renderItem}
                    />

                    <View style={{ marginTop: 20 }}>
                      {this.state.configs?.is_promo && (
                        <View style={styles.promotion}>
                          <Text style={styles.promotionLabel}>
                            {Languageprovider.t(
                              'PROMOTON_CODE_LABEL',
                              language_key,
                            )}
                          </Text>
                          <TextInput
                            keyboardType="default"
                            autoCorrect={false}
                            style={styles.signupInput}
                            onChangeText={value =>
                              this.setState({
                                promotionCode: value,
                              })
                            }
                            placeholder={Languageprovider.t(
                              'Code',
                              language_key,
                            )}
                            placeholderTextColor={Colors.colorTicketDescription}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              this.applyPromoCode(this.state.promotionCode);
                            }}
                            style={styles.promotionButton}>
                            <Text
                              style={styles.paymentMethodButtonCheckoutLabel}>
                              {Languageprovider.t('APPLY', language_key)}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      <View style={styles.total}>
                        <Text style={styles.totalLabel}>
                          {Languageprovider.t('TOTAL', language_key)}
                        </Text>
                        <Text style={[styles.price, styles.totalPrice]}>
                          AU${this.getTotalPrice()}
                        </Text>
                      </View>

                      {this.state.configs?.is_promo && (
                        <View style={styles.discount}>
                          <Text style={styles.moneyLabel}>
                            {Languageprovider.t('DISCOUNT', language_key)}
                          </Text>
                          <Text style={[styles.price, styles.totalPrice]}>
                            AU${this.state.discount}
                          </Text>
                        </View>
                      )}

                      {this.state.configs?.is_promo && (
                        <View style={styles.totalCheckout}>
                          <Text style={styles.moneyLabel}>
                            {Languageprovider.t('TOTAL_CHECKOUT', language_key)}
                          </Text>
                          <Text style={[styles.price, styles.totalPrice]}>
                            AU${this.getTotalPrice() - this.state.discount}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.paymentMethod}>
                      <Text style={styles.paymentMethodTitle}>
                        {Languageprovider.t(
                          'SELECTPAYMENTMETHOD',
                          language_key,
                        )}
                      </Text>
                      <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodItemRadio}>
                          <Radio
                            title={Languageprovider.t(
                              'CREDITCARD',
                              language_key,
                            )}
                            selected={this.state.valuePaymentMethod === 'card'}
                            onPress={() =>
                              this.setState({ valuePaymentMethod: 'card' })
                            }
                          />
                        </View>

                        <View style={styles.paymentMethodItemLogo}>
                          <Image
                            style={styles.paymentMethodItemLogoImage}
                            source={require('../assets/visa-credit-card.png')}
                            width={120}
                            height={20}
                            resizeMode={'contain'}
                          />
                        </View>
                      </View>

                      <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodItemRadio}>
                          <Radio
                            title={Languageprovider.t('PAYPAL', language_key)}
                            selected={
                              this.state.valuePaymentMethod === 'paypal'
                            }
                            onPress={() =>
                              this.setState({ valuePaymentMethod: 'paypal' })
                            }
                          />
                        </View>

                        <View style={styles.paymentMethodItemLogo}>
                          <Image
                            style={styles.paymentMethodItemLogoImage}
                            source={require('../assets/paypal.png')}
                            width={120}
                            height={20}
                            resizeMode={'contain'}
                          />
                        </View>
                      </View>

                      <View style={styles.paymentMethodButton}>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('CheckoutTicket', {
                              event: this.state.event,
                              tickets: this.state.tickets,
                              ticketsRegister: this.state.ticketsRegister,
                              paymentMethod: this.state.valuePaymentMethod,
                              discountPercent: this.state.discountPercent,
                              promotionCode: this.state.promotionCode,
                            })
                          }
                          style={styles.paymentMethodButtonCheckout}>
                          <Text style={styles.paymentMethodButtonCheckoutLabel}>
                            {Languageprovider.t('CHECKOUT', language_key)}
                          </Text>
                        </TouchableOpacity>
                        {this.state.valuePaymentMethod === 'card' && (
                          <>
                            <Text style={styles.paymentMethodButtonCheckoutOr}>
                              {Languageprovider.t('OR', language_key)}
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate(
                                  'CheckoutTicketAsGuest',
                                  {
                                    event: this.state.event,
                                    tickets: this.state.tickets,
                                    paymentMethod: this.state
                                      .valuePaymentMethod,
                                    ticketsRegister: this.state.ticketsRegister,
                                    discountPercent: this.state.discountPercent,
                                    promotionCode: this.state.promotionCode,
                                  },
                                )
                              }
                              style={styles.paymentMethodButtonCheckoutGuest}>
                              <Text
                                style={
                                  styles.paymentMethodButtonCheckoutGuestLabel
                                }>
                                {Languageprovider.t(
                                  'CHECKOUTASGUEST',
                                  language_key,
                                )}
                              </Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
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
    minWidth: 25,
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
    marginTop: 15,
  },
  totalLabel: { flex: 1, alignItems: 'flex-start', fontWeight: 'bold' },
  moneyLabel: { flex: 1, alignItems: 'flex-start', fontWeight: 'normal' },
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
  paymentMethod: { marginTop: 10 },
  paymentMethodTitle: { fontWeight: 'bold', marginTop: 30 },
  paymentMethodItem: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  paymentMethodButton: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodButtonCheckout: {
    backgroundColor: Colors.colorTicketButtonRed,
    width: '100%',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  paymentMethodButtonCheckoutOr: { marginTop: 30 },
  paymentMethodButtonCheckoutGuest: {
    marginTop: 10,
    padding: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodButtonCheckoutGuestLabel: {
    color: Colors.colorTicketSelected,
    fontSize: 16,
  },
  paymentMethodButtonCheckoutLabel: {
    textTransform: 'uppercase',
    color: Colors.whiteColor,
    fontWeight: 'bold',
  },
  paymentMethodItemLabel: { marginLeft: 15, flex: 1 },
  paymentMethodItemRadio: {},
  paymentMethodItemLogo: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 3,
    textAlign: 'left',
    padding: 10,
  },
  paymentMethodItemLogoImage: { alignSelf: 'flex-end' },
  promotion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  promotionLabel: { marginRight: 10 },
  promotionInput: { marginRight: 10, justifyContent: 'flex-end' },
  signupInput: {
    backgroundColor: Colors.colorTicketItem,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.colorTicket,
    color: Colors.blackColor,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    marginRight: 10,
    width: 150,
    textAlign: 'center',
  },
  promotionButton: {
    backgroundColor: Colors.colorTicketButtonRed,
    width: 80,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'flex-end',
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
