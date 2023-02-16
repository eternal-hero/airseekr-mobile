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

import MapView, { Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
import { color } from 'react-native-reanimated';
export default class Shareitemdetail extends Component {

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
            this.getitemdata()
        }else{
            this.props.navigation.navigate('Login')
        }
       
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
      
        if(this.state.user_id==0){
            config.user_login_first(this.props.navigation)
            return false
        }
        let url = config.baseURL + 'add_remove_favourite.php?user_id=' + this.state.user_id + '&ads_id=' + this.state.ads_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                homerefresh=true
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

        if (this.state.product_detail.image != 'NA') {
            this.props.navigation.navigate('Fullimage', { image_arr: this.state.product_detail.image_arr })
        }
    }
    //-----------------------confirmation for make  offer on ads-----------------//
    makeoffer = () => {
        if(this.state.user_id==0){
            config.user_login_first(this.props.navigation)
            return false
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
    makeoffer1 =async () => {
        if(this.state.user_id==0){
            config.user_login_first(this.props.navigation)
            return false
        }
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            match_price = this.state.product_detail.price
            ads_id = this.state.product_detail.ads_id
            if (this.state.product_detail.me_as_seller == false) {
                this.props.navigation.navigate('Makeoffer')
            } else if(user_details.bankdetail=='NA') {
                this.props.navigation.navigate('Addbank',{type:'makeoffer'})
            }
             else {
                this.props.navigation.navigate('Offerprice')
            }
        }
       


    }
    //-----------------------share ads to another one-----------------//
    shareitem = () => {
        
        if (this.state.product_detail != 'NA') {
            let url = config.baseURL + 'share_app.php/?link=airseekr://Shareitemdetail/' + this.state.ads_id
            url1 = 'Ads Name :' + this.state.product_detail.title + "\n" + 'Airseekr app link' + "\n" + url
            mediaprovider.sharedata('Share', url1, 'Airseekr', "");

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
        if(this.state.user_id==0){
            config.user_login_first(this.props.navigation)
            return false
        }
       
        Alert.alert(
            msgTitle.alert[config.language],
            msgTitle.msgdeletepost[config.language], [{
                text: msgTitle.no[config.language],
                onPress: () => {  this.setState({ modaleditdelete: false })},
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
                    homerefresh=true
                  
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
        if(this.state.user_id==0){
            config.user_login_first(this.props.navigation)
            return false
        }
        this.setState({ modaleditdelete: false });
        if (this.state.product_detail != 'NA') {
            this.props.navigation.navigate('Editpost', { ads_detail: this.state.product_detail })
        }

    }
    //--------confirmation for delete offer--------------//
    confirm_delete_offer=()=>{
        if(this.state.product_detail.accept_status==1){
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
                onPress: () => this.delete_offer()          }], {
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
    edit_offer=()=>{
        if(this.state.product_detail.accept_status==1){
            msgProvider.toast(Lang_chg.notedit[config.language], 'center')
            return false;
        }else{
            if (this.state.product_detail != 'NA') {
                match_price= this.state.product_detail.price
                this.props.navigation.navigate('Editoffer', { offer_arr: this.state.product_detail.offer_details })
            }
        }
    }
    
    //------------------------open offer page----------------------//
    openofferpage=()=>{
        if(this.state.user_id==0){
            config.user_login_first(this.props.navigation)
            return false
        }
        if(this.state.product_detail.offer_count>0){
            if (this.state.its_myads == true) {
                this.props.navigation.navigate('Offeronmyads',{ads_id: this.state.product_detail.ads_id})
              }else{  this.props.navigation.navigate('Offerlist',{ads_id: this.state.product_detail.ads_id})
            }
        }else{
            msgProvider.toast(validation.emptyofferlist[config.language], 'center')
            return false;
        }
       
       
    }
    //------------------open report modal--------//
    openreportmodal=()=>{
        if(this.state.user_id==0){
            config.user_login_first(this.props.navigation)
            return false
        }
        this.props.navigation.navigate('Reportpage', { ads_id: this.state.product_detail.ads_id,type:'ads' }); this.setState({ modalReport: false })
    }
    //------------------open chat screen--------//
    openchat=()=>{
        if(this.state.user_id==0){
            config.user_login_first(this.props.navigation)
            return false
        }
        this.props.navigation.navigate('Chat')
    }

    render() {

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
                                    <Text style={{ fontFamily: Font.Poppins_Regular, fontSize: windowWidth * 4 / 100, color: 'red' }}>{Lang_chg.cancelmedia[config.language]}</Text>
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
                                    <Text style={{ fontFamily: Font.Poppins_Regular, fontSize: windowWidth * 4 / 100, color: 'red' }}>{Lang_chg.cancelmedia[config.language]}</Text>
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
                           { this.state.product_detail!='NA' && this.state.product_detail.accept_status==0 ?
                           <TouchableOpacity onPress={() => { this.setState({ modaleditdelete: true }) }} style={{ padding: 2, justifyContent: 'center' }} >
                                <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.dotsb}></Image>
                            </TouchableOpacity>:
                             <View  style={{ padding: 2, justifyContent: 'center' }} >
                                <Text>{'   '}</Text>
                            </View>}
                            </View>
                            }
                        </View>

                        <View style={{ width: '100%', height: windowHeight * 43 / 100, }}>
                            <ImageBackground
                                onLoadStart={() => this.setState({ showDefault: false })}
                                onLoad={() => this.setState({ showDefault: false })}
                                style={{
                                    width: '100%', height: windowHeight * 40 / 100, alignItems: 'center', resizeMode: 'cover',
                                }} source={(this.state.product_detail != 'NA' && this.state.product_detail.image_arr!='NA') ? { uri: config.img_url2 + this.state.product_detail.image_arr[0].image } : localimag.nopreview}
                                resizeMode={FastImage.resizeMode.contain} >
                                <TouchableOpacity onPress={() => { this.fullimageshow() }} style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: windowHeight * 33 / 100, marginLeft: windowWidth * 8 / 100, paddingVertical: 3, paddingHorizontal: windowWidth * 1.5 / 100, backgroundColor: '#00000060', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }} >
                                    <Image style={[styles.iconswatch, { resizeMode: "contain", }]} source={localimag.whitebackarrow}></Image>
                                    <Text style={{ fontSize: windowWidth * 2.7 / 100, fontFamily: Font.Poppins_Regular, color: Colors.whiteColor, }}>{Lang_chg.txtViewPhotos[config.language]}</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                            {this.state.its_myads == false && <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: -windowHeight * 3.5 / 100, marginRight: windowWidth * 5 / 100, paddingVertical: 1, alignItems: 'center', justifyContent: 'center' }} >
                                <TouchableOpacity onPress={() => {this.shareitem() }} style={{ paddingVertical: 3, paddingHorizontal: windowWidth * 2 / 100, alignItems: 'center', justifyContent: 'center' }} >
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
                                {this.state.product_detail != 'NA' && <Text numberOfLines={1} style={styles.txtitem3}>{this.state.product_detail.title}</Text>}
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

                          {this.state.product_detail!='NA' &&  <View style={{ width: '90%', marginTop: windowHeight * .5 / 100, alignSelf: 'center', justifyContent: 'space-between' }}>
                            {this.state.product_detail.offer_details.status==0 && <Text  style={[styles.txtstatus,{color:"orange"}]}>{Lang_chg.txtPending[config.language]}</Text> }
                                                        {this.state.product_detail.offer_details.status==1 && <Text  style={[styles.txtstatus,{color:"green"}]}>{Lang_chg.txtAccepted[config.language]}</Text> } 
                                                        {this.state.product_detail.offer_details.status==2 && <Text  style={[styles.txtstatus,{color:"red"}]}>{Lang_chg.txtRejected[config.language]}</Text> } 
                                {/* <Text style={[styles.txtstatus, {}]}>{'Pending'}</Text> */}
                            </View>}
                            <View style={{ width: '90%', flexDirection: 'row', marginTop: windowHeight * 1.5 / 100, alignSelf: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '70%' }}>
                                    <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.confirm_delete_offer()}} style={{ backgroundColor: Colors.theme_color1, alignItems: 'center', justifyContent: 'center', height: windowHeight * 3 / 100, paddingHorizontal: '2%' }}>
                                        <Text style={[styles.txtsmall, { color: Colors.border_color }]}>{Lang_chg.txtDeleteoffer[config.language]}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.edit_offer()}} style={{ borderColor: Colors.border_color, borderWidth: 2, marginLeft: windowWidth * 2 / 100, alignItems: 'center', justifyContent: 'center', height: windowHeight * 3 / 100, paddingHorizontal: '2%' }}>
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
                                            <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.quickdelivery[config.language]} </Text>
                                        </View>

                                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Text style={[styles.edittext, {textAlign:'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, }]}>${this.state.product_detail.offer_details.quick_delivery_fee} </Text>
                                        </View>
                                    </View>
                                </View>}
                            {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.standard_delivery_fee != '0.00' &&
                                <View style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                        <View style={{ width: '50%', }}>
                                            <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.standarddelivery[config.language]} </Text>
                                        </View>

                                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Text style={[styles.edittext, {textAlign:'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, }]}>${this.state.product_detail.offer_details.standard_delivery_fee} </Text>
                                        </View>
                                    </View>
                                </View>}
                            {this.state.product_detail != 'NA' && this.state.product_detail.offer_details.express_delivery_fee != '0.00' &&
                                <View style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                        <View style={{ width: '50%', }}>
                                            <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.expressdelivery[config.language]} </Text>
                                        </View>

                                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Text style={[styles.edittext, {textAlign:'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, }]}>${this.state.product_detail.offer_details.express_delivery_fee} </Text>
                                        </View>
                                    </View>
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
                            <TouchableOpacity onPress={() => {this.openofferpage()  }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF2F2', paddingHorizontal: windowWidth * 1 / 100, paddingVertical: windowHeight * .3 / 100, borderRadius: 15, }}>
                                <Image style={styles.iconswatch} source={localimag.redoffericon}></Image>
                                <Text style={[styles.txtoffers, { textDecorationLine: 'underline' }]}>{Lang_chg.txtOffers[config.language]}</Text>
                                {this.state.product_detail != 'NA' && this.state.product_detail.offer_count > 0 && <Text style={[styles.txtoffers, { marginLeft: 2 }]}>{'(' + this.state.product_detail.offer_count + ')'}</Text>}

                            </TouchableOpacity>
                        </View>
                        {this.state.its_myads == false && this.state.offer_by_me == false && this.state.product_detail.accept_status==0 && <View style={{ marginTop: windowHeight * 2 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row', width: '10%' }}>
                            </View>
                            <TouchableOpacity onPress={() => { this.makeoffer() }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme_color1, paddingHorizontal: windowWidth * 1 / 100, paddingVertical: windowHeight * .3 / 100, borderRadius: 2, }}>
                                <Text style={[styles.txtmakeoffers, { color: Colors.whiteColor, marginTop: 2 }]}>{Lang_chg.txtMakeOffer[config.language]}</Text>
                            </TouchableOpacity>
                        </View>}

                        <View style={{ marginTop: windowHeight * 2 / 100, width: '100%', height: 1, backgroundColor: Colors.border_color, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', }}>

                        </View>
                        <View style={{ marginTop: windowHeight * 2 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                            <Image style={styles.iconswatch} source={localimag.locationicon}></Image>
                            {this.state.product_detail != 'NA' && <Text style={[styles.txtdesc2, { marginLeft: 5, marginTop: 2 }]}>{this.state.product_detail.location}</Text>}

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
                        {this.state.its_myads == false && <View style={{ marginTop: windowHeight * 3 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', width: '10%' }}>
                            </View>
                            <TouchableOpacity onPress={() => { this.openchat() }} style={{ borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.theme_color1, paddingHorizontal: windowWidth * 8 / 100, paddingVertical: windowHeight * 0.5 / 100, }}>
                                <Image style={{ width: windowWidth * 5 / 100, height: windowWidth * 5 / 100, resizeMode: 'contain' }} source={localimag.messageicon29}></Image>
                            </TouchableOpacity>
                        </View>}





                    </View>
                </ScrollView>




            </View>
        )
    }
}



const styles = StyleSheet.create({
    edittext: { fontSize: windowWidth * 3.7 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, },

    mainview: { width: '90%', flexDirection: 'row', alignSelf: 'center', alignItems: "center", justifyContent: 'center' },

    txtsmall: {
        fontSize: windowWidth * 2.7 / 100, fontFamily: Font.Poppins_Regular, marginTop: 1
    },
    txtstatus: {
        fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_SemiBold, color: 'orange',
    },
    txtdesc: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor, marginHorizontal: 5
    },
    txtdesc1: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1, marginHorizontal: 5
    },
    txtdesc2: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1,
    },
    txtdays: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1, alignSelf: 'center',
    },
    txtoffers: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'center',
    },
    txtmakeoffers: {
        fontSize: windowWidth * 2.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center',
    },
    txtitem2: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1,
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
        marginRight:2,
        resizeMode: 'cover',
    },
    iconsfav: {
        width: windowWidth * 10 / 100,
        height: windowWidth * 10 / 100,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    txtitem1: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Regular, color: Colors.greyColor,
    },
    txtitem11: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.greyColor,
    },
    txtitem3: {
        fontSize: windowWidth * 4.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtitemprice: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1,
    },
    txttime: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.whiteColor, marginHorizontal: 5, alignSelf: 'center'
    }, icons: {
        width: windowWidth * 4 / 100,
        height: windowWidth * 4 / 100,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    // txtitem4: {
    //     fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor, alignSelf: 'center'
    // },
});