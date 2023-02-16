import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../Provider/Colorsfont';
import { localimag } from '../../../Provider/Localimage';
import { Languageprovider } from '../../../Provider/Languageprovider';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Header({
  title,
  backOnPress,
  nextOnPress,
  titleStyle,
  backgroundStyle,
}) {
  return (
    <View style={[styles.container, backgroundStyle]}>
      <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.theme_color1}
        hidden={false}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.back}
          onPress={backOnPress}>
          <Image
            resizeMode="contain"
            style={styles.backIcon}
            source={localimag.backIcon2}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { ...titleStyle }]}>{title}</Text>
        {nextOnPress ? (
          <TouchableOpacity style={styles.next} onPress={nextOnPress}>
            <Text style={styles.nextLabel}>
              {Languageprovider.NEXT[language_key]}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.next} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.colorTicket },
  back: {
    padding: 0,
    width: 30,
    height: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: { width: 15, height: 15 },
  next: {
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  nextLabel: {
    color: Colors.colorTicketSelected,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    padding: 5,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: (windowWidth * 3) / 100,
    paddingRight: (windowWidth * 3) / 100,
    paddingTop: 10,
    paddingBottom: 5,
    width: '100%',
  },
});
