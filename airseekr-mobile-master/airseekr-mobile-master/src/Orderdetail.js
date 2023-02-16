import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Orderdetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            order_id:this.props.route.params.order_id,
            user_id:'',
            item_list:'NA',
            item_data:'NA',
            user_details:'NA',
            orderdata:'NA'
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
             this.getvalue()
        });
       // this.getvalue()
    }
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
            this.getorderdetail()

        }else{
            config.AppLogout(this.props.navigation)
        }
    }
    getorderdetail = () => {
        let url = config.baseURL + 'get_orderdetail.php?user_id=' + this.state.user_id+'&order_id='+this.state.order_id;
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('itemdetail', obj);
                if(obj.order_item!='NA'){
                    this.setState({
                        orderdata:obj.orderdata,
                        item_list:obj.order_item,
                        user_details:obj.user_details
                    })
                }
            } else {
                if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                    config.checkUserDeactivate(this.props.navigation)
                } else {
                   this.props.navigation.navigate('Homepage')
                }
                return false;
            }

        }).catch((err) => {
            consolepro.consolelog('err', err);

        });
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.whiteColor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                        <View style={{ width: '100%', backgroundColor: Colors.orderbg, paddingBottom: windowHeight * 2 / 100 }}>
                            <View style={CSSstyle.notification_header}>
                                <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.navigate('Myorder') }}>
                                    <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                                </TouchableOpacity>
                                <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.orderdetail[config.language]}</Text>
                                <View  style={{justifyContent:'center'  }} >
                                    {/* <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.more1}></Image> */}
                                 <Text>{'     '}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: windowHeight * 3 / 100, paddingHorizontal: windowWidth * 3 / 100 }}>
                                <View style={{ width: '70%', flexDirection: 'row', }}>
                                    <Text style={[styles.txtlogin, { alignSelf: 'center' }]}>{Lang_chg.orderdid[config.language]}: </Text>
                                 {this.state.orderdata!='NA'&&   <Text style={[styles.txtlogin, { alignSelf: 'center', color: Colors.greyColor }]}>#{this.state.orderdata.order_no}</Text>}
                                </View>
                                <View style={{ width: '30%', backgroundColor: Colors.orderplacebg, borderRadius: 10, borderColor: Colors.google_color, borderWidth: 1, padding: 2 }}>
                                {this.state.orderdata!='NA'&& this.state.orderdata.order_status==0  && <Text style={[styles.txtlogin1, { fontFamily: Font.Poppins_Regular }]}>{Lang_chg.orderplaced[config.language]}</Text>}
                                {this.state.orderdata!='NA'&& this.state.orderdata.order_status==1  && <Text style={[styles.txtlogin1, { fontFamily: Font.Poppins_Regular }]}>{Lang_chg.orderinprogress[config.language]}</Text>}
                                {this.state.orderdata!='NA'&& this.state.orderdata.order_status==2  && <Text style={[styles.txtlogin1, { fontFamily: Font.Poppins_Regular }]}>{Lang_chg.orderinprogress[config.language]}</Text>}
                                {this.state.orderdata!='NA'&& this.state.orderdata.order_status==3  && <Text style={[styles.txtlogin1, { fontFamily: Font.Poppins_Regular }]}>{Lang_chg.orderincompleted[config.language]}</Text>}
                                </View>


                            </View>
                        </View>

{/* ////--------------*/}


                           <View>
                            {this.state.item_list != "NA" &&
                                <FlatList
                                    data={this.state.item_list}
                                    style={{ width: '100%', }}
                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={{ width: '100%', marginTop: windowHeight * 1.5 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100, borderBottomColor: Colors.border_color, borderBottomWidth: 1, flexDirection: 'row', }}>
                                                    <View style={{ width: '22%', justifyContent: 'center' }}>
                                                        <Image style={{ width: windowWidth * 21 / 100, height: windowWidth * 18 / 100, borderRadius: 5 }} source={{uri:config.img_url1+item.product_detail.image[0].image}}></Image>
                                                    </View>
                                                    <View style={{ width: '48%', }}>

                                                        <Text numberOfLines={1} style={styles.txtitem2}>{item.product_detail.product_title[config.language]}</Text>
                                                        <Text numberOfLines={1} style={styles.txtitem3}>{item.product_detail.category_name[config.language]}</Text>
                                                        <Text numberOfLines={1} style={styles.txtitem3}>{''}</Text>
                                                        <View style={{ flexDirection: 'row',alignItems:'center',marginHorizontal: windowWidth * 2 / 100, marginTop: -windowHeight * 1/ 100  }}>
                                                            <View style={{width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.greyColor}}></View>
                                                            <Text style={styles.txtitem4}>{'Qty :'}</Text>
                                                            <Text style={[styles.txtitem33, {}]}>{item.quantity}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ width: '30%', }}>
                                                        <Text numberOfLines={1} style={styles.txtitem5}>${item.price}</Text>
                                                    </View>
                                                  </View>
                                        )
                                    }}
                                    keyExtractor={(index) => { index.toString() }}
                                />
                            }
                        </View>
{/*------------------//// */}
                        {/* <View style={{ width: '100%', marginTop: windowHeight * 1.5 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100, borderBottomColor: Colors.border_color, borderBottomWidth: 1, flexDirection: 'row', }}>
                            <View style={{ width: '22%', justifyContent: 'center' }}>
                                <Image style={{ width: windowWidth * 21 / 100, height: windowWidth * 18 / 100, borderRadius: 5 }} source={localimag.testimage}></Image>
                            </View>
                            <View style={{ width: '53%', }}>

                                <Text numberOfLines={1} style={styles.txtitem2}>{'Mobile One Plus'}</Text>
                                <Text numberOfLines={1} style={styles.txtitem3}>{'Mobile'}</Text>
                                <Text numberOfLines={1} style={styles.txtitem3}>{''}</Text>
                                <View style={{ flexDirection: 'row',alignItems:'center',marginHorizontal: windowWidth * 2 / 100, marginTop: -windowHeight * 1/ 100  }}>
                                    <View style={{width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.greyColor}}></View>
                                     <Text style={styles.txtitem4}>{'Qty :'}</Text>
                                    <Text style={[styles.txtitem33, {}]}>{'2'}</Text>
                                </View>
                            </View>
                            <View style={{ width: '25%', }}>


                                <Text numberOfLines={1} style={styles.txtitem5}>${'500'}</Text>
                            </View>
                        </View> */}
                        <View style={{ width: '100%', marginTop: windowHeight * 1 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100 }}>
                            <Text style={config.textalign=='left' ? [styles.txtlogin,{textAlign:'left', marginTop: windowHeight * 2 / 100,}]:[styles.txtlogin,{textAlign:'left', marginTop: windowHeight * 2 / 100,}]}>{Lang_chg.shipinadd[config.language]} </Text>

                            {/* {this.state.user_details!='NA' &&  <Text style={config.textalign=='left' ? [styles.txtitem6,{textAlign:'left', marginTop: windowHeight * 1/ 100,}]:[styles.txtitem6,{textAlign:'left', marginTop: windowHeight * 1 / 100,}]}>{this.state.user_details.name} </Text>}
                            {this.state.user_details!='NA' && this.state.user_details.mobile!='' && <Text style={config.textalign=='left' ? [styles.txtitem8,{textAlign:'left', color:Colors.border_color1,fontFamily: Font.Poppins_SemiBold,}]:[styles.txtitem8,{textAlign:'left',color:Colors.border_color1,fontFamily: Font.Poppins_SemiBold,}]}>+966{' ' +this.state.user_details.mobile}</Text>} */}

                            <View style={{ flexDirection: 'row', }}>
                                <Image style={{ width: windowWidth * 6 / 100, height: windowWidth * 6 / 100, }} source={localimag.mapicon}></Image>
                             {this.state.orderdata!='NA' &&   <Text style={[styles.txtitem8, { marginHorizontal: 10,  color: Colors.border_color1,fontFamily: Font.Poppins_SemiBold, }]}>{this.state.orderdata.address}</Text>}
                            </View>

                        </View>

                        <View style={{ width: '100%', backgroundColor: Colors.homebg, height: windowHeight * 1 / 100 }}>

                        </View>
                        <View style={{ width: '100%', marginTop: windowHeight * 3 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100 }}>
                            <Text style={config.textalign=='left' ? [styles.txtitem7,{textAlign:'left'}]:[styles.txtitem7,{textAlign:'left'}]}>{Lang_chg.orderdetail[config.language]} </Text>
                            <Text style={config.textalign=='left' ? [styles.txtitem3,{textAlign:'left'}]:[styles.txtitem3,{textAlign:'left'}]}>{this.state.orderdata.createtime}</Text>
                        </View>

                        <View style={{ width: '100%', marginTop: windowHeight * 1 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 2 / 100 }}>
                       {/* <Image style={{ width: '100%', height: windowHeight * 10 / 100, }} source={localimag.order}></Image> */}
                       <View style={{flexDirection:"row",width:'100%',justifyContent:'space-between'}}>
                       <Text style={ [styles.txtlogin11,{ }]}>{Lang_chg.txtplaced[config.language]} </Text>
                       <Text style={ [styles.txtlogin11,{ }]}>{Lang_chg.txtpackaging[config.language]} </Text>
                       <Text style={ [styles.txtlogin11,{ }]}>{Lang_chg.txtoutfordelvery[config.language]} </Text>
                       <Text style={ [styles.txtlogin11,{ }]}>{Lang_chg.txtdelivered[config.language]} </Text>

                       </View>
                        </View>

                        <View style={{ width: '100%',flexDirection:'row',justifyContent:'space-between', marginTop: windowHeight * 0.5 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1 / 100 }}>
                            <View style={{paddingLeft:5, width:'28%', flexDirection:'row',alignItems:'center',}}>
                              <Image style={{ width: windowWidth * 4.5 / 100, height: windowWidth * 4.5 / 100, }} source={localimag.track0}></Image>
                              <View style={ this.state.orderdata!='NA'&& this.state.orderdata.order_status>0 ? [styles.trackfirst,{backgroundColor:Colors.theme_color1}]: [styles.trackfirst,{backgroundColor:Colors.border_color}]}>
                               </View>
                            </View>
                            <View style={{width:'30%', flexDirection:'row',alignItems:'center',}}>
                              <Image style={{ width: windowWidth * 4.4 / 100, height: windowWidth * 4.5 / 100, }} source={localimag.track1}></Image>
                                <View style={ this.state.orderdata!='NA'&& this.state.orderdata.order_status>1 ? [styles.tracksecond,{backgroundColor:Colors.theme_color1}]: [styles.tracksecond,{backgroundColor:Colors.border_color}]}>
                               </View>
                            </View>
                            <View style={{width:'32%', flexDirection:'row',alignItems:'center',}}>
                              <Image style={{ width: windowWidth * 4.4 / 100, height: windowWidth * 4.5 / 100, }} source={localimag.track2}></Image>
                                <View style={ this.state.orderdata!='NA'&& this.state.orderdata.order_status>2 ? [styles.trackthird,{backgroundColor:Colors.theme_color1}]: [styles.trackthird,{backgroundColor:Colors.border_color}]}>
                               </View>
                            </View>
                            <View style={{width:'6%', flexDirection:'row',alignItems:'center',}}>
                              <Image style={{ width: windowWidth * 4.5 / 100, height: windowWidth * 4.5 / 100, }} source={localimag.track3}></Image>
                               
                            </View>
                        </View>

                        <View style={{ width: '100%', marginTop: windowHeight * 1 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 2 / 100 }}>
                       {/* <Image style={{ width: '100%', height: windowHeight * 10 / 100, }} source={localimag.order}></Image> */}
                       <View style={{flexDirection:"row",width:'100%',justifyContent:'space-between'}}>
                           <View style={{width:'25%'}}>
                           <Text style={ [styles.txtlogin11,{textAlign:'left' }]}>{this.state.orderdata.place_date}</Text>
                           </View>
                           <View style={{width:'25%'}}>
                           <Text style={ [styles.txtlogin11,{textAlign:'left' }]}>{this.state.orderdata.packing_date_time}</Text>
                           </View>
                           <View style={{width:'25%',alignItems:'center',}}>
                           <Text style={ [styles.txtlogin11,{ textAlign:'left'}]}>{this.state.orderdata.out_for_delivery_date_time}</Text>
                           </View>
                           <View style={{width:'25%',alignItems:'flex-end'}}>
                           <Text style={ [styles.txtlogin11,{textAlign:'left' }]}>{this.state.orderdata.deliver_date_time}</Text>
                           </View>
                      
                       

                       </View>
                        </View>

                        <View style={styles.viewmore}>
                            <Text style={[styles.txtitem8, {}]}>{Lang_chg.itemprice[config.language]} </Text>
                            <Text style={[styles.txtitem8, {}]}>${this.state.orderdata.total_amount}</Text>
                        </View>
                        <View style={styles.viewmore}>
                            <Text style={[styles.txtitem8, {}]}>{Lang_chg.tax[config.language]} 
                            <Text style={[styles.txtitem8, {}]}>{'('+this.state.orderdata.tax+ ' % tax applied)'}</Text>
                            </Text>
                            
                            <Text style={[styles.txtitem8, {}]}>${this.state.orderdata.tax_amount}</Text>
                        </View>
                        <View style={styles.viewmore}>
                            <Text style={[styles.txtitem8, {}]}>{Lang_chg.shipingcharge[config.language]} </Text>
                            <Text style={[styles.txtitem8, {}]}>${this.state.orderdata.shiping_charge}</Text>
                        </View>
                       { this.state.orderdata.coupon_code !=null && this.state.orderdata.coupon_code !='' &&   <View style={styles.viewmore}>
                            <Text style={[styles.txtitem8, { color: '#2C996A' }]}>{Lang_chg.couponapply[config.language]} </Text>
                            <View style={{ backgroundColor: '#DAF5FF', borderRadius: 20, borderColor: Colors.google_color, borderWidth: 1, paddingHorizontal: windowWidth * 4 / 100, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.txtitem8, { color: 'black',fontFamily: Font.Poppins_SemiBold, }]}>{this.state.orderdata.coupon_code} </Text>
                            </View>
                        </View>}



                        <View style={[{ width: '100%', marginHorizontal: windowWidth * 4 / 100, height: 2, backgroundColor: Colors.border_color, marginBottom: 8 }]}>
                        </View>
                        <View style={styles.viewmore}>
                            <Text style={[styles.txtlogin, {}]}>{Lang_chg.total[config.language]} </Text>
                            <Text style={[styles.txtlogin, {}]}>${this.state.orderdata.total}</Text>
                        </View>

                    </View>
                </ScrollView>

                {/* <View style={{width:'100%',backgroundColor:'red'}}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Cancelorder')}} style={[CSSstyle.mainbutton, { backgroundColor: 'red' }]}>

                        <Text style={styles.txtlogin11}>{Lang_chg.cancelnow1[config.language]}</Text>
                    </TouchableOpacity>
                </View> */}

            </View>



        )
    }
}



