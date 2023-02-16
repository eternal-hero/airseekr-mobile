import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import Carousel from 'react-native-banner-carousel';
import CountDown from 'react-native-countdown-component';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import { color } from 'react-native-reanimated';
export default class Reportpage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            type: this.props.route.params.type,
            ads_id: this.props.route.params.ads_id,
            report: ''
        }

    }
    componentDidMount() {
      
    }

    submitreport =async (description) => {
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let user_id= user_details.user_id
            let url = config.baseURL + "add_ads_report.php";
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('ads_id', this.state.ads_id)
            data.append('description', description)
            consolepro.consolelog('test', data)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('test111', obj)
                if (obj.success == 'true') {
                    msgProvider.toast(obj.msg[config.language],'center')
                    this.props.navigation.goBack()
                } else {
                    if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                        config.checkUserDeactivate(this.props.navigation)
                    } else {
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    }
                    return false;
                }
            }).catch(err => {
                consolepro.consolelog('err11', err);
            });
        }
    }
    submitchatreport =async (description) => {
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let user_id= user_details.user_id
            let url = config.baseURL + "add_chat_report.php";
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('other_user_id', this.state.ads_id)
            data.append('description', description)
            consolepro.consolelog('test', data)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('test111', obj)
                if (obj.success == 'true') {
                    msgProvider.toast(obj.msg[config.language],'center')
                    this.props.navigation.goBack()
                } else {
                    if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                        config.checkUserDeactivate(this.props.navigation)
                    } else {
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    }
                    return false;
                }
            }).catch(err => {
                consolepro.consolelog('err11', err);
            });
        }
    }
    submit=()=>{
        let report=this.state.report.trim()
        if(report.length<=0){
            msgProvider.toast(validation.emptyreportMessage[config.language], 'center')
            return false;
        }else{
            if(this.state.type == 'ads'){
                this.submitreport(report)
            }else{
                this.submitchatreport(report)
            }
         
        }
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <ScrollView >
                    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingBottom: windowHeight * 8 / 100 }}>

                        <View style={[CSSstyle.notification_header, { paddingTop: 10, paddingBottom: 10, }]}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtReport[config.language]}</Text>
                            <View style={{ padding: 2, justifyContent: 'center' }} >
                                <Text>{'    '}</Text>
                            </View>
                        </View>

                        {/* <View style={{width:'85%',alignItems:'center',alignSelf:'center'}}>
                         <Text style={[styles.txtitem1, {}]}>{Lang_chg.txtenterdesc[config.language]}</Text>
                    </View>  */}

                        <View style={{ width: '85%', alignItems: 'center', alignSelf: 'center' }}>
                            <TextInput
                                value={"" + this.state.report + ""}
                                onChangeText={(txt) => { this.setState({ report: txt }) }}
                                keyboardType='default'
                                maxLength={250}
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={[styles.txteditemail, {}]}
                                placeholderTextColor={Colors.lightfontcolor} placeholder={Lang_chg.txtenterdesc[config.language]}></TextInput>

                            <View style={{ width: '100%', backgroundColor: Colors.theme_color1, height: 1, marginTop: windowHeight * 10 / 100 }}>
                            </View>
                            <TouchableOpacity onPress={() => { this.submit() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 8 / 100, }]}>

                                <Text style={styles.txtlogin}>{Lang_chg.submit[config.language]}</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </ScrollView>




            </View>
        )
    }
}



const styles = StyleSheet.create({
    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },


    txteditemail: { marginTop: windowHeight * 5 / 100, fontSize: windowWidth * 4 / 100, width: '100%', fontFamily: Font.Poppins_Bold, color: Colors.lightfontcolor },


});