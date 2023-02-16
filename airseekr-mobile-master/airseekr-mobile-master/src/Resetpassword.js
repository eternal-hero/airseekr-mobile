import React, { Component } from 'react'
import {I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,  Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {localimag} from '../src/Provider/Localimage';
export default class Resetpassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            password:'',
            confirmpassword:'',
            securepassword:true,
            secureconfirmpassword:true,
            user_id:''
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
         });
      }
      getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
          this.setState({
           user_id:user_details.user_id,
          })
        }
      }

    resetpassword=()=> {
    Keyboard.dismiss()
    let password = this.state.password.trim();
    if (password.length <= 0) {
        msgProvider.toast(validation.emptyPassword[config.language], 'center')
        return false;
    }
    if (password.length <= 5) {
        msgProvider.toast(validation.lengthPassword[config.language], 'center')
        return false;
    }
    let confirmpassword = this.state.confirmpassword.trim();
    if (confirmpassword.length <= 0) {
        msgProvider.toast(validation.emptyconfirmPassword[config.language], 'center')
        return false;
    }

    if(password != confirmpassword){
        msgProvider.toast(validation.verifypassword[config.language], 'center')
        return false;
    }

    let url = config.baseURL + "forgot_password_reset.php?user_id="+this.state.user_id+'&password='+password;
    consolepro.consolelog('url', url);
    apifuntion.getApi(url).then((obj) => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
            var user_details = obj.user_details;
            localStorage.setItemObject('user_arr', user_details);
            msgProvider.toast(obj.msg[config.language], 'center')
            this.props.navigation.navigate('Login')
            
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
                      <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                                        <View style={CSSstyle.notification_header}>
                                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                                            </TouchableOpacity>
                                            <Text style={[CSSstyle.Notifications_title, {  }]}>{Lang_chg.resetpassword[config.language]}</Text>
                                            <View >
                                                <Text >{'       '}</Text>
                                            </View>
                                      </View> 

                        <View style={[styles.mainview,{marginTop:windowHeight*5/100}]}>
                           <View style={{width:'12%',alignItems:'center',justifyContent:'center',}}>
                                <Image  style={styles.icon} source={localimag.lock}></Image>
                            </View>
                            <View style={{width:'72%',marginHorizontal:3,alignItems:'center'}}>    
                                <TextInput 
                                 value={"" + this.state.password + ""}
                                        onChangeText={(txt) => { this.setState({ password: txt.trim() }) }}
                                        keyboardType='default'
                                        secureTextEntry={this.state.securepassword}
                                        maxLength={40}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={I18nManager.isRTL == false ? [styles.txtaddtype,{textAlign:'left'}]:[styles.txtaddtype,{textAlign:'right'}]}

                                        placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.password[config.language]}></TextInput>
                            </View>
                            <TouchableOpacity onPress={()=>{this.setState({securepassword:!this.state.securepassword})}} style={{width:'12%',alignItems:'center',justifyContent:'center'}}>
                                {this.state.securepassword==true ? <Image  style={styles.icon} source={localimag.eye}></Image>
                                :<Image  style={styles.icon} source={localimag.eye}></Image>}
                            </TouchableOpacity>
                        </View> 

                        <View style={[styles.mainview,{marginTop:windowHeight*2.8/100}]}>
                           <View style={{width:'12%',alignItems:'center',justifyContent:'center',}}>
                                <Image  style={styles.icon} source={localimag.lock}></Image>
                            </View>
                            <View style={{width:'72%',marginHorizontal:3,alignItems:'center'}}>    
                                <TextInput 
                                 value={"" + this.state.confirmpassword + ""}
                                        onChangeText={(txt) => { this.setState({ confirmpassword: txt.trim() }) }}
                                        keyboardType='default'
                                        secureTextEntry={this.state.secureconfirmpassword}
                                        maxLength={40}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={I18nManager.isRTL == false ? [styles.txtaddtype,{textAlign:'left'}]:[styles.txtaddtype,{textAlign:'right'}]}

                                        placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.confrmpassword[config.language]}></TextInput>
                            </View>
                            <TouchableOpacity onPress={()=>{this.setState({secureconfirmpassword:!this.state.secureconfirmpassword})}} style={{width:'12%',alignItems:'center',justifyContent:'center'}}>
                                {this.state.secureconfirmpassword==true ? <Image  style={styles.icon} source={localimag.eye}></Image>
                                :<Image  style={styles.icon} source={localimag.eye}></Image>}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={()=>{this.resetpassword()}} style={[CSSstyle.mainbutton,{marginTop:windowHeight*8/100,}]}>
                             
                             <Text style={styles.txtlogin}>{Lang_chg.submit[config.language]}</Text>
                        </TouchableOpacity>

                      </View>

              </View> 
        )
    }
}
const styles = StyleSheet.create({
    txtaddtype:{fontSize:windowWidth*3.8/100,width:'100%',paddingVertical:windowWidth*.1/100,fontFamily:Font.Poppins_Regular,color:Colors.blackColor},
    txtlogin:{
        fontSize:windowWidth*4/100,fontFamily:Font.Poppins_Bold,color:Colors.whiteColor,alignSelf:'center'
    },
    icon: {
        width:windowWidth*5/100,
        height:windowWidth*5/100,
        resizeMode: 'contain'
    },
    mainview:{width:'90%',paddingVertical:10,borderColor:Colors.border_color,borderWidth:1, flexDirection:'row',backgroundColor:Colors.whiteColor,alignSelf:'center',},
});