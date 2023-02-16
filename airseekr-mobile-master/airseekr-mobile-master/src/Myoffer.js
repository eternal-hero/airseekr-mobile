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
import { color } from 'react-native-reanimated';
export default class Myoffer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id:'',
            is_serach: false,
            txtsearch: '',
            myads_arr: 'NA',
            myads_arr1: 'NA',
        }
    }


    componentDidMount() {
        consolepro.consolelog('product_id', this.state.product_id)
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
        });
        this.getvalue()
    }
   //--------getuser details---------------------//
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
            this.getmyofferdata()
        }
    }
  //--------get my offer all---------------------//
    getmyofferdata = () => {
        let url = config.baseURL + 'get_my_offer.php?user_id=' + this.state.user_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('itemdetail', obj);
                if (obj.offer_all != 'NA') {
                    this.setState({
                        myads_arr: obj.offer_all,
                        myads_arr1: obj.offer_all,

                    })
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
     //--------Erase search text----------------------//
     cross_click = async () => {
        this.SearchFilterFunction('')

   }
   //--------search particular item----------------------//

   SearchFilterFunction = (text) => {

       this.setState({ myads_arr: 'NA' })
       this.setState({ txtsearch: text })
       let data1 = this.state.myads_arr1
       consolepro.consolelog('data1', data1)
       if (data1 != 'NA') {
           const newData = data1.filter(function (item) {
             let searchtext=  item.title

               //applying filter for the inserted text in search bar
               const itemData = item.title ? searchtext.toUpperCase() : ''.toUpperCase();
               const textData = text.toUpperCase();
               return itemData.indexOf(textData) > -1;
           });
           consolepro.consolelog('newData',newData)
           let  setdata=newData
           if (setdata.length > 0) {
               this.setState({ myads_arr: setdata })
           } else {
               this.setState({ myads_arr: 'NA' })
           }

       }

   }


    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.newcolor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.newcolor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.newcolor} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <ScrollView >
                <View style={{ flex: 1, backgroundColor: Colors.newcolor, paddingBottom: windowHeight * 2 / 100 }}>

                    <View style={[CSSstyle.notification_header,{paddingTop: 10, paddingBottom: 10,}]}>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                            <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.arrowred}></Image>
                        </TouchableOpacity>
                        {!this.state.is_serach && <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtmyoffer1[config.language]}</Text>}
                           {!this.state.is_serach && <TouchableOpacity onPress={() => {this.setState({is_serach:!this.state.is_serach}) }} style={{ padding: 2,justifyContent:'center' }} >
                                <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.search1}></Image>
                            </TouchableOpacity>}
                            {this.state.is_serach &&  <View style={{backgroundColor:Colors.homebg, borderRadius:10, width:windowWidth*82/100,height:windowHeight*5/100,flexDirection:'row'}}>
                            <TextInput
                                 value={"" + this.state.txtsearch + ""}
                                        onChangeText={(txt) => {this.SearchFilterFunction(txt)  }}
                                        keyboardType='default'
                                       // secureTextEntry={this.state.secureoldpassword}
                                        maxLength={40}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={ [styles.txtaddtype,{}]}
                                         placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.Search[config.language]}></TextInput>
                            <TouchableOpacity onPress={() => {this.cross_click() }} style={{ padding: 2,justifyContent:'center' }} >
                                <Image style={[ {width:windowWidth*4/100,  height:windowWidth*4/100, resizeMode: 'contain', resizeMode: "contain", }]} source={localimag.cross}></Image>
                            </TouchableOpacity>
                            </View>}




                        {/* <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtmyoffer[config.language]}</Text>
                        <TouchableOpacity onPress={() => { }} style={{ padding: 2, justifyContent: 'center' }} >
                            <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.searchicon}></Image>
                        </TouchableOpacity> */}
                    </View>

                    <View style={{ width: '94%', marginTop: windowHeight * 1 / 100, alignItems: 'center', alignSelf: 'center' }}>


