import React, { Component } from 'react';
import {
    I18nManager,
    Text,
    BackHandler,
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
    Platform,
} from 'react-native';
import {
    config,
    Otpprovider,
    Mapprovider,
    notification,
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
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import { firebaseprovider } from './Provider/FirebaseProvider';
import CountDown from 'react-native-countdown-component';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import CSSstyle from './css';
import messaging from '@react-native-firebase/messaging';
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            secureoldpassword: true,
            player_id: '12345',
            minutes_Counter: '01',
            seconds_Counter: '59',
            show: false,
            timer: null,
            startDisable: false,
            refreshpage: false,
            otpstatus: '',
            user_id: '',
            userotp: 0,
            verifydisable: false,
            guest_status: config.guest_status
        };
    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.checkguest();
            this.checksocial();
        });
    }
    onIds(device) {
        player_id_me1 = device.userId;
        this.setState({
            player_id: device.userId,
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

    getallcontent = () => {
        consolepro.consolelog('getallcontent');
        let url = config.baseURL + 'get_all_content.php?Submit=Submit';
        apifuntion
            .getApi(url, 1)
            .then(obj => {
                if (obj.success == 'true') {
                    consolepro.consolelog('obj.content_arr', obj.content_arr);

                    if (obj.content_arr != 'NA') {
                        config.content_arr = obj.content_arr;
                        config.guest_status = obj.guest_status;
                        this.setState({ refreshpage: true, guest_status: obj.guest_status });
                    }
                    this.setState({ refreshpage: false });
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
        let url = config.baseURL + 'resend_otp.php';
        var data = new FormData();
        data.append('user_id', this.state.user_id);
        consolepro.consolelog('data1', data);
        apifuntion
            .postApi(url, data)
            .then(obj => {
                consolepro.consolelog('resendobj', obj);
                if (obj.success == 'true') {
                    this.setState({ startDisable: true });
                    msgProvider.alert(
                        msgTitle.information[config.language],
                        obj.msg[config.language],
                        false,
                    );
                    if (obj.showotp == true) {
                        this.setState({ otpstatus: obj.otp });
                    }
                    this.setState({ userotp: obj.otp });
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
        // this.props.navigation.navigate('Homepage')
        Keyboard.dismiss();

        if (this.state.otpstatus.length <= 0) {
            msgProvider.toast(validation.emptyOTP[config.language], 'center');
            return false;
        }

        if (this.state.otpstatus.length < 4) {
            msgProvider.toast(validation.lengthOTP[config.language], 'center');
            return false;
        }

        // const reg = /^\d+$/;
        // if (reg.test(this.state.otpstatus) !== true) {
        //     msgProvider.toast(msgText.validOtp[config.language], 'center')
        //     return false
        // }

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
                consolepro.consolelog('test', data);
                this.setState({ verifydisable: false });
                if (obj.success == 'true') {
                    if (obj.notification_arr != 'NA') {
                        notification.notification_arr(obj.notification_arr);
                    }
                    this.setState({
                        show: false,
                        otpstatus: '',
                    });
                    var user_details = obj.user_details;
                    localStorage.setItemObject('user_arr', user_details);
                    localStorage.setItemObject('skip_status', 'no');
                    firebaseprovider.firebaseUserCreate();
                    firebaseprovider.getMyInboxAllData();
                    //this.props.navigation.navigate('Homepage')
                    this.props.navigation.navigate('HomeTicket');
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
        this.props.navigation.navigate('Signup');
    };
    signin = () => {
        Keyboard.dismiss();
        let email = this.state.email?.trim();
        if (!email || email.length <= 0) {
            msgProvider.toast(validation.emptyEmail[config.language], 'center');

            return false;
        }

        if (config.regemail.test(email) !== true) {
            msgProvider.toast(validation.validEmail[config.language], 'center');
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

        let url = config.baseURL + 'login.php';
        var data = new FormData();

        data.append('email', this.state.email);
        data.append('password', this.state.password);
        data.append('action', 'normal');
        data.append('device_type', config.device_type);
        data.append('player_id', player_id_me1);
        apifuntion
            .postApi(url, data)
            .then(async obj => {
                consolepro.consolelog('url:', url);
                if (obj.success === 'true') {
                    var user_details = obj.user_details;
                    localStorage.setItemObject('user_arr', user_details);
                    const formData = new FormData();
                    const fcmToken = await messaging().getToken();
                    formData.append('user_id', user_details.user_id);
                    formData.append('app_device_token', fcmToken);
                    const tokenUrl = config.baseURL + 'api/update_user_device_token.php';
                    console.log(
                        tokenUrl,
                        formData,
                        '=========================+_+_+_+_+_+_+__+_+_+_+_+_+_+_+',
                    );
                    apifuntion
                        .postApi(tokenUrl, formData)
                        .then(obj => {
                            consolepro.consolelog('obj==================', obj);
                        })
                        .catch(err => {
                            consolepro.consolelog('err===========', err);
                        });
                    const uservalue = {
                        login_type: user_details.login_type,
                        email: this.state.email,
                        password: password,
                    };
                    localStorage.setItemObject('user_login', uservalue);
                    this.setState({
                        userotp: user_details.otp,
                    });
                    if (user_details.otp_verify == 0) {
                        setTimeout(() => {
                            if (obj.showotp == true) {
                                this.setState({
                                    otpstatus: user_details.otp,
                                });
                            }

                            this.setState({
                                show: true,
                                user_id: user_details.user_id,
                            });
                            this.onButtonStart();
                        }, 100);
                    } else {
                        //   firebaseprovider.firebaseUserCreate();
                        //   firebaseprovider.getMyInboxAllData();
                        if (obj.notification_arr != 'NA') {
                            notification.notification_arr(obj.notification_arr);
                        }
                        this.setState({
                            email: '',
                            password: '',
                        });
                        localStorage.setItemObject('skip_status', 'no');
                        firebaseprovider.firebaseUserCreate();
                        firebaseprovider.getMyInboxAllData();
                        //this.props.navigation.navigate('Homepage')
                        this.props.navigation.navigate('HomeTicket');
                    }
                } else {
                    consolepro.consolelog('obj.active_status', obj.active_status);
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
    //---------------------skip screen (login as guest user) ----------------//
    skipscreen = () => {
        localStorage.setItemObject('skip_status', 'yes');
        localStorage.setItemObject('user_login', null);
        localStorage.setItemObject('user_arr', null);
        //this.props.navigation.navigate('Homepage')
        this.props.navigation.navigate('HomeTicket');
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.newcolor,
                }}>
                <SafeAreaView
                    style={{
                        flex: 0,
                        backgroundColor: Colors.newcolor,
                    }}
                />
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.newcolor}
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
                                        this.onButtonStop();
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
                                    <Text style={CSSstyle.numbertext}>{'Email '}</Text>
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
                                            paddingVertical: (windowHeight * 1.5) / 100,
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

                <View style={{ height: '100%' }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.skipscreen();
                        }}
                        style={{
                            alignSelf: 'flex-end',
                            padding: (windowHeight * 1.8) / 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text style={styles.orlogintxt}>
                            {Lang_chg.Skip[config.language]}
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            width: '100%',
                            height: (windowHeight * 16) / 100,
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'center',
                        }}>
                        <Image style={styles.logo} source={localimag.splash1} />
                    </View>
                    <Text style={[styles.login, { paddingHorizontal: '3%' }]}>
                        {Lang_chg.login1[config.language]}
                    </Text>

                    <View
                        style={{
                            paddingHorizontal: '4%',
                            width: windowWidth,
                            paddingVertical: (windowHeight * 2) / 100,
                            alignSelf: 'center',
                            marginTop: (windowHeight * 1.5) / 100,
                            backgroundColor: Colors.newcolor1,
                        }}>
                        <View
                            style={{
                                width: '94%',
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: (windowWidth * 3.5) / 100,
                                    fontFamily: Font.Poppins_Bold,
                                    color: Colors.red_color,
                                }}>
                                Email
                            </Text>
                        </View>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: (windowHeight * 0.5) / 100,
                            }}>
                            <View
                                style={{
                                    width: '95%',
                                    justifyContent: 'center',
                                }}>
                                <TextInput
                                    value={'' + this.state.email + ''}
                                    onChangeText={txt => {
                                        this.setState({ email: txt });
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
                                    placeholder={Lang_chg.email1[config.language]}
                                />
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            paddingHorizontal: '4%',
                            width: '100%',
                            paddingVertical: (windowHeight * 1.3) / 100,
                            alignSelf: 'center',
                            marginTop: (windowHeight * 1.8) / 100,
                            justifyContent: 'center',
                        }}>
                        <View
                            style={{
                                width: '94%',
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: (windowWidth * 3.5) / 100,
                                    fontFamily: Font.Poppins_Bold,
                                    color: Colors.red_color,
                                }}>
                                Password
                            </Text>
                        </View>

                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: (windowHeight * 0.5) / 100,
                            }}>
                            <View
                                style={{
                                    width: '84%',
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
                                    placeholder={Lang_chg.password1[config.language]}
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
                                    marginTop: (-windowHeight * 0.5) / 100,
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
                    </View>

                    {/*  */}

                    {this.state.guest_status == false ? (
                        <View
                            style={{
                                backgroundColor: Colors.newcolor1,
                                paddingVertical: (windowHeight * 1) / 100,
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
                                        {Lang_chg.orlogin[config.language]}
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
                                {/* <TouchableOpacity
                                 onPress={() => {
                                   SocialLogin.Socialfunction(
                                     this.props.navigation,
                                     'facebook',
                                     'facebook',
                                   );
                                 }}
                                 style={{}}>
                                 <Image
                                   style={[
                                     styles.socialicon,
                                     {
                                       alignSelf: 'center',
                                       marginHorizontal:
                                         (windowWidth * 5) / 100,
                                     },
                                   ]}
                                   source={localimag.fbicon}
                                 />
                               </TouchableOpacity> */}
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
                                        {Lang_chg.signInWithGoogle[config.language]}
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
                                            {Lang_chg.signInWithApple[config.language]}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View
                            style={{
                                height: (windowHeight * 12.2) / 100,
                                backgroundColor: Colors.newcolor1,
                            }}
                        />
                    )}
                    
                    <Text
                        onPress={() => {
                            this.props.navigation.navigate('Forgotpassword');
                        }}
                        style={styles.forgottext}>
                        {Lang_chg.forgotpassword[config.language]}
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            this.signup();
                        }}
                        style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginTop: (windowHeight * 1) / 100,
                        }}>
                        <Text style={styles.orlogintxt}>
                            {Lang_chg.notmem[config.language]}
                            <Text style={styles.signuphere}>
                                {Lang_chg.signuphre1[config.language]}{' '}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                    <HideWithKeyboard
                        style={{
                            width: '100%',
                            position: 'absolute',
                            bottom: 0,
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.signin();
                            }}
                            style={[
                                ,
                                {
                                    width: '100%',
                                    paddingVertical: (windowHeight * 2) / 100,
                                    backgroundColor: Colors.theme_color1,
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    marginTop: (windowHeight * 2.6) / 100,
                                },
                            ]}>
                            <Text style={styles.txtlogin}>
                                {Lang_chg.login1[config.language]}
                            </Text>
                        </TouchableOpacity>
                    </HideWithKeyboard>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        width: (windowWidth * 65) / 100,
        height: (windowHeight * 13) / 100,
        resizeMode: 'contain',
    },
    login: {
        marginTop: (windowHeight * 8) / 100,
        fontSize: (windowWidth * 5) / 100,
        fontFamily: Font.Poppins_Bold,
        color: Colors.blackColor,
    },
    icon: {
        width: (windowWidth * 6) / 100,
        height: (windowWidth * 6) / 100,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    txteditemail: {
        fontSize: (windowWidth * 3.2) / 100,
        width: '100%',
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
        marginTop: (windowHeight * 2) / 100,
        fontSize: (windowWidth * 3) / 100,
        fontFamily: Font.Poppins_SemiBold,
        color: Colors.blackColor,
        alignSelf: 'center',
    },
    txtlogin: {
        fontSize: (windowWidth * 3.8) / 100,
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
        fontFamily: Font.Bold,
        color: Colors.theme_color1,
        alignSelf: 'center',
    },

    socialicon: {
        width: (windowWidth * 9) / 100,
        height: (windowWidth * 9) / 100,
        resizeMode: 'contain',
        marginBottom: (windowWidth * 1) / 100,
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
});