const styles = StyleSheet.create({
  trackfirst:{  width:'89%',height:windowHeight*1/100},
  tracksecond:{width:'90.2%',height:windowHeight*1/100},
  trackthird:{width:'90.8%',height:windowHeight*1/100},
    txtlogin11: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    },
    viewmore: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight * .5 / 100, paddingHorizontal: windowWidth * 4 / 100, paddingBottom: windowHeight * 1.5 / 100 },
    txtlogin: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtlogin11: {
        fontSize: windowWidth * 2.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtlogin1: {
        fontSize: windowWidth * 3.2 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.google_color, alignSelf: 'center'
    },


    icon: {
        width: windowWidth * 5 / 100,
        height: windowWidth * 5 / 100,
        resizeMode: 'contain'
    },
    mainview: { width: '90%', paddingVertical: 10, borderColor: Colors.border_color1, borderWidth: 1, flexDirection: 'row', backgroundColor: Colors.whiteColor, alignSelf: 'center', },

    txtitem6: {
        fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor,
    },
    txtitem2: {
        textAlign:config.textalign, fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor, marginHorizontal: windowWidth * 2 / 100,
    },
    txtitem3: {
        textAlign:config.textalign,fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1, marginHorizontal: windowWidth * 2 / 100, marginTop: -windowHeight * 0.5 / 100
    },
    txtitem33: {
        textAlign:config.textalign, fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1, marginHorizontal: windowWidth * 2 / 100, marginTop: 3
    },
    txtitem4: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.greyColor, marginHorizontal: windowWidth * 1 / 100, marginTop: -windowHeight * 0 / 100
    },
    txtitem5: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1, marginHorizontal: windowWidth * 2 / 100, alignSelf: 'flex-end'
    },
    txtitem7: {
        fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor,
    },
    txtitem8: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1,
    },

});