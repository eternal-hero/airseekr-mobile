import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../Provider/Colorsfont';
import Modal from 'react-native-modal';

export default function Dropdown({
  title,
  data,
  onPress,
  onItemPress,
  titleStyle,
  backgroundStyle,
  isOpen,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.dropdown, backgroundStyle]}
        onPress={onPress}>
        <Text style={[styles.dropdownTitle, titleStyle]}>{title}</Text>
        <Image
          resizeMode="contain"
          style={styles.dropdownIcon}
          width={20}
          source={require('../../../assets/chevron.png')}
        />
      </TouchableOpacity>

      {isOpen && (
        <Modal
          isVisible={true}
          onSwipeComplete={onPress}
          onBackdropPress={onPress}>
          <View style={styles.dropdownList}>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              {data?.map(item => {
                return (
                  <TouchableOpacity
                    key={item.value.toString()}
                    style={styles.dropdownListItem}
                    onPress={() => onItemPress(item)}>
                    <Text style={styles.dropdownListItemLabel}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { zIndex: 3 },
  dropdown: {
    borderColor: Colors.colorTicket,
    borderWidth: 1,
    padding: 5,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIcon: { marginLeft: 5 },
  dropdownTitle: {},
  dropdownList: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.colorTicket,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    backgroundColor: Colors.colorTicketE2,
  },
  dropdownListItem: {
    minWidth: 80,
    padding: 5,
  },
  dropdownListItemLabel: {
    color: Colors.blackColor,
    textAlign: 'center',
  },
});
