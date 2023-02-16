import React, { Component } from 'react'
import {Linking, Text, I18nManager, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import Carousel from 'react-native-banner-carousel';
import FastImage from 'react-native-fast-image'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { DrawerActions } from '@react-navigation/native';
import { localimag } from '../src/Provider/Localimage';
export class CustomDrawerCntent extends Component {
    constructor(props) {

        super(props)
        this.state = {
            username: '',
            user_id: 0,
            user_mobile: '',
            user_image: 'NA',
            test: false


        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.setState({ username: '' })
            this.setState({ user_id: 0 })
            setTimeout(() => {
                this.getvalue()
            }, 500);
        });
        //this.getvalue()

    }
    getvalue = async () => {

        let user_detail = await localStorage.getItemObject('user_arr')

        if (user_detail != null) {
            this.setState({ username: user_detail.name })
            this.setState({ user_mobile: user_detail.mobile })
            this.setState({ user_id: user_detail.user_id })
            if (user_detail.image != 'NA') {
                this.setState({ user_image: config.img_url + user_detail.image })
            }else{
                this.setState({ user_image:'NA'  }) 
            }
        }

    }

    // btn_click=(screen)=>{
    //     this.props.navigation.dispatch(DrawerActions.closeDrawer());
    //     this.props.navigation.navigate(screen)
    // }

    // btnclick_contact = () => {
    //     this.props.navigation.dispatch(DrawerActions.closeDrawer());
    //     if(this.state.user_id!=0){
    //         this.props.navigation.navigate('Contact')
    //     }else{
    //         this.handleBackPresscontact()

    //     }
    // }
    // handleBackPresscontact = () => {
    //     Alert.alert(
    //         msgTitle.login[config.language],
    //         msgText.loginFirst[config.language], [{
    //             text: msgTitle.no[config.language],
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: msgTitle.cancel[config.language]
    //         }, {
    //             text: msgTitle.yes[config.language],
    //             onPress: () => {this.login1()}
    //         }], {
    //             cancelable: false
    //         }
    //     ); 
    //     return true;
    // };
    // login1=async()=>{
    //     await localStorage.removeItem('skip_status');
    //     await localStorage.removeItem('user_arr');
    //     await localStorage.setItemObject('skip_status',null);
    //     await localStorage.setItemObject('user_arr',null);
    //     this.props.navigation.navigate('Login2')
    // }

    // btn_login_logout=async()=>{
    //      if(this.state.user_id==0){
    //         await localStorage.removeItem('skip_status');
    //         await localStorage.removeItem('user_arr');
    //         await localStorage.setItemObject('skip_status',null);
    //         await localStorage.setItemObject('user_arr',null);
    //         this.props.navigation.dispatch(DrawerActions.closeDrawer());
    //         this.props.navigation.navigate('Login2')

    //      }else{
    //         this.handleBackPress()

    //      }
    // }

    // handleBackPress = () => {
    //     Alert.alert(
    //         msgTitle.logout[config.language],
    //         msgTitle.msglogout[config.language], [{
    //             text: msgTitle.no[config.language],
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: msgTitle.cancel[config.language]
    //         }, {
    //             text: msgTitle.yes[config.language],
    //             onPress: () => {this.logout()}
    //         }], {
    //             cancelable: false
    //         }
    //     ); // works best when the goBack is async
    //     return true;
    // };

    // logout=async()=>{
    //     await localStorage.removeItem('user_arr');
    //     await localStorage.setItemObject('user_arr',null);
    //     await localStorage.clear();
    //     this.props.navigation.dispatch(DrawerActions.closeDrawer());
    //     this.props.navigation.navigate('Login2')
    // }
    // shareapp=()=>{
    //     if(Platform.OS=='ios'){
    //         mediafuntion.sharedata('share','https://www.apple.com/in/app-store/','text','this is test');
    //     }else{
    //         mediafuntion.sharedata('share','https://play.google.com/store','text','this is test');
    //     }

    //     this.props.navigation.dispatch(DrawerActions.closeDrawer());
    // }
    // rateapp=()=>{
    //     if(Platform.OS=='ios'){
    //         Linking.openURL('https://www.apple.com/in/app-store/')

    //     }else{
    //         Linking.openURL('https://play.google.com/store')
    //     }

    //     this.props.navigation.dispatch(DrawerActions.closeDrawer());
    // }
    drawerclose = () => {

    }


    changelanguage = (item) => {
        if (item == 0) {
            let url = 'NA'
            if (config.content_arr != 'NA' && config.content_arr[6].content[0] != null) {
                url = config.content_arr[6].content[0]
            }

                mediaprovider.sharedata('Share',url,'Airseekr app','');
             
        } else {
            if (Platform.OS == 'ios') {
                if (config.content_arr != 'NA' && config.content_arr[5].content[0] != null) {
                    Linking.openURL(config.content_arr[5].content[0])
                } else {
                    Linking.openURL('https://www.apple.com/in/app-store/')
                }
            } else {
                if (config.content_arr != 'NA' && config.content_arr[4].content[0] != null) {
                    Linking.openURL(config.content_arr[4].content[0])
                } else {
                    Linking.openURL('https://play.google.com/store')
                }
            }
        }
        this.setState({ test: true })
        this.props.navigation.dispatch(DrawerActions.closeDrawer());


    }

    render() {

        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar backgroundColor={Colors.theme_color1} barStyle='default' hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <ScrollView style={{ width: '70%', backgroundColor: Colors.drwerbg, height: '100%' }}>
                    <View style={{ width: '100%', }}>
                        <ImageBackground source={localimag.drawerbg} style={{ marginBottom: windowHeight * 2 / 100, flexDirection: 'row', height: windowHeight * 20 / 100, alignItems: 'center', paddingLeft: windowWidth * 5 / 100 }}>

                            <Image resizeMode="contain" style={styles.side_img_main} source={this.state.user_image == "NA" ?
                                localimag.user_profile1 : { uri: this.state.user_image }}></Image>

                            <View style={styles.side_menuleft}>
                                <Text style={styles.sidebar_name}>{this.state.username}</Text>
                                {this.state.user_mobile != "" && this.state.user_mobile != null && <Text style={styles.sidebar_mobile}>{'+966 ' + this.state.user_mobile}</Text>}
                            </View>

                        </ImageBackground>


                        <TouchableOpacity activeOpacity={.7} style={styles.side_toch} onPress={() => { this.props.navigation.dispatch(DrawerActions.closeDrawer()); this.props.navigation.navigate('Homepage') }}>
                            <View style={styles.side_toch_btn}>
                                <Image style={styles.menu_list_icon} source={localimag.drawer_home}></Image>
                                <Text style={[styles.home_side_txt, {}]}>{Lang_chg.home[config.language]}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} style={styles.side_toch} onPress={() => { this.props.navigation.dispatch(DrawerActions.closeDrawer()); this.props.navigation.navigate('Myorder') }}>
                            <View style={styles.side_toch_btn}>
                                <Image style={styles.menu_list_icon} source={localimag.drawer_order}></Image>
                                <Text style={[styles.home_side_txt, {}]}>{Lang_chg.order[config.language]}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} style={styles.side_toch} onPress={() => { this.props.navigation.dispatch(DrawerActions.closeDrawer()); this.props.navigation.navigate('Favourite') }}>
                            <View style={styles.side_toch_btn}>
                                <Image style={styles.menu_list_icon} source={localimag.drawer_favourite}></Image>
                                <Text style={[styles.home_side_txt, {}]}>{Lang_chg.favourites[config.language]}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} style={styles.side_toch} onPress={() => { this.props.navigation.dispatch(DrawerActions.closeDrawer()); this.props.navigation.navigate('Setting') }}>
                            <View style={styles.side_toch_btn}>
                                <Image style={styles.menu_list_icon} source={localimag.drawer_setting}></Image>
                                <Text style={[styles.home_side_txt, {}]}>{Lang_chg.setting[config.language]}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} style={styles.side_toch} onPress={() => { this.props.navigation.dispatch(DrawerActions.closeDrawer()); this.props.navigation.navigate('Termsconditions') }}>
                            <View style={styles.side_toch_btn}>
                                <Image style={styles.menu_list_icon} source={localimag.drawer_term}></Image>
                                <Text style={[styles.home_side_txt, {}]}>{Lang_chg.termcondition1[config.language]}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} style={styles.side_toch} onPress={() => { this.props.navigation.dispatch(DrawerActions.closeDrawer()); this.props.navigation.navigate('Privacypolicy') }}>
                            <View style={styles.side_toch_btn}>
                                <Image style={styles.menu_list_icon} source={localimag.drawer_privacy}></Image>
                                <Text style={[styles.home_side_txt, {}]}>{Lang_chg.privacypolicy1[config.language]}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} style={styles.side_toch} onPress={() => { this.changelanguage(0) }}>
                            <View style={styles.side_toch_btn}>
                                <Image style={styles.menu_list_icon} source={localimag.drawer_shareapp}></Image>
                                <Text style={[styles.home_side_txt, {}]}>{Lang_chg.shareapp[config.language]}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} style={styles.side_toch} onPress={() => { this.changelanguage(1) }}>
                            <View style={styles.side_toch_btn}>
                                <Image style={styles.menu_list_icon} source={localimag.drawer_rateapp}></Image>
                                <Text style={[styles.home_side_txt, {}]}>{Lang_chg.rateapp[config.language]}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} style={styles.side_toch} onPress={() => { this.props.navigation.dispatch(DrawerActions.closeDrawer()); config.AppLogout(this.props.navigation) }}>
                            <View style={styles.side_toch_btn}>
                                <Image style={styles.menu_list_icon} source={localimag.drawer_logout}></Image>
                                <Text style={[styles.home_side_txt, {}]}>{Lang_chg.logout[config.language]}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </ScrollView>



            </View>
        );
    }
}


const styles = StyleSheet.create({

    side_img_main: {
        width: windowWidth * 16 / 100,
        height: windowWidth * 16 / 100,
        borderRadius: windowWidth * 8 / 10,
        alignSelf: 'center',
        resizeMode: 'cover'
    },


    sidebar_name: {
        fontFamily: Font.Poppins_SemiBold,
        fontSize: windowWidth * 5 / 100,
        color: 'white',

    },
    sidebar_mobile: {
        fontFamily: Font.Poppins_Regular,
        fontSize: windowWidth * 3.5 / 100,
        color: 'white',

    },

    menu_list_icon: {
        width: windowWidth * 5 / 100,
        height: windowWidth * 5 / 100,

    },
    side_toch_btn: {
        flexDirection: 'row',
        paddingRight: windowWidth * 5 / 100,
        paddingLeft: windowWidth * 5 / 100,
        alignItems: 'center',
        paddingVertical: windowHeight * 1.7 / 100
    },
    home_side_txt: {
        fontSize: windowWidth * 4.3 / 100,
        marginHorizontal: windowWidth * 4 / 100,
        color: Colors.drwrfont,
        fontFamily: Font.Poppins_Regular,
    },


    side_menuleft: {
        marginLeft: windowWidth * 3 / 100,
        alignItems: 'center', justifyContent: 'center'
    },

})