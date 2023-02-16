import React, { Component } from 'react'
import {I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { localimag } from '../src/Provider/Localimage';

export default class Checkout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            address: false,
            shipcharge:0,
            proceedamount:0,
            name:'',
            mobile:'',
            address_arr:'NA',
            addcoupon: false,
            removecoupon: false,
            applycoupon: false,
            coupon: '',
            totalamount:0,
            taxamount:0,
            user_id:'',
            tax:0.5,
            discountprice:0,
            isempty:true,
            new_item:'NA',
            new_item1: [{ 'name': 'MObile One Plus', 'image': localimag.testimage, 'price': 200, 'type': 1 },
            { 'name': 'New Brand Mobile', 'image': localimag.testimage1, 'price': 300, 'type': 0 },
            ]
        }

    }
  
  
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            // this.getvalue()
            
            this.getaddress()
        });
        this.getvalue()
    }
    getaddress = async () => {
        if(user_address!=''){
            this.setState({
                address: true,
            }) 
        }else{
            this.setState({
                address: false,
            }) 
        }
    }
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
                name:user_details.name,
                mobile:user_details.mobile
            })
            this.getcheckoutdata()

        }
    }

    getcheckoutdata = () => {
        let url = config.baseURL + 'get_checkout_data.php?user_id=' + this.state.user_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('getcheckoutdata', obj);
            if (obj.success == 'true') {

                if(obj.cart_item!='NA'){
                    this.setState({new_item:obj.cart_item, tax:obj.tax , shipcharge: obj.shipcharge})
                    let amount=0;
                    for(let i=0;i<obj.cart_item.length;i++){
                        amount=amount+obj.cart_item[i].price
                    }
                    let taxamount1=amount*obj.tax/100;
                    this.setState({ totalamount:amount,proceedamount:amount+obj.shipcharge+taxamount1,taxamount:taxamount1})
              
                }
                if(obj.address !='NA'){
                    user_address=obj.address.address
                    user_address_id=obj.address.user_address_id
                    user_address_lat=obj.address.latitude
                    user_address_long=obj.address.longitude
                    this.setState({address:true,address_arr:obj.address})
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

    applycoupon=async()=>{
        let coupon =this.state.coupon.trim()
        if(coupon.length<=0){
            msgProvider.toast(validation.emptycoupon[config.language], 'center')
            return false;
        }
        let user_detailss = await localStorage.getItemObject('user_arr');
        
        if (user_detailss != null) {
           
                 let user_ids= user_detailss.user_id
                let url = config.baseURL + "verify_coupon.php";
                var data = new FormData();
                data.append('user_id',user_ids )
                data.append('coupon_code', coupon)
                data.append('amount', this.state.totalamount)
                consolepro.consolelog('test', data)
                apifuntion.postApi(url, data).then((obj) => {
                    if (obj.success == 'true') {

                        consolepro.consolelog('obj', obj)
                        let dis=obj.discount;
                         let price=this.state.totalamount
                         price=price-price*dis/100;
                         price=price+this.state.shipcharge+this.state.taxamount
                         this.setState({ removecoupon: true,proceedamount:price,discountprice:dis})

                    } else {
                        if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
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
}
    removecoupondata=()=>{
      let price=this.state.totalamount+this.state.shipcharge+this.state.taxamount
        this.setState({ removecoupon: false, applycoupon: false,proceedamount:price,coupon:'',discountprice:0 })
  
    }

    payment=async()=>{
        if(this.state.address == false){
            msgProvider.toast(validation.emptyAddress[config.language], 'center')
            return false;
        }else{
       
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            let user_id= user_details.user_id;
            let timestamp = new Date().getUTCMilliseconds()+ '' + Math.round(Math.random() * Math.pow(10, 7));
           
            let intr_arr=[];
                let data=this.state.new_item;
                let datalength=data.length
                for(let i=0;i<datalength;i++){
                    let pushdata= {
                        cart_id:data[i].cart_id,
                        quantity:data[i].quantity,
                        price:data[i].price ,
                        product_id :data[i].product_id,
                        vendor_id :data[i].product_detail.vendor_id,
                        shipingcharg :this.state.shipcharge/datalength,
                        discount :this.state.discountprice,
                       
                        }
                     intr_arr.push(pushdata)
                }
                var data1 = new FormData();
                data1.append('user_id',user_id)
                data1.append('user_address_id', user_address_id)
                data1.append('address', user_address)
                data1.append('latitude', user_address_lat)
                data1.append('longitude', user_address_long)
                data1.append('coupon_code', this.state.coupon)
                data1.append('tax', this.state.tax)
                data1.append('order_no', timestamp)
                data1.append('arr_data',JSON.stringify(intr_arr))
               
                let url=config.baseURL+'payment_myfatoorah/payment_url.php?user_id='+user_id+'&amount='+this.state.proceedamount+'&order_id='+this.state.proceedamount
                
                apifuntion.getApi(url).then((obj) => {
                consolepro.consolelog('obj', obj);
            if (obj.success == 'true') {
                if(obj.paymentLink !=null && obj.paymentLink!=''){
                    this.props.navigation.navigate('Paymentproccess',{paymenturl:obj.paymentLink,data:data1})
                }
                
            } else {
                if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                    config.checkUserDeactivate(this.props.navigation)
                } else {
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                }
                return false;
            }
            
                }).catch((err) => {
                    consolepro.consolelog('err1', err);
            
                });
                
                }else{
                return false;
            }
    //  if (user_details != null) {
    //         let user_id= user_details.user_id;
    //     let intr_arr=[];
    //     let data=this.state.new_item;
    //     let datalength=data.length
    //     for(let i=0;i<datalength;i++){
    //         let pushdata= {
    //             cart_id:data[i].cart_id,
    //             quantity:data[i].quantity,
    //             price:data[i].price ,
    //             product_id :data[i].product_id,
    //             vendor_id :data[i].product_detail.vendor_id,
    //             shipingcharg :this.state.shipcharge/datalength,
    //             discount :this.state.discountprice,
               
    //             }
    //          intr_arr.push(pushdata)
    //     }
    //     var timestamp = new Date().getUTCMilliseconds()+ '' + Math.round(Math.random() * Math.pow(10, 7));
      
    //     consolepro.consolelog('timestamp', timestamp);
      
    //     let url = config.baseURL + "place_order.php";
    //     var data1 = new FormData();
    //     data1.append('user_id',user_id)
    //     data1.append('user_address_id', user_address_id)
    //     data1.append('address', user_address)
    //     data1.append('latitude', user_address_lat)
    //     data1.append('longitude', user_address_long)
    //     data1.append('coupon_code', this.state.coupon)
    //     data1.append('tax', this.state.tax)
    //     data1.append('order_no', timestamp)
    //     data1.append('arr_data',JSON.stringify(intr_arr))
    //     consolepro.consolelog('data1', data1);
    //     consolepro.consolelog('url', url);
    //     apifuntion.postApi(url, data1).then((obj) => {
    //         consolepro.consolelog('obj', obj);
    //       if (obj.success == 'true') {
    //         orderid=obj.order_no;
    //         if(obj.notification_arr !='NA'){

    //             notification.notification_arr(obj.notification_arr)
    //           }
    //         this.props.navigation.navigate('Congratulations')
    //       } else {
    //           if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
    //               config.checkUserDeactivate(this.props.navigation)
    //           } else {
    //               msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
    //           }
    //           return false;
    //       }
        
    //         }).catch((err) => {
    //             consolepro.consolelog('err1', err);
        
    //         });

    //     }else{
    //         return false;
    //     }
            
    }

    }
   

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.whiteColor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
              <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} ref={ref => {this.scrollView = ref}}>
<KeyboardAwareScrollView>
                    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                        <View style={CSSstyle.notification_header}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.checkout[config.language]}</Text>
                            <View >
                                <Text >{'      '}</Text>
                            </View>
                        </View>
                        <View>
                            {this.state.new_item != "NA" &&
                                <FlatList
                                    data={this.state.new_item}

                                    style={{ width: '100%', paddingHorizontal: '2%', }}
                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ width: '100%', marginTop: windowHeight * 1.5 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100, borderBottomColor: Colors.border_color, borderBottomWidth: 1, flexDirection: 'row', }}>
                                                <View style={{ width: '23%', justifyContent: 'center' }}>
                                                    <Image style={{ width: windowWidth * 21 / 100, height: windowWidth * 19 / 100, borderRadius: 5 }} source={item.product_detail.image != 'NA' ?
                                                                               {uri:config.img_url2+item.product_detail.image[0].image} : localimag.testimage}></Image>
                                                </View>
                                                <View style={{ width: '52%',paddingTop:5 }}>

                                                    <Text numberOfLines={1} style={styles.txtitem2}>{item.product_detail.product_title[config.language]}</Text>
                                                    <Text numberOfLines={1} style={styles.txtitem33}>{item.product_detail.category_name[config.language]}</Text>
                                                    <Text numberOfLines={1} style={styles.txtitem3}>{''}</Text>
                                                    <View style={{ flexDirection: 'row',alignItems:'center',marginHorizontal: windowWidth * 2 / 100, marginTop: -windowHeight * 1/ 100  }}>
                                                        <View style={{width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.greyColor}}></View>
                                                        <Text style={styles.txtitem4}>{'Qty :'}</Text>
                                                        <Text style={[styles.txtitem3, {}]}>{item.quantity}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ width: '25%',paddingTop:5 }}>

                                                    <Text numberOfLines={1} style={styles.txtitem5}>${item.price}</Text>
                                                </View>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(index) => { index.toString() }}
                                />
                            }
                        </View>
                        <View style={{paddingHorizontal:windowWidth * 4 / 100,width:'100%'}}>
                        <Text style={[styles.txtlogin, {textAlign:'left', marginTop: windowHeight * 2 / 100 }]}>{Lang_chg.shipinadd[config.language]} </Text>
                       
                        </View>
                          
                        {this.state.address==true && <View style={{ width: '100%', marginTop: windowHeight *0.5 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100 }}>
                             <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'space-between' }}>
                               <Text style={[styles.txtitem6, { marginTop: windowHeight * 2 / 100, }]}>{' '} </Text>
                               <Text onPress={()=>{this.props.navigation.navigate('Chooseaddress')}} style={[styles.txtchange, { marginTop: windowHeight * 2 / 100 }]}>{Lang_chg.change[config.language]} </Text>
                            </View>
                           {/* {this.state.mobile!= '' && this.state.mobile!= null && <Text style={[styles.txtitem8, {textAlign:'left', marginLeft: 0, color: Colors.border_color1,fontFamily: Font.Poppins_SemiBold }]}>{'+966 '+this.state.mobile}</Text>} */}
                            <View style={{ flexDirection: 'row', }}>
                                <Image style={{ width: windowWidth * 6 / 100, height: windowWidth * 6 / 100, }} source={localimag.mapicon}></Image>
                                <Text style={[styles.txtitem8, { marginLeft: 10,marginRight:10, color: Colors.border_color1,fontFamily: Font.Poppins_SemiBold, }]}>{user_address}</Text>
                            </View>

                        </View> }
                        {this.state.address==false &&  <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.props.navigation.navigate('Chooseaddress')}} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight * 2 / 100, borderBottomColor: Colors.border_color, borderBottomWidth: 1, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100 }}>
                            <Text style={[styles.txtitem8, {}]}>{Lang_chg.chooseaddres[config.language]} </Text>
                            <View style={{ flexDirection: 'row', }}>
                                <Image style={{ width: windowWidth * 5 / 100, height: windowWidth * 5 / 100, }} source={localimag.arrowbl}></Image>
                            </View>

                        </TouchableOpacity>}

                        <View style={{ width: '100%', marginTop: windowHeight * 1 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100 }}>
                            <Text style={[styles.txtitem7, {textAlign:'left', marginTop: windowHeight * 2 / 100, }]}>{Lang_chg.orderdetail[config.language]} </Text>
                        </View>

                        <View style={styles.viewmore}>
                            <Text style={[styles.txtitem8, {}]}>{Lang_chg.itemprice[config.language]} </Text>
                            <Text style={[styles.txtitem8, {}]}>${this.state.totalamount}</Text>
                        </View>
                        <View style={styles.viewmore}>
                            {/* <Text style={[styles.txtitem8, {}]}>{Lang_chg.tax[config.language]} </Text>
                            <Text style={[styles.txtitem8, {}]}>{'0.5 % tax applied'}</Text> */}
                           <Text style={[styles.txtitem8, {}]}>{Lang_chg.tax[config.language]}
                               <Text style={[styles.txtitem8, {}]}>{' ('+this.state.tax+' % tax applied)'}</Text>
                             </Text>
                            <Text style={[styles.txtitem8, {}]}>${this.state.taxamount}</Text>

                        </View>
                        <View style={styles.viewmore}>
                            <Text style={[styles.txtitem8, {}]}>{Lang_chg.shipingcharge[config.language]} </Text>
                            <Text style={[styles.txtitem8, {}]}>${this.state.shipcharge}</Text>
                        </View>
                       {this.state.removecoupon==true && <View style={styles.viewmore}>
                            <Text style={[styles.txtitem8, {}]}>{Lang_chg.couponapply[config.language]} </Text>
                            <Text style={[styles.txtitem8, {}]}>{this.state.discountprice+'% discount'}</Text>
                        </View>}
                        {/* //--------------apply coupon---------------------- */}
                        {this.state.applycoupon == true && this.state.removecoupon == false
                            && <View style={styles.couponaplly}>
                                <TextInput
                                    value={"" + this.state.coupon + ""}
                                    onChangeText={(txt) => { this.setState({ coupon: txt }) }}
                                    keyboardType='default'
                                    //  secureTextEntry={this.state.secureconfirmpassword}
                                    maxLength={40}
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    style={I18nManager.isRTL == false ? [styles.txtaddtype,{textAlign:'left'}]:[styles.txtaddtype,{textAlign:'right'}]}

                                     placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.entercoupon[config.language]}></TextInput>
                                <Text onPress={() => { this.applycoupon()  }} style={[styles.txtchange, { color: Colors.theme_color2 }]}>{Lang_chg.apply[config.language]} </Text>

                            </View>}
                        {/* //--------------add coupon---------------------- */}
                        {this.state.applycoupon == false &&
                            <TouchableOpacity activeOpacity={0.7} onPress={() => { this.setState({ applycoupon: true }) }} style={styles.viewmore}>
                                <Text style={[styles.txtchange, {}]}>{Lang_chg.addcoupon[config.language]} </Text>
                            </TouchableOpacity>}

                        {/* //----------------cpoupon */}
                        {this.state.removecoupon == true && <View style={styles.viewmore}>

                            <View style={{ backgroundColor: Colors.orderplacebg, borderRadius: 20, borderColor: Colors.google_color, borderWidth: 1, paddingHorizontal: windowWidth * 2 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.txtlogin, { color: 'black' }]}>{this.state.coupon} </Text>
                            </View>
                            <Text onPress={() => { this.removecoupondata() }} style={[styles.txtitem8, { color: Colors.theme_color3, textDecorationLine: 'underline' }]}>{Lang_chg.remove[config.language]} </Text>

                        </View>}

                        <View style={[{ width: '100%', marginHorizontal: windowWidth * 4 / 100, height: 2, backgroundColor: Colors.border_color, marginBottom: 8 }]}>
                        </View>
                        <View style={styles.viewmore}>
                            <Text style={[styles.txtlogin, {}]}>{Lang_chg.total[config.language]} </Text>
                            <Text style={[styles.txtlogin, {}]}>${this.state.proceedamount}</Text>
                        </View>


                    </View>
                    </KeyboardAwareScrollView>
                </ScrollView>
                <HideWithKeyboard>
                <View style={{ width: '100%', backgroundColor: Colors.theme_color1 }}>
                    <TouchableOpacity onPress={() => { this.payment() }} style={[CSSstyle.mainbutton, {}]}>

                        <Text style={styles.txtlogin11}>{Lang_chg.proceedpay[config.language]}</Text>
                    </TouchableOpacity>
                </View>
                </HideWithKeyboard>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    txtaddtype:{alignSelf: 'center', fontSize: windowWidth * 3.8 / 100, width: '80%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor},
    txtlogin11: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    },
    couponaplly: {
        alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '92%', flexDirection: 'row', borderRadius: 20, borderWidth: 1, borderColor: Colors.theme_color2, paddingHorizontal: windowWidth * 2 / 100, marginTop: windowHeight * .5 / 100, marginBottom: windowHeight * 1 / 100, paddingVertical: windowHeight * 1 / 100
    },
    viewmore: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight * .5 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100 },

    txtlogin: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtchange: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color3,
    },
    // txtlogin: {
    //     fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    // },
    // icon: {
    //     width: windowWidth * 5 / 100,
    //     height: windowWidth * 5 / 100,
    //     resizeMode: 'contain'
    // },
    // mainview: { width: '90%', paddingVertical: 10, borderColor: Colors.border_color, borderWidth: 1, flexDirection: 'row', backgroundColor: Colors.whiteColor, alignSelf: 'center', },

    txtitem2: {
        textAlign:config.textalign, fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor, marginHorizontal: windowWidth * 2 / 100,
    },
    txtitem3: {
        textAlign:config.textalign, fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1, marginHorizontal: windowWidth * 0 / 100, marginTop: 3
    },
    txtitem33: {
        textAlign:config.textalign, fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1, marginHorizontal: windowWidth * 2 / 100, marginTop: -windowHeight * 0/ 100
    },

    txtitem4: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.greyColor, marginHorizontal: windowWidth * 1 / 100, marginTop: -windowHeight * 0/ 100
    },
    txtitem5: {
        fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1, marginHorizontal: windowWidth * 2 / 100, alignSelf: 'flex-end'
    },
    txtitem6: {
        fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor,
    },
    txtitem7: {
        fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtitem8: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1,
    },



});