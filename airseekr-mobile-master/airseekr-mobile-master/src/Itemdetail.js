import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import Carousel from 'react-native-banner-carousel';
import CountDown from 'react-native-countdown-component';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';

import MapView, { Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
import { color } from 'react-native-reanimated';
import { Languageprovider } from "./Provider/Languageprovider";
import Radio from "./container/components/Control/radio";
import { WebView } from "react-native-webview";
export default class Itemdetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: 0,
            item_arr: 'NA',
            addtocart: false,
            ads_id: this.props.route.params.ads_id,
            product_detail: 'NA',
            modalReport: false,
            modaleditdelete: false,
            latitude: config.latitude,
            longitude: config.longitude,
            latdelta: '0.0922',
            longdelta: '0.0421',
            its_myads: true,
            offer_by_me: false,
            modalinvoice: false,
            offer_arr: [],
            valuePaymentMethod: 'card',
            paypalUrl: null,
            showmodal2: false,
            paymentSuccess: false,
            confirmBuyModalVisible: false,
            showPaymentMethod: false,
            totalPayAmount: 0,
        }

    }
    componentDidMount() {
        consolepro.consolelog('product_id', this.state.ads_id)
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
        });
        // this.getvalue()
    }
    //-----------------------get user details from local database-----------------//
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
        }
        this.getitemdata()
    }
    //-----------------------get ads details-----------------//
    getitemdata = () => {
        let url = config.baseURL + 'get_item_detail.php?user_id=' + this.state.user_id + '&ads_id=' + this.state.ads_id

        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('itemdetail', obj);
                if (obj.product != 'NA') {
                    this.setState({
                        product_detail: obj.product,
                        latitude: obj.product.latitude,
                        longitude: obj.product.longitude,
                        its_myads: obj.product.its_myads

                    })
                    if (obj.product.offer_details != 'NA') {
                        this.setState({ offer_by_me: true })
                    }
                }
                else {

                    this.props.navigation.goBack();

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
    //-----------------------add ads as a favourite-----------------//
    addfavourite = () => {

        if (this.state.user_id == 0) {
            config.user_login_first(this.props.navigation)
            return false
        }
        let url = config.baseURL + 'add_remove_favourite.php?user_id=' + this.state.user_id + '&ads_id=' + this.state.ads_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                homerefresh = true
                consolepro.consolelog('favstatus', obj);
                let data = this.state.product_detail
                data.fav_status = !data.fav_status
                this.setState({
                    product_detail: data,
                })

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
    //-----------------------open image in full view -----------------//
    fullimageshow = () => {


        this.props.navigation.navigate('Fullimage', { image_arr: this.state.product_detail.image_arr })

    }
    //-----------------------confirmation for make  offer on ads-----------------//
    makeoffer = () => {
        if (this.state.user_id == 0) {
            config.user_login_first(this.props.navigation)
            return false
        }
        if (this.state.product_detail.for_sale == 1) {
            this.makeoffer1();
            return true;
        }
        Alert.alert(
            'Alert',
            'Do you have this item?', [{
                text: msgTitle.no[config.language],
                onPress: () => { },
                style: msgTitle.cancel[config.language]
            }, {
                text: msgTitle.yes[config.language],
                onPress: () => this.makeoffer1()
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    }
    //-----------------------add offer on ads -----------------//
    makeoffer1 = async () => {
        if (this.state.user_id == 0) {
            config.user_login_first(this.props.navigation)
            return false
        }
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            match_price = this.state.product_detail.price
            current_detail_product = this.state.product_detail;
            ads_id = this.state.product_detail.ads_id
            if (this.state.product_detail.me_as_seller == false) {
                this.props.navigation.navigate('Makeoffer')
            } else if (user_details.bankdetail == 'NA') {
                if (config.guest_status == true && config.device_type == 'ios') {
                    this.props.navigation.navigate('Offerprice')
                } else {
                    this.props.navigation.navigate('Addbank', { redirect: 'setting' })
                }


            }
            else {
                this.props.navigation.navigate('Offerprice')
            }
        }



    }
    //-----------------------share ads to another one-----------------//
    shareitem = () => {
        if (this.state.product_detail != 'NA') {
            // let url = config.baseURL + 'share_app.php/?link=airseekr://Shareitemdetail/' + this.state.ads_id
            // url1 = 'Ads Name :' + this.state.product_detail.title + "\n" + 'Airseekr app link' + "\n" + url
            // mediaprovider.sharedata('Share', url1, 'Airseekr', "");
            let url = config.baseURL + 'share_app.php/?link=airseekr://Shareitemdetail/' + this.state.ads_id;
            let title = 'Ads Name : ' + this.state.product_detail.title;
            mediaprovider.sharedata(title, url, title, title);

        }

    }



    setMapRef = (map) => {
        this.map = map;
    }
    //-----------------------set lat long for map view-----------------//
    getCoordinates = () => {
        return ({
            latitude: parseFloat(this.state.latitude),
            longitude: parseFloat(this.state.longitude),
            latitudeDelta: parseFloat(this.state.latdelta),
            longitudeDelta: parseFloat(this.state.longdelta),
        }
        );
    }

    //-----------------------modal open-----------------//
    openmodal = () => {

        if (this.state.its_myads == false) {
            this.setState({ modalReport: true })
        } else {
            this.setState({ modaleditdelete: true })
        }
    }
    //-----------------------get confirmation for delete ads-----------------------//
    confirmdelete = () => {
        if (this.state.user_id == 0) {
            config.user_login_first(this.props.navigation)
            return false
        }

        Alert.alert(
            msgTitle.alert[config.language],
            msgTitle.msgdeletepost[config.language], [{
                text: msgTitle.no[config.language],
                onPress: () => { this.setState({ modaleditdelete: false }) },
                style: msgTitle.cancel[config.language]
            }, {
                text: msgTitle.yes[config.language],
                onPress: () => this.deletepost()
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    }
    processPaymentPaypal = async () => {
        if (this.state.valuePaymentMethod === 'card') {
            return await this.processPayment();
        }
        Keyboard.dismiss()
        this.setState({ modalinvoice: false, showPaymentMethod: false });
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        let offer = this.state.product_detail.offer_details;
        console.log("offer ::::----> ", this.state.product_detail)
        if (user_details != null) {

            let url = config.baseAPI + `payment-ads/paypal-url/${offer.offer_id}`;
            consolepro.consolelog('url', url, offer);
            apifuntion.getApi(url, 1).then((obj) => {
                this.setState({ refresh: false })
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                    // code here
                    this.setState({ paypalUrl: obj.data.paypal_url })
                } else {
                    //error
                    return false;
                }

            }).catch((err) => {
                consolepro.consolelog('err', err);
                this.setState({ refresh: false })
            });
        }
    }

    processPayment = async () => {
        console.log("this.state.product_detail : ", this.state.product_detail)
        if (this.state.valuePaymentMethod === 'paypal') {
            return await this.processPaymentPaypal();
        }
        Keyboard.dismiss()
        this.setState({ modalinvoice: false, showPaymentMethod: false });
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        let offer = this.state.product_detail.offer_details;
        if (user_details != null) {
            let user_id = user_details.user_id
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('seller_id', this.state.product_detail.ad_user_id)
            data.append('offer_id', offer.offer_id)
            data.append("delivery_type", offer.delivery_type)
            var transfer_user_id = 0;
            var order_id = 0;
            var amount = this.state.totalPayAmount ? this.state.totalPayAmount : offer.total_amount_pay;
            // var amount = 5
            var transfer_amount = 0;
            var descriptor_suffix = 'Offer Payment';
            var payment_url = config.baseURL + 'stripe_payment/payment_url.php?user_id=' + user_id + '&transfer_user_id=' + transfer_user_id + '&order_id=' + order_id + '&amount=' + amount + '&transfer_amount=' + transfer_amount + '&descriptor_suffix=' + descriptor_suffix;
            console.log("payment_url:", payment_url);
            console.log("dataPayment:", data);
            this.props.navigation.navigate('Offerpaymentaccept', { paymenturl: payment_url, offer_data: data })

        }
    }
    //--------------------------Delete ads----------------------------//////////
    deletepost = async () => {
        this.setState({ modaleditdelete: false })
        let url = config.baseURL + "delete_ads.php";
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let user_id = user_details.user_id
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('ads_id', this.state.ads_id)
            apifuntion.postApi(url, data).then((obj) => {

                if (obj.success == 'true') {
                    homerefresh = true

                    this.props.navigation.navigate('Homepage')

                } else {
                    if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                        config.checkUserDeactivate(this.props.navigation)
                    } else {
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    }
                    return false;
                }
            }).catch(err => {
                consolepro.consolelog('err', err)
            });
        }
    }
    //----------------------Edit post-------------------//
    editpost = () => {
        if (this.state.user_id == 0) {
            config.user_login_first(this.props.navigation)
            return false
        }

        this.setState({ modaleditdelete: false });
        if (this.state.product_detail != 'NA') {
            this.props.navigation.navigate('Editpost', { ads_detail: this.state.product_detail })
        }

    }
    //--------confirmation for delete offer--------------//
    confirm_delete_offer = () => {
        if (this.state.product_detail.accept_status == 1 || this.state.product_detail.offer_details.status == 2) {
            msgProvider.toast(Lang_chg.notdelete[config.language], 'center')
            return false;
        }

        Alert.alert(
            msgTitle.alert[config.language],
            msgTitle.msgdeleteoffer[config.language], [{
                text: msgTitle.no[config.language],
                onPress: () => { },
                style: msgTitle.cancel[config.language]
            }, {
                text: msgTitle.yes[config.language],
                onPress: () => this.delete_offer()
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    }
    //--------------------------Delete offers----------------------------//////////
    delete_offer = async () => {

        let url = config.baseURL + "delete_offer.php";
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let user_id = user_details.user_id
            let offer_id = this.state.product_detail.offer_details.offer_id
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('offer_id', offer_id)
            consolepro.consolelog('data', data)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('obj', obj)
                if (obj.success == 'true') {
                    if (obj.notification_arr != 'NA') {
                        notification.notification_arr(obj.notification_arr)
                    }
                    msgProvider.toast(obj.msg[config.language], 'center')
                    this.props.navigation.navigate('Homepage')

                } else {
                    if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                        config.checkUserDeactivate(this.props.navigation)
                    } else {
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    }
                    return false;
                }
            }).catch(err => {
                consolepro.consolelog('err', err)
            });
        }
    }
    //------------------------edit offer----------------------//
    edit_offer = () => {
        // if(this.state.product_detail.status!=0){
        //     msgProvider.toast(Lang_chg.notdelete[config.language], 'center')
        //     return false;
        // }
        if (this.state.product_detail.accept_status == 1 || this.state.product_detail.offer_details.status == 2) {
            msgProvider.toast(Lang_chg.notedit[config.language], 'center')
            return false;
        } else {
            if (this.state.product_detail != 'NA') {
                match_price = this.state.product_detail.price
                current_detail_product = this.state.product_detail;
                this.props.navigation.navigate('Editoffer', { offer_arr: this.state.product_detail.offer_details })
            }
        }


    }

    //------------------------open offer page----------------------//
    openofferpage = () => {
        if (this.state.user_id == 0) {
            config.user_login_first(this.props.navigation)
            return false
        }
        if (this.state.product_detail.offer_count > 0) {
            if (this.state.its_myads == true) {
                this.props.navigation.navigate('Offeronmyads', { ads_id: this.state.product_detail.ads_id })
            } else {
                this.props.navigation.navigate('Offerlist', { ads_id: this.state.product_detail.ads_id })
            }
        } else {
            msgProvider.toast(validation.emptyofferlist[config.language], 'center')
            return false;
        }


    }
    //------------------open report modal--------//
    openreportmodal = () => {
        if (this.state.user_id == 0) {
            config.user_login_first(this.props.navigation)
            return false
        }
        this.props.navigation.navigate('Reportpage', { ads_id: this.state.product_detail.ads_id, type: 'ads' }); this.setState({ modalReport: false })
    }
    //------------------open chat screen--------//
    openchat = () => {
        if (this.state.user_id == 0) {
            config.user_login_first(this.props.navigation)
            return false
        }
        this.props.navigation.navigate('Chat', { 'data': { 'other_user_id': this.state.product_detail.user_details.user_id, 'other_user_name': this.state.product_detail.user_details.name, 'image': config.img_url1 + this.state.product_detail.user_details.image } })
    }

    _onNavigationStateChange = (webViewState) => {
        if (webViewState.loading == false) {
            const t = webViewState.url
            // .split('/')
            // .pop()
            // .split('?')[0];

            if (typeof t != null) {
                if (t.indexOf('notify') > -1 && t.indexOf('cancel=1') === -1) {
                    setTimeout(() => {
                        this.setState({ paypalUrl: null, showmodal2: true, paymentSuccess: true });
                        //navigation.navigate('OrderSuccess');
                    }, 5500);
                } else if (t.indexOf('cancel=1') > -1) {
                    this.setState({ paypalUrl: null, showmodal2: true, paymentSuccess: false });
                    msgProvider.toast(Lang_chg.paymentcancel[config.language], 'center');
                }
            }
        }
    };

    render() {
        console.log("offer_arr:", this.state.offer_arr)
        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalReport}
                    onRequestClose={() => {
                        this.setState({ modalReport: false })
                    }}>

                    <View style={{ flex: 1, backgroundColor: '#00000030', alignItems: 'center' }}>
                        <View style={{ position: 'absolute', bottom: 2, width: windowWidth, }}>
                            <View style={{ alignSelf: 'center', width: '100%', alignItems: 'center' }}>
                                <View style={CSSstyle.modalviewinner}>
                                    <View style={CSSstyle.modaaltextview}>
                                        <Text style={CSSstyle.modaltxtselect}>{Lang_chg.txtOption[config.language]}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { this.openreportmodal() }} style={CSSstyle.modaaltextview1}>
                                        <Text style={CSSstyle.modaltxtother}>{Lang_chg.txtReport[config.language]}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={CSSstyle.modalcancelview}>
                                <TouchableOpacity onPress={() => { this.setState({ modalReport: false }) }} style={CSSstyle.modalcanceltouch}>
                                    <Text style={{ fontFamily: Font.Hind_Regular, fontSize: windowWidth * 4 / 100, color: 'red' }}>{Lang_chg.cancelmedia[config.language]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modaleditdelete}
                    onRequestClose={() => {
                        this.setState({ modaleditdelete: false })
                    }}>

                    <View style={{ flex: 1, backgroundColor: '#00000030', alignItems: 'center' }}>
                        <View style={{ position: 'absolute', bottom: 2, width: windowWidth, }}>
                            <View style={{ alignSelf: 'center', width: '100%', alignItems: 'center' }}>
                                <View style={CSSstyle.modalviewinner}>
                                    <View style={CSSstyle.modaaltextview}>
                                        <Text style={CSSstyle.modaltxtselect}>{Lang_chg.txtOption[config.language]}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { this.editpost() }} style={CSSstyle.modaaltextview}>
                                        <Text style={CSSstyle.modaltxtother}>{Lang_chg.Mediaedit[config.language]}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.confirmdelete() }} style={CSSstyle.modaaltextview1}>
                                        <Text style={CSSstyle.modaltxtother}>{Lang_chg.Mediadelete[config.language]}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={CSSstyle.modalcancelview}>
                                <TouchableOpacity onPress={() => { this.setState({ modaleditdelete: false }) }} style={CSSstyle.modalcanceltouch}>
                                    <Text style={{ fontFamily: Font.Hind_Regular, fontSize: windowWidth * 4 / 100, color: 'red' }}>{Lang_chg.cancelmedia[config.language]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView >
                    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingBottom: windowHeight * 2 / 100 }}>

                        <View style={[CSSstyle.notification_header, { paddingTop: 10, paddingBottom: 10, }]}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtDetail[config.language]}</Text>

                            {this.state.its_myads == false && <TouchableOpacity onPress={() => { this.setState({ modalReport: true }) }} style={{ padding: 2, justifyContent: 'center' }} >
                                <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.dotsb}></Image>
                            </TouchableOpacity>}


                            {this.state.its_myads == true &&
                                <View>
                                    {this.state.product_detail != 'NA' && this.state.product_detail.accept_status == 0 ?
                                        <TouchableOpacity onPress={() => { this.setState({ modaleditdelete: true }) }} style={{ padding: 2, justifyContent: 'center' }} >
                                            <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.dotsb}></Image>
                                        </TouchableOpacity> :
                                        <View style={{ padding: 2, justifyContent: 'center' }} >
                                            <Text>{'   '}</Text>
                                        </View>}
                                </View>
                            }
                        </View>

                        <View style={{ width: '100%', height: windowHeight * 43 / 100, marginTop: windowHeight * 0.5 / 100 }}>
                            <ImageBackground
                                onLoadStart={() => this.setState({ showDefault: false })}
                                onLoad={() => this.setState({ showDefault: false })}
                                style={{
                                    width: '100%', height: windowHeight * 40 / 100, alignItems: 'center', resizeMode: 'cover',
                                }} source={(this.state.product_detail != 'NA' && this.state.product_detail.image_arr != 'NA') ? { uri: config.img_url2 + this.state.product_detail.image_arr[0].image } : localimag.nopreview}
                                resizeMode={FastImage.resizeMode.contain} >
                 {/* add new tag  */}
                      <View
                        style={{
                        position: 'absolute',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        backgroundColor:
                        this.state.product_detail.for_sale === 0 ? '#100dc9' : '#c90d0d',
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                        top: 10,
                        right: 0,
                        zIndex: 20,
                     }}>
                   <Text
                      style={{
                       fontFamily: Font.Poppins_Bold,
                         color: 'white',
                         fontSize: 10,
                     }}>
                     {this.state.product_detail.for_sale === 0
                          ? 'LOOKING FOR'
                          : 'FOR SALE'}
                          </Text>

          </View>
                                {(this.state.product_detail != 'NA' && this.state.product_detail.image_arr != 'NA') && <TouchableOpacity onPress={() => { this.fullimageshow() }} style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: windowHeight * 33 / 100, marginLeft: windowWidth * 8 / 100, paddingVertical: 3, paddingHorizontal: windowWidth * 1.5 / 100, backgroundColor: '#00000060', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }} >
                                    <Image style={[styles.iconswatch, { resizeMode: "contain", }]} source={localimag.whitebackarrow}></Image>
                                    <Text style={{ fontSize: windowWidth * 2.7 / 100, fontFamily: Font.Hind_Regular, color: Colors.whiteColor, }}>{Lang_chg.txtViewPhotos[config.language]}</Text>
                                </TouchableOpacity>}
                            </ImageBackground>
                            {this.state.its_myads == false && <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: -windowHeight * 3.5 / 100, marginRight: windowWidth * 5 / 100, paddingVertical: 1, alignItems: 'center', justifyContent: 'center' }} >
                                <TouchableOpacity onPress={() => { this.shareitem() }} style={{ paddingVertical: 3, paddingHorizontal: windowWidth * 2 / 100, alignItems: 'center', justifyContent: 'center' }} >
                                    <Image style={[styles.iconsfav, { resizeMode: "contain", marginTop: windowHeight * .2 / 100 }]} source={localimag.share}></Image>
                                </TouchableOpacity>
                                {this.state.product_detail != 'NA' && <TouchableOpacity onPress={() => { this.addfavourite() }} style={{ paddingVertical: 3, paddingHorizontal: windowWidth * 2 / 100, alignItems: 'center', justifyContent: 'center' }} >
                                    {this.state.product_detail.fav_status == true ? <Image style={[styles.iconsfav, { resizeMode: "contain", }]} source={localimag.favouriteicon}></Image> :
                                        <Image style={[styles.iconsfav, { resizeMode: "contain", }]} source={localimag.deactivefavicon}></Image>}
                                </TouchableOpacity>}
                            </View>}
                        </View>


                        <View style={{ width: '90%', flexDirection: 'row', marginTop: windowHeight * 1 / 100, alignSelf: 'center', justifyContent: 'space-between' }}>
                            <View style={{ justifyContent: 'center', width: '60%' }}>
                                {this.state.product_detail != 'NA' && <Text style={styles.txtitem3}>{this.state.product_detail.title}</Text>}
                            </View>
                            <View style={{ width: '40%', alignItems: 'flex-end' }}>

                                {this.state.product_detail != 'NA' && <Text numberOfLines={1} style={styles.txtitemprice}>${this.state.product_detail.price}</Text>}
                            </View>
                        </View>
                        <View style={{ width: '90%', justifyContent: 'center', alignSelf: 'center' }}>

                            {this.state.product_detail != 'NA' && <Text style={styles.txtitem1}>{this.state.product_detail.category_name}</Text>}
                        </View>
                        <View style={{ width: '90%', alignSelf: 'center' }}>

                            {this.state.product_detail != 'NA' && <Text style={[styles.txtdesc2, {}]}>{this.state.product_detail.description}</Text>}
                        </View>

                        {/* //-----------------if already offer start--------------// */}
                        {this.state.offer_by_me == true && <View>

                            {/* Start Looking for */}
                            {(this.state.product_detail != 'NA' && this.state.product_detail.for_sale == 0) && <View>
                                {(this.state.product_detail != 'NA') &&
                                    <View style={{ width: '90%', marginTop: windowHeight * .5 / 100, alignSelf: 'center', justifyContent: 'space-between' }}>
                                        {this.state.product_detail.offer_details.status == 0 && <Text style={[styles.txtstatus, { color: "orange" }]}>{Lang_chg.txtPending[config.language]}</Text>}
                                        {this.state.product_detail.offer_details.status == 1 && <Text style={[styles.txtstatus, { color: "green" }]}>{Lang_chg.txtAccepted[config.language]}</Text>}
                                        {this.state.product_detail.offer_details.status == 2 && <Text style={[styles.txtstatus, { color: "red" }]}>{Lang_chg.txtRejected[config.language]}</Text>}
                                        {/* <Text style={[styles.txtstatus, {}]}>{'Pending'}</Text> */}
                                    </View>}
                                <View style={{ width: '90%', flexDirection: 'row', marginTop: windowHeight * 1.5 / 100, alignSelf: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '70%' }}>
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => { this.confirm_delete_offer() }} style={{ backgroundColor: Colors.theme_color1, alignItems: 'center', justifyContent: 'center', height: windowHeight * 3 / 100, paddingHorizontal: '2%' }}>
                                            <Text style={[styles.txtsmall, { color: Colors.border_color }]}>{Lang_chg.txtDeleteoffer[config.language]}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => { this.edit_offer() }} style={{ borderColor: Colors.border_color, borderWidth: 2, marginLeft: windowWidth * 2 / 100, alignItems: 'center', justifyContent: 'center', height: windowHeight * 3 / 100, paddingHorizontal: '2%' }}>
                                            <Text style={[styles.txtsmall, { color: Colors.blackColor }]}>{Lang_chg.txteditofff[config.language]}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '30%', alignItems: 'flex-end' }}>
                                        {this.state.product_detail != 'NA' && <Text numberOfLines={1} style={styles.txtitemprice}>${this.state.product_detail.offer_details.offer_amount}</Text>}
                                    </View>
                                </View>
                                <View style={{ width: '90%', justifyContent: 'center', alignSelf: 'center', marginTop: windowHeight * 2 / 100, }}>
                                    <Text style={styles.txtitem1}>{Lang_chg.deliverydetails[config.language]}</Text>
                                </View>
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.pickup_location != '' && <View style={{ marginTop: windowHeight * 1 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                                    <Image style={styles.iconswatch} source={localimag.locationicon}></Image>
                                    <Text style={[styles.txtdesc2, { marginLeft: 5, marginTop: 2 }]}>{this.state.product_detail.offer_details.pickup_location}</Text>

                                </View>}
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.quick_delivery_fee != '0.00' &&
                                    <View style={[styles.mainview, { marginTop: windowHeight * 2 / 100 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                            <View style={{ width: '50%', }}>
                                                <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.quickdelivery[config.language]} </Text>
                                            </View>

                                            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <Text style={[styles.edittext, { textAlign: 'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>${this.state.product_detail.offer_details.quick_delivery_fee} </Text>
                                            </View>
                                        </View>
                                    </View>}
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.standard_delivery_fee != '0.00' &&
                                    <View style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                            <View style={{ width: '50%', }}>
                                                <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.standarddelivery[config.language]} </Text>
                                            </View>

                                            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <Text style={[styles.edittext, { textAlign: 'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>${this.state.product_detail.offer_details.standard_delivery_fee} </Text>
                                            </View>
                                        </View>
                                    </View>}
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.express_delivery_fee != '0.00' &&
                                    <View style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                            <View style={{ width: '50%', }}>
                                                <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.expressdelivery[config.language]} </Text>
                                            </View>

                                            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <Text style={[styles.edittext, { textAlign: 'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>${this.state.product_detail.offer_details.express_delivery_fee} </Text>
                                            </View>
                                        </View>
                                    </View>}
                            </View>}
                            {/* END Looking for */}
                            {(this.state.product_detail != 'NA' && this.state.product_detail.for_sale == 1) && <View>
                                <View style={{ width: '90%', flexDirection: 'row', marginTop: windowHeight * 1.5 / 100, alignSelf: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '70%' }}>
                                        {this.state.product_detail.offer_details.status == 0 && <Text style={[styles.txtstatus, { color: "orange" }]}>{Lang_chg.txtPending[config.language]}</Text>}
                                        {this.state.product_detail.offer_details.status == 1 && <Text style={[styles.txtstatus, { color: "green" }]}>{Lang_chg.txtAccepted[config.language]}</Text>}
                                        {this.state.product_detail.offer_details.status == 2 && <Text style={[styles.txtstatus, { color: "red" }]}>{Lang_chg.txtRejected[config.language]}</Text>}

                                    </View>
                                    <View style={{ width: '30%', alignItems: 'flex-end' }}>
                                        {this.state.product_detail != 'NA' && <Text numberOfLines={1} style={styles.txtitemprice}>${this.state.product_detail.offer_details.offer_amount}</Text>}
                                    </View>
                                </View>
                                <View style={{ width: '90%', justifyContent: 'center', alignSelf: 'center', marginTop: windowHeight * 2 / 100, }}>
                                    <Text style={styles.txtitem1}>{Lang_chg.deliverydetails[config.language]}</Text>
                                </View>
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.pickup_location != '' && <View style={{ marginTop: windowHeight * 1 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                                    <Image style={styles.iconswatch} source={localimag.locationicon}></Image>
                                    <Text style={[styles.txtdesc2, { marginLeft: 5, marginTop: 2 }]}>{this.state.product_detail.offer_details.pickup_location}</Text>

                                </View>}
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.quick_delivery_fee != '0.00' &&
                                    <View style={[styles.mainview, { marginTop: windowHeight * 2 / 100 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                            <View style={{ width: '50%', }}>
                                                <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.quickdelivery[config.language]} </Text>
                                            </View>

                                            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <Text style={[styles.edittext, { textAlign: 'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>${this.state.product_detail.offer_details.quick_delivery_fee} </Text>
                                            </View>
                                        </View>
                                    </View>}
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.standard_delivery_fee != '0.00' &&
                                    <View style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                            <View style={{ width: '50%', }}>
                                                <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.standarddelivery[config.language]} </Text>
                                            </View>

                                            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <Text style={[styles.edittext, { textAlign: 'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>${this.state.product_detail.offer_details.standard_delivery_fee} </Text>
                                            </View>
                                        </View>
                                    </View>}
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.express_delivery_fee != '0.00' &&
                                    <View style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                            <View style={{ width: '50%', }}>
                                                <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.expressdelivery[config.language]} </Text>
                                            </View>

                                            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                <Text style={[styles.edittext, { textAlign: 'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>${this.state.product_detail.offer_details.express_delivery_fee} </Text>
                                            </View>
                                        </View>
                                    </View>}
                                {((this.state.product_detail.offer_details && this.state.product_detail.offer_details.status == 1 && !this.state.product_detail.offer_details.transfer_id) || this.state.showPaymentMethod) &&
                                    <>
                                        <View style={styles.paymentMethod}>
                                            <Text style={styles.paymentMethodTitle}>
                                                {Languageprovider.t(
                                                    'SELECTPAYMENTMETHOD',
                                                    language_key,
                                                )}
                                            </Text>
                                            <View style={styles.paymentMethodItem}>

                                                {/* //Delivery Price */}

                                                <View style={styles.paymentMethodItemRadio}>
                                                    <Radio
                                                        title={Languageprovider.t(
                                                            'CREDITCARD',
                                                            language_key,
                                                        )}
                                                        selected={this.state.valuePaymentMethod === 'card'}
                                                        onPress={() =>
                                                            this.setState({ valuePaymentMethod: 'card' })
                                                        }
                                                    />
                                                </View>

                                                <View style={styles.paymentMethodItemLogo}>
                                                    <Image
                                                        style={styles.paymentMethodItemLogoImage}
                                                        source={localimag.visaCard}
                                                        width={120}
                                                        height={20}
                                                        resizeMode={'contain'}
                                                    />
                                                </View>
                                            </View>

                                            <View style={styles.paymentMethodItem}>
                                                <View style={styles.paymentMethodItemRadio}>
                                                    <Radio
                                                        title={Languageprovider.t('PAYPAL', language_key)}
                                                        selected={
                                                            this.state.valuePaymentMethod === 'paypal'
                                                        }
                                                        onPress={() =>
                                                            this.setState({ valuePaymentMethod: 'paypal' })
                                                        }
                                                    />
                                                </View>

                                                <View style={styles.paymentMethodItemLogo}>
                                                    <Image
                                                        style={styles.paymentMethodItemLogoImage}
                                                        source={localimag.paypal}
                                                        width={120}
                                                        height={20}
                                                        resizeMode={'contain'}
                                                    />
                                                </View>
                                            </View>
                                        </View>

                                        <TouchableOpacity activeOpacity={0.7} onPress={() => { this.state.valuePaymentMethod === 'card' ? this.processPayment() : this.processPaymentPaypal() }} style={{ marginTop: 0, width: '88%', height: 40, backgroundColor: 'green', alignSelf: 'center', justifyContent: 'center', borderRadius: 8 }}>
                                            <Text style={[styles.txtdesc, { color: Colors.border_color, alignSelf: 'center', justifyContent: 'center' }]}>Pay ${this.state.product_detail.offer_details.total_amount_pay}</Text>
                                        </TouchableOpacity>
                                    </>
                                }
                            </View>}

                        </View>}
                        {/* //-----------------if already offer end --------------// */}

                        <View style={{ marginTop: windowHeight * 1 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF2F2', paddingHorizontal: windowWidth * 2 / 100, paddingVertical: windowHeight * .3 / 100, borderRadius: 15, }}>
                                <Image style={styles.iconswatch} source={localimag.clockicon10}></Image>
                                {this.state.product_detail != 'NA' ?
                                    <Text style={[styles.txtdays, { marginTop: 2 }]}>{this.state.product_detail.createtime}</Text> :
                                    <Text style={[styles.txtdays, { marginTop: 2 }]}>{''}</Text>}
                            </View>
                            <TouchableOpacity onPress={() => { this.openofferpage() }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF2F2', paddingHorizontal: windowWidth * 1 / 100, paddingVertical: windowHeight * .3 / 100, borderRadius: 15, }}>
                                <Image style={styles.iconswatch} source={localimag.redoffericon}></Image>
                                <Text style={[styles.txtoffers, { textDecorationLine: 'underline' }]}>{Lang_chg.txtOffers[config.language]}</Text>
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_count > 0 && <Text style={[styles.txtoffers, { marginLeft: 2 }]}>{'(' + this.state.product_detail.offer_count + ')'}</Text>}

                            </TouchableOpacity>
                        </View>
                        {this.state.its_myads == false && this.state.offer_by_me == false && this.state.product_detail.accept_status == 0 && this.state.product_detail.for_sale == 0
                            && <View style={{ marginTop: windowHeight * 2 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', }}>
                                <View style={{ flexDirection: 'row', width: '10%' }}>
                                </View>
                                <TouchableOpacity onPress={() => { this.makeoffer() }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme_color1, paddingHorizontal: windowWidth * 1 / 100, paddingVertical: windowHeight * .3 / 100, borderRadius: 2, }}>
                                    <Text style={[styles.txtmakeoffers, { color: Colors.whiteColor, marginTop: 2 }]}>{(this.state.product_detail.for_sale == 0 ? Lang_chg.txtMakeOffer[config.language] : Lang_chg.txtPurchase[config.language])}</Text>
                                </TouchableOpacity>
                            </View>}
                        {this.state.its_myads == false && this.state.offer_by_me == false && this.state.product_detail.accept_status == 0 && this.state.product_detail.for_sale == 1 && <View style={{ marginTop: windowHeight * 2 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row', width: '10%' }}>
                            </View>
                            <TouchableOpacity onPress={() => {
                                if (this.state.user_id == 0) {
                                    config.user_login_first(this.props.navigation)
                                    return false
                                } else {
                                    this.setState({ confirmBuyModalVisible: true })
                                }
                            }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme_color1, paddingHorizontal: windowWidth * 1 / 100, paddingVertical: windowHeight * .3 / 100, borderRadius: 2, }}>
                                <Text style={[styles.txtmakeoffers, { color: Colors.whiteColor, marginTop: 2 }]}>{(Lang_chg.txtBuyNow[config.language])}</Text>
                            </TouchableOpacity>
                        </View>}

                        <Modal
                            transparent
                            visible={this.state.showPaymentMethod}
                        >
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0.5,0.5,0.5,0.3)" }}>
                                <View style={{ backgroundColor: Colors.whiteColor, padding: 20, borderRadius: 20, width: "80%" }}>
                                    <View style={[styles.paymentMethod, { marginTop: 0, padding: 0 }]}>
                                        <Text style={[styles.paymentMethodTitle, { marginTop: 0 }]}>
                                            {Languageprovider.t(
                                                'SELECTPAYMENTMETHOD',
                                                language_key,
                                            )}
                                        </Text>
                                        <View style={styles.paymentMethodItem}>
                                            <View style={styles.paymentMethodItemRadio}>
                                                <Radio
                                                    title={Languageprovider.t(
                                                        'CREDITCARD',
                                                        language_key,
                                                    )}
                                                    selected={this.state.valuePaymentMethod === 'card'}
                                                    onPress={() =>
                                                        this.setState({ valuePaymentMethod: 'card' })
                                                    }
                                                />
                                            </View>

                                            <View style={styles.paymentMethodItemLogo}>
                                                <Image
                                                    style={[styles.paymentMethodItemLogoImage, { height: 30, width: 120 }]}
                                                    source={localimag.visaCard}

                                                    resizeMode={'contain'}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.paymentMethodItem}>
                                            <View style={styles.paymentMethodItemRadio}>
                                                <Radio
                                                    title={Languageprovider.t('PAYPAL', language_key)}
                                                    selected={
                                                        this.state.valuePaymentMethod === 'paypal'
                                                    }
                                                    onPress={() =>
                                                        this.setState({ valuePaymentMethod: 'paypal' })
                                                    }
                                                />
                                            </View>

                                            <View style={styles.paymentMethodItemLogo}>
                                                <Image
                                                    style={[styles.paymentMethodItemLogoImage, { height: 30, width: 120 }]}
                                                    source={localimag.paypal}

                                                    resizeMode={'contain'}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <TouchableOpacity activeOpacity={0.7} onPress={() => { this.state.valuePaymentMethod === 'card' ? this.processPayment() : this.processPaymentPaypal() }} style={{ marginTop: 15, width: '88%', height: 40, backgroundColor: 'green', alignSelf: 'center', justifyContent: 'center', borderRadius: 8 }}>
                                        <Text style={[styles.txtdesc, { color: Colors.border_color, alignSelf: 'center', justifyContent: 'center' }]}>Pay ${this.state.totalPayAmount}</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </Modal>

                        <Modal
                            transparent
                            visible={this.state.confirmBuyModalVisible}
                        >
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0.5,0.5,0.5,0.3)" }}>
                                <View style={{ backgroundColor: Colors.whiteColor, padding: 25, borderRadius: 20, width: "80%" }}>

                                    <Text style={{ color: Colors.blackColor, fontWeight: "bold" }}>Are you sure you would like to buy?</Text>
                                    <Text style={{ color: Colors.blackColor, fontWeight: "400" }}>Offer amount: ${this.state.product_detail.price}</Text>
                                    <Text style={{ color: Colors.blackColor, fontWeight: "400" }}>Commision amount: ${(this.state.product_detail.price * 0.10).toFixed(2)}</Text>
                                    <Text style={{ color: Colors.blackColor, fontWeight: "400" }}>Delivery price: 0</Text>
                                    <Text style={{ color: Colors.blackColor, fontWeight: "400" }}>Total payment: ${Number(this.state.product_detail.price) + Number((this.state.product_detail.price * 0.10).toFixed(2))}</Text>

                                    <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    confirmBuyModalVisible: false
                                                })
                                            }}
                                            style={{ backgroundColor: Colors.theme_color1, width: 65, height: 30, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                                            <Text style={{ color: Colors.whiteColor }} >Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    confirmBuyModalVisible: false,
                                                    showPaymentMethod: true,
                                                    totalPayAmount: Number(this.state.product_detail.price) + Number((this.state.product_detail.price * 0.10).toFixed(2))
                                                })
                                            }}
                                            style={{ marginLeft: 10, backgroundColor: Colors.colorTicketBlue01, width: 65, height: 30, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
                                            <Text style={{ color: Colors.whiteColor }} >Yes</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>

                        </Modal>

                        <View style={{ marginTop: windowHeight * 2 / 100, width: '100%', height: 1, backgroundColor: Colors.border_color, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', }}>

                        </View>
                        <View style={{ marginTop: windowHeight * 2 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                            <Image style={styles.iconswatch} source={localimag.locationicon}></Image>
                            {(this.state.product_detail != 'NA' && this.state.product_detail.seller_id == this.state.user_id && this.state.product_detail.status == 0) ?
                                <Text style={[styles.txtdesc2, { marginLeft: 5, marginTop: 2 }]}>{this.state.product_detail.location}</Text> :
                                <View>
                                    {this.state.product_detail != 'NA' && <Text style={[styles.txtdesc2, { marginLeft: 5, marginTop: 2 }]}>{this.state.product_detail.location2}</Text>}
                                </View>
                            }


                        </View>
                        <View style={{ marginTop: windowHeight * 2 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                            {/* <Image style={{width:'100%',height:windowHeight*28/100}} source={localimag.mapimage}></Image> */}
                            <MapView
                                followsUserLocation={true}
                                style={{ width: '100%', height: windowHeight * 28 / 100 }}
                                region={
                                    this.getCoordinates(this)
                                }
                                zoomEnabled={true}
                                provider={PROVIDER_GOOGLE}
                                minZoomLevel={2}
                                maxZoomLevel={20}
                                rotateEnabled={true}
                                pitchEnabled={true}
                                showsUserLocation={true}
                                userLocationPriority='high'
                                moveOnMarkerPress={true}
                                showsMyLocationButton={true}
                                showsScale={true} // also this is not working
                                showsCompass={true} // and this is not working
                                showsPointsOfInterest={true} // this is not working either
                                showsBuildings={true} // and finally, this isn't working either
                                onMapReady={this.onMapReady}
                                onRegionChangeComplete={(event) => { }}
                                draggable
                                ref={this.setMapRef}
                            >

                            </MapView>
                        </View>

                        <View style={{ marginTop: windowHeight * 3 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between' }}>
                            <Text style={styles.txtitemprice1}>All payments from the buyer will be held securely by us, until the buyer receives the item.</Text>
                        </View>
                        {this.state.its_myads == false && <View style={{ marginTop: windowHeight * 3 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', width: '10%' }}>
                            </View>
                            <TouchableOpacity onPress={() => { this.openchat() }} style={{ borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme_color1, paddingHorizontal: windowWidth * 8 / 100, paddingVertical: windowHeight * 0.5 / 100, }}>
                                <Image style={{ width: windowWidth * 5 / 100, height: windowWidth * 5 / 100, resizeMode: 'contain' }} source={localimag.messageicon29}></Image>
                            </TouchableOpacity>
                        </View>}





                    </View>
                </ScrollView>


                {this.state.paypalUrl && (
                    <View style={styles.webview}>
                        <WebView
                            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                            source={{ uri: this.state.paypalUrl }}
                            style={{ marginTop: 0 }}
                        />
                    </View>
                )}

                <Modal transparent
                    visible={this.state.showmodal2}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.modelview}>
                            <View style={{ width: '80%', borderRadius: 15, backgroundColor: 'white', padding: 20 }}>
                                <View style={{ width: '100%', flexDirection: 'row', marginTop: 5 }}>

                                    <View style={{ width: '100%', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 18, color: 'black', fontFamily: Font.Poppins_Bold }}>{this.state.paymentSuccess ? "Payment Success" : "Payment Failed"}</Text>

                                    </View>

                                </View>

                                <Text style={{ fontFamily: Font.Poppins_Regular, paddingBottom: 20, fontSize: 14, color: Colors.gray_color, marginTop: 5, textAlign: 'center' }}>
                                    {'Date : ' + new Date().toLocaleString() + ''}
                                </Text>

                                <TouchableOpacity onPress={() => { this.setState({ showmodal2: false }); this.props.navigation.goBack() }} style={{ backgroundColor: 'green', width: '30%', alignSelf: 'center', padding: 10, borderRadius: 8 }}>
                                    <Text style={{ fontFamily: Font.Poppins_Bold, fontSize: 15, color: Colors.white_color, textAlign: 'center' }}>
                                        {"Ok"}
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </SafeAreaView>

                </Modal>

            </View>
        )
    }
}



const styles = StyleSheet.create({
    edittext: { fontSize: windowWidth * 3.7 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, },

    mainview: { width: '90%', flexDirection: 'row', alignSelf: 'center', alignItems: "center", justifyContent: 'center' },

    txtsmall: {
        fontSize: windowWidth * 2.7 / 100, fontFamily: Font.Hind_Regular, marginTop: 1
    },
    txtstatus: {
        fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Hind_SemiBold, color: 'orange',
    },
    txtdesc: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Hind_Regular, color: Colors.blackColor, marginHorizontal: 5
    },
    txtdesc1: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Hind_Regular, color: Colors.border_color1, marginHorizontal: 5
    },
    txtdesc2: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Hind_Regular, color: Colors.border_color1,
    },
    txtdays: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Hind_Regular, color: Colors.border_color1, alignSelf: 'center',
    },
    txtoffers: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.theme_color1, alignSelf: 'center',
    },
    txtmakeoffers: {
        fontSize: windowWidth * 2.7 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.whiteColor, alignSelf: 'center',
    },
    txtitem2: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Hind_Bold, color: Colors.theme_color1,
    },
    icons: {
        width: windowWidth * 10 / 100,
        height: windowWidth * 10 / 100,
        resizeMode: 'cover',
        alignSelf: 'center'
    }
    ,

    iconswatch: {
        width: windowWidth * 4 / 100,
        height: windowWidth * 4 / 100,
        marginRight: 2,
        resizeMode: 'cover',
    },
    iconsfav: {
        width: windowWidth * 10 / 100,
        height: windowWidth * 10 / 100,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    txtitem1: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Hind_Regular, color: Colors.greyColor,
    },
    txtitem11: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Hind_Regular, color: Colors.greyColor,
    },
    txtitem3: {
        fontSize: windowWidth * 4.8 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor,
    },
    txtitemprice: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.theme_color1,
    },
    txtitemprice1: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor,
    },
    txttime: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Hind_Regular, color: Colors.whiteColor, marginHorizontal: 5, alignSelf: 'center'
    }, icons: {
        width: windowWidth * 4 / 100,
        height: windowWidth * 4 / 100,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    // txtitem4: {
    //     fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Hind_Regular, color: Colors.blackColor, alignSelf: 'center'
    // },

    paymentMethod: { marginTop: 0, padding: 20 },
    paymentMethodTitle: { fontWeight: 'bold', marginTop: 30 },
    paymentMethodItem: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    paymentMethodButton: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentMethodButtonCheckout: {
        backgroundColor: Colors.colorTicketButtonRed,
        width: '100%',
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    paymentMethodButtonCheckoutOr: { marginTop: 30 },
    paymentMethodButtonCheckoutGuest: {
        marginTop: 10,
        padding: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentMethodButtonCheckoutGuestLabel: {
        color: Colors.colorTicketSelected,
        fontSize: 16,
    },
    paymentMethodButtonCheckoutLabel: {
        textTransform: 'uppercase',
        color: Colors.whiteColor,
        fontWeight: 'bold',
    },
    paymentMethodItemLabel: { marginLeft: 15, flex: 1 },
    paymentMethodItemRadio: {},
    paymentMethodItemLogo: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 3,
        textAlign: 'left',
        padding: 10,
    },
    paymentMethodItemLogoImage: { alignSelf: 'flex-end' },
    webview: {
        width: '100%',
        height: (windowHeight * 89) / 100,
        position: 'absolute',
    },
    modelview: {
        height: '100%',
        width: '100%',
        backgroundColor: '#00000090',
        justifyContent: 'center',
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },
});
