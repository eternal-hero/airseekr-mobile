import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../Provider/Colorsfont';
import { Languageprovider } from '../../../Provider/Languageprovider';
import { msgTitle } from '../../../Provider/Messageconsolevalidationprovider/messageProvider';
import { localStorage } from '../../../Provider/localStorageProvider';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class HomeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      userDetail: null,
    };
  }

  componentDidMount() {
    this.authenticateSession();
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

  gotoProfile = async () => {
    await this.authenticateSession();
    if (!this.state.isLoggedIn) {
      Alert.alert(
        'Confirm',
        'Please first login',
        [
          {
            text: msgTitle.cancel[0],
          },
          {
            text: msgTitle.ok[0],
            // onPress: () =>  this.btnPageLoginCall(),
            onPress: async () => {
              await localStorage.setItemObject('skip_status', 'no');
              this.props.navigation.navigate('Login');
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      this.props.navigation.navigate('Profile');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.item} onPress={this.gotoProfile}>
          <Image
            style={styles.itemImage}
            resizeMode={'contain'}
            source={require('../../../assets/become-a-seller.png')}
            width={windowWidth}
            height={(431 / 1244) * windowWidth}
          />
          <Text style={styles.textHeader}>
            {Languageprovider.t('BECOMEASELLER', language_key)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.navigate('BookAStall')}>
          <Image
            style={styles.itemImage}
            resizeMode={'contain'}
            source={require('../../../assets/book-a-stall.png')}
            width={windowWidth}
            height={(431 / 1244) * windowWidth}
          />
          <Text style={styles.textHeader}>
            {Languageprovider.t('BOOKASTALL', language_key)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => this.props.navigation.navigate('Homepage')}>
          <Image
            style={styles.itemImage}
            resizeMode={'contain'}
            source={require('../../../assets/browse-marketplace.png')}
            width={windowWidth}
            height={(431 / 1244) * windowWidth}
          />
          <Text style={styles.textHeader}>
            {Languageprovider.t('BROWSEMARKETPLACE', language_key)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.colorTicketItem, padding: 0 },
  item: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: Colors.colorTicketItem,
    height: (431 / 1244) * windowWidth,
    borderRadius: 5,
    padding: 0,
    marginBottom: 10,
  },
  itemImage: {
    width: '100%',
    maxHeight: (431 / 1244) * windowWidth,
    borderRadius: 5,
    alignSelf: 'center',
  },
  textHeader: {
    color: Colors.blackColor,
    position: 'absolute',
    fontSize: 21,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    right: 5,
    width: '55%',
  },
});
