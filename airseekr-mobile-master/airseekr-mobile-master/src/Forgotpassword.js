import React, { Component } from 'react'
import {I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,  Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {localimag} from '../src/Provider/Localimage';
export default class Forgotpassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email:'',
            minutes_Counter: '01',
            seconds_Counter: '59',
            show: false,
            timer: null,
            startDisable: false,
            otpstatus: '',
            user_id:''
        }

    }
    componentDidMount() {

    }

    onButtonStart = () => {

        let timer = setInterval(() => {

            if (this.state.minutes_Counter == '00' && this.state.seconds_Counter == '01') {
                this.onButtonStop()
            }

            var num = (Number(this.state.seconds_Counter) - 1).toString(),
                count = this.state.minutes_Counter;


            if ((this.state.seconds_Counter) == '00') {
                count = (Number(this.state.minutes_Counter) - 1).toString();
                num = 59
            }
            if (count != -1) {
                this.setState({
                    minutes_Counter: count.length == 1 ? '0' + count : count,
                    seconds_Counter: num.length == 1 ? '0' + num : num
                });
            }
            else {
                this.onButtonStop()
            }

        }, 1000);

        this.setState({ timer });

        this.setState({ startDisable: true })
    }

    onButtonStop = () => {
        clearInterval(this.state.timer);
        this.setState({ startDisable: false })
    }

    resend_click = async () => {
        this.setState({ minutes_Counter: '01' })
        this.setState({ seconds_Counter: '59' })


        let url = config.baseURL + "resend_otp_forgot.php";
        var data = new FormData();
        data.append('user_id', this.state.user_id)
        apifuntion.postApi(url, data).then((obj) => {

            if (obj.success == 'true') {
                this.onButtonStart()
                      // this.sendmail(obj)
                      if(obj.showotp== true){
                        this.setState({otpstatus: obj.otp,})
                    }

              //  msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);

            } else {
                if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                    config.checkUserDeactivate(this.props.navigation)
                } else {
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                }
                return false;
            }


        }).catch((err) => {
            consolepro.consolelog('err', err);
        });
    }



verify_click = async () => {

    Keyboard.dismiss()

    if (this.state.otpstatus.length <=0) {
        msgProvider.toast(validation.emptyOTP[config.language], 'center')
        return false;
    }

    if (this.state.otpstatus.length < 4) {
        msgProvider.toast(validation.lengthOTP[config.language], 'center')
        return false;
    }
    let url = config.baseURL + "otp_verification_forgot.php";
    var data = new FormData();
    data.append('user_id', this.state.user_id)
    data.append('otp', this.state.otpstatus)
    consolepro.consolelog('test', data)
    apifuntion.postApi(url, data).then((obj) => {
        this.setState({ show: false ,name:'',mobile:'',otpstatus: '',})
        if (obj.success == 'true') {
            var user_details = obj.user_details;
            localStorage.setItemObject('user_arr', user_details);
            this.props.navigation.navigate('Resetpassword')
        } else {
            if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                config.checkUserDeactivate(this.props.navigation)
            } else {
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
            }
            return false;
        }

    }).catch((err) => {
        consolepro.consolelog('err', err);

    });
}

