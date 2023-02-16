import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../Provider/Colorsfont';
import { localimag } from '../../../Provider/Localimage';
import {Languageprovider} from "../../../Provider/Languageprovider";

export default function SocialSignIn({
  title,
  signOnPress,
  titleStyle,
  backgroundStyle,
  userNameOnChange,
  passwordOnChange,
  googleSignIn,
  facebookSignIn,
  appleSignIn,
}) {
  return (
    <View style={[styles.container, backgroundStyle]}>
      <View style={styles.signup}>
        <Text style={[styles.signupTitle, titleStyle]}>
          {title ? title : Languageprovider.t(`SIGNINSIGNUP`, language_key)}
        </Text>
        <View style={styles.signupForm}>
          <TextInput
            extContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="email"
            style={styles.signupInput}
            onChangeText={value => userNameOnChange(value)}
            placeholder={Languageprovider.t(`USERNAMEOREMAIL`, language_key)}
            placeholderTextColor={Colors.colorTicketDescription}
          />
          <TextInput
            style={styles.signupInput}
            onChangeText={value => passwordOnChange(value)}
            secureTextEntry={true}
            placeholder={Languageprovider.t(`PASSWORD`, language_key)}
            placeholderTextColor={Colors.colorTicketDescription}
          />
        </View>
        <Text style={styles.orUse}>{Languageprovider.t(`ORUSE`, language_key)}</Text>
        <View style={styles.social}>
          {googleSignIn && (
            <TouchableOpacity style={styles.socialItem} onPress={googleSignIn}>
              <Image
                resizeMode={'contain'}
                style={{ width: 30, height: 30, alignSelf: 'center' }}
                source={require('../../../assets/Google.png')}
                width={30}
                height={30}
              />
            </TouchableOpacity>
          )}
          {facebookSignIn && (
            <TouchableOpacity
              style={styles.socialItem}
              onPress={facebookSignIn}>
              <Image
                resizeMode={'contain'}
                style={{ width: 30, height: 30, alignSelf: 'center' }}
                source={localimag.fbicon}
                width={30}
                height={30}
              />
            </TouchableOpacity>
          )}
          {Platform.OS === 'ios' &&
            parseInt(Platform.Version) >= 13 &&
            appleSignIn && (
              <TouchableOpacity style={styles.socialItem} onPress={appleSignIn}>
                <Image
                  resizeMode={'contain'}
                  style={{ width: 30, height: 30, alignSelf: 'center' }}
                  source={require('../../../assets/apple-login.png')}
                  width={30}
                  height={35}
                />
              </TouchableOpacity>
            )}
        </View>
        <TouchableOpacity style={styles.signupButton} onPress={signOnPress}>
          <Text style={styles.signupButtonLabel}>{Languageprovider.t(`SIGNIN`, language_key)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 4,
    minHeight: 350,
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
