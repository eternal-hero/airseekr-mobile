import React, { Component } from 'react'
import { Text, View ,Platform,PermissionsAndroid} from 'react-native'
import Geolocation from '@react-native-community/geolocation';
import {consolepro,config } from './utilslib/Utils';
global.currentlatlong='NA';
class Currentlatlong{
    requestLocation= async () => {
      return new Promise(async(resolve, reject) => {

    if (Platform.OS === 'ios') {
        resolve(this.getOneTimeLocation());
          resolve(this.subscribeLocationLocation())
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          global.props.showLoader();
          resolve(this.getOneTimeLocation());
          resolve(this.subscribeLocationLocation())
        } else {
          let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}
          global.props.hideLoader();
          resolve(position)
        }
      } catch (err) {
        let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}
        global.props.hideLoader();
        resolve(position)
      }
    }
  })
      };
     getOneTimeLocation = () => {
      return new Promise((resolve, reject) => {
        consolepro.consolelog('Getting Location ...');
      Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        consolepro.consolelog('You are Here' ,position);
        global.props.hideLoader();
        resolve(position)
     },
      (error) => {
        let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}
        global.props.hideLoader();
        resolve(position)
      },
      {
         enableHighAccuracy:true,
         timeout: 30000,
         maximumAge: 0
      },
    );
      })
      };
      subscribeLocationLocation = () => {
        return new Promise((resolve, reject) => {
       Geolocation.watchPosition(
      (position) => {
          global.props.hideLoader();
          resolve(position)
        },
      (error) => {
         let position={'coords':{'latitude':config.latitude,'longitude':config.longitude}}
         global.props.hideLoader();
         resolve(position)
       },
          {
            enableHighAccuracy:true,
            maximumAge: 0
          },
       );
        })
       };


}
export const  Currentltlg=new Currentlatlong()
