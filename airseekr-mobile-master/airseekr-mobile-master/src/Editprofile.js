import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView, ViewBase } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import FastImage from 'react-native-fast-image'
import Footer from './Provider/Footer';
import Carousel from 'react-native-banner-carousel';
import CountDown from 'react-native-countdown-component';
import {firebaseprovider}  from './Provider/FirebaseProvider';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import { color } from 'react-native-reanimated';
export default class Editprofile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            name: '',
            email: '',
            mobile: '',
            password: '',
            confirmpassword: '',
            secureoldpassword: true,
            secureconfirmpassword: true,
            address: '',
            latitude: '',
            longitude: '',
            imagepath: '',
            imagepath1: '',
            cameramodalon: false,
            takeimage: false,
            takecoverimage: false,
            user_roll: 0,
            camera: 0,
        }

    }
    componentDidMount() {

        this.props.navigation.addListener('focus', () => {
            //  this.getvalue()
            this.getaddress()
            this.setState({ isseller: config.isseller })
        });
        this.getvalue()
    }
    //-------------------update user address----------------//
    getaddress = async () => {
        if (user_address != '') {
            this.setState({
                address: user_address,
                latitude: user_address_lat,
                longitude: user_address_long,

            })
        }
    }
//-------------------get user value from local database----------------//
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
                name: user_details.name,
                email: user_details.email,
                mobile: (user_details.mobile).toString(),
                address: user_details.address,
                latitude: user_details.latitude,
                longitude: user_details.longitude,
                user_roll: user_details.user_roll
            })
            if (user_details.image != 'NA') {
                this.setState({ imagepath: config.img_url1 + user_details.image })

            } else {
                consolepro.consolelog('image',)
                this.setState({ imagepath: 'NA' })
            }
            if (user_details.cover_image != 'NA') {

                this.setState({ imagepath1: config.img_url2 + user_details.cover_image })
            } else {
                consolepro.consolelog('cover_image')
                this.setState({ imagepath1: 'NA' })
            }

        }
    }


//-------------------open camera for take image----------------//
    _openCamera = () => {

        mediaprovider.launchCamera().then((obj) => {
            consolepro.consolelog('imageobj', obj)
            this.setState({ cameramodalon: false })
            if (this.state.camera == 0) {
                this.setState({
                    imagepath: obj.path, takeimage: true
                })
            } else {
                this.setState({
                    imagepath1: obj.path, takecoverimage: true
                })
            }

        })
    }
    //-------------------open gallery for take image----------------//
    _openGellery = () => {

        mediaprovider.launchGellery().then((obj) => {
            consolepro.consolelog('imageobj', obj)
            this.setState({ cameramodalon: false })
            if (this.state.camera == 0) {
                if (obj.mime == "image/jpeg") {
                    this.setState({
                        imagepath: obj.path, takeimage: true

                    })
                } else {
                    this.setState({
                        imagepath: 'NA', takeimage: false

                    })
                }
            } else {
                if (obj.mime == "image/jpeg") {
                    this.setState({
                        imagepath1: obj.path, takecoverimage: true

                    })
                } else {
                    this.setState({
                        imagepath1: 'NA', takecoverimage: false

                    })
                }
            }

        })
    }

//-------------------call api for edit profile-----------------//
    editprofile = () => {
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

        let mobile = this.state.mobile.trim();
        if (mobile.length <= 0) {
            msgProvider.toast(validation.emptyPhone[config.language], 'center')
            return false;
        }
        if (mobile.length < 7) {
            msgProvider.toast(validation.lengthPhone[config.language], 'center')
            return false;
        }
        let location = this.state.address.trim();
        if (location.length <= 0) {
            msgProvider.toast(validation.emptyAddress[config.language], 'center')
            return false;
        }


        let url = config.baseURL + "edit_profile.php";
        var data = new FormData();
        data.append('user_id', this.state.user_id)
        data.append('name', name)
        data.append('email', email)
        data.append("mobile", mobile)
        data.append("address", location)
        data.append("latitude", this.state.latitude)
        data.append("longitude", this.state.longitude)
        data.append("type", 0)
        data.append("abn_number", 0)
        if (this.state.takeimage == true) {
            data.append('profile_pic', {
                uri: this.state.imagepath,
                type: 'image/jpg',
                name: 'image.jpg'
            })
        }
        if (this.state.takecoverimage == true) {
            data.append('profile_pic_cover', {
                uri: this.state.imagepath1,
                type: 'image/jpg',
                name: 'image.jpg'
            })
        }

        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('test', obj)
            if (obj.success == 'true') {
                var user_details = obj.user_details;
                localStorage.setItemObject('user_arr', user_details);
                msgProvider.toast(obj.msg[config.language], 'long')
                setTimeout(() => {
                    firebaseprovider.firebaseUserCreate();
                }, 1000);
                this.props.navigation.navigate('Profile')

            } else {
                if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
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
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Cameragallery mediamodal={this.state.cameramodalon} Camerapopen={() => { this._openCamera() }} Galleryopen={() => { this._openGellery() }} Canclemedia={() => { this.setState({ cameramodalon: false }) }} />
                <KeyboardAvoidingView style={{ flex: 1, }}
                    behavior={Platform.OS === "ios" ? "padding" : null}>
                    <ScrollView >
                        <View style={{ backgroundColor: Colors.whiteColor, paddingBottom: windowHeight * 2 / 100 }}>

                            <View style={CSSstyle.notification_header}>
                                <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                    <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                                </TouchableOpacity>
                                <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.editprofile[config.language]}</Text>
                                <View >
                                    <Text >{'      '}</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => { this.setState({ cameramodalon: true, camera: 1 }) }} style={{ width: '100%', height: windowHeight * 40 / 100, }}>
                                <ImageBackground
                                    onLoadStart={() => this.setState({ showDefault: false })}
                                    onLoad={() => this.setState({ showDefault: false })}
                                    blurRadius={20}
                                    style={{
                                        width: '100%', height: windowHeight * 40 / 100, alignItems: 'center', resizeMode: 'cover',
                                       
                                    }} source={this.state.imagepath1 == 'NA' ? localimag.backbg : { uri: this.state.imagepath1 }}
                                    resizeMode={FastImage.resizeMode.stretch} >

                                    <View style={{ padding: 5, alignSelf: 'flex-end' }} >
                                        <Image style={[{ width: windowWidth * 10 / 100, height: windowWidth * 10 / 100, borderRadius: windowWidth * 7.5 / 100, resizeMode: "cover", }]} source={localimag.cameraicon}></Image>
                                    </View>

                                    <TouchableOpacity onPress={() => { this.setState({ cameramodalon: true, camera: 0 }) }} style={{ marginTop: windowHeight * 4.5 / 100, flexDirection: 'row', paddingVertical: 1, paddingHorizontal: windowWidth * 7 / 100, alignItems: 'center', justifyContent: 'center', width: windowWidth * 25 / 100, height: windowWidth * 25 / 100, backgroundColor: Colors.whiteColor, borderRadius: windowWidth * 12.5 / 100, }} >
                                        <Image style={[{ width: windowWidth * 22 / 100, height: windowWidth * 22 / 100, borderRadius: windowWidth * 11 / 100, resizeMode: "cover", }]} source={this.state.imagepath == 'NA' ? localimag.user_profile : { uri: this.state.imagepath }}></Image>
                                        <Image style={[{ position: 'absolute', bottom: 0, right: 0, width: windowWidth * 8 / 100, height: windowWidth * 8 / 100, borderRadius: windowWidth * 11 / 100, resizeMode: "cover", }]} source={localimag.cameraicon}></Image>
                                    </TouchableOpacity>
                                </ImageBackground>

                            </TouchableOpacity>


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
                                    <View style={[styles.iconview, { marginRight: windowWidth * 1 / 100 }]}>
                                        <Image style={{ width: windowWidth * 7 / 100, height: windowWidth * 7 / 100, resizeMode: 'contain' }} source={localimag.emailicon}></Image>
                                    </View>
                                    <View style={{ width: '91%', justifyContent: 'center' }}>
                                        <Text style={[styles.txteditemail, { marginLeft: windowWidth * .7 / 100, color: Colors.greyColor }]}>{this.state.email}</Text>

                                    </View>

                                </View>
                                <View style={styles.viewstyle}>
                                    <View style={styles.iconview}>
                                        <Image style={styles.icon} source={localimag.phoneicon}></Image>
                                    </View>
                                    <View style={{ width: '91%', flexDirection: 'row' }}>
                                        <Text style={{ fontSize: windowWidth * 3.5 / 100, width: '10%', fontFamily: Font.Poppins_Regular, color: Colors.blackColor, alignSelf: 'center' }}> {'+61'}</Text>
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
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Location') }} style={styles.viewstyle}>
                                    <View style={styles.iconview}>
                                        <Image style={styles.icon} source={localimag.locationicon}></Image>
                                    </View>
                                    <View style={{ width: '91%', justifyContent: 'center' }}>

                                        <Text style={[styles.txteditemail, { marginLeft: windowWidth * .3 / 100 }]}> {this.state.address}</Text>

                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.editprofile() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 7 / 100, }]}>

                                    <Text style={styles.txtlogin}>{Lang_chg.update[config.language]}</Text>
                                </TouchableOpacity>


                                {/* //------------------------------------------    */}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>




            </View>
        )
    }
}



const styles = StyleSheet.create({


    viewstyle: { marginTop: windowHeight * 2 / 100, width: '100%', paddingVertical: windowHeight * 1.5 / 100, flexDirection: 'row', borderBottomColor: 'red', borderBottomWidth: .5, alignSelf: 'center', justifyContent: 'center', },
    iconview: { width: '9%', justifyContent: 'center', alignItems: 'center' },

    icon: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 6 / 100,
        resizeMode: 'contain'
    },
    txteditemail: { fontSize: windowWidth * 3.5 / 100, width: '90%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },

    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },


});
