import React from 'react'
import { View,Alert } from 'react-native'
import Loader from '../Loader';
import NetInfo from '@react-native-community/netinfo';
import { msgProvider, msgTitle, msgText, titlealert, handleback } from './messageProvider';

var loading = true
//--------------------------- Config Provider Start -----------------------

class ApiContainer {

 
  postApi1 = async (url, data) => {
    var result = 1
   
    result = fetch(url, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      body: data
    })

    return result

  }




   postApi = async (url, data, load) => {
    return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        if(load!=1){
          global.props.showLoader();
        }
        fetch(url, {
          method: 'POST',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
            // 'Content-Type': 'application/json'
          },
          body: data
        }).then((response) => {
          global.props.hideLoader();
          return response.json();})
          .then((obj) => {
            global.props.hideLoader();
            resolve(obj);
          });
      }else {
        global.props.hideLoader();
        msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
      }
    })
  })
   }

  getApi1 = async (url) => {
    var result = 1
    result = fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
    })
    return result
  }

  getApi = async (url) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          global.props.showLoader();
          fetch(url, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
              // 'Content-Type': 'application/json'
            },
           
          }).then((response) => {
            global.props.hideLoader();
            return response.json();})
            .then((obj) => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch((error) => {
              global.props.hideLoader();
              reject(error);
            });
        }else {
          global.props.hideLoader();
          msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        }
      })
    })
}
}
//--------------------------- Config Provider End -----------------------
export const apifuntion = new ApiContainer();
