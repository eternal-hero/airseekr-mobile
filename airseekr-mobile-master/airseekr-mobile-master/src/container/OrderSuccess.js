import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../Provider/Colorsfont';
import { Languageprovider } from '../Provider/Languageprovider';

export default class OrderSuccess extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg:
        this.props.route?.params?.msg ||
        Languageprovider.PAYMENTSUCCESS[language_key],
    };
  }

  componentDidMount() {
    //Code...
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.paymentSuccess}>
          <Image
            resizeMode={'contain'}
            width={80}
            height={80}
            style={styles.paymentSuccessImage}
            source={require('../assets/checked.png')}
          />

          <Text style={styles.paymentSuccessTitle}>{this.state.msg}</Text>
        </View>

        <View style={styles.paymentSuccessDescription}>
          <Text style={styles.paymentSuccessContent}>
            An email has been sent to your inbox!
          </Text>
          <Text style={styles.paymentSuccessContent}>
            If it doesn’t appear in your inbox, please check your spam folder
          </Text>
          <Text style={styles.paymentSuccessContent}>
            SMS was successfully sent to your phone number!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.paymentSuccessButton}
          onPress={() => this.props.navigation.navigate('HomeTicket')}>
          <Text style={styles.paymentSuccessButtonLabel}>OK</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.colorTicketItem, padding: 15 },
  paymentSuccess: {
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 220,
    flex: 1,
  },
  paymentSuccessImage: { flex: 1, width: 80, height: 80 },
  paymentSuccessTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  paymentSuccessDescription: { marginTop: 40 },
  paymentSuccessContent: { marginTop: 35 },
  paymentSuccessButton: {
    marginTop: 45,
    borderRadius: 20,
    backgroundColor: Colors.colorTicketButtonRed,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  paymentSuccessButtonLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.whiteColor,
  },
});
