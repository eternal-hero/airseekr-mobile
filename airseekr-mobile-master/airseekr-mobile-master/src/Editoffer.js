import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import RadioForm from 'react-native-simple-radio-button';
const photodata = [
    { 'id': 0, image: 'NA', file: 'NA', status: false },
    { 'id': 1, image: 'NA', file: 'NA', status: false },
    { 'id': 2, image: 'NA', file: 'NA', status: false },
    { 'id': 3, image: 'NA', file: 'NA', status: false },
    { 'id': 4, image: 'NA', file: 'NA', status: false },

]

export default class Editoffer extends Component {

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
            expressposttxt: '',
            latitude: config.latitude,
            longitude: config.longitude,
            location: 'Enter Location',
            ads_id:'',
            offer_id:0,
            offer_arr:this.props.route.params.offer_arr,
            photodata: photodata,
            imagecount:0,
            cameramodalon: false,
            radioDelivery:{},
            arrDelivery:[],
            delivery_type:null,
            delivery_select: -1
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
            var deliverSelect = [];
            var index = 0;
            console.log("current_detail_product:",current_detail_product);
            if(current_detail_product.delivery_info) {
                var deliverInfo = current_detail_product.delivery_info;
                console.log("deliverInfo:",deliverInfo);
                if(deliverInfo.quick_delivery != undefined && deliverInfo.quick_delivery.valid == "true") {
                    arrDelivery[1] = deliverInfo.quick_delivery.price;
                    deliverSelect[1] = index;
                    index++;
                    radioDeliverProps.push({label:Lang_chg.quickdeliveryc[config.language] + ': $' + deliverInfo.quick_delivery.price,value:1});
                }
                if(deliverInfo.express_post !== undefined && deliverInfo.express_post.valid == "true") {
                    arrDelivery[2] = deliverInfo.express_post.price;
                    deliverSelect[2] = index;
                    index++;
                    radioDeliverProps.push({label:Lang_chg.expressdelivery[config.language] + ': $' + deliverInfo.express_post.price,value:2});
                }
                if(deliverInfo.standard_post !== undefined && deliverInfo.standard_post.valid == "true") {
                    arrDelivery[3] = deliverInfo.standard_post.price;
                    deliverSelect[3] = index;
                    index++;
                    radioDeliverProps.push({label:Lang_chg.standarddelivery[config.language] + ': $' + deliverInfo.standard_post.price,value:3});
                }
            }
            radioDeliverProps.push({label:Lang_chg.freepickup[config.language] + ": " + current_detail_product.location,value:0})
            arrDelivery[4] = 0;
            deliverSelect[4] = index;
            var delivery_select = -1;
            if(deliverSelect[this.state.offer_arr.delivery_type] != undefined) {
                delivery_select = deliverSelect[this.state.offer_arr.delivery_type];
            }
        }
        this.setState({ads_id:this.state.offer_arr.ads_id, photodata: pic_arr,radioDelivery:radioDeliverProps,arrDelivery:arrDelivery,delivery_select:delivery_select,delivery_type: this.state.offer_arr.delivery_type});
      consolepro.consolelog('offer_arr',this.state.offer_arr)
        this.props.navigation.addListener('focus', () => {
            this.getaddress()
        });
        this.setvalue()


    }
//--------------------------get user detail from local database---------------------//
        setvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
        }
        let offer_data=this.state.offer_arr
        this.setState({
            offerprice: offer_data.offer_amount,
            ads_id:offer_data.ads_id,
            offer_id:offer_data.offer_id
        })
        if(offer_data.pickup_location!=''){
            user_address=offer_data.pickup_location
            this.setState({freetouch:true,location:offer_data.pickup_location,latitude:offer_data.latitude,longitude:offer_data.longitude,})
        }
        if(offer_data.quick_delivery_fee!= '0.00'){
            this.setState({deliverycharge:true,deliverychargetxt:offer_data.quick_delivery_fee,})
        }
        if(offer_data.express_delivery_fee!= '0.00'){
            this.setState({expresspost:true,expressposttxt:offer_data.express_delivery_fee,})
        }
        if(offer_data.standard_delivery_fee!= '0.00'){
            this.setState({standardpost:true,standardposttxt:offer_data.standard_delivery_fee,})
        }


        let pic_arr1 = this.state.photodata
        let image_arr=offer_data.offer_images
        if(image_arr!='NA'){
        for (let j = 0; j < image_arr.length; j++) {
            pic_arr1[j].image = config.img_url2+image_arr[j].image
            pic_arr1[j].status=true
            pic_arr1[j].id=image_arr[j].offer_image_id
        }
    }

        this.setState({imagecount:image_arr.length, photodata: pic_arr1})

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
    _openCamera = () => {

        mediaprovider.launchCamera().then((obj) => {
            consolepro.consolelog('imageobj', obj)
            this.setState({ cameramodalon: false })
            let data = this.state.photodata
            for (let i = 0; i < data.length; i++) {
                if (data[i].image == 'NA') {
                    data[i].image = obj.path
                    // data[i].status=true
                    break;
                }
                // data2.push({'id': i, image: config.img_url1 + images_arr[i].image, file: 'NA', status: true, userimage: images_arr[i].user_image_id, type: 1})

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
                        // data[i].status=true
                        break;
                    }
                    // data2.push({'id': i, image: config.img_url1 + images_arr[i].image, file: 'NA', status: true, userimage: images_arr[i].user_image_id, type: 1})

                }
                this.setState({
                    photodata: data
                })

            } else {
                // this.setState({
                //   imagepath:'NA',takeimage:false

                // })
            }

        })
    }
    cameraclcik = (item, index) => {
        if (item.image == 'NA') {
            this.setState({ cameramodalon: true, })
        }
    }
    deleteiamage = (index) => {
        let data = this.state.photodata
        data[index].image = 'NA';
        this.setState({
            photodata: data
        })
    }
    //------------------ confirmation delete from server---------------------//
    deleteiamage_server = (index) => {

        Alert.alert(
            msgTitle.alert[config.language],
            msgTitle.msgdeleteimage[config.language], [{
                text: msgTitle.no[config.language],
                onPress: () => { },
                style: msgTitle.cancel[config.language]
            }, {
                text: msgTitle.yes[config.language],
                onPress: () => this.deletefromserver(index)
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    }
//------------------delete from server---------------------//
    deletefromserver=async(index)=>{
        let url = config.baseURL + "delete_offer_image.php";
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let data1 = this.state.photodata
            let imageid=  data1[index].id
            let user_id = user_details.user_id
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('offer_id', this.state.offer_id)
            data.append('offer_image_id', imageid)
            consolepro.consolelog('data', data);
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('itemdetaissl', obj);
                if (obj.success == 'true') {
                   setTimeout(() => {
                    data1[index].image='NA';
                    data1[index].status=false;
                    let temp_arr=[];
                    for(let i=0;i<data1.length;i++){
                       if(data1[i].image!='NA'){
                        temp_arr.push(data1[i])
                       }
                    }
                    consolepro.consolelog('temp_arr', temp_arr);
                    let new_arr=[]
                    for(let j=0;j<5;j++){
                        if(temp_arr.length>j){
                            consolepro.consolelog('temp_a', j);
                            new_arr.push(temp_arr[j])
                        }else{
                          new_arr.push( { 'id': j, image: 'NA', file: 'NA', status: false })
                        }
                     }
                     consolepro.consolelog('new_arr', new_arr);
                     this.setState({photodata:new_arr,imagecount:this.state.imagecount-1})




                   }, 300);
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
    //--------------------------Create offer---------------------//
    newofferadd=async()=>{
        Keyboard.dismiss()
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            let user_id = user_details.user_id
            let user_address1 = user_address
            if (this.state.ads_id == 0) {
                msgProvider.toast(validation.emptysomething[config.language], 'center')
                return false;
            }
            let offerprice = this.state.offerprice.trim()
            if (offerprice.length <= 0 || offerprice==0) {
                msgProvider.toast(validation.emptyofferprice[config.language], 'center')
                return false;
            }
            let url = config.baseURL + "add_new_offer.php";
            var data = new FormData();
            if(current_detail_product.for_sale == 1) {
                url = config.baseURL + "add_new_purchase.php";
                var delivery_type = this.state.delivery_type;
                if ( this.state.delivery_type == null || !this.state.delivery_type) {
                    msgProvider.toast(validation.emptydeliveryotion[config.language], 'center')
                    return false;
                }
                var delivery_price = this.state.arrDelivery[delivery_type];
                //console.log("delivery_price:",delivery_price);
                data.append('user_id', user_id)
                data.append('ads_id', this.state.ads_id)
                data.append('offer_price', offerprice)
                data.append("address", user_address)
                data.append("latitude", this.state.latitude)
                data.append("longitude", this.state.longitude)
                data.append("buyer_comission_percent", 0.00)
                data.append("seller_comission_percent", 0.00)
                data.append("delivery_price",delivery_price)
                data.append("delivery_type",delivery_type)
                data.append("offer_id",this.state.offer_id)
            } else {

                let expressposttxt = this.state.expressposttxt.trim()
                let standardposttxt = this.state.standardposttxt.trim()
                let deliverychargetxt = this.state.deliverychargetxt.trim()

                if (this.state.freetouch == false && this.state.deliverycharge == false && this.state.standardpost == false && this.state.expresspost == false
                ) {
                    msgProvider.toast(validation.emptydeliveryotion[config.language], 'center')
                    return false;
                }
                if (this.state.freetouch == true && user_address == "") {
                    msgProvider.toast(validation.emptyAddress[config.language], 'center')
                    return false;
                }

                if (this.state.deliverycharge == true) {

                    if (deliverychargetxt.length <= 0 || deliverychargetxt == 0) {
                        msgProvider.toast(validation.emptyquickprice[config.language], 'center')
                        return false;
                    }
                }
                if (this.state.standardpost == true) {

                    if (standardposttxt.length <= 0 || standardposttxt == 0) {
                        msgProvider.toast(validation.emptystandardprice[config.language], 'center')
                        return false;
                    }
                }
                if (this.state.expresspost == true) {

                    if (expressposttxt.length <= 0 || expressposttxt == 0) {
                        msgProvider.toast(validation.emptyexpresprice[config.language], 'center')
                        return false;
                    }
                }

                if (this.state.deliverycharge == false) {

                    deliverychargetxt = ''
                }
                if (this.state.standardpost == false) {

                    standardposttxt = ''
                }
                if (this.state.expresspost == false) {
                    expressposttxt = ''
                }
                if (this.state.freetouch == false) {
                    user_address1 = ''
                }
                data.append('user_id', user_id)
                data.append('ads_id', this.state.ads_id)
                data.append('offer_price', offerprice)
                data.append("address", user_address1)
                data.append("latitude", this.state.latitude)
                data.append("longitude", this.state.longitude)
                data.append("deliverycharge", deliverychargetxt)
                data.append("standardpost", standardposttxt)
                data.append("expresspost", expressposttxt)
                data.append("offer_id", this.state.offer_id)
                let image_arr = this.state.photodata
                for (let i = 0; i < image_arr.length; i++) {
                    if (image_arr[i].image != 'NA' && image_arr[i].status == false) {
                        data.append('offer_image[]', {
                            uri: image_arr[i].image,
                            type: 'image/jpg',
                            name: 'image.jpg'
                        })
                    }

                }
            }

            consolepro.consolelog('send data', data)

            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('test111', obj)
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
        var radioSelected = parseInt(this.state.delivery_select);
        console.log('radioSelected:',radioSelected);
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

                            <TouchableOpacity onPress={()=>{this.setState({offerprice:match_price.toString()})}}  style={{paddingTop:windowHeight*.6/100, alignItems: 'center',backgroundColor:Colors.theme_color1,justifyContent:'center'}}>
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
                                                       {item.status==false ? <TouchableOpacity onPress={() => { this.deleteiamage(index) }}>
                                                            <Image style={{ width: 20, height: 20, borderRadius: 50, alignSelf: 'flex-end' }} source={localimag.crossicon} />
                                                        </TouchableOpacity>:
                                                        <View>
                                                        {this.state.imagecount>1 && <TouchableOpacity onPress={() => { this.deleteiamage_server(index) }}>
                                                            <Image style={{ width: 20, height: 20, borderRadius: 50, alignSelf: 'flex-end' }} source={localimag.crossicon} />
                                                        </TouchableOpacity>}
                                                        </View>}
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
                                {radioSelected == 1 && <RadioForm
                                    radio_props={this.state.radioDelivery}
                                    initial={1}
                                    onPress={(value) => {this.setState({delivery_type:value})}}
                                />}
                                {radioSelected == 2 && <RadioForm
                                    radio_props={this.state.radioDelivery}
                                    initial={2}
                                    onPress={(value) => {this.setState({delivery_type:value})}}
                                />}
                                {radioSelected == 3 && <RadioForm
                                    radio_props={this.state.radioDelivery}
                                    initial={3}
                                    onPress={(value) => {this.setState({delivery_type:value})}}
                                />}
                                {radioSelected == 4 && <RadioForm
                                    radio_props={this.state.radioDelivery}
                                    initial={4}
                                    onPress={(value) => {this.setState({delivery_type:value})}}
                                />}
                            </View>}
                            <TouchableOpacity onPress={() => {this.newofferadd() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 10 / 100, }]}>

                                <Text style={styles.txtlogin}>{Lang_chg.txteditoffer[config.language]}</Text>
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
        width: '100%', paddingVertical: windowWidth * .1 / 100,fontSize: windowWidth * 4.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: windowWidth * 0 / 100

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
