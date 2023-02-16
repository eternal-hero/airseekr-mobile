import React, { Component } from 'react'
import { I18nManager, Text, BackHandler, Checkbox, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import HTMLView from 'react-native-htmlview';

import {firebaseprovider}  from './Provider/FirebaseProvider';
import CSSstyle from './css';
import { localimag } from './Provider/Localimage';
export default class Socialsignup extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props)
        this.state = {
            social_data:this.props.route.params.social_data,
            name: '',
            social_id:'',
            signup_type:'social',
            email: '',
            mobile: '',
            address: 'Choose location',
            latitude: config.latitude,
            longitude: config.longitude,
            uncheck: 'unchecked',
            modalVisible2: false,
            modalVisible1: false,
            privacydata:'',
            termservice:'',
            // privacydata: 'Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remainsWarner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains',
            // termservice: 'Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remainsWarner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains',

        }
        this._didFocusSubscription =this.props.navigation.addListener('focus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    );

    }
    handleBackPress  ()  {
        return true
    }
    componentDidMount() {
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    );
        let check = 'unchecked';
        if (Platform.OS == 'ios') {
            check = 'indeterminate';
        }
        this.setState({ uncheck: check ,
            name:this.state.social_data?.social_name?.trim()?.toLowerCase() === 'null' ? '' : this.state.social_data?.social_name,
            email:this.state.social_data?.social_email,
            signup_type:this.state.social_data?.social_type,
            social_id:this.state.social_data?.social_id,


        })
        this.props.navigation.addListener('focus', () => {
           this.getaddress()
            this.getvalue()
        });
    }


    getaddress = async () => {
        if(user_address!=''){
            this.setState({
                address: user_address,
                latitude: user_address_lat,
                longitude: user_address_long,

            })
        }
    }
    getvalue = async () => {

        if (config.content_arr == "NA") {
            this.getallcontent()
        } else {

            this.setState({ termservice: config.content_arr[2].content[config.language] })
            this.setState({ privacydata: config.content_arr[1].content[config.language] })
        }
    }
    getallcontent = () => {
        consolepro.consolelog('getallcontent')
        let url = config.baseURL + 'get_all_content.php?Submit=Submit'
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('obj.content_arr', obj.content_arr);

                if (obj.content_arr != 'NA') {
                    config.content_arr = obj.content_arr;
                    if(config.device_type=='ios'){
                        config.guest_status=obj.guest_status;
                    }else{
                        config.guest_status =false
                    }
                    this.setState({ termservice: obj.content_arr[2].content[config.language] })
                    this.setState({ privacydata: obj.content_arr[1].content[config.language] })
                }

            } else {
                if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
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

    signup = () => {
        //  this.props.navigation.navigate('Homepage')
        //  return false
        Keyboard.dismiss()

        let name = this.state.name?.trim();
        if (!name || name.length <= 0 || name == "null") {
            msgProvider.toast(validation.emptyFirstName[config.language], 'center')
            return false;
        }
        let email = this.state.email?.trim();
        if (!email || email?.length <= 0) {
            msgProvider.toast(validation.emptyEmail[config.language], 'center')
            return false;
        }


        let mobile = this.state.mobile?.trim();
        if (!mobile || mobile.length <= 0) {
            msgProvider.toast(validation.emptyPhone[config.language], 'center')
            return false;
        }
        if (mobile.length < 7) {
            msgProvider.toast(validation.lengthPhone[config.language], 'center')
            return false;
        }
        let location =user_address;
        if (!location || location?.length <= 0) {
            msgProvider.toast(validation.emptyAddress[config.language], 'center')
            return false;
        }

        let url = config.baseURL + "signup.php";
        var data = new FormData();
        data.append('signup_type', this.state.signup_type)
        data.append('social_id', this.state.social_id)
        data.append('name', this.state.name)
        data.append('mobile', this.state.mobile)
        data.append('password', '47851')
        data.append("device_type", config.device_type)
        data.append("player_id", player_id_me1)
        data.append("email", this.state.email)
        data.append("address", this.state.address)
        data.append("latitude", this.state.latitude)
        data.append("longitude", this.state.longitude)
        consolepro.consolelog('test', data)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('test111', obj)
            if (obj.success == 'true') {
                const uservalue = { "login_type": this.state.social_type, "social_email": this.state.social_email, 'social_id':this.state.social_id };
                            localStorage.setItemObject('user_login', uservalue);
                            localStorage.setItemObject('user_arr',obj?.user_details)
                if (obj.notification_arr != 'NA') {
                    notification.notification_arr(obj.notification_arr)
                }
                firebaseprovider.firebaseUserCreate();
                firebaseprovider.getMyInboxAllData();
                    this.props.navigation.navigate('Homepage')




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


    render() {

        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <Modal animationType="slide" transparent={true} visible={this.state.modalVisible1}
                    onRequestClose={() => {

                    }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{ flex: 1, backgroundColor: 'white', }}>
                            <View style={CSSstyle.notification_header}>
                                <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.setState({ modalVisible1: false }) }}>
                                    <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                                </TouchableOpacity>
                                <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.privacypolicy1[config.language]}</Text>
                                <View >
                                    <Text ></Text>
                                </View>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.terms_txt}>
                                    <HTMLView
                                        value={this.state.privacydata}
                                        stylesheet={styles.p}
                                    />

                                </View>
                            </ScrollView>

                        </View>
                    </SafeAreaView>
                </Modal>
                <Modal animationType="slide" transparent={true} visible={this.state.modalVisible2}
                    onRequestClose={() => {

                    }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{ flex: 1, backgroundColor: 'white', }}>
                            <View style={CSSstyle.notification_header}>
                                <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.setState({ modalVisible2: false }) }}>
                                    <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                                </TouchableOpacity>
                                <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.termcondition[config.language]}</Text>
                                <View activeOpacity={.7}>
                                    <Text ></Text>
                                </View>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.terms_txt}>
                                    <HTMLView
                                        value={this.state.termservice}
                                        stylesheet={styles.p}
                                    />

                                </View>
                            </ScrollView>

                        </View>
                    </SafeAreaView>
                </Modal>
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.theme_color }}
                    behavior={Platform.OS === "ios" ? "padding" : null}>
                    <ScrollView style={{}} >
                        <ImageBackground source={localimag.splashbg1} style={{ paddingHorizontal: '5%', }}>
                            <View style={{ width: '100%', marginTop: windowHeight * 5 / 100, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', }}>
                                <Image style={styles.logo} source={localimag.splash1}></Image>
                            </View>
                            <Text style={[styles.login, { marginBottom: windowHeight * 1 / 100 }]}>{Lang_chg.signup}</Text>

                            <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.nameicon}></Image>
                                </View>
                                <View style={{ width: '91%', justifyContent: 'center' }}>
                                    <TextInput
                                        value={this.state.name}
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
                                    <Image style={{ width: windowWidth * 7 / 100, height: windowWidth * 7 / 100, resizeMode: 'contain' }} source={localimag.emailicon}></Image>
                                </View>
                                <View style={{ width: '91%', justifyContent: 'center' }}>
                                <Text style={[styles.txteditemail, {  }]}> {this.state.email}</Text>
                                    {/* <TextInput
                                        value={"" + this.state.email + ""}
                                        onChangeText={(txt) => { this.setState({ email: txt }) }}
                                        keyboardType='email-address'
                                        maxLength={60}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.email[config.language]}></TextInput> */}
                                </View>

                            </View>
                            <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.phoneicon}></Image>
                                </View>
                                <View style={{ width: '91%', justifyContent: 'center' ,flexDirection:'row',alignItems:'center' }}>
                                <Text style={ {marginTop:1.2, fontSize: windowWidth * 3.5 / 100, width: '10%',  fontFamily: Font.Poppins_Regular, color: Colors.blackColor,alignSelf:'center'   }}> {'+61'}</Text>

                                    <TextInput
                                        value={"" + this.state.mobile + ""}
                                        onChangeText={(txt) => { this.setState({ mobile: txt }) }}
                                        keyboardType='number-pad'
                                        maxLength={15}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.mobile[config.language]}></TextInput>
                                </View>

                            </View>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Location')}} style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.locationicon}></Image>
                                </View>
                                <View style={{ width: '91%', justifyContent: 'center' }}>

                                    <Text style={[styles.txteditemail, {  }]}> {this.state.address}</Text>

                                </View>

                            </TouchableOpacity>

                            {/* <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.passwordicon}></Image>
                                </View>
                                <View style={{ width: '80%', justifyContent: 'center' }}>
                                    <TextInput
                                        value={"" + this.state.password + ""}
                                        onChangeText={(txt) => { this.setState({ password: txt }) }}
                                        keyboardType='default'
                                        maxLength={60}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        secureTextEntry={this.state.secureoldpassword}
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.password[config.language]}></TextInput>
                                </View>

                                <TouchableOpacity onPress={() => { this.setState({ secureoldpassword: !this.state.secureoldpassword }) }} style={{ width: '11%', alignItems: 'center', justifyContent: 'center' }}>
                                    {this.state.secureoldpassword ? <Text style={styles.icontext1}>{Lang_chg.show[config.language]}</Text> :
                                        <Text style={styles.icontext1}>{Lang_chg.hide[config.language]}</Text>
                                    }
                                </TouchableOpacity>

                            </View> */}
                            {/* <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.passwordicon}></Image>
                                </View>
                                <View style={{ width: '80%', justifyContent: 'center' }}>
                                    <TextInput
                                        value={"" + this.state.confirmpassword + ""}
                                        onChangeText={(txt) => { this.setState({ confirmpassword: txt }) }}
                                        keyboardType='default'
                                        maxLength={60}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        secureTextEntry={this.state.secureconfirmpassword}
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.confrmpassword[config.language]}></TextInput>
                                </View>

                                <TouchableOpacity onPress={() => { this.setState({ secureconfirmpassword: !this.state.secureconfirmpassword }) }} style={{ width: '11%', alignItems: 'center', justifyContent: 'center' }}>
                                    {this.state.secureconfirmpassword ? <Text style={styles.icontext1}>{Lang_chg.show[config.language]}</Text> :
                                        <Text style={styles.icontext1}>{Lang_chg.hide[config.language]}</Text>
                                    }
                                </TouchableOpacity>


                            </View> */}

                            <Text style={[styles.forgottext, { marginTop: windowHeight * 3.5 / 100, }]}>{Lang_chg.bysign[config.language]}

                            </Text>
                            <Text style={[styles.forgottext, { }]}>{''}
                            <Text onPress={() => { this.setState({ modalVisible2: true }) }} style={[styles.forgottext, { textDecorationLine: 'underline' }]}>{Lang_chg.termcondition1[config.language]}</Text>
                            <Text style={styles.forgottext}>{Lang_chg.and[config.language]}
                                <Text onPress={() => { this.setState({ modalVisible1: true }) }} style={[styles.forgottext, { textDecorationLine: 'underline' }]}>{Lang_chg.privacypolicy[config.language]}</Text>

                            </Text>
                            </Text>


                            <TouchableOpacity onPress={() => { this.signup() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 3 / 100, }]}>

                                <Text style={styles.txtlogin}>{Lang_chg.signup[config.language]}</Text>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => { this.props.navigation.replace('Login') }} style={{ alignItems: 'center', alignSelf: 'center', marginVertical: windowHeight * 3.5 / 100 }} >
                                <Text style={styles.orlogintxt}>{Lang_chg.alreadyaccount[config.language]}
                                    <Text style={styles.signuphere}>{Lang_chg.loginhere[config.language]} </Text>
                                </Text>
                            </TouchableOpacity>



                        </ImageBackground>

                    </ScrollView>
                </KeyboardAvoidingView>


            </View>
        )
    }
}



const styles = StyleSheet.create({
    viewstyle: { marginTop: windowHeight * 2 / 100, width: '100%', paddingVertical: windowHeight * 1.5 / 100, flexDirection: 'row', borderBottomColor: 'red', borderBottomWidth: .5, alignSelf: 'center', justifyContent: 'center', },
    iconview: { width: '9%', justifyContent: 'center', alignItems: 'center' },
    logo: {
        width: windowWidth * 65 / 100,
        height: windowHeight * 13 / 100,
        resizeMode: 'contain',

    },
    login: {
        marginTop: windowHeight * 6 / 100, fontSize: windowWidth * 6 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor,
    },
    icon: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 6 / 100,
        resizeMode: 'contain'
    },
    txteditemail: { fontSize: windowWidth * 3.5 / 100, width: '90%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },
    icontext1: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'center'
    },
    forgottext: {
       fontSize: windowWidth * 2.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'center'
    },
    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },
    orlogintxt: {
        fontSize: windowWidth * 3.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'center'
    },
    signuphere: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'center'
    },

    socialicon: {
        width: windowWidth * 16 / 100,
        height: windowWidth * 16 / 100,
        resizeMode: 'contain'
    },



    p: {
        color: 'black', // make links coloured pink
        textAlign: 'justify',
        marginBottom: -50,
        lineHeight: 24,
        letterSpacing: 0.8,
        fontStyle: 'normal',
        fontFamily: Font.regular_font,
    },

    textfont: {
        fontFamily: Font.Poppins_Regular,
        fontSize: 13,
        paddingLeft: 10
      },
      p: {
        fontWeight: '300',
        color: 'black', // make links coloured pink
        // textAlign:'justify',
        marginBottom: -50,
        lineHeight: 24,
        letterSpacing: 0.8,
        fontStyle: 'normal',
        fontFamily: Font.Poppins_Regular
      },
    terms_txt: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
      },

});
