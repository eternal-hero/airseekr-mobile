import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../Provider/Colorsfont';
import { Languageprovider } from '../../../Provider/Languageprovider';

export default function Guest({
  title,
  submitOnPress,
  titleStyle,
  backgroundStyle,
  fullNameOnChang,
  emailOnChang,
  phoneOnChang,
  full_name,
  email,
  phone_number,
}) {
  return (
    <View style={[styles.container, backgroundStyle]}>
      <View style={styles.signup}>
        <Text style={[styles.signupTitle, titleStyle]}>
          {title ? title : Languageprovider.MOREABOUTYOU[language_key]}
        </Text>
        <View style={styles.signupForm}>
          <TextInput
            value={full_name}
            style={styles.signupInput}
            onChangeText={fullNameOnChang}
            placeholder={'full name'}
            placeholderTextColor={Colors.colorTicketDescription}
          />
          <TextInput
            value={email}
            extContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="email"
            style={styles.signupInput}
            onChangeText={emailOnChang}
            placeholder={'email address'}
            placeholderTextColor={Colors.colorTicketDescription}
          />
          <TextInput
            value={phone_number}
            style={styles.signupInput}
            onChangeText={phoneOnChang}
            placeholder={'phone number'}
            placeholderTextColor={Colors.colorTicketDescription}
          />
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={submitOnPress}>
          <Text style={styles.signupButtonLabel}>
            {Languageprovider.SUBMIT[language_key]}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 4,
    minHeight: 300,
    width: '100%',
  },
  signup: { padding: 10 },
  signupTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
  },
  signupForm: { padding: 10, marginTop: 30 },
  social: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  socialItem: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.colorTicket,
    marginRight: 15,
    borderRadius: 22.5,
  },
  orUse: { textAlign: 'center' },
  signupInput: {
    backgroundColor: Colors.colorTicketItem,
    padding: 6,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.colorTicket,
    color: Colors.blackColor,
  },
  signupButton: {
    borderRadius: 20,
    height: 45,
    backgroundColor: Colors.red_color,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  signupButtonLabel: {
    color: Colors.whiteColor,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
