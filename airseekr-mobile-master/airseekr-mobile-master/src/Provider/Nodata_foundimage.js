import React from 'react';
import {View,Image} from 'react-native';
export const Nodata_foundimage=(props)=>{
    return(<View style={{alignContent:'center',alignSelf:'center',alignItems:'center',marginTop:20}}>
     <Image source={require('../Provider/Localimageprovider/icons/no_found.png')} style={{width:150,height:150,alignSelf:'center',}}/>
 </View>)}