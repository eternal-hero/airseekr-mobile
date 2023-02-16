import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import Colors from '../Colors';
const CSSstyle=StyleSheet.create({
    backb:  {width:30,
    height:30,
    resizeMode:'contain',},
    searchimg:{
        width:25,
        height:25,
        resizeMode:'contain',
        alignSelf:'center'
    },
    profilimage_large:{width:65,height:70,resizeMode:'contain',alignSelf:'center',borderRadius:5},
    profilimage_prelarge:{width:50,height:50,resizeMode:'contain',borderRadius:5},
    profilimage_big:{width:40,height:40,resizeMode:'cover',borderRadius:5},
    profilimage_med:{width:30,height:30,resizeMode:'cover',borderRadius:5},
    profilimage_small:{width:25,height:25,resizeMode:'cover',borderRadius:5},
    liketxt:{marginRight:25,fontSize:12,color:'gray'},
    sell_purchase_txt:{ marginRight:5, fontSize:14,fontFamily:'Poppins-Regular'},
    arrow:{ width:10,height:10,resizeMode:'contain',alignSelf:'center'},
    socialtouch:{marginRight:10,flexDirection:'row',backgroundColor:Colors.white_light,padding:5,alignItems:'center',borderRadius:5},
    socialimg:{
        width:17,
        height:17,
        resizeMode:'contain'
      },
      socialimg1:{
        width:11,
        height:11,
        resizeMode:'contain'
      },
    socialtxt:{marginRight:5,
        fontSize:12,
        fontFamily:'Poppins-Regular',
        color:Colors.gray_color,
        marginLeft:5
    },
    smallicon:{width:15,height:15,resizeMode:'contain'},
    moresmallicon:{width:10,height:10,resizeMode:'contain'},
    headertext:{ alignSelf: 'center', fontSize: 18, color: Colors.black_color, fontFamily: 'Poppins-Bold' },
    lockview:{position:'absolute',left:10, bottom:30,backgroundColor:'black',padding:5,alignItems:'center',justifyContent:'center',borderRadius:50},
    locktxt:{ width:'100%',fontFamily:'Poppins-Regular',fontSize:12,position:'absolute',left:10, bottom:10,color:'black'}

})
export default CSSstyle;