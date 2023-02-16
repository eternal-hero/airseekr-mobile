import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
const photodata = [
    { 'id': 0, image: 'NA', file: 'NA', status: false },
    { 'id': 1, image: 'NA', file: 'NA', status: false },
    { 'id': 2, image: 'NA', file: 'NA', status: false },
    { 'id': 3, image: 'NA', file: 'NA', status: false },
    { 'id': 4, image: 'NA', file: 'NA', status: false },

]
export default class Offerprice extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            offerprice: '',
            freetouch: false,
            deliverycharge: false,
            standardpost: false,
            expresspost: false,
            deliverychargetxt: '',
            standardposttxt: '',
            product_detail: null,
            expressposttxt: '',
            latitude: config.latitude,
            longitude: config.longitude,
            location: 'Enter Location',
            ads_id:ads_id,
            photodata: photodata,
            cameramodalon: false,
            radioDelivery:{},
            arrDelivery:[],
            delivery_type:null
        }

    }
    componentDidMount() {
        let pic_arr = this.state.photodata
        for (let i = 0; i < pic_arr.length; i++) {
            pic_arr[i].image = 'NA'
        }
        if(current_detail_product.for_sale == 1) {
            var arrDelivery = [];
            var radioDeliverProps = [];
            console.log("current_detail_product:",current_detail_product);
            if(current_detail_product.delivery_info) {
                var deliverInfo = current_detail_product.delivery_info;
                console.log("deliverInfo:",deliverInfo);
                if(deliverInfo.quick_delivery != undefined && deliverInfo.quick_delivery.valid == "true") {
                    arrDelivery[0] = deliverInfo.quick_delivery.price;
                    radioDeliverProps.push({label:Lang_chg.quickdeliveryc[config.language] + ': $' + deliverInfo.quick_delivery.price,value:0});
                }
                if(deliverInfo.express_post !== undefined && deliverInfo.express_post.valid == "true") {
                    arrDelivery[1] = deliverInfo.express_post.price;
                    radioDeliverProps.push({label:Lang_chg.expressdelivery[config.language] + ': $' + deliverInfo.express_post.price,value:1});
                }
                if(deliverInfo.standard_post !== undefined && deliverInfo.standard_post.valid == "true") {
                    arrDelivery[2] = deliverInfo.standard_post.price;
                    radioDeliverProps.push({label:Lang_chg.standarddelivery[config.language] + ': $' + deliverInfo.standard_post.price,value:2});
                }
            }
            radioDeliverProps.push({label:Lang_chg.freepickup[config.language] + ": " + current_detail_product.location,value:3})
            arrDelivery[3] = "0";
            console.log("radioDeliverProps:",radioDeliverProps);
        }
        this.setState({ photodata: pic_arr,radioDelivery:radioDeliverProps,arrDelivery:arrDelivery });
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
            this.getaddress()
        });

    }
    _openCamera = () => {
        mediaprovider.launchCamera().then((obj) => {
            consolepro.consolelog('imageobj', obj)
            this.setState({ cameramodalon: false })
            let data = this.state.photodata
            for (let i = 0; i < data.length; i++) {
                if (data[i].image == 'NA') {
                    data[i].image = obj.path
                    break;
                }
            }
            this.setState({
                photodata: data
            })
        })
    }

    _openGellery = () => {

        mediaprovider.launchGellery().then((obj) => {
            consolepro.consolelog('imageobj', obj)
            this.setState({ cameramodalon: false })
            if (obj.mime == "image/jpeg") {
                let data = this.state.photodata
                for (let i = 0; i < data.length; i++) {
                    if (data[i].image == 'NA') {
                        data[i].image = obj.path
                        break;
                    }
                }
                this.setState({
                    photodata: data
                })

            }
        })
    }
    //-----------------check already image or not-----------------//
    cameraclcik = (item, index) => {
        if (item.image == 'NA') {
            this.setState({ cameramodalon: true, })
        }
    }
    //--------------------------delete images---------------------//
    deleteiamage = (index) => {
        let data = this.state.photodata
        data[index].image = 'NA';
        this.setState({
            photodata: data
        })
    }
