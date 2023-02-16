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
import { localimag } from './Provider/Localimage';
import { color } from 'react-native-reanimated';
export default class Offerlist extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            ads_id:this.props.route.params.ads_id,
            item_arr: 'NA',
            myads_arr:'NA',
            myads_arr1: [
                { 'image': localimag.notificationimg, name: 'Danny Smith', price: '2895.25', offerno: 5, date: '05 July 2021', time: '2:19 PM' },
                { 'image': localimag.notifiimg8, name: 'Fabian Williams', price: '2895.25', offerno: 3, date: '01 July 2021', time: '3:30 PM' },
                { 'image': localimag.notificationimg8, name: 'Baldwin Taylor', price: '2895.25', offerno: 2, date: '30 Jun 2021', time: '5:25 AM' },
                { 'image': localimag.notificationimg7, name: 'Fabian Taylor', price: '2895.25', offerno: 1, date: '26 Jun 2021', time: '4:19 PM' },
                { 'image': localimag.notifyimg9, name: 'John Deo', price: '2895.25', offerno: 4, date: '28 Jun 2021', time: '3:50 AM' },
                { 'image': localimag.notificationimg2, name: 'Fabia', price: '2895.25', offerno: 5, date: '27 Jun 2021', time: '2:30 PM' },
                { 'image': localimag.notifiimg8, name: 'David ', price: '2895.25', offerno: 4, date: '26 Jun 2021', time: '1:28 PM' },
                { 'image': localimag.notificationimg4, name: 'Danny', price: '2895.25', offerno: 5, date: '25 Jun 2021', time: '4:23 AM' },

            ],
        }

    }
    componentDidMount() {
        consolepro.consolelog('product_id', this.state.product_id)
        this.props.navigation.addListener('focus', () => {
            // this.getvalue()
        });
         this.getvalue()
    }

    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
            this.getofferdata()
        }
    }

    getofferdata = () => {
        let url = config.baseURL + 'get_all_offer.php?user_id=' + this.state.user_id + '&ads_id=' + this.state.ads_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('itemdetail', obj);
                if (obj.offer_all != 'NA') {
                    this.setState({
                        myads_arr: obj.offer_all,
                     
                    })
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

    addfavourite = (item, index) => {
        return false
        let url = config.baseURL + 'add_remove_favourite.php?user_id=' + this.state.user_id + '&product_id=' + this.state.product_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('favstatus', obj);
                let data = this.state.item_arr
                data.fav_status = !data.fav_status
                this.setState({
                    item_arr: data,
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
    fullimageshow = () => {
        this.props.navigation.navigate('Fullimage')
       
        // if (this.state.product_detail.image != 'NA') {
        //     this.props.navigation.navigate('Fullimage', { image_arr: this.state.product_detail.image })
        // }
    }
    makeoffer = () => {
        this.props.navigation.navigate('Makeoffer')
       
        // if (this.state.product_detail.image != 'NA') {
        //     this.props.navigation.navigate('Fullimage', { image_arr: this.state.product_detail.image })
        // }
    }

    shareitem = () => {
        return false
        if (this.state.product_detail != 'NA') {
            let url = config.baseURL + 'share_app.php/?link=Airseekr://Itemdetail/' + this.state.product_id
            url1 = 'Product Name :' + this.state.product_detail.product_title[config.language] + "\n" + 'Airseekr app link' + "\n" + url
            mediaprovider.sharedata('Share', url1, 'Airseekr', "");

        }

    }
    addtocart = async () => {
        return false
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let user_id = user_details.user_id;
            let url = config.baseURL + 'add_to_cart.php'
            let data = new FormData();
            data.append('user_id', user_id);
            data.append('product_id', this.state.product_id);
            data.append('vendor_id', this.state.product_detail.vendor_id);
            data.append('quantity', 1);
            data.append('price', this.state.product_detail.price);
            consolepro.consolelog('data', data);
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                  
                        this.props.navigation.navigate('Mycard');
                  
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


    buynow = () => {
        return false
        this.props.navigation.navigate('Checkout_buy', { product_id: this.state.product_id })
    }
    errorimage=(index)=>{
        let data= this.state.myads_arr
                    data[index].seller_image='NA'
                    this.setState({myads_arr:data})
            }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
            
                <ScrollView >
                <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingBottom: windowHeight * 2 / 100 }}>

                    <View style={[CSSstyle.notification_header,{paddingTop: 10, paddingBottom: 10,}]}>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                            <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                        </TouchableOpacity>
                        <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtOffers[config.language]}</Text>
                        <View  style={{ padding: 2, justifyContent: 'center' }} >
                           <Text>{'    '}</Text>
                              </View>
                    </View>
                    <View style={{ width: '94%', marginTop: windowHeight * 1 / 100, alignItems: 'center', alignSelf: 'center' }}>
                            {this.state.myads_arr != "NA" &&
                                this.state.myads_arr.map((item, index) => (

                                    <View  style={{ width: '100%', flexDirection: 'row', borderRadius: 5, backgroundColor: Colors.whiteColor, elevation: 2, shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, padding: 2, alignSelf: 'center', marginTop: windowHeight * 1.5 / 100, marginBottom: windowHeight * .2 / 100 }}>
                                        <View style={{ width: '32%', padding: 3 }}>
                                            <FastImage
                                            onError={(error)=>{this.errorimage(index)}}
                                                source={item.seller_image != 'NA' ?
                                                    {uri:config.img_url1+item.seller_image} : localimag.user_profile}
                                                    // item.image : item.image}
                                                style={{ width: windowWidth * 27 / 100, height: windowWidth * 28 / 100, resizeMode: 'cover', borderRadius: 5 }}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </View>
                                        <View style={{ width: '68%', justifyContent:'flex-end' }}>
                                           
                                                <Text numberOfLines={1} style={styles.txtitem1}>{item.seller_name}</Text>
                                                <Text numberOfLines={1} style={styles.txtitemprice}>${item.offer_amount}</Text>
                                           

                                            <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image style={styles.smallicons} source={localimag.productarrowicon}></Image>
                                                    <Text style={styles.txtsmall}>{item.create_date}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginLeft: windowWidth * 3 / 100 }}>
                                                    <Image style={styles.smallicons} source={localimag.clockicon10}></Image>
                                                    <Text style={styles.txtsmall}>{item.create_time}</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginTop:windowHeight*1.3/100, justifyContent:'space-between', flexDirection: 'row', paddingVertical: windowHeight * .3 / 100, }}>
                                                <Text>{'   '}</Text>
                                                <View style={{width:'60%',alignItems:'flex-end'  }}>
                                                    {/* <View style={{backgroundColor:Colors.theme_color1,alignItems:'center',justifyContent:'center',height:windowHeight*3/100,paddingHorizontal:'3%'}}>
                                                        <Text style={[styles.txtsmall,{color:Colors.border_color}]}>{Lang_chg.txtAccept[config.language]}</Text>
                                                    </View>
                                                    <View style={{marginLeft:windowWidth*2/100,backgroundColor:'#368E0A',alignItems:'center',justifyContent:'center',height:windowHeight*3/100,paddingHorizontal:'3%'}}>
                                                        <Text style={[styles.txtsmall,{color:Colors.border_color}]}>{Lang_chg.txtReject[config.language]}</Text>
                                                    </View> */}
                                                    
                                                      
                                                        {item.status==0 && <Text  style={[styles.txtitemprice1,{color:"orange"}]}>{Lang_chg.txtPending[config.language]}</Text> }
                                                        {item.status==1 && <Text  style={[styles.txtitemprice1,{color:"green"}]}>{Lang_chg.txtAccepted[config.language]}</Text> } 
                                                        {item.status==2 && <Text  style={[styles.txtitemprice1,{color:"red"}]}>{Lang_chg.txtRejected[config.language]}</Text> } 
                                                </View>
                                            </View>

                                        </View>

                                    </View>
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
        width: '98%', fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtsmall: {
        marginRight: 3,  marginLeft: 3, marginTop: 1, fontSize: windowWidth * 2.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1,
    },
    txtoffers: {
        fontSize: windowWidth * 2.6 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'center',
    },
   
    txtitemprice: {
        width: '98%', fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1,
    },
    txtitemprice1: {
        alignSelf: 'flex-end',  fontSize: windowWidth * 3.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, paddingRight: 3
    },
   
 
   
  
   
   
});