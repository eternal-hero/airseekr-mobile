
import React from 'react'
import { View } from 'react-native'
import NetInfo from '@react-native-community/netinfo';
//--------------------------- Connection Provider Start -----------------------

class ConnectionContainer {


  getConnection = async () => {
    let result = true
    NetInfo.fetch().then(state => { result = state.isConnected });
    NetInfo.addEventListener(state => {
      result = state.isConnected
    });
    return result
   
  }

}
//--------------------------- Connection Provider End -----------------------
export const connectionfuntion = new ConnectionContainer();
