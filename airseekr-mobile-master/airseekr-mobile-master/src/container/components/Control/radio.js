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

export default function Radio({
  title,
  selected,
  onPress,
  backgroundStyle,
  selectedStyle,
  titleStyle,
}) {
  return (
    <TouchableOpacity style={styles.radio} onPress={onPress}>
      <View style={[styles.radioButton, backgroundStyle]}>
        {selected && (
          <View style={[selectedStyle ? selectedStyle : styles.selected]} />
        )}
      </View>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  radio: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  radioButton: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.colorTicket,
    borderWidth: 1,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.colorTicketSelected,
  },
  title: { marginLeft: 10 },
});
