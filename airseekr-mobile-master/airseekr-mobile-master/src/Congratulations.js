import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Congratulations extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
        }

        this._didFocusSubscription = this.props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    componentDidMount() {
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );

    }

    handleBackPress  ()  {
        return true
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.whiteColor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <View style={{ flex: 1, backgroundColor: Colors.whiteColor, justifyContent: 'center', alignItems: 'center' }}>
                          
                    <View style={{zIndex:1, marginBottom: windowHeight * 8 / 100, width: '85%', backgroundColor:Colors.theme_color1, borderRadius: 12, padding: windowHeight * 4 / 100,  }}>
                    <Image resizeMode="contain" style={{width:windowWidth*15/100,height:windowWidth*15/100,resizeMode:'contain',alignSelf:'center'}} source={localimag.congrateright}></Image>
                    
                        <Text style={styles.txtitem2}>{Lang_chg.Congratulations[config.language]}</Text>
                         <Text style={styles.txtitem1}>{Lang_chg.Congratulations1[config.language] }</Text>
                        <Text style={[styles.txtitem1, { fontFamily: Font.Poppins_Regular }]}>{'Date : '+new Date().toLocaleString()+''}</Text>

                    </View>

                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Itemdetailoffer') }} style={[CSSstyle.mainbutton, {width:'85%', backgroundColor: Colors.theme_color1 }]}>

                        <Text style={styles.txtlogin}>{Lang_chg.ok[config.language]}</Text>
                    </TouchableOpacity>

                </View>

            </View>



        )
    }
}



const styles = StyleSheet.create({
    txtlogin: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    },
    txtitem2: {
        textAlign:'center', fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, marginTop:windowWidth*2/100
    },
    txtitem1: {
      textAlign:'center',  fontSize: windowWidth * 3.6 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color, 
    },
});