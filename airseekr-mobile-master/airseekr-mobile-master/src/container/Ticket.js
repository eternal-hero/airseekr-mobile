import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../Provider/Colorsfont';
import Header from './components/Header';
import moment from 'moment';
import Dropdown from './components/Dropdown';
import { Languageprovider } from '../Provider/Languageprovider';
import {
  msgText,
  msgTitle,
} from '../Provider/Messageconsolevalidationprovider/messageProvider';
import { config } from '../Provider/configProvider';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.route?.params?.event,
      tickets: [],
      ticketSelectedId: 0,
      ticketDescriptionSelectedId: 0,
      isOpenDropdownQty: [],
      qtyDropdown: [
        { title: '0', value: 0 },
        { title: '1', value: 1 },
        { title: '2', value: 2 },
        { title: '3', value: 3 },
        { title: '4', value: 4 },
        { title: '5', value: 5 },
        { title: '6', value: 6 },
        { title: '7', value: 7 },
        { title: '8', value: 8 },
        { title: '9', value: 9 },
        { title: '10', value: 10 },
      ],
    };
  }

  componentDidMount() {
    this.setState({ tickets: this.props.route?.params?.tickets });
  }

  onPressItem = item => {
    if (this.state.ticketSelectedId === item.id) {
      this.setState({ ticketSelectedId: 0 });
    } else {
      this.setState({ ticketSelectedId: item.id });
    }
  };

  onPressItemDescription = item => {
    if (this.state.ticketDescriptionSelectedId === item.id) {
      this.setState({ ticketDescriptionSelectedId: 0 });
    } else {
      this.setState({ ticketDescriptionSelectedId: item.id });
    }
  };

  isSelectDropdownQty = (item, qtyItem) => {
    const isOpens = this.state.isOpenDropdownQty;
    if (!isOpens[item.id]) {
      isOpens[item.id] = {};
    }
    isOpens[item.id].qtyTitle = qtyItem.title;
    isOpens[item.id].qtyValue = Number(qtyItem.value);
    isOpens[item.id].isOpen = false;
    isOpens[item.id].ticket = item;
    this.setState({ isOpenDropdownQty: isOpens });
  };

  isOpenDropdownQty = item => {
    const isOpens = this.state.isOpenDropdownQty;
    if (isOpens && isOpens[item.id]) {
      isOpens[item.id].isOpen = !isOpens[item.id].isOpen;
    } else {
      isOpens[item.id] = {};
      isOpens[item.id].isOpen = true;
    }
    isOpens[item.id].ticket = item;
    this.setState({ isOpenDropdownQty: isOpens });
  };

  gotoOrderSummary = () => {
    const ticketSelected = this.state.isOpenDropdownQty.filter(
      t => t.qtyValue > 0,
    );
    if (ticketSelected?.length && this.state.event) {
      this.props.navigation.navigate('OrderSummary', {
        tickets: ticketSelected,
        event: this.state.event,
      });
    } else {
      Alert.alert(
        msgTitle.select_a_ticket_title[config.language],
        msgTitle.select_a_ticket_content[config.language],
        [
          {
            text: msgTitle.ok[config.language],
          },
        ],
        { cancelable: false },
      );
    }
  };

  renderItem = ({ index, item }) => {
    return (
      <View
        style={[
          styles.ticketItem,
          this.state.isOpenDropdownQty[item.id]?.qtyValue > 0
            ? styles.ticketSelected
            : null,
        ]}>
        <TouchableOpacity onPress={() => this.onPressItem(item)}>
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{item.name.split('-')[0]}</Text>
            <Text style={styles.price}>AU${item.price}</Text>
            <View style={styles.quantity}>
              <Dropdown
                data={this.state.qtyDropdown.filter(
                  c => c.value <= Number(item.qty),
                )}
                title={this.state.isOpenDropdownQty[item.id]?.qtyTitle || 0}
                isOpen={this.state.isOpenDropdownQty[item.id]?.isOpen || false}
                onPress={() => this.isOpenDropdownQty(item)}
                onItemPress={qtyItem => this.isSelectDropdownQty(item, qtyItem)}
              />
            </View>
          </View>
          <View style={styles.description}>
            <Text style={styles.descriptionContent}>{item.description}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.onPressItemDescription(item)}
          style={styles.detail}>
          {this.state.ticketDescriptionSelectedId === item.id ? (
            <>
              <View style={styles.chevron}>
                <Image
                  style={[styles.chevronIconUp]}
                  resizeMode={'contain'}
                  source={require('../assets/chevron.png')}
                />
              </View>
              <View style={styles.detailContent}>
                <View style={styles.descriptionItem}>
                  <Text style={styles.descriptionTitle}>Details</Text>
                  <Text style={styles.descriptionContent}>
                    {item.description}
                  </Text>
                </View>

                <View style={styles.descriptionItem}>
                  <Text style={styles.descriptionTitle}>Sale Dates</Text>
                  <Text style={styles.descriptionContent}>
                    The dates when this option is available for purchase.
                  </Text>
                  <View style={styles.descriptionDate}>
                    <Text style={styles.descriptionDateLabel}>
                      Goes On Sale:{' '}
                      {moment(item.sales_start).format('MMMM D, YYYY h:mm A')}
                    </Text>
                    <Text style={styles.descriptionDateLabel}>
                      Sales End:{' '}
                      {moment(item.sales_end).format('MMMM D, YYYY h:mm A')}
                    </Text>
                  </View>
                </View>

                <View style={styles.descriptionItem}>
                  <Text style={styles.descriptionTitle}>Access</Text>
                  <Text style={styles.descriptionContent}>
                    This option allows access to the following dates and times
                  </Text>
                  <View style={styles.descriptionDate}>
                    <Text style={styles.descriptionDateLabel}>
                      {this.state.event.venue} Bump In
                    </Text>
                    <Text style={styles.descriptionDateLabel}>
                      {moment(
                        this.state.event.dateEvent,
                        'Do of MMMM, YYYY',
                      ).format('MMMM D, YYYY')}{' '}
                      06:00 AM - 09:00 AM
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.chevron}>
              <Image
                style={[
                  styles.chevronIcon,
                  this.state.ticketDescriptionSelectedId === item.id
                    ? styles.chevronIconUp
                    : null,
                ]}
                resizeMode={'contain'}
                source={require('../assets/chevron.png')}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backOnPress={() => this.props.navigation.goBack()}
          title={Languageprovider.t(`SELECTATICKET`, language_key)}
          nextOnPress={this.gotoOrderSummary}
        />
        <Image
          style={styles.backgroundBannerImage}
          source={require('../assets/book-a-stall2.png')}
          resizeMode={'contain'}
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
                  <TouchableOpacity>
                    <Image
                      style={styles.blackTowerMarketEditIcon}
                      source={require('../assets/edit.png')}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.title}>{this.state.event.venue}</Text>
                <Text style={styles.dateLabel}>
                  {this.state.event.name.replace(this.state.event.venue, '')}
                </Text>
              </View>

              <View style={styles.tickets}>
                <FlatList
                  data={this.state.tickets}
                  extraData={this.state}
                  renderItem={this.renderItem}
                  keyExtractor={item => item.id.toString()}
                />
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
    backgroundColor: Colors.colorTicket,
  },
  backgroundBannerImage: {
    width: windowWidth,
    height: (467 / 1240) * windowWidth,
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
  dateLabel: { color: Colors.colorTicketSelected, fontSize: 13 },
  tickets: {},
  ticketItem: {
    borderRadius: 5,
    borderColor: Colors.colorHomeItem,
    borderWidth: 1,
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
  },
  name: { fontWeight: 'bold', fontSize: 16, flex: 3 },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    color: Colors.colorTicketSelected,
  },
  quantity: {
    // backgroundColor: Colors.colorTicketItem,
    // width: 35,
    // height: 35,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    zIndex: 3,
  },
  quantityLabel: { fontSize: 16 },
  description: { marginLeft: 10, marginRight: 10 },
  detail: { marginTop: 10, zIndex: 1 },
  detailContent: {
    backgroundColor: Colors.colorTicketItem,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.colorTicketItem,
    padding: 3,
  },
  chevronIcon: { width: 20, height: 20 },
  chevronIconUp: {
    transform: [{ rotate: '180deg' }],
  },
  descriptionItem: { marginBottom: 20 },
  descriptionTitle: { fontWeight: 'bold', fontSize: 12 },
  descriptionContent: { marginTop: 5, fontSize: 11 },
  descriptionDate: { marginLeft: 30, marginTop: 10 },
  descriptionDateLabel: { fontSize: 12 },
});