{this.state.myads_arr != "NA" &&

    this.state.myads_arr.map((item, index) => (


        <TouchableOpacity onPress={()=>{  this.props.navigation.navigate('Itemdetail',{ads_id:item.ads_id})}} style={{ width: '100%', flexDirection: 'row', borderRadius: 5, backgroundColor: Colors.newcolor1, elevation: 2, shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, padding: 2, alignSelf: 'center', marginTop: windowHeight * 1.5 / 100, marginBottom: windowHeight * .2 / 100 }}>
            <View style={{ width: '35%', padding: 3 }}>
                <FastImage
                    source={item.image_arr != 'NA' ?
                        {uri:config.img_url2+item.image_arr[0].image} : localimag.nopreview}
                    style={{ width: windowWidth * 28 / 100, height: windowWidth * 27 / 100, resizeMode: 'cover', borderRadius: 5 }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={{ width: '65%',marginTop:windowHeight*1/100 }}>
                <View style={{ flexDirection: 'row',height:windowHeight*6/100, }}>
                    <Text numberOfLines={2} style={styles.txtitem1}>{item.title}</Text>
                    <Text numberOfLines={1} style={styles.txtitemprice}>${item.offer_amount}</Text>
                </View>
                <Text  numberOfLines={1} style={styles.txtsmall}>{item.address}</Text>
                <View style={{ flexDirection: 'row', marginTop: 2 }}>
                    <View style={{ flexDirection: 'row' }}>
                        {/* <Image style={styles.smallicons} source={localimag.calender}></Image> */}
                        <Text style={styles.txtsmall}>{item.create_date}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: windowWidth * 10 / 100 }}>
                        {/* <Image style={styles.smallicons} source={localimag.clockicon10}></Image> */}
                        <Text style={styles.txtsmall}>{item.create_time}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row',marginTop:2 }}>

                   {item.status==1 &&
                   <View style={{flexDirection:'row',alignItems:'center'}}>
                       <View style={{width:windowWidth*2/100,height:windowWidth*2/100,borderRadius:windowWidth*1/100,backgroundColor:'green',marginTop:-1}}>
                       </View>
                           <Text numberOfLines={1} style={[styles.txtitemprice1,{ }]}>{'ACCEPTED'}</Text>
                   </View>}
                   {item.status==0 &&
                   <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
                       <View style={{width:windowWidth*2/100,height:windowWidth*2/100,borderRadius:windowWidth*1/100,backgroundColor:'orange',marginTop:-1}}>
                       </View>
                           <Text numberOfLines={1} style={[styles.txtitemprice1,{ }]}>{'PENDING'}</Text>
                   </View>}
                   {item.status==2 &&
                   <View style={{flexDirection:'row',alignItems:'center'}}>
                       <View style={{width:windowWidth*2/100,height:windowWidth*2/100,borderRadius:windowWidth*1/100,backgroundColor:'red',marginTop:-1}}>
                       </View>
                           <Text numberOfLines={1} style={[styles.txtitemprice1,{ }]}>{'REJECTED'}</Text>
                   </View>}

                   {/* {item.status==0 && <Text numberOfLines={1} style={[styles.txtitemprice1,{color:"orange", }]}>{'Pending'}</Text> }
                   {item.status==2 && <Text numberOfLines={1} style={[styles.txtitemprice1,{color:"red", }]}>{'Rejected'}</Text> }  */}

                   </View>

            </View>

        </TouchableOpacity>


    ))
}





</View>




                </View>
                </ScrollView>




            </View>
        )
    }
}



const styles = StyleSheet.create({
    txtaddtype:{marginLeft:3, fontSize:windowWidth*3.2/100,width:'89%',paddingVertical:windowWidth*.1/100,fontFamily:Font.Poppins_Regular,color:Colors.blackColor},

    txtitemfav: {
        marginLeft: windowWidth * 3 / 100, fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: windowWidth * 1.2 / 100
    },
    iconsfav: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 6 / 100,
        resizeMode: 'cover'
    },
    txtpricefav: {
        marginLeft: windowWidth * 3 / 100, fontSize: windowWidth * 3.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'flex-start', marginHorizontal: windowWidth * 1.5 / 100
    },
    styletopbar: { width: '50%', alignItems: 'center', justifyContent: 'center', borderBottomColor: Colors.theme_color1, paddingTop: windowHeight * 1.5 / 100, paddingBottom: windowHeight * 1.5 / 100, },
    smallicons: {
        width: windowWidth * 3 / 100,
        height: windowWidth * 3 / 100,
        resizeMode: 'cover',
        alignSelf: 'center'
    }
    ,

    iconswatch: {
        width: windowWidth * 3.5 / 100,
        height: windowWidth * 3.5 / 100,
        resizeMode: 'cover',
        alignSelf: 'center'
    },

    txtitem1: {
        width: '60%', fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtsmall: {
        marginLeft: 3, marginTop: 1, fontSize: windowWidth * 2.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1,
    },
    txtoffers: {
        fontSize: windowWidth * 2.6 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'center',
    },

    txtitemprice: {
        textAlign: 'right', width: '40%', fontSize: windowWidth * 3.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, paddingRight: 3
    },
    txtitemprice1: {
        marginLeft:10, textAlign: 'left', width: '100%', fontSize: windowWidth * 2.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, paddingRight: 3
    },





});
