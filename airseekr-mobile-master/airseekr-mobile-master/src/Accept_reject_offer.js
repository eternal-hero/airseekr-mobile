import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import {Languageprovider} from "./Provider/Languageprovider";
import Radio from "./container/components/Control/radio";
import {WebView} from "react-native-webview";


export default class Accept_reject_offer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            deliveredcharge:0,
            commision:0,
            modalinvoice:false,
            user_id: '',
            offerprice: '',
            freetouch: false,
            freetouchshow: false,
            deliverycharge: false,
            deliverychargeshow: false,
            standardpost: false,
            standardpostshow: false,
            expresspost: false,
            expresspostshow: false,
            deliverychargetxt: '',
            standardposttxt: '',
            expressposttxt: '',
            latitude: config.latitude,
            longitude: config.longitude,
            location: 'Enter Location',
            offer_id:this.props.route.params.offer_id,
            ads_id:0,
            offer_arr:'NA',
            photodata: "NA",
            status:0,
            delivery_type:0,
            delivered_status:0,
            seller_id:'',
            delivered_typeselect:0,
            finalprice:0,
            finalamount:0,
            valuePaymentMethod: 'card',
            paypalUrl: null,
            showmodal2: false,
            paymentSuccess: false
        }

    }
  async  componentDidMount() {

        this.props.navigation.addListener('focus', () => {

            this.get_value()



        });


       // this.setvalue()


    }
    //--------------------------get value from server---------------------//
    get_value=async()=>{
        let user_details = await localStorage.getItemObject('user_arr');
    if (user_details != null) {
        this.setState({
            user_id: user_details.user_id,
        })
        let userid=user_details.user_id


            let url = config.baseURL + 'get_offerdetail.php?user_id=' +userid + '&offer_id=' + this.state.offer_id
            consolepro.consolelog('url', url);
            apifuntion.getApi(url).then((obj) => {
                if (obj.success == 'true') {
                    consolepro.consolelog('offer_detail', obj);
                    this.setState({offer_arr:obj.offer_all})
                    this.setvalue()
                    // if (obj.offer_all != 'NA') {
                    //     this.setState({
                    //         myads_arr: obj.offer_all,

                    //     })
                    // }
                    // else {
                    //         this.props.navigation.goBack();
                    // }

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
    }
//--------------------------get user detail from local database---------------------//
        setvalue = async () => {

        let offer_data=this.state.offer_arr
        this.setState({
            offerprice: offer_data.offer_amount,
            offer_id:offer_data.offer_id,
            ads_id:offer_data.ads_id,
            seller_id:offer_data.seller_id,
            status:offer_data.status,
            delivery_type:offer_data.delivery_type,
            delivered_status:offer_data.delivered_status,
            commision:offer_data.commision,
        })
        if(offer_data.pickup_location!=''){
            user_address=offer_data.pickup_location
            this.setState({freetouchshow:true,location:offer_data.pickup_location,latitude:offer_data.latitude,longitude:offer_data.longitude,})
        }
        if(offer_data.quick_delivery_fee!= '0.00'){
            this.setState({deliverychargeshow:true,deliverychargetxt:offer_data.quick_delivery_fee,})
        }
        if(offer_data.express_delivery_fee!= '0.00'){
            this.setState({expresspostshow:true,expressposttxt:offer_data.express_delivery_fee,})
        }
        if(offer_data.standard_delivery_fee!= '0.00'){
            this.setState({standardpostshow:true,standardposttxt:offer_data.standard_delivery_fee,})
        }

       if(offer_data.status==1){
       if(offer_data.delivery_type==1){
        this.setState({deliverycharge:true,})
       }
       if(offer_data.delivery_type==2){
        this.setState({expresspost:true,})
       }
       if(offer_data.delivery_type==3){
        this.setState({standardpost:true,})
       }
       if(offer_data.delivery_type==4){
        this.setState({freetouch:true,})
       }

       }
        let image_arr=offer_data.offer_images
        this.setState({ photodata: image_arr})

    }
    //--------------------------get user selected address---------------------//
    getaddress = async () => {
        if(user_address!=''){
            this.setState({
                location: user_address,
                latitude: user_address_lat,
                longitude: user_address_long,

            })
        }
    }
    //--------------------------accept offer---------------------//

    acceptoffer=async()=>{
        let deleveryoption=''
            if ( this.state.freetouch== false && this.state.deliverycharge== false &&this.state.standardpost== false &&this.state.expresspost== false
               ) {
                msgProvider.toast(validation.emptydeliveryotion[config.language], 'center')
                return false;
            }
            if (this.state.deliverycharge== true ) {
               this.setState({ delivered_typeselect:1,  deliveredcharge:this.state.deliverychargetxt})
               deleveryoption='Quick delivery'
            }
            if (this.state.expresspost== true ) {
                this.setState({ delivered_typeselect:2,  deliveredcharge:this.state.expressposttxt})
                deleveryoption='Express post'
            }
            if (this.state.standardpost== true ) {
                this.setState({ delivered_typeselect:3,  deliveredcharge:this.state.standardposttxt})
                deleveryoption='Standard post'
            }
            if (this.state.freetouch== true ) {
                deleveryoption='Free pickup'
                this.setState({ delivered_typeselect:4,  deliveredcharge:0})

            }

            setTimeout(() => {
                let price= parseFloat(this.state.offerprice)
                let del= parseFloat(this.state.deliveredcharge)
                let commision1=0
                consolepro.consolelog('this.state.commision.buyer_comission',this.state.commision.buyer_comission)
                if(this.state.commision!='NA'){
                    commision1=parseFloat(this.state.commision.buyer_comission)
                }

                let taxes=parseFloat((this.state.offerprice*commision1)/100)

                let final=price+del+taxes


                 let finalstring=  "Are you sure you would like to accept? This is the offer amount "+price+" and this is the commission amount: "+taxes+ " and you chose delivery option: "+deleveryoption+" Pickup and delivery amount is: "+del+" and this is the total price: "+ final
                 this.setState({ finalprice:finalstring,finalamount:final})
                this.setState({modalinvoice:true})
            }, 10);





    }
    markascomplete=async()=>{
        Keyboard.dismiss()
        if (config.guest_status==true && config.device_type=='ios'){
            let result = Math.random().toString(36).substring(2,7);
            this.markascompletedone(result)
        }else{


        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null && this.state.offer_arr!='NA') {
            let user_id = user_details.user_id
           let amount= this.state.offer_arr.seller_total_amount
           let user_token_id= this.state.offer_arr.usertoken
           if(this.state.offer_arr.usertoken== 'NA'){
            msgProvider.toast('Please contact to seller for update bank details', 'center')
            return false
           }
            var data = new FormData();

        data.append('user_id', user_id)
        data.append('user_token_id', user_token_id)
        data.append('amount', amount)
        data.append('description', 'seller amount transfer')
        let url = config.baseURL + "stripe_payment/transfer_amount.php";
            apifuntion.postApi(url,data).then((obj) => {
                consolepro.consolelog('obj',obj)
                if (obj.status ==true) {
                    this.markascompletedone(obj.id)

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
    }
    }
    //--------------------------mark as cmplete offer---------------------//

    markascompletedone=async(id)=>{
        Keyboard.dismiss()
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            let user_id = user_details.user_id
            let url = config.baseURL + 'mark_as_complete.php?user_id=' + user_id + '&offer_id=' + this.state.offer_id+'&id='+id
            consolepro.consolelog('url', url);
            apifuntion.getApi(url).then((obj) => {
                if (obj.success == 'true') {
                    if(obj.notification_arr !='NA'){
                        notification.notification_arr(obj.notification_arr)
                    }
                    this.setState({delivered_status:1})

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
    }
    //--------------------------go to back screen---------------------//
    goback=()=>{
        user_address=''
        this.setState({
            offerprice:'',
            freetouch: false,
            deliverycharge: false,
            standardpost: false,
            expresspost: false,
            deliverychargetxt: '',
            standardposttxt: '',
            expressposttxt: '',
    })
        this.props.navigation.goBack()
    }
    acceptRejectPurchase = async(_action) => {
        console.log("action:",_action)
        Keyboard.dismiss()
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let user_id = user_details.user_id
            let url = config.baseURL + "accept_reject_purchase.php";
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('action', _action)
            data.append('offer_id', this.state.offer_id)
            data.append("delivery_type", this.state.delivered_typeselect)
            consolepro.consolelog('send data', data)
            apifuntion.postApi(url, data).then((obj) => {
                if (obj.success == 'true') {
                    if(obj.notification_arr !='NA'){
                        notification.notification_arr(obj.notification_arr)
                    }
                    // setTimeout(() => {

                    this.setState({status:(_action == 'accept'?1:2)})
                    msgProvider.toast(obj.msg[config.language], 'center')
                    // }, 500);


                } else {
                    if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
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
    }
    //--------------------------reject offer---------------------//
    rejectoffer=async()=>{
        Keyboard.dismiss()
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            let user_id = user_details.user_id
            let url = config.baseURL + "reject_offer.php";
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('seller_id', this.state.seller_id)
            data.append('offer_id', this.state.offer_id)
            consolepro.consolelog('send data', data)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('reject', obj)
                if (obj.success == 'true') {
                    if(obj.notification_arr !='NA'){
                        notification.notification_arr(obj.notification_arr)
                    }
                    // setTimeout(() => {

                        this.setState({status:2})
                        msgProvider.toast(obj.msg[config.language], 'center')
                    // }, 500);


                } else {
                    if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
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
    }

    offeracceptPaypal  = async () => {
        if(this.state.valuePaymentMethod === 'card') {
            return await this.offeraccept();
        }
        Keyboard.dismiss()
        this.setState({modalinvoice:false});
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            let url = config.baseAPI + `payment-ads/paypal-url/${this.state.offer_id}?delivery_type=${this.state.delivered_typeselect}`;
            consolepro.consolelog('url', url);
            apifuntion.getApi(url, 1).then((obj) => {
                this.setState({ refresh: false })
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                    // code here
                    this.setState({ paypalUrl: obj.data.paypal_url })
                } else {
                    //error
                    msgProvider.toast('Offer failed', 'long');
                    return false;
                }

            }).catch((err) => {
                consolepro.consolelog('err', err);
                this.setState({ refresh: false })
            });
        }
    }

    offeraccept=async()=>{
        if(this.state.valuePaymentMethod === 'paypal') {
            return await this.offeracceptPaypal();
        }

        Keyboard.dismiss()
        this.setState({modalinvoice:false});
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            let user_id = user_details.user_id
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('seller_id', this.state.seller_id)
            data.append('offer_id', this.state.offer_id)
            data.append("delivery_type", this.state.delivered_typeselect)
           var transfer_user_id = 0;
           var order_id = 0;
           var amount = this.state.finalamount;
          // var amount = 5
           var transfer_amount = 0;
           var descriptor_suffix = 'Offer Payment';
           var payment_url = config.baseURL + 'stripe_payment/payment_url.php?user_id=' + user_id + '&transfer_user_id=' + transfer_user_id + '&order_id=' + order_id + '&amount=' + amount + '&transfer_amount=' + transfer_amount + '&descriptor_suffix=' + descriptor_suffix;
           this.props.navigation.navigate('Offerpaymentaccept', { paymenturl: payment_url,offer_data:data })

        }
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
        console.log("this.state.offer_arr.offer_all.ads:",this.state.offer_arr);
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => { Keyboard.dismiss() }} style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                  <Modal transparent
                        visible={this.state.modalinvoice}
                    >
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={styles.modelview}>
                                <View style={{ width: '80%', borderRadius: 15, backgroundColor: 'white', padding: 20 }}>
                                    <View style={{ width: '100%', flexDirection: 'row', marginTop: 5}}>

                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 18, color: 'black', fontFamily: Font.Poppins_regular }}>{this.state.finalprice}</Text>

                                        </View>

                                    </View>

                                    <View>
                                        <View style={styles.paymentMethod}>
                                            <Text style={styles.paymentMethodTitle}>
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
                                    </View>

                                    <View style={{alignSelf:'center', flexDirection:'row',width:'80%',alignItems:'center',justifyContent:'space-between',marginTop:windowHeight*3/100}}>

                                    <TouchableOpacity  onPress={()=>{this.setState({modalinvoice:false})  }} style={{backgroundColor:'green',width:'35%',padding:windowWidth*1/100, borderRadius: 8}}>
                                    <Text style={{fontFamily: Font.Poppins_SemiBold,  fontSize: windowWidth*3/100, color: Colors.whiteColor,  textAlign: 'center' }}>
                                       {Lang_chg.cancel[config.language]}
                                    </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity  onPress={()=>{this.state.valuePaymentMethod === 'card' ? this.offeraccept() : this.offeracceptPaypal() }} style={{backgroundColor:'green',width:'35%',padding:windowWidth*1/100, borderRadius: 8}}>
                                    <Text style={{fontFamily: Font.Poppins_SemiBold,  fontSize: windowWidth*3/100, color: Colors.whiteColor,  textAlign: 'center' }}>
                                    {Lang_chg.ok[config.language]}
                                    </Text>
                                    </TouchableOpacity>
                                    </View>

                                </View>

                            </View>
                        </SafeAreaView>

                    </Modal>
                <ScrollView >
                    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingBottom: windowHeight * 4 / 100, }}>

                        <View style={[CSSstyle.notification_header, { paddingTop: 10, paddingBottom: 10, }]}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.goback() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtadsoffer[config.language]}</Text>
                            <View style={{ padding: 2, justifyContent: 'center' }} >
                                <Text>{'    '}</Text>
                            </View>
                        </View>

                        <View style={{ width: '90%', alignItems: 'center', alignSelf: 'center' }}>

                            <View onPress={() => {  }} style={[styles.mainview, { marginTop: windowHeight * 3 / 100 }]}>
                                <View style={styles.txtview}>
                                {this.state.offer_arr!='NA' &&<Text style={[styles.edittext, {}]}>{Lang_chg.txtadsofferprice[config.language]} </Text>}
                                </View>
                            </View>
                            <View style={[styles.mainview, {width: '100%',marginTop: windowHeight * 0 / 100 }]}>
                                       {/* <View style={{paddingTop:windowHeight*.6/100, alignItems: 'center',backgroundColor:Colors.theme_color1,justifyContent:'center'}}>
                                               <Text style={[ {alignSelf:'center', fontSize: windowWidth * 3.5 / 100, paddingHorizontal:windowWidth * .3 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold,color:'white'}]}>{Lang_chg.txtMatch[config.language]+match_price} </Text>
                                                    </View> */}
                                 {this.state.offer_arr!='NA' &&  <View style={{marginLeft:windowWidth*2/100, width: '50%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                    <Text  style={[styles.edittext,{height:windowHeight*5/100}]}
                                        >${this.state.offerprice}</Text>
                                </View>}

                            </View>
                            <View  style={[styles.mainview, { marginTop: windowHeight * 3 / 100 }]}>
                                <View style={styles.txtview}>
                                {this.state.offer_arr!='NA' && <Text style={[styles.edittext, {}]}>{Lang_chg.deliveryoption[config.language]} </Text>}
                                </View>
                            </View>
                            {/* Start looking product */}
                            {(this.state.offer_arr && this.state.offer_arr.ads && this.state.offer_arr.ads.for_sale == 0) && <View>
                            {this.state.freetouchshow==true &&    <View  style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                           {this.state.status==0 ? <TouchableOpacity onPress={()=>{this.setState({deliverycharge:false,expresspost:false,freetouch:true,standardpost:false})}} style={{flexDirection:'row',alignItems:'center'}}>
                                     <View >
                                              {this.state.freetouch==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </View>
                                     <Text style={[styles.edittext, {marginLeft:windowWidth*2/100, fontSize: windowWidth * 3/ 100,}]}>{Lang_chg.freepickup[config.language]} </Text>
                                </TouchableOpacity>:
                            <View  style={{flexDirection:'row',alignItems:'center'}}>
                                     <View >
                                              {this.state.freetouch==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </View>
                                     <Text style={[styles.edittext, {marginLeft:windowWidth*2/100, fontSize: windowWidth * 3/ 100,}]}>{Lang_chg.freepickup[config.language]} </Text>
                                </View>}
                            </View>}

                          {this.state.freetouchshow==true &&  <View  style={[styles.mainview, {borderBottomColor: 'red', borderBottomWidth: 1,  marginTop: windowHeight * 2 / 100 }]}>
                                <View style={styles.txtview}>
                                    {( config.newaddress =='' ||  config.newaddress==null) ? <Text style={[styles.edittext, {}]}>{this.state.location} </Text>:
                                    <Text style={[styles.edittext, {}]}>{ config.newaddress} </Text>}
                                </View>
                                <View style={styles.imageview}>
                                    <Image style={styles.icon} source={localimag.locationicon}></Image>
                                </View>
                            </View>
                            }

                           {this.state.deliverychargeshow==true && <View  style={[styles.mainview, { marginTop: windowHeight * 4 / 100 }]}>
                           {this.state.status==0 ?  <TouchableOpacity activeOpacity={.9} onPress={()=>{this.setState({deliverycharge:true,expresspost:false,freetouch:false,standardpost:false})}} style={{flexDirection:'row',alignItems:'center'}}>
                                     <View  style={{width:'8%'}}>
                                              {this.state.deliverycharge==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </View>
                                     <View  style={{width:'65%',}}>
                                          <Text style={[styles.edittext, {marginLeft:windowWidth*2/100,fontSize: windowWidth * 3 / 100, width: '47%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,}]}>{Lang_chg.quickdelivery[config.language]} </Text>
                                     </View>
                                     <View style={{ width: '25%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                        <Text style={[styles.edittext,{height:windowHeight*5/100}]}
                                        >${this.state.deliverychargetxt}</Text>
                                    </View>
                                </TouchableOpacity>:
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                     <View  style={{width:'8%'}}>
                                              {this.state.deliverycharge==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </View>
                                     <View  style={{width:'65%',}}>
                                          <Text style={[styles.edittext, {marginLeft:windowWidth*2/100,fontSize: windowWidth * 3 / 100, width: '47%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,}]}>{Lang_chg.quickdelivery[config.language]} </Text>
                                     </View>
                                     <View style={{ width: '25%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                        <Text style={[styles.edittext,{height:windowHeight*5/100}]}
                                        >${this.state.deliverychargetxt}</Text>
                                    </View>
                                </View>}
                            </View>}
                            {this.state.expresspostshow==true &&  <View  style={[styles.mainview, { marginTop: windowHeight * 4 / 100 }]}>
                            {this.state.status==0 ?  <TouchableOpacity activeOpacity={.9} onPress={()=>{this.setState({deliverycharge:false,expresspost:true,freetouch:false,standardpost:false})}} style={{flexDirection:'row',alignItems:'center'}}>
                                     <View style={{width:'8%'}}>
                                              {this.state.expresspost==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </View>
                                     <View  style={{width:'65%',}}>
                                          <Text style={[styles.edittext, {marginLeft:windowWidth*2/100,fontSize: windowWidth * 3 / 100, width: '47%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,}]}>{Lang_chg.expressdelivery[config.language]} </Text>
                                     </View>

                                     <View style={{ width: '25%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                        <Text style={[styles.edittext,{height:windowHeight*5/100}]}
                                        >${this.state.expressposttxt}</Text>
                                    </View>
                                </TouchableOpacity>:
                                <View  style={{flexDirection:'row',alignItems:'center'}}>
                                     <View style={{width:'8%'}}>
                                              {this.state.expresspost==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </View>
                                     <View  style={{width:'65%',}}>
                                          <Text style={[styles.edittext, {marginLeft:windowWidth*2/100,fontSize: windowWidth * 3 / 100, width: '47%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,}]}>{Lang_chg.expressdelivery[config.language]} </Text>
                                     </View>

                                     <View style={{ width: '25%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                        <Text style={[styles.edittext,{height:windowHeight*5/100}]}
                                        >${this.state.expressposttxt}</Text>
                                    </View>
                                </View>}
                            </View>}
                            {this.state.standardpostshow==true &&  <View  style={[styles.mainview, { marginTop: windowHeight * 4 / 100 }]}>
                            {this.state.status==0 ?    <TouchableOpacity  activeOpacity={.9} onPress={()=>{this.setState({deliverycharge:false,expresspost:false,freetouch:false,standardpost:true})}} style={{flexDirection:'row',alignItems:'center'}}>
                                     <View  style={{width:'8%'}}>
                                              {this.state.standardpost==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </View>
                                     <View style={{width:'65%',}}>
                                          <Text style={[styles.edittext, {marginLeft:windowWidth*2/100,fontSize: windowWidth * 3 / 100, width: '47%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,}]}>{Lang_chg.standarddelivery[config.language]} </Text>
                                     </View>

                                     <View style={{ width: '25%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                        <Text     style={[styles.edittext,{height:windowHeight*5/100}]}
                                       >${this.state.standardposttxt}</Text>
                                    </View>
                                </TouchableOpacity>:
                                <View   style={{flexDirection:'row',alignItems:'center'}}>
                                     <View onPress={()=>{this.setState({standardpost:!this.state.standardpost})}} style={{width:'8%'}}>
                                              {this.state.standardpost==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </View>
                                     <View style={{width:'65%',}}>
                                          <Text style={[styles.edittext, {marginLeft:windowWidth*2/100,fontSize: windowWidth * 3 / 100, width: '47%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,}]}>{Lang_chg.standarddelivery[config.language]} </Text>
                                     </View>

                                     <View style={{ width: '25%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                        <Text     style={[styles.edittext,{height:windowHeight*5/100}]}
                                       >${this.state.standardposttxt}</Text>
                                    </View>
                                </View>}
                            </View>}

                           {this.state.photodata!='NA'&& <View style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', marginTop: windowHeight * 4 / 100 }}>
                                <FlatList
                                    data={this.state.photodata}
                                    horizontal={true}

                                    renderItem={({ item, index }) => {
                                        consolepro.consolelog('item',item)
                                        return (
                                            <TouchableOpacity style={{ marginLeft: 3, width: windowWidth * 18 / 100, height: windowWidth * 16 / 100 }} onPress={() => { this.props.navigation.navigate('Fullimage',{image_arr:this.state.photodata}) }}>

                                                <View style={{ width: '100%', height: '100%', backgroundColor: '#F1FAFE', borderRadius: 8, justifyContent: 'center' }}>
                                                    <ImageBackground imageStyle={{ borderRadius: 8 }} style={{ width: windowWidth * 18 / 100, height: windowWidth * 16 / 100, resizeMode: 'cover', alignSelf: 'center' }} source={{ uri: config.img_url2+item.image }} >
                                                    </ImageBackground>
                                                </View>
                                        </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
    }

              {this.state.status==0 ?  <View style={{flexDirection:'row',justifyContent:'center' ,width:'100%', alignItems: 'center', alignSelf: 'center'}}>
                             {this.state.offer_arr!='NA' &&   <TouchableOpacity onPress={() => {this.acceptoffer() }} style={{marginTop: windowHeight * 10 / 100, width: '45%', paddingVertical: windowHeight*1/100, backgroundColor: 'green', alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>

                                    <Text style={styles.txtlogin}>{Lang_chg.txtAccept[config.language]}</Text>
                                </TouchableOpacity>}
                  {this.state.offer_arr!='NA' && <View style={{width: '9.9%'}} />}
                  {this.state.offer_arr!='NA' &&     <TouchableOpacity onPress={() => {this.rejectoffer() }} style={{marginTop: windowHeight * 10 / 100, width: '45%', paddingVertical: windowHeight*1/100, backgroundColor: Colors.theme_color1, alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>

                                <Text style={styles.txtlogin}>{Lang_chg.txtReject[config.language]}</Text>
                                </TouchableOpacity>}
                            </View>:
                            <View style={{flexDirection:'row',justifyContent:'space-between' ,width:'90%'}}>

                                  {this.state.status==2 &&  <View  style={{marginTop: windowHeight * 10 / 100, width: '100%', paddingVertical: windowHeight*1/100, backgroundColor: 'red', alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>
                                  <Text style={styles.txtlogin}>{Lang_chg.txtRejected[config.language]}</Text>
                                    </View>}
                                    {(this.state.status==1 && this.state.delivered_status==0) && <TouchableOpacity onPress={() => {this.markascomplete() }} style={{marginTop: windowHeight * 10 / 100, width: '100%', paddingVertical: windowHeight*1/100, backgroundColor: 'orange', alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>
                                  <Text style={styles.txtlogin}>{Lang_chg.txtmarkascomplete[config.language]}</Text>
                                    </TouchableOpacity>}
                                    {(this.state.status==1 && this.state.delivered_status!=0)  &&  <View  style={{marginTop: windowHeight * 10 / 100, width: '100%', paddingVertical: windowHeight*1/100, backgroundColor: 'green', alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>
                                  <Text style={styles.txtlogin}>{Lang_chg.txtAccepted[config.language]}</Text>
                                    </View>}

                           </View>}


                           <View style={{ marginTop: windowHeight * 3 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between' }}>
                        <Text  style={styles.txtitemprice1}>After accepting an offer, your payment will be held securely by us. Once you have received your item, please click the 'mark as delivered' button above.</Text>
                        </View>

                            </View>}
                            {/* End Looking product */}
                            {(this.state.offer_arr && this.state.offer_arr.ads && this.state.offer_arr.ads.for_sale == 1) && <View>
                                {this.state.offer_arr && this.state.offer_arr.pickup_location != '' && <View style={{ marginTop: windowHeight * 1 / 100, width: '90%', flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                                    <Image style={styles.iconswatch} source={localimag.locationicon}></Image>
                                    <Text style={[styles.txtdesc2, { marginLeft: 5, marginTop: 2 }]}>{this.state.offer_arr.pickup_location}</Text>

                                </View>}
                                {this.state.offer_arr && this.state.offer_arr.quick_delivery_fee != '0.00' &&
                                <View style={[styles.mainview, { marginTop: windowHeight * 2 / 100 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                        <View style={{ width: '50%', }}>
                                            <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.quickdelivery[config.language]} </Text>
                                        </View>

                                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Text style={[styles.edittext, {textAlign:'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>${this.state.offer_arr.quick_delivery_fee} </Text>
                                        </View>
                                    </View>
                                </View>}
                                {this.state.offer_arr && this.state.offer_arr.standard_delivery_fee != '0.00' &&
                                <View style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                        <View style={{ width: '50%', }}>
                                            <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.standarddelivery[config.language]} </Text>
                                        </View>

                                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Text style={[styles.edittext, {textAlign:'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>${this.state.offer_arr.standard_delivery_fee} </Text>
                                        </View>
                                    </View>
                                </View>}
                                {this.state.offer_arr && this.state.offer_arr.express_delivery_fee != '0.00' &&
                                <View style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                        <View style={{ width: '50%', }}>
                                            <Text style={[styles.edittext, { marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>{Lang_chg.expressdelivery[config.language]} </Text>
                                        </View>

                                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Text style={[styles.edittext, {textAlign:'right', marginLeft: windowWidth * 2 / 100, fontSize: windowWidth * 3 / 100, width: '100%', marginTop: windowHeight * 1 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, }]}>${this.state.offer_arr.express_delivery_fee} </Text>
                                        </View>
                                    </View>
                                </View>}
                                <View  style={[styles.mainview, { marginTop: windowHeight * 3 / 100,flexDirection: 'row',color:styles.red_color }]}>
                                    <View style={[styles.txtview,{width:"60%",color:styles.red_color}]}>
                                        <Text style={[styles.edittext, {color:styles.red_color}]}>{Lang_chg.youWillGet[config.language]} </Text>
                                    </View>
                                    <View style={[styles.txtview,{width:"40%",color:styles.red_color}]}>
                                        <Text style={[styles.edittext, {color:styles.red_color}]}>${this.state.offer_arr.seller_total_amount} </Text>
                                    </View>
                                </View>

                                {(this.state.offer_arr && this.state.offer_arr.status == 0) ?  <View style={{flexDirection:'row',justifyContent:'space-between' ,width:'90%'}}>
                                        {this.state.offer_arr!='NA' &&   <TouchableOpacity onPress={() => {this.acceptRejectPurchase('accept') }} style={{marginTop: windowHeight * 10 / 100, width: '45%', paddingVertical: windowHeight*1/100, backgroundColor: 'green', alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>

                                            <Text style={styles.txtlogin}>{Lang_chg.txtAccept[config.language]}</Text>
                                        </TouchableOpacity>}
                                        {this.state.offer_arr!='NA' &&     <TouchableOpacity onPress={() => {this.acceptRejectPurchase('reject') }} style={{marginTop: windowHeight * 10 / 100, width: '45%', paddingVertical: windowHeight*1/100, backgroundColor: Colors.theme_color1, alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>

                                            <Text style={styles.txtlogin}>{Lang_chg.txtReject[config.language]}</Text>
                                        </TouchableOpacity>}
                                    </View>:
                                    <View style={{flexDirection:'row',justifyContent:'space-between' ,width:'90%'}}>

                                        {this.state.status==2 &&  <View  style={{marginTop: windowHeight * 10 / 100, width: '100%', paddingVertical: windowHeight*1/100, backgroundColor: 'red', alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>
                                            <Text style={styles.txtlogin}>{Lang_chg.txtRejected[config.language]}</Text>
                                        </View>}
                                        {(this.state.status==1 && this.state.delivered_status==0) && <TouchableOpacity onPress={() => {this.markascomplete() }} style={{marginTop: windowHeight * 10 / 100, width: '100%', paddingVertical: windowHeight*1/100, backgroundColor: 'orange', alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>
                                            <Text style={styles.txtlogin}>{Lang_chg.txtmarkascomplete[config.language]}</Text>
                                        </TouchableOpacity>}
                                        {(this.state.status==1 && this.state.delivered_status!=0)  &&  <View  style={{marginTop: windowHeight * 10 / 100, width: '100%', paddingVertical: windowHeight*1/100, backgroundColor: 'green', alignSelf: 'center',  justifyContent: 'center', borderRadius: 8 }}>
                                            <Text style={styles.txtlogin}>{Lang_chg.txtAccepted[config.language]}</Text>
                                        </View>}

                                    </View>}
                            </View>}

                        </View>




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
                                <View style={{ width: '100%', flexDirection: 'row', marginTop: 5}}>

                                    <View style={{ width: '100%', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 18, color: 'black', fontFamily: Font.Poppins_Bold }}>{this.state.paymentSuccess ? "Payment Success" : "Payment Failed"}</Text>

                                    </View>

                                </View>

                                <Text style={{fontFamily: Font.Poppins_Regular, paddingBottom: 20, fontSize: 14, color: Colors.gray_color, marginTop: 5, textAlign: 'center' }}>
                                    {'Date : '+new Date().toLocaleString()+''}
                                </Text>

                                <TouchableOpacity  onPress={()=>{this.setState({showmodal2:false});  this.props.navigation.goBack()}} style={{backgroundColor:'green',width:'30%',alignSelf:'center',padding:10, borderRadius: 8}}>
                                    <Text style={{fontFamily:Font.Poppins_Bold,  fontSize: 15, color: Colors.white_color,  textAlign: 'center' }}>
                                        {"Ok"}
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </SafeAreaView>

                </Modal>

            </TouchableOpacity>
        )
    }
}



const styles = StyleSheet.create({
    txtitemprice1: {
       textAlign:'justify', fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor,
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
    hole_top_l1:{
        width:windowWidth*6/100,height:windowWidth*6/100,resizeMode:'contain'
    },
    edittext:{fontSize: windowWidth * 3.7 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,},

    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },

    mainview: { width: '100%', flexDirection: 'row', alignSelf: 'center', },
    imageview: { width: '10%',paddingTop:windowHeight*.6/100, alignItems: 'center' },
    txtview: { width: '90%' ,paddingVertical:windowHeight*1/100},

    icon: {
        width: windowWidth * 4 / 100,
        height: windowWidth * 4 / 100,
        resizeMode: 'cover', alignSelf: 'center'
    },
    paymentMethod: { marginTop: 0, padding: 10 },
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
});