forgotverify = () => {
    // this.props.navigation.navigate('Homepage')

    Keyboard.dismiss()

    let email = this.state.email.trim();
    if (email.length <= 0) {
        msgProvider.toast(validation.emptyEmail[config.language], 'center')
        return false;
    }

    if (config.regemail.test(email) !== true) {
        msgProvider.toast(validation.validEmail[config.language], 'center')
        return false
    }


    let url = config.baseURL + "forgot_password.php?email="+this.state.email;

    apifuntion.getApi(url).then((obj) => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
            var user_details = obj.user_details;
            localStorage.setItemObject('user_arr', user_details);

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
        consolepro.consolelog('err', err);
    });
}



    render() {

        return (
            <View style={{ flex: 1, }}>
            <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
            <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                networkActivityIndicatorVisible={true} />
            <Modal
                transparent
                visible={this.state.show}
            >
                <View style={CSSstyle.modelview}>
                    <View style={CSSstyle.mainmodelview}>
                        <View style={CSSstyle.veriview}>
                            <Text style={CSSstyle.veritext}>{Lang_chg.verification[config.language]}</Text></View>
                        <View style={CSSstyle.pleaseview}>
                            <Text style={CSSstyle.pleasetext}>{Lang_chg.verification1[config.language]}</Text></View>
                        <View style={CSSstyle.updateview}>
                            <TouchableOpacity activeOpacity={0.9} style={CSSstyle.editview} onPress={() => { this.onButtonStop(); this.setState({ show: false, minutes_Counter: '01', seconds_Counter: '59', otpstatus: '', }) }}>
                                <Text style={CSSstyle.edittext}>{Lang_chg.edit[config.language]}</Text>
                            </TouchableOpacity>
                            <View style={CSSstyle.numberview}><Text style={CSSstyle.numbertext}>{': +966 ' + this.state.mobile}</Text></View>
                            <View style={CSSstyle.digitview}><Text style={CSSstyle.digittext}>{this.state.email}</Text></View>

                        </View>
                        <View style={CSSstyle.otpview}>
                            <View style={CSSstyle.otptext}>
                                <TextInput value={"" + this.state.otpstatus + ""} onChangeText={(txt) => { this.setState({ otpstatus: txt }) }} style={{ width: '100%', textAlign: 'center', paddingVertical:windowHeight*1.5/100 }} placeholder={Lang_chg.otp[config.language]} placeholderTextColor="#b9b9b9" maxLength={4}></TextInput>
                            </View>
                        </View>

                        <View style={CSSstyle.lastview}>

                            {this.state.startDisable == true ?
                                <View style={CSSstyle.resendtouch}>
                                    <Text style={{ justifyContent: 'center', alignSelf: 'center', color: 'red' }}>{this.state.minutes_Counter + ':' + this.state.seconds_Counter}</Text>
                                </View> :
                                <TouchableOpacity onPress={() => {
                                    this.resend_click()
                                }} activeOpacity={0.9} style={CSSstyle.resendtouch}>
                                    <Text style={CSSstyle.resend}>{Lang_chg.resend[config.language]}</Text>
                                </TouchableOpacity>
                            }
                            <View style={CSSstyle.line}></View>
                            <TouchableOpacity activeOpacity={0.9} style={CSSstyle.resendtouch} onPress={() => {
                                this.verify_click()
                            }}>
                                <Text style={CSSstyle.verify}>{Lang_chg.verify[config.language]}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <ImageBackground source={localimag.splashbg1} style={{ paddingHorizontal: '5%', height: '100%' }}>
                <View style={{ width: '100%', height: '25%', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', }}>
                    <Image style={styles.logo} source={localimag.splash1}></Image>
                    <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={{ position:'absolute',top:windowHeight*2/100,left:0,padding:windowHeight*1/100}}>
                    <Image style={{width:windowWidth*6/100,height:windowWidth*6/100}} source={localimag.backarrowicon}></Image>
                    </TouchableOpacity>
                </View>
                <Text style={styles.login}>{Lang_chg.forgotpassword}</Text>
                <Text style={styles.enteremail}>{Lang_chg.enteremail}</Text>
                <View style={{ width: '100%', paddingVertical:windowHeight*.8/100, flexDirection: 'row', borderBottomColor: 'red', borderBottomWidth: .5, alignSelf: 'center', marginTop: windowHeight * 2.7 / 100 }}>
                    <View style={{ width: '9%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={styles.icon} source={localimag.emailicon}></Image>
                    </View>
                    <View style={{ width: '91%', justifyContent: 'center' }}>
                        <TextInput
                            value={"" + this.state.email + ""}
                            onChangeText={(txt) => { this.setState({ email: txt }) }}
                            keyboardType='email-address'
                            maxLength={60}
                            returnKeyLabel='done'
                            returnKeyType='done'
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            style={[styles.txteditemail, {}]}
                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.email[config.language]}></TextInput>
                    </View>

                </View>


                <TouchableOpacity onPress={() => { this.forgotverify() }} style={[CSSstyle.mainbutton,{marginTop: windowHeight * 5 / 100,}]}>

                    <Text style={styles.txtlogin}>{Lang_chg.submit[config.language]}</Text>
                </TouchableOpacity>




            </ImageBackground>


        </View>
        )
    }
}



const styles = StyleSheet.create({


    logo: {
        width: windowWidth * 65 / 100,
        height: windowHeight * 13 / 100,
        resizeMode: 'contain',

    },
    login: {
        marginTop: windowHeight * 6 / 100, fontSize: windowWidth * 6 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor,
    },
    enteremail: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1,
    },
    icon: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 6 / 100,
        resizeMode: 'contain'
    },
    txteditemail: { fontSize: windowWidth * 3.5 / 100, width: '100%', paddingVertical: windowHeight*1.5/100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },

    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },



});