//--------------------------get user detail from local database---------------------//
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
        }
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
    //--------------------------Create offer---------------------//
    newofferadd=async()=>{
        Keyboard.dismiss()
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            let user_id = user_details.user_id

            if (ads_id == 0) {
                msgProvider.toast(validation.emptysomething[config.language], 'center')
                return false;
            }
            let offerprice = this.state.offerprice.trim()
            if (offerprice.length <= 0 || offerprice==0) {
                msgProvider.toast(validation.emptyofferprice[config.language], 'center')
                return false;
            }

            if (this.state.freetouch== true && user_address=="") {
                msgProvider.toast(validation.emptyAddress[config.language], 'center')
                return false;
            }
            var data = new FormData();
            let url = config.baseURL + "add_new_offer.php";
            if(current_detail_product.for_sale == 1) {
                url = config.baseURL + "add_new_purchase.php";
                var delivery_type = this.state.delivery_type;
                if ( this.state.delivery_type == null) {
                    msgProvider.toast(validation.emptydeliveryotion[config.language], 'center')
                    return false;
                }
                console.log("delivery_type:",delivery_type);
                var delivery_price = this.state.arrDelivery[delivery_type];
                delivery_type = delivery_type + 1;
                let pick_up_address = "";
                if(delivery_type == 0) {
                    pick_up_address = current_detail_product.location;
                }
                data.append('user_id', user_id)
                data.append('ads_id', this.state.ads_id)
                data.append('offer_price', offerprice)
                data.append("address", pick_up_address)
                data.append("latitude", this.state.latitude)
                data.append("longitude", this.state.longitude)
                data.append("buyer_comission_percent", 0.00)
                data.append("seller_comission_percent", 0.00)
                data.append("delivery_price",delivery_price)
                data.append("delivery_type",delivery_type)
                data.append("offer_id",0)
            } else {
                if ( this.state.freetouch== false && this.state.deliverycharge== false &&this.state.standardpost== false &&this.state.expresspost== false
                ) {
                    msgProvider.toast(validation.emptydeliveryotion[config.language], 'center')
                    return false;
                }
                if (this.state.deliverycharge== true ) {
                    let deliverychargetxt = this.state.deliverychargetxt.trim()
                    if (deliverychargetxt.length <= 0 || deliverychargetxt==0) {
                        msgProvider.toast(validation.emptyquickprice[config.language], 'center')
                        return false;
                    }
                }
                if (this.state.standardpost== true ) {
                    let standardposttxt = this.state.standardposttxt.trim()
                    if (standardposttxt.length <= 0 || standardposttxt==0) {
                        msgProvider.toast(validation.emptystandardprice[config.language], 'center')
                        return false;
                    }
                }
                if (this.state.expresspost== true ) {
                    let expressposttxt = this.state.expressposttxt.trim()
                    if (expressposttxt.length <= 0 || expressposttxt==0) {
                        msgProvider.toast(validation.emptyexpresprice[config.language], 'center')
                        return false;
                    }
                }
                let user_address1 = user_address
                if (this.state.freetouch== false){
                    user_address1=''
                }


                let image_arr = this.state.photodata
                let imageavailable = false
                for (let j = 0; j < image_arr.length; j++) {
                    if (image_arr[j].image != 'NA') {
                        imageavailable = true
                    }
                }
                // if (imageavailable == false) {
                //     msgProvider.toast(validation.emptyadsimage[config.language], 'center')
                //     return false;
                // }

                data.append('user_id', user_id)
                data.append('ads_id', this.state.ads_id)
                data.append('offer_price', offerprice)
                data.append("address", user_address1)
                data.append("latitude", this.state.latitude)
                data.append("longitude", this.state.longitude)
                data.append("deliverycharge", this.state.deliverychargetxt)
                data.append("standardpost", this.state.standardposttxt)
                data.append("expresspost",this.state.expressposttxt)
                data.append("offer_id",0)
                for (let i = 0; i < image_arr.length; i++) {
                    if (image_arr[i].image != 'NA') {
                        data.append('offer_image[]', {
                            uri: image_arr[i].image,
                            type: 'image/jpg',
                            name: 'image.jpg'
                        })
                    }

                }
            }
            console.log("URL:",url);
            apifuntion.postApi(url, data).then((obj) => {
                console.log("obj:",obj);
                if (obj.success == 'true') {
                    if(obj.notification_arr !='NA'){
                        notification.notification_arr(obj.notification_arr)
                    }
                        user_address = ''
                        let ads_ids=ads_id
                        ads_id=''
                        this.props.navigation.navigate('Itemdetail',{ads_id:ads_ids})



                } else {
                    if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                        config.checkUserDeactivate(this.props.navigation)
                    } else {
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    }
                    return false;
                }
            }).catch(err => {
                this.props.navigation.navigate('Itemdetail',{ads_id:this.state.ads_id})
                consolepro.consolelog('err11', err);
            });

        }
        // this.props.navigation.navigate('Congratulations')
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

    render() {

        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => { Keyboard.dismiss() }} style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <Cameragallery mediamodal={this.state.cameramodalon} Camerapopen={() => { this._openCamera() }} Galleryopen={() => { this._openGellery() }} Canclemedia={() => { this.setState({ cameramodalon: false }) }} />


                <ScrollView >
                    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingBottom: windowHeight * 4 / 100, }}>

                        <View style={[CSSstyle.notification_header, { paddingTop: 10, paddingBottom: 10, }]}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.goback() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtwhatsoffer[config.language]}</Text>
                            <View style={{ padding: 2, justifyContent: 'center' }} >
                                <Text>{'    '}</Text>
                            </View>
                        </View>

                        <View style={{ width: '90%', alignItems: 'center', alignSelf: 'center' }}>

                            <View onPress={() => {  }} style={[styles.mainview, { marginTop: windowHeight * 3 / 100 }]}>
                                <View style={styles.txtview}>
                                        <Text style={[styles.edittext, {}]}>{Lang_chg.txtwhatsoffer1[config.language]} </Text>
                                </View>
                            </View>
                            <View style={[styles.mainview, {width: '100%',marginTop: windowHeight * 0 / 100 }]}>
                                       <TouchableOpacity onPress={()=>{this.setState({offerprice:match_price.toString()})}} style={{paddingTop:windowHeight*.6/100, alignItems: 'center',backgroundColor:Colors.theme_color1,justifyContent:'center'}}>
                                               <Text style={[ {alignSelf:'center', fontSize: windowWidth * 3.5 / 100, paddingHorizontal:windowWidth * .3 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold,color:'white'}]}>{Lang_chg.txtMatch[config.language]+match_price} </Text>
                                                    </TouchableOpacity>
                                  <View style={{marginLeft:windowWidth*2/100, width: '50%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                    <TextInput
                                        value={"" + this.state.offerprice + ""}
                                        onChangeText={(txt) => { this.setState({  offerprice: txt }) }}
                                        keyboardType='number-pad'
                                        maxLength={10}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => {  }}
                                        style={[styles.edittext,{height:windowHeight*5/100}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={'$0.00'}></TextInput>
                                </View>

                            </View>
                            <View  style={[styles.mainview, { marginTop: windowHeight * 3 / 100 }]}>
                                <View style={styles.txtview}>
                                        <Text style={[styles.edittext, {}]}>{Lang_chg.deliveryoption[config.language]} </Text>
                                </View>
                            </View>
                            {/* Start Looking for*/}
                            {(current_detail_product && current_detail_product.for_sale == 0) && <View>
                            <View  style={[styles.mainview, { marginTop: windowHeight * 1 / 100 }]}>
                            <TouchableOpacity onPress={()=>{this.setState({freetouch:!this.state.freetouch})}} style={{flexDirection:'row',alignItems:'center'}}>
                                     <View >
                                              {this.state.freetouch==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </View>
                                     <Text style={[styles.edittext, {marginLeft:windowWidth*2/100, fontSize: windowWidth * 3/ 100,}]}>{Lang_chg.freepickup[config.language]} </Text>
                                </TouchableOpacity>
                            </View>

                          {this.state.freetouch==true &&  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Location')}} style={[styles.mainview, {borderBottomColor: 'red', borderBottomWidth: 1,  marginTop: windowHeight * 2 / 100 }]}>
                                <View style={styles.txtview}>
                                    {( config.newaddress =='' ||  config.newaddress==null) ? <Text style={[styles.edittext, {}]}>{this.state.location} </Text>:
                                    <Text style={[styles.edittext, {}]}>{ config.newaddress} </Text>}
                                </View>
                                <View style={styles.imageview}>
                                    <Image style={styles.icon} source={localimag.locationicon}></Image>
                                </View>
                            </TouchableOpacity>
                            }

                            <View  style={[styles.mainview, { marginTop: windowHeight * 4 / 100 }]}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                     <TouchableOpacity onPress={()=>{this.setState({deliverycharge:!this.state.deliverycharge})}} style={{width:'8%'}}>
                                              {this.state.deliverycharge==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </TouchableOpacity>
                                     <TouchableOpacity activeOpacity={.9} onPress={()=>{this.setState({deliverycharge:!this.state.deliverycharge})}} style={{width:'65%',}}>
                                          <Text style={[styles.edittext, {marginLeft:windowWidth*2/100,fontSize: windowWidth * 3 / 100, width: '47%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,}]}>{Lang_chg.quickdelivery[config.language]} </Text>
                                     </TouchableOpacity>

                                     <View style={{ width: '25%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                        <TextInput
                                        value={"" + this.state.deliverychargetxt + ""}
                                        onChangeText={(txt) => { this.setState({  deliverychargetxt: txt }) }}
                                        keyboardType='number-pad'
                                        maxLength={6}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => {  }}
                                        style={[styles.edittext,{height:windowHeight*5/100}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={'$0.00'}></TextInput>
                                </View>
                                </View>
                            </View>
                            <View  style={[styles.mainview, { marginTop: windowHeight * 4 / 100 }]}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                     <TouchableOpacity onPress={()=>{this.setState({expresspost:!this.state.expresspost})}} style={{width:'8%'}}>
                                              {this.state.expresspost==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </TouchableOpacity>
                                     <TouchableOpacity activeOpacity={.9} onPress={()=>{this.setState({expresspost:!this.state.expresspost})}} style={{width:'65%',}}>
                                          <Text style={[styles.edittext, {marginLeft:windowWidth*2/100,fontSize: windowWidth * 3 / 100, width: '47%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,}]}>{Lang_chg.expressdelivery[config.language]} </Text>
                                     </TouchableOpacity>

                                     <View style={{ width: '25%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                        <TextInput
                                        value={"" + this.state.expressposttxt + ""}
                                        onChangeText={(txt) => { this.setState({  expressposttxt: txt }) }}
                                        keyboardType='number-pad'
                                        maxLength={6}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => {  }}
                                        style={[styles.edittext,{height:windowHeight*5/100}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={'$0.00'}></TextInput>
                                </View>
                                </View>
                            </View>
                            <View  style={[styles.mainview, { marginTop: windowHeight * 4 / 100 }]}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                     <TouchableOpacity onPress={()=>{this.setState({standardpost:!this.state.standardpost})}} style={{width:'8%'}}>
                                              {this.state.standardpost==false ? <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addunselect}></Image>:
                                              <Image resizeMode="contain" style={styles.hole_top_l1} source={localimag.addselect}></Image>}
                                     </TouchableOpacity>
                                     <TouchableOpacity activeOpacity={.9} onPress={()=>{this.setState({standardpost:!this.state.standardpost})}} style={{width:'65%',}}>
                                          <Text style={[styles.edittext, {marginLeft:windowWidth*2/100,fontSize: windowWidth * 3 / 100, width: '47%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,}]}>{Lang_chg.standarddelivery[config.language]} </Text>
                                     </TouchableOpacity>

                                     <View style={{ width: '25%', borderBottomColor: 'red', borderBottomWidth: 1,  }}>
                                        <TextInput
                                        value={"" + this.state.standardposttxt + ""}
                                        onChangeText={(txt) => { this.setState({  standardposttxt: txt }) }}
                                        keyboardType='number-pad'
                                        maxLength={6}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => {  }}
                                        style={[styles.edittext,{height:windowHeight*5/100}]}
                                        placeholderTextColor={Colors.blackColor} placeholder={'$0.00'}></TextInput>
                                </View>
                                </View>
                            </View>
                            <Text style={[styles.txtitem, { marginTop: windowHeight * 3 / 100 }]}>{Lang_chg.txtuploadphoto[config.language]}</Text>
                            <View style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', marginTop: windowHeight * 2 / 100 }}>
                                <FlatList
                                    data={this.state.photodata}
                                    horizontal={true}

                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity style={{ marginLeft: 3, width: windowWidth * 18 / 100, height: windowWidth * 16 / 100 }} onPress={() => { this.cameraclcik(item, index) }}>
                                                {item.image == 'NA' ? <View style={{ width: '100%', height: '100%', backgroundColor: '#F1FAFE', borderRadius: 8, justifyContent: 'center' }}>
                                                    <Image style={{ width: windowWidth * 5 / 100, height: windowWidth * 5 / 100, resizeMode: 'cover', alignSelf: 'center' }} source={localimag.greycameraicon} />
                                                </View> :
                                                    <View style={{ width: '100%', height: '100%', backgroundColor: '#F1FAFE', borderRadius: 8, justifyContent: 'center' }}>
                                                        <ImageBackground imageStyle={{ borderRadius: 8 }} style={{ width: windowWidth * 18 / 100, height: windowWidth * 16 / 100, resizeMode: 'cover', alignSelf: 'center' }} source={{ uri: item.image }} >
                                                            <TouchableOpacity onPress={() => { this.deleteiamage(index) }}>
                                                                <Image style={{ width: 20, height: 20, borderRadius: 50, alignSelf: 'flex-end' }} source={localimag.crossicon} />
                                                            </TouchableOpacity>
                                                        </ImageBackground>


                                                    </View>}


                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                            </View>}
                            {/*End Looking for */ }
                            {(current_detail_product && current_detail_product.for_sale == 1) && <View>
                                <RadioForm
                                    radio_props={this.state.radioDelivery}
                                    initial={-1}
                                    onPress={(value) => {this.setState({delivery_type:value})}}
                                />
                            </View>}
                            <TouchableOpacity onPress={() => {this.newofferadd() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 10 / 100, }]}>

                                <Text style={styles.txtlogin}>{Lang_chg.txtcreateoffer[config.language]}</Text>
                            </TouchableOpacity>
                        </View>


                    </View>
                </ScrollView>


            </TouchableOpacity>
        )
    }
}



const styles = StyleSheet.create({
    txtitem: {
        width: '100%', paddingVertical: windowWidth * .1 / 100, fontSize: windowWidth * 4.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: windowWidth * 0 / 100

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

});
