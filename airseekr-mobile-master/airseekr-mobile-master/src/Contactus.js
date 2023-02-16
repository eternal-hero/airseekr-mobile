import React, { Component } from 'react'
import { I18nManager,Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Contactus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            message: '',
            name: '',
            email:'',
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
            name:user_details.name,
            email:user_details.email,
          })
             
        }
      }

      contactus=()=>{
        // msgProvider.toast('Thank you for contact, Will get back you soon','center');            
        // this.props.navigation.goBack()
        // return false
        Keyboard.dismiss()
        let name = this.state.name.trim();
        if (name.length <= 0) {
            msgProvider.toast(validation.emptyFirstName[config.language], 'center')
            return false;
        }
        let email = this.state.email.trim();
        if (email.length <= 0) {
            msgProvider.toast(validation.emptyEmail[config.language], 'center')
            return false;
        }

        if (config.regemail.test(email) !== true) {
            msgProvider.toast(validation.validEmail[config.language], 'center')
            return false
          }

        let message = this.state.message.trim();
        if (message.length <= 0) {
            msgProvider.toast(validation.emptyContactMessage[config.language], 'center')
            return false;
        }
        
    
        let url = config.baseURL + "contact_us.php";
        var data = new FormData();
        data.append('user_id', this.state.user_id)
        data.append('name', name)
        data.append('email', email)
        data.append("message",message)
        
       
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('test', obj)
            this.setState({message:''})
            if (obj.success == 'true') { 
                msgProvider.toast(obj.msg[config.language], 'long')
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
                <TouchableOpacity activeOpacity={0.9} onPress={() => { Keyboard.dismiss() }} style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                    <View style={CSSstyle.notification_header}>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                            <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                        </TouchableOpacity>
                        <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.constactus[config.language]}</Text>
                        <View >
                            <Text >{'     '}</Text>
                        </View>
                    </View>

                   

                    <View style={{ width: '90%', marginTop: windowHeight * 3 / 100, alignSelf: 'center', alignItems: 'flex-start' }}>
{/* //---------------------------------------------- */}



                             <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.nameicon}></Image>
                                </View>
                                <View style={{ width: '91%', justifyContent: 'center' }}>
                                    <TextInput
                                        value={"" + this.state.name + ""}
                                        onChangeText={(txt) => { this.setState({ name: txt }) }}
                                        keyboardType='default'
                                        maxLength={60}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.name[config.language]}></TextInput>
                                </View>

                            </View>
                            <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={{ width: windowWidth * 7 / 100, height: windowWidth * 7 / 100,  resizeMode: 'contain'}} source={localimag.emailicon}></Image>
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
                            <View style={styles.viewstyle}>
                                <View style={{width: '9%',  alignItems: 'center'}}>
                                    <Image style={styles.icon} source={localimag.editicon}></Image>
                                </View>
                                <View style={{ width: '91%',  }}>
                                    <TextInput
                                        value={"" + this.state.message + ""}
                                        onChangeText={(txt) => { this.setState({ message: txt }) }}
                                        keyboardType='default'
                                        maxLength={250}
                                        multiline={true}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => {  }}
                                        style={{textAlignVertical:'top', fontSize: windowWidth * 3.5 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor,height:windowHeight*10/100}}
                                        placeholderTextColor={Colors.blackColor} placeholder={'Enter your message'}></TextInput>
                                </View>

                            </View>
                            
                            <TouchableOpacity onPress={() => {this.contactus()  }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 7 / 100, }]}>

                                <Text style={styles.txtlogin}>{Lang_chg.send[config.language]}</Text>
                                </TouchableOpacity>


                         {/* //------------------------------------------    */}
                        </View>

                   





                </TouchableOpacity>

            </View>



        )
    }
}



const styles = StyleSheet.create({
    
    viewstyle:{ marginTop: windowHeight * 2 / 100, width: '100%', paddingVertical: windowHeight * 1.5 / 100, flexDirection: 'row', borderBottomColor: 'red', borderBottomWidth: .5, alignSelf: 'center',justifyContent: 'center',},
    iconview:{width: '9%', justifyContent: 'center', alignItems: 'center'}, 
   
     icon: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 6 / 100,
        resizeMode: 'contain'
    },
    txteditemail: { fontSize: windowWidth * 3.5 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },
   
    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },
});