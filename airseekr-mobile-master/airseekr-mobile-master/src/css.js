import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CSSstyle = StyleSheet.create({
    modaltxtother: { fontFamily: Font.Poppins_Regular, textAlign: 'center', fontSize: windowWidth * 4 / 100, color: Colors.mediatextcolor },
    modaltxtselect: { fontFamily: Font.Poppins_Regular, textAlign: 'center', fontSize: windowWidth * 3.5 / 100, color: Colors.mediatextcolor },
    modalcancelview: { marginTop: 15, alignSelf: 'center', borderRadius: 15, backgroundColor: Colors.mediabackground, width: '94%', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    modalcanceltouch: { alignSelf: 'center', width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: windowWidth * 3.5 / 100 },
    modalviewinner: { width: '94%', backgroundColor: Colors.mediabackground, borderRadius: 15, paddingVertical: windowWidth * 3.5 / 100 },
    modaaltextview: { borderBottomColor: Colors.border_color, borderBottomWidth: 1, width: '100%', paddingVertical: windowWidth * 2 / 100 },
    modaaltextview1: { width: '100%', paddingVertical: windowWidth * 2 / 100 },
    modelview: {
        height: '100%',
        width: '100%',
        backgroundColor: '#00000090',
        justifyContent: 'center',
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },
    mainmodelview: {
        backgroundColor: Colors.whiteColor,
        height: 250,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 25,
        alignItems: 'center'
        // position:'absolute',bottom:100
    },
    veriview: {
        justifyContent: 'center',
        paddingTop: 15
    },
    veritext: {
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontFamily: Font.Poppins_Regular
    },
    pleaseview: {
        justifyContent: 'center'
    },
    pleasetext: {
        fontSize: 13,
        alignSelf: 'center',
        paddingTop: 7,
        paddingHorizontal: 20,
        textAlign: 'center',
        fontFamily: Font.Poppins_Regular,
        fontWeight: 'bold',
        color: Colors.lightfontcolor
    },
    updateview: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 2
    },
    numberview: {
        alignSelf: 'center',
        justifyContent: 'center',
    },
    numbertext: {
        fontFamily: Font.Poppins_Regular,
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.lightfontcolor
    },
    digitview: {
        alignSelf: 'center',
        justifyContent: 'center'
    },
    digittext: {
        color: Colors.lightfontcolor,
        fontFamily: Font.Poppins_Regular,
        fontSize: 13,
        fontWeight: 'bold'
    },
    editview: {
        alignSelf: 'center',
        justifyContent: 'center',

    },
    edittext: {
        color: '#67a6ff',
        fontSize: 12,
        paddingHorizontal: 5,
        fontFamily: Font.Poppins_Regular,
        fontWeight: 'bold',
        textDecorationColor: '#67a6ff',
        textDecorationLine: 'underline'
    },
    otpview: {
        borderWidth: 2,
        borderColor: '#eceded',
        width: '87%',
        alignSelf: 'center',

        position: 'relative',
        top: 20,

    },
    otptext: {
        alignContent: 'center',
        fontFamily: Font.Poppins_Regular,
        width: '100%',
        alignItems: 'center'
    },
    lastview: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        borderTopColor: '#eceded',
        borderTopWidth: 2,
        justifyContent: 'space-evenly',
        width: '100%',
        height: 60,
        alignSelf: 'center',
    },
    resend: {
        color: '#e8485f',
        fontSize: 18,
        fontFamily: Font.Poppins_Regular,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    resendtouch: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: 150,

    },
    verify: {
        color: '#67a6ff',
        fontSize: 18,
        fontFamily: Font.Poppins_Regular,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    modalageview:
        { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
    modalcross:
        { width: 30, height: 30 },
    line:
        { width: 2, backgroundColor: '#eceded' },
    notification_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: windowWidth * 3 / 100,
        paddingRight: windowWidth * 3 / 100,
        backgroundColor: Colors.newcolor,
        paddingTop: 10,
        paddingBottom: 5,
        width: '100%',
        // elevation:1,
        // shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20,

    }, hole_top_l1: {
        width: 25,
        height: 25,
    },
    Notifications_title: {
        fontFamily: Font.Poppins_SemiBold,
        fontSize: windowWidth * 4 / 100,
        color: '#000',
        alignSelf: 'center'
    },
    mainbutton: { width: '100%', paddingVertical: windowHeight * 1.5 / 100, backgroundColor: Colors.theme_color1, alignSelf: 'center', justifyContent: 'center', borderRadius: windowHeight * 4 / 100 },
    icons: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 6 / 100,
        resizeMode: 'contain'
    },
    edittxticon: {
        width: windowWidth * 5 / 100,
        height: windowWidth * 5 / 100,
        resizeMode: 'contain'
    },


})
export default CSSstyle;