import React, { Component, useState, useRef } from 'react';
import {
    I18nManager,
    Text,
    BackHandler,
    Checkbox,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Alert,
    View,
    StyleSheet,
    Keyboard,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    FlatList,
    ScrollView,
} from 'react-native';
import {
    config,
    Otpprovider,
    notification,
    Mapprovider,
    apifuntion,
    Colors,
    Font,
    validation,
    mobileH,
    mobileW,
    SocialLogin,
    Cameragallery,
    mediaprovider,
    localStorage,
    Lang_chg,
    consolepro,
    msgProvider,
    msgTitle,
    msgText,
    Currentltlg,
} from './Provider/utilslib/Utils';
import DeviceCountry, {
    TYPE_ANY,
    TYPE_TELEPHONY,
    TYPE_CONFIGURATION,
} from 'react-native-device-country';

import HTMLView from 'react-native-htmlview';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// import * as RNLocalize from 'react-native-localize';
// import { NetworkInfo } from 'react-native-network-info';
// import DeviceInfo from 'react-native-device-info';
import PhoneInput from 'react-native-phone-number-input';
import { firebaseprovider } from './Provider/FirebaseProvider';
import CountDown from 'react-native-countdown-component';
import CSSstyle from './css';
import { localimag } from '../src/Provider/Localimage';
import { Directions } from 'react-native-gesture-handler';

console.log(DeviceCountry.getCountryCode().result);

export default class Signup extends Component {
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this.phoneInput = React.createRef();
        this.state = {
            name: '',
            email: '',
            mobile: '',
            password: '',
            address: 'Choose location',
            latitude: config.latitude,
            longitude: config.longitude,
            confirmpassword: '',
            secureoldpassword: true,
            secureconfirmpassword: true,
            location: 'Choose location',
            check: false,
            uncheck: 'unchecked',
            modalVisible2: false,
            modalVisible1: false,
            privacydata: '',
            termservice: '',
            // privacydata: 'Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remainsWarner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains',
            // termservice: 'Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remainsWarner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains',
            minutes_Counter: '01',
            seconds_Counter: '59',
            show: false,
            timer: null,
            startDisable: false,
            otpstatus: '',
            user_id: '',
            userotp: 0,
            verifydisable: false,
            phoneCode: 'default',
            guest_status: false
        };
        this._didFocusSubscription = this.props.navigation.addListener(
            'focus',
            payload =>
                BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
        );
    }

    handleBackPress() {
        return true;
    }
    componentDidMount() {
        this._willBlurSubscription = this.props.navigation.addListener(
            'blur',
            payload =>
                BackHandler.removeEventListener(
                    'hardwareBackPress',
                    this.handleBackPress,
                ),
        );

        DeviceCountry.getCountryCode(TYPE_CONFIGURATION)
            .then(result => {
                this.setState({ phoneCode: result.code });
                // {"code": "BY", "type": "config"}
            })
            .catch(e => {
                console.log(e);
            });

        let check = 'unchecked';
        if (Platform.OS == 'ios') {
            check = 'indeterminate';
        }
        this.setState({ uncheck: check });
        this.props.navigation.addListener('focus', () => {
            this.getaddress();
            this.getvalue();
            this.checkguest();
            this.checksocial();
        });
    }

    checksocial = async () => {
        let user_login = await localStorage.getItemObject('user_login');
        if (user_login != null) {
            if (user_login.login_type == 'google') {
                localStorage.setItemObject('user_login', null);
                SocialLogin.socaillogout('google', this.props.navigation);
            }
            if (user_login.login_type == 'facebook') {
                localStorage.setItemObject('user_login', null);
                SocialLogin.socaillogout('facebook', this.props.navigation);
            }
        }
    };
    checkguest = async () => {
        if (config.device_type != 'ios') {
            this.setState({guest_status: false})
            config.guest_status = false;
        } else {
            if (config.content_arr == 'NA') {
                this.getallcontent();
            }
        }
    };

    getaddress = async () => {
        if (user_address != '') {
            this.setState({
                address: user_address,
                latitude: user_address_lat,
                longitude: user_address_long,
            });
        }
    };
    getvalue = async () => {
        if (config.content_arr == 'NA') {
            this.getallcontent();
        } else {
            this.setState({
                termservice: config.content_arr[2].content[config.language],
            });
            this.setState({
                privacydata: config.content_arr[1].content[config.language],
            });
        }
    };
    getallcontent = () => {
        consolepro.consolelog('getallcontent');
        let url = config.baseURL + 'get_all_content.php?Submit=Submit';
        apifuntion
            .getApi(url)
            .then(obj => {
                if (obj.success == 'true') {
                    consolepro.consolelog('obj', obj);

                    if (obj.content_arr != 'NA') {
                        config.content_arr = obj.content_arr;
                        if (config.device_type == 'ios') {
                            config.guest_status = obj.guest_status;
                            this.setState({
                                guest_status: obj.guest_status
                            });
                        } else {
                            config.guest_status = false;
                            this.setState({
                                guest_status: false
                            });
                        }
                        
                        this.setState({
                            termservice: obj.content_arr[2].content[config.language],
                        });
                        this.setState({
                            privacydata: obj.content_arr[1].content[config.language],
                        });
                    }
                } else {
                    if (
                        obj.active_status == '0' ||
                        obj.msg[config.language] == msgTitle.usernotexit[config.language]
                    ) {
                        config.checkUserDeactivate(this.props.navigation);
                    } else {
                        msgProvider.alert(
                            msgTitle.information[config.language],
                            obj.msg[config.language],
                            false,
                        );
                    }
                    return false;
                }
            })
            .catch(err => {
                consolepro.consolelog('err', err);
            });
    };

    onButtonStart = () => {
        let timer = setInterval(() => {
            if (
                this.state.minutes_Counter == '00' &&
                this.state.seconds_Counter == '01'
            ) {
                this.onButtonStop();
            }

            var num = (Number(this.state.seconds_Counter) - 1).toString(),
                count = this.state.minutes_Counter;

            if (this.state.seconds_Counter == '00') {
                count = (Number(this.state.minutes_Counter) - 1).toString();
                num = 59;
            }
            if (count != -1) {
                this.setState({
                    minutes_Counter: count.length == 1 ? '0' + count : count,
                    seconds_Counter: num.length == 1 ? '0' + num : num,
                });
            } else {
                this.onButtonStop();
            }
        }, 1000);

        this.setState({ timer });

        this.setState({ startDisable: true });
    };

    onButtonStop = () => {
        clearInterval(this.state.timer);
        this.setState({ startDisable: false });
    };

    resend_click = async () => {
        // this.setState({ show: false })

        // return false

        this.setState({ minutes_Counter: '01' });
        this.setState({ seconds_Counter: '59' });
        let url = config.baseURL + 'resend_otp.php';
        var data = new FormData();
        data.append('user_id', this.state.user_id);
        apifuntion
            .postApi(url, data)
            .then(obj => {
                consolepro.consolelog('test11', obj);
                if (obj.success == 'true') {
                    this.setState({ startDisable: true });
                    // this.sendmail(obj)
                    if (obj.showotp == true) {
                        this.setState({ otpstatus: obj.otp });
                    }
                    this.setState({ userotp: obj.otp });

                    msgProvider.alert(
                        msgTitle.information[config.language],
                        obj.msg[config.language],
                        false,
                    );
                } else {
                    if (
                        obj.active_status == '0' ||
                        obj.msg[config.language] == msgTitle.usernotexit[config.language]
                    ) {
                        config.checkUserDeactivate(this.props.navigation);
                    } else {
                        msgProvider.alert(
                            msgTitle.information[config.language],
                            obj.msg[config.language],
                            false,
                        );
                    }
                    return false;
                }
            })
            .catch(err => {
                consolepro.consolelog('err', err);
            });
    };

    verify_click = async () => {
        // this.props.navigation.replace('Homepage')
        // return false

        Keyboard.dismiss();
        if (this.state.otpstatus.length <= 0) {
            msgProvider.toast(validation.emptyOTP[config.language], 'center');
            return false;
        }

        if (this.state.otpstatus.length < 4) {
            msgProvider.toast(validation.lengthOTP[config.language], 'center');
            return false;
        }
        if (
            this.state.otpstatus == this.state.userotp &&
            config.device_type == 'ios'
        ) {
            this.setState({ show: false });
        }
        this.setState({ verifydisable: true });
        let url = config.baseURL + 'otp_verification.php';
        var data = new FormData();
        data.append('user_id', this.state.user_id);
        data.append('otp', this.state.otpstatus);
        consolepro.consolelog('test', data);
        apifuntion
            .postApi(url, data)
            .then(obj => {
                this.setState({ verifydisable: false });
                if (obj.success == 'true') {
                    this.setState({
                        show: false,
                        name: '',
                        mobile: '',
                        otpstatus: '',
                    });
                    if (obj.notification_arr != 'NA') {
                        notification.notification_arr(obj.notification_arr);
                    }
                    var user_details = obj.user_details;
                    localStorage.setItemObject('user_arr', user_details);
                    localStorage.setItemObject('skip_status', 'no');
                    firebaseprovider.firebaseUserCreate();
                    firebaseprovider.getMyInboxAllData();
                    this.props.navigation.navigate('Homepage');
                } else {
                    if (
                        obj.active_status == '0' ||
                        obj.msg[config.language] == msgTitle.usernotexit[config.language]
                    ) {
                        config.checkUserDeactivate(this.props.navigation);
                    } else {
                        msgProvider.alert(
                            msgTitle.information[config.language],
                            obj.msg[config.language],
                            false,
                        );
                    }
                    return false;
                }
            })
            .catch(err => {
                this.setState({ verifydisable: false });
                consolepro.consolelog('err', err);
            });
    };

    signup = () => {
        try {
            //  this.props.navigation.navigate('Homepage')
            //  return false
            Keyboard.dismiss();

            let name = this.state.name?.trim();
            if (!name || name.length <= 0 || name?.toLowerCase() === 'null') {
                msgProvider.toast(validation.emptyFirstName[config.language], 'center');
                return false;
            }
            let email = this.state.email?.trim();
            if (!email || email.length <= 0) {
                msgProvider.toast(validation.emptyEmail[config.language], 'center');
                return false;
            }

            if (config.regemail.test(email) !== true) {
                msgProvider.toast(validation.validEmail[config.language], 'center');
                return false;
            }

            let mobile = this.state.mobile?.trim();
            if (!mobile || mobile.length <= 0) {
                msgProvider.toast(validation.emptyPhone[config.language], 'center');
                return false;
            }
            if (mobile.length < 7) {
                msgProvider.toast(validation.lengthPhone[config.language], 'center');
                return false;
            }
            let location = user_address;
            if (!location || location.length <= 0) {
                msgProvider.toast(validation.emptyAddress[config.language], 'center');
                return false;
            }
            let password = this.state.password?.trim();
            if (!password || password.length <= 0) {
                msgProvider.toast(validation.emptyPassword[config.language], 'center');
                return false;
            }
            if (password.length <= 5) {
                msgProvider.toast(validation.lengthPassword[config.language], 'center');
                return false;
            }
            let confirmpassword = this.state.confirmpassword?.trim();
            if (!confirmpassword || confirmpassword.length <= 0) {
                msgProvider.toast(
                    validation.emptyconfirmPassword[config.language],
                    'center',
                );
                return false;
            }

            if (password != confirmpassword) {
                msgProvider.toast(validation.verifypassword[config.language], 'center');
                return false;
            }

            let url = config.baseURL + 'signup.php';
            var data = new FormData();
            data.append('signup_type', 'app');
            data.append('name', this.state.name);
            data.append('mobile', this.state.mobile);
            data.append('password', this.state.password);
            data.append('device_type', config.device_type);
            data.append('player_id', player_id_me1);
            data.append('email', this.state.email);
            data.append('address', this.state.address);
            data.append('latitude', this.state.latitude);
            data.append('longitude', this.state.longitude);

            consolepro.consolelog('test', data);
            this.setState({
                password: '',
                confirmpassword: '',
            });
            apifuntion
                .postApi(url, data)
                .then(obj => {
                    consolepro.consolelog('test111', obj);
                    if (obj.success == 'true') {
                        var user_details = obj.user_details;
                        localStorage.setItemObject('user_arr', user_details);
                        const uservalue = {
                            login_type: user_details.login_type,
                            email: this.state.email,
                            password: password,
                        };
                        localStorage.setItemObject('user_login', uservalue);

                        if (obj.showotp == true) {
                            this.setState({
                                otpstatus: user_details.otp,
                            });
                        }
                        this.setState({
                            userotp: user_details.otp,
                        });

                        setTimeout(() => {
                            this.setState({
                                show: true,
                                user_id: user_details.user_id,
                            });
                            this.onButtonStart();
                        }, 500);
                    } else {
                        if (
                            obj.active_status == '0' ||
                            obj.msg[config.language] == msgTitle.usernotexit[config.language]
                        ) {
                            config.checkUserDeactivate(this.props.navigation);
                        } else {
                            msgProvider.alert(
                                msgTitle.information[config.language],
                                obj.msg[config.language],
                                false,
                            );
                        }
                        return false;
                    }
                })
                .catch(err => {
                    consolepro.consolelog('err11', err);
                });
        } catch (e) { }
    };

    getPhoneNumber = () => {
        Alert.alert(this.state.phoneNumber);
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView
                    style={{
                        flex: 0,
                        backgroundColor: Colors.theme_color1,
                    }}
                />
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.theme_color1}
                    hidden={false}
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                />
                <Modal transparent visible={this.state.show}>
                    <View style={CSSstyle.modelview}>
                        <View style={CSSstyle.mainmodelview}>
                            <View style={CSSstyle.veriview}>
                                <Text style={CSSstyle.veritext}>
                                    {Lang_chg.verification[config.language]}
                                </Text>
                            </View>
                            <View style={CSSstyle.pleaseview}>
                                <Text style={CSSstyle.pleasetext}>
                                    {Lang_chg.verification1[config.language]}
                                </Text>
                            </View>
                            <View style={CSSstyle.updateview}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={CSSstyle.editview}
                                    onPress={() => {
                                        this.setState({
                                            show: false,
                                            otpstatus: '',
                                        });
                                    }}>
                                    <Text style={CSSstyle.edittext}>
                                        {Lang_chg.edit[config.language]}
                                    </Text>
                                </TouchableOpacity>
                                <View style={CSSstyle.numberview}>
                                    <Text style={CSSstyle.numbertext}>{'Email :'}</Text>
                                </View>
                                <View style={CSSstyle.digitview}>
                                    <Text style={CSSstyle.digittext}>{this.state.email}</Text>
                                </View>
                            </View>
                            <View style={CSSstyle.otpview}>
                                <View style={CSSstyle.otptext}>
                                    <TextInput
                                        value={'' + this.state.otpstatus + ''}
                                        onChangeText={txt => {
                                            this.setState({
                                                otpstatus: txt,
                                            });
                                        }}
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                            paddingVertical: 10,
                                            color: Colors.blackColor,
                                        }}
                                        placeholder={Lang_chg.otp[config.language]}
                                        placeholderTextColor="#b9b9b9"
                                        maxLength={4}
                                    />
                                </View>
                            </View>

                            <View style={CSSstyle.lastview}>
                                {this.state.startDisable == true ? (
                                    <CountDown
                                        until={59.5 * 2}
                                        size={(mobileW * 3.5) / 100}
                                        onFinish={() => {
                                            this.setState({
                                                startDisable: false,
                                            });
                                        }}
                                        digitStyle={{ color: 'red' }}
                                        digitTxtStyle={{
                                            color: 'red',
                                            marginTop: 1.5,
                                        }}
                                        timeLabelStyle={{
                                            fontSize: 1,
                                        }}
                                        timeToShow={['M', 'S']}
                                        timeLabels={{ m: '', s: '' }}
                                        separatorStyle={{
                                            color: 'red',
                                        }}
                                        showSeparator={true}
                                        style={CSSstyle.resendtouch}
                                    />
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.resend_click();
                                        }}
                                        activeOpacity={0.9}
                                        style={CSSstyle.resendtouch}>
                                        <Text style={CSSstyle.resend}>
                                            {Lang_chg.resend[config.language]}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <View style={CSSstyle.line} />
                                <TouchableOpacity
                                    disabled={this.state.verifydisable}
                                    activeOpacity={0.9}
                                    style={CSSstyle.resendtouch}
                                    onPress={() => {
                                        this.verify_click();
                                    }}>
                                    <Text style={CSSstyle.verify}>
                                        {Lang_chg.verify[config.language]}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible1}
                    onRequestClose={() => { }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                            }}>
                            <View style={CSSstyle.notification_header}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{ padding: 5 }}
                                    onPress={() => {
                                        this.setState({
                                            modalVisible1: false,
                                        });
                                    }}>
                                    <Image
                                        resizeMode="contain"
                                        style={CSSstyle.hole_top_l1}
                                        source={localimag.backarrowicon}
                                    />
                                </TouchableOpacity>
                                <Text style={[CSSstyle.Notifications_title, {}]}>
                                    {Lang_chg.privacypolicy1[config.language]}
                                </Text>
                                <View>
                                    <Text />
                                </View>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.terms_txt}>
                                    <HTMLView value={this.state.privacydata} styles={styles.p} />
                                </View>
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible2}
                    onRequestClose={() => { }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                            }}>
                            <View style={CSSstyle.notification_header}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{ padding: 5 }}
                                    onPress={() => {
                                        this.setState({
                                            modalVisible2: false,
                                        });
                                    }}>
                                    <Image
                                        resizeMode="contain"
                                        style={CSSstyle.hole_top_l1}
                                        source={localimag.backarrowicon}
                                    />
                                </TouchableOpacity>
                                <Text style={[CSSstyle.Notifications_title, {}]}>
                                    {Lang_chg.termcondition[config.language]}
                                </Text>
                                <View activeOpacity={0.7}>
                                    <Text />
                                </View>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.terms_txt}>
                                    <HTMLView value={this.state.termservice} styles={styles.p} />
                                </View>
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </Modal>

                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        backgroundColor: Colors.theme_color,
                    }}
                    behavior={Platform.OS === 'ios' ? 'padding' : null}>
                    <ScrollView style={{}}>
                        <ImageBackground
                            source={localimag.splashbg1}
                            style={{ paddingHorizontal: '5%' }}>
                            <View
                                style={{
                                    width: '100%',
                                    height: (windowHeight * 16) / 100,
                                    marginTop: (windowHeight * 3) / 100,
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Image style={styles.logo} source={localimag.splash1} />
                            </View>
                            <Text
                                style={[
                                    styles.login,
                                    {
                                        marginBottom: (windowHeight * 1) / 100,
                                    },
                                ]}>
                                {Lang_chg.signup}
                            </Text>

                            <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.nameicon} />
                                </View>
                                <View
                                    style={{
                                        width: '91%',
                                        justifyContent: 'center',
                                    }}>
                                    <TextInput
                                        value={
                                            '' +
                                            (this.state.name != 'null' ? this.state.name : '') +
                                            ''
                                        }
                                        onChangeText={txt => {
                                            this.setState({
                                                name: txt,
                                            });
                                        }}
                                        keyboardType="default"
                                        maxLength={60}
                                        returnKeyLabel="done"
                                        returnKeyType="done"
                                        onSubmitEditing={() => {
                                            Keyboard.dismiss();
                                        }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor}
                                        placeholder={Lang_chg.name[config.language]}
                                    />
                                </View>
                            </View>
                            <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image
                                        style={{
                                            width: (windowWidth * 7) / 100,
                                            height: (windowWidth * 7) / 100,
                                            resizeMode: 'contain',
                                        }}
                                        source={localimag.emailicon}
                                    />
                                </View>
                                <View
                                    style={{
                                        width: '91%',
                                        justifyContent: 'center',
                                    }}>
                                    <TextInput
                                        value={'' + this.state.email}
                                        onChangeText={txt => {
                                            this.setState({
                                                email: txt,
                                            });
                                        }}
                                        keyboardType="email-address"
                                        maxLength={60}
                                        returnKeyLabel="done"
                                        returnKeyType="done"
                                        onSubmitEditing={() => {
                                            Keyboard.dismiss();
                                        }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor}
                                        placeholder={Lang_chg.email[config.language]}
                                    />
                                </View>
                            </View>
                            <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.phoneicon} />
                                </View>
                                <View style={styles.MainContainer}>
                                    {this.state.phoneCode != 'default' ? (
                                        <PhoneInput
                                            ref={this.phoneInput}
                                            defaultValue={this.state.mobile}
                                            defaultCode={this.state.phoneCode.toUpperCase()}
                                            layout="first"
                                            autoFocus
                                            containerStyle={styles.phoneNumberView}
                                            textContainerStyle={{
                                                paddingVertical: 0,
                                            }}
                                            onChangeFormattedText={text => {
                                                if (text.length > 15) return;
                                                this.setState({
                                                    mobile: text,
                                                });
                                            }}
                                            onSubmitEditing={() => {
                                                Keyboard.dismiss();
                                            }}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </View>
                                {/* <View
                  style={{
                    width: '91%',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                 
                  <Text
                    style={{
                      marginTop: 1.2,
                      fontSize: (windowWidth * 3.5) / 100,
                      width: '10%',
                      fontFamily: Font.Poppins_Regular,
                      color: Colors.blackColor,
                    }}>
                    {' '}
                    {'+61'}
                  </Text>
                  <TextInput
                    value={'' + this.state.mobile + ''}
                    onChangeText={txt => {
                      this.setState({ mobile: txt });
                    }}
                    keyboardType="number-pad"
                    maxLength={15}
                    returnKeyLabel="done"
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    style={[styles.txteditemail, {}]}
                    placeholderTextColor={Colors.blackColor}
                    placeholder={Lang_chg.mobile[config.language]}
                  />
                </View> */}
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('Location');
                                }}
                                style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.locationicon} />
                                </View>
                                <View
                                    style={{
                                        width: '91%',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={[styles.txteditemail, {}]}>
                                        {' '}
                                        {this.state.address}
                                    </Text>
                                    {/* <TextInput
                                        value={"" + this.state.location + ""}
                                        onChangeText={(txt) => { this.setState({ mobile: txt }) }}
                                        keyboardType='number-pad'
                                        maxLength={15}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.mobile[config.language]}></TextInput> */}
                                </View>
                            </TouchableOpacity>

                            <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.passwordicon} />
                                </View>
                                <View
                                    style={{
                                        width: '80%',
                                        justifyContent: 'center',
                                    }}>
                                    <TextInput
                                        value={'' + this.state.password + ''}
                                        onChangeText={txt => {
                                            this.setState({
                                                password: txt,
                                            });
                                        }}
                                        keyboardType="default"
                                        maxLength={60}
                                        returnKeyLabel="done"
                                        returnKeyType="done"
                                        secureTextEntry={this.state.secureoldpassword}
                                        onSubmitEditing={() => {
                                            Keyboard.dismiss();
                                        }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor}
                                        placeholder={Lang_chg.password[config.language]}
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            secureoldpassword: !this.state.secureoldpassword,
                                        });
                                    }}
                                    style={{
                                        width: '11%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    {this.state.secureoldpassword ? (
                                        <Text style={styles.icontext1}>
                                            {Lang_chg.show[config.language]}
                                        </Text>
                                    ) : (
                                        <Text style={styles.icontext1}>
                                            {Lang_chg.hide[config.language]}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.viewstyle}>
                                <View style={styles.iconview}>
                                    <Image style={styles.icon} source={localimag.passwordicon} />
                                </View>
                                <View
                                    style={{
                                        width: '80%',
                                        justifyContent: 'center',
                                    }}>
                                    <TextInput
                                        value={'' + this.state.confirmpassword + ''}
                                        onChangeText={txt => {
                                            this.setState({
                                                confirmpassword: txt,
                                            });
                                        }}
                                        keyboardType="default"
                                        maxLength={60}
                                        returnKeyLabel="done"
                                        returnKeyType="done"
                                        secureTextEntry={this.state.secureconfirmpassword}
                                        onSubmitEditing={() => {
                                            Keyboard.dismiss();
                                        }}
                                        style={[styles.txteditemail, {}]}
                                        placeholderTextColor={Colors.blackColor}
                                        placeholder={Lang_chg.confrmpassword[config.language]}
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            secureconfirmpassword: !this.state.secureconfirmpassword,
                                        });
                                    }}
                                    style={{
                                        width: '11%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    {this.state.secureconfirmpassword ? (
                                        <Text style={styles.icontext1}>
                                            {Lang_chg.show[config.language]}
                                        </Text>
                                    ) : (
                                        <Text style={styles.icontext1}>
                                            {Lang_chg.hide[config.language]}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <Text
                                style={[
                                    styles.forgottext,
                                    {
                                        marginTop: (windowHeight * 3.5) / 100,
                                    },
                                ]}>
                                {Lang_chg.bysign[config.language]}
                            </Text>
                            <Text style={[styles.forgottext, {}]}>
                                {''}
                                <Text
                                    onPress={() => {
                                        this.setState({
                                            modalVisible2: true,
                                        });
                                    }}
                                    style={[
                                        styles.forgottext,
                                        {
                                            textDecorationLine: 'underline',
                                        },
                                    ]}>
                                    {Lang_chg.termcondition1[config.language]}
                                </Text>
                                <Text style={styles.forgottext}>
                                    {Lang_chg.and1[config.language]}
                                    <Text
                                        onPress={() => {
                                            this.setState({
                                                modalVisible1: true,
                                            });
                                        }}
                                        style={[
                                            styles.forgottext,
                                            {
                                                textDecorationLine: 'underline',
                                            },
                                        ]}>
                                        {Lang_chg.privacypolicy[config.language]}
                                    </Text>
                                </Text>
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    this.signup();
                                }}
                                style={[
                                    CSSstyle.mainbutton,
                                    {
                                        marginTop: (windowHeight * 3) / 100,
                                    },
                                ]}>
                                <Text style={styles.txtlogin}>
                                    {Lang_chg.signup[config.language]}
                                </Text>
                            </TouchableOpacity>

                            {/* Social Signup Buttons */}
                            {this.state.guest_status == false && (
                            <View
                                style={{
                                    paddingVertical: (windowHeight * 1) / 100,
                                    marginTop: 10
                                }}>

                                <View
                                    style={{
                                        alignSelf: 'center',
                                        flexDirection: 'row',
                                        width: '70%',
                                        marginTop: (windowHeight * 0.8) / 100,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    {/* <View style={{ width: '30%', height: 1, backgroundColor: Colors.border_color1 }}></View> */}

                                    <View
                                        style={{
                                            width: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <Text style={styles.orlogintxt}>
                                            {Lang_chg.orsignup[config.language]}
                                        </Text>
                                    </View>
                                    {/* <View style={{ width: '30%', height: 1, backgroundColor: Colors.border_color1 }}></View> */}
                                </View>

                                <View
                                    style={{
                                        alignSelf: 'center',
                                        //   flexDirection: 'row',
                                        marginTop: (windowHeight * 0.8) / 100,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            SocialLogin.Socialfunction(
                                                this.props.navigation,
                                                'google',
                                                'google',
                                            );
                                        }}
                                        style={styles.social_button}>
                                        <Image
                                            style={[styles.socialicon]}
                                            source={localimag.googleicon}
                                        />
                                        <Text style={styles.social_button_text}>
                                            {Lang_chg.continueWithGoogle[config.language]}
                                        </Text>
                                    </TouchableOpacity>

                                    {Platform.OS === 'ios' && parseInt(Platform.Version) >= 13 && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                SocialLogin.Socialfunction(
                                                    this.props.navigation,
                                                    'apple',
                                                    'apple',
                                                );
                                            }}
                                            style={styles.social_button}>
                                            <Image
                                                style={[styles.socialicon]}
                                                source={localimag.appleicon}
                                            />
                                            <Text style={styles.social_button_text}>
                                                {Lang_chg.continueWithApple[config.language]}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            )}

                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.replace('Login');
                                }}
                                style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    marginVertical: (windowHeight * 3.5) / 100,
                                }}>
                                <Text style={styles.orlogintxt}>
                                    {Lang_chg.alreadyaccount[config.language]}
                                    <Text style={styles.signuphere}>
                                        {Lang_chg.loginhere[config.language]}{' '}
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewstyle: {
        marginTop: (windowHeight * 1) / 100,
        width: '100%',
        paddingVertical: (windowHeight * 1.5) / 100,
        flexDirection: 'row',
        borderBottomColor: 'red',
        borderBottomWidth: 0.5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    iconview: { width: '9%', justifyContent: 'center', alignItems: 'center' },
    logo: {
        width: (windowWidth * 65) / 100,
        height: (windowHeight * 13) / 100,
        resizeMode: 'contain',
    },
    login: {
        marginTop: (windowHeight * 6) / 100,
        fontSize: (windowWidth * 6) / 100,
        fontFamily: Font.Poppins_Bold,
        color: Colors.blackColor,
    },
    icon: {
        width: (windowWidth * 6) / 100,
        height: (windowWidth * 6) / 100,
        resizeMode: 'contain',
    },
    txteditemail: {
        fontSize: (windowWidth * 3.5) / 100,
        width: '90%',
        paddingVertical: (windowWidth * 0.1) / 100,
        fontFamily: Font.Poppins_Regular,
        color: Colors.blackColor,
    },
    icontext1: {
        fontSize: (windowWidth * 3) / 100,
        fontFamily: Font.Poppins_SemiBold,
        color: Colors.theme_color1,
        alignSelf: 'center',
    },
    forgottext: {
        fontSize: (windowWidth * 3.5) / 100,
        fontFamily: Font.Poppins_SemiBold,
        color: Colors.blackColor,
        alignSelf: 'center',
        textAlign:'center',
       
    },
    txtlogin: {
        fontSize: (windowWidth * 3.3) / 100,
        fontFamily: Font.Poppins_SemiBold,
        color: Colors.whiteColor,
        alignSelf: 'center',
    },
    orlogintxt: {
        fontSize: (windowWidth * 3.4) / 100,
        fontFamily: Font.Poppins_SemiBold,
        color: Colors.blackColor,
        alignSelf: 'center',
    },
    signuphere: {
        fontSize: (windowWidth * 3.5) / 100,
        fontFamily: Font.Poppins_SemiBold,
        color: Colors.theme_color1,
        alignSelf: 'center',
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
        paddingLeft: 10,
    },
    p: {
        fontWeight: '300',
        color: 'black', // make links coloured pink
        // textAlign:'justify',
        marginBottom: -50,
        lineHeight: 24,
        letterSpacing: 0.8,
        fontStyle: 'normal',
        fontFamily: Font.Poppins_Regular,
    },
    terms_txt: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },

    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    heading: {
        fontSize: 24,
        textAlign: 'center',
        paddingBottom: 20,
        color: 'black',
    },

    phoneNumberView: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        width: '80%',
        padding: 8,
        backgroundColor: '#00B8D4',
    },

    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    social_button: {
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingTop: 5,
        marginTop: 10,
    },
    social_button_text: {
        fontSize: (windowWidth * 4) / 100,
        fontFamily: Font.Poppins_Regular,
        color: Colors.blackColor,
        alignSelf: 'center',
        marginLeft: 10,
    },
    socialicon: {
        width: (windowWidth * 9) / 100,
        height: (windowWidth * 9) / 100,
        resizeMode: 'contain',
        marginBottom: (windowWidth * 1) / 100,
    },
});
