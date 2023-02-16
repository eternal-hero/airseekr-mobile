import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Myorder extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id:'',
            item_list:'NA',
            item_list1:[
                {'name':'Mobile One Plus','image':localimag.testimage1,'id':'#547862','type':0,'price':'200'},
                {'name':'New Brand Mobile','image':localimag.testimage3,'id':'#125465','type':1,'price':'500'},
                {'name':'Mobile','image':localimag.testimage2,'id':'#745869','type':2,'price':'300'},
                {'name':'Mobile','image':localimag.testimage1,'id':'#478569','type':3,'price':'100'},
            
            ],
           
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
           
            this.setState({
                item_list:'NA',
            })
            this.getvalue()
        });
       
    }

    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
            this.getorderdata()

        }
    }

    getorderdata = () => {
        let url = config.baseURL + 'get_myorder.php?user_id=' + this.state.user_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('itemdetail', obj);
                if(obj.order_item!='NA'){
                    this.setState({
                        item_list: obj.order_item,
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
   
    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.whiteColor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                        <View style={CSSstyle.notification_header}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.navigate('Homepage') }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.myorder[config.language]}</Text>
                            <TouchableOpacity onPress={() => { }} style={{ padding: 2,justifyContent:'center' }} >
                                {/* <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.searchw}></Image> */}
                                <Text style={ {}}>{'      '}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', paddingBottom: windowHeight * 1 / 100, }}>
                        {this.state.item_list == "NA"  &&  
                                      <Image style={{alignSelf:'center', width:'70%',height:windowHeight/3,marginTop:windowHeight/4,resizeMode:'stretch'}} source={localimag.splash}></Image>
                                      } 
                           {this.state.item_list != "NA" &&
                                <FlatList
                                    data={this.state.item_list}
                                  
                                    // style={{width:'89%',alignSelf:'center',}}
                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                       return (

                                        <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.props.navigation.navigate('Orderdetail',{order_id:item.order_id})}} style={{width:'100%',flexDirection:'row',marginTop:windowHeight*2/100,paddingHorizontal:windowWidth*4/100, borderBottomColor:Colors.border_color,borderBottomWidth:1,paddingBottom:windowHeight*2/100 }}>
                                            {/* <View style={{width:'22%',justifyContent:'center'}}>
                                                <Image style={{width:windowWidth*20/100,height:windowWidth*24/100,borderRadius:10}} source={{uri:config.img_url1+item.product_detail.image[0].image}}></Image>
                                            </View> */}
                                            <View style={{width:'100%',}}>
                                               <Text numberOfLines={1} style={styles.txtitem1}>#{item.order_no}</Text>
                                               <View style={{width:'100%',flexDirection:'row',}}>
                                                       
                                                   <View style={{width:'70%',}}>
                                                    <Text numberOfLines={1} style={styles.txtitem2}>{item.product_detail.product_title[config.language]}</Text>
                                                    </View>
                                                    <View style={{width:'30%',}}>
                                                          <Text numberOfLines={1} style={styles.txtitem5}>${item.price}</Text>
                                                     </View>
                                               </View>
                                               {/* <Text numberOfLines={1} style={styles.txtitem3}>{item.product_detail.category_name[config.language]}</Text> */}
                                              
                                               {
                                                    item.order_status==0 ? <View style={{flexDirection:'row',paddingLeft:windowWidth*0/100,marginTop:windowHeight*1/100,justifyContent:'space-between'}}>
                                                         {/* <View style={{marginTop:windowHeight*.5/100,width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.theme_color2}}>
                                                        </View> */}
                                                         <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.theme_color2}]}>{Lang_chg.orderplaced[config.language]}</Text>
                                                         {item.order_status==0 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.place_date_time}</Text> }
                                                        {item.order_status==1 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.packing_date_time}</Text> }
                                                        {item.order_status==2 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.out_for_delivery_date_time}</Text> }
                                                        {item.order_status==3 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.deliver_date_time}</Text> }
                                                         
                                                         </View>
                                                         :
                                                    item.order_status==1 ?  <View style={{flexDirection:'row',paddingLeft:windowWidth*0/100,marginTop:windowHeight*1/100,justifyContent:'space-between'}}>
                                                    {/* <View style={{marginTop:windowHeight*.5/100,width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.theme_color3}}>
                                                   </View> */}
                                                   <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.theme_color3}]}>{Lang_chg.orderinprogress[config.language]}</Text>
                                                   {item.order_status==0 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.place_date_time}</Text> }
                                                        {item.order_status==1 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.packing_date_time}</Text> }
                                                        {item.order_status==2 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.out_for_delivery_date_time}</Text> }
                                                        {item.order_status==3 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.deliver_date_time}</Text> }
                                                    </View>
                                                    :
                                                    
                                                    item.order_status==2 ? <View style={{flexDirection:'row',paddingLeft:windowWidth*0/100,marginTop:windowHeight*1/100,justifyContent:'space-between'}}>
                                                    {/* <View style={{marginTop:windowHeight*.5/100,width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:'green'}}>
                                                   </View> */}
                                                   <Text numberOfLines={1} style={[styles.txtitem6,{color: 'green'}]}>{Lang_chg.orderinprogress[config.language]}</Text>
                                                   {item.order_status==0 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.place_date_time}</Text> }
                                                        {item.order_status==1 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.packing_date_time}</Text> }
                                                        {item.order_status==2 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.out_for_delivery_date_time}</Text> }
                                                        {item.order_status==3 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.deliver_date_time}</Text> }
                                                    </View>
                                                    :
                                                    
                                                    item.order_status==3 ? <View style={{flexDirection:'row',paddingLeft:windowWidth*0/100,marginTop:windowHeight*1/100,justifyContent:'space-between'}}>
                                                    {/* <View style={{marginTop:windowHeight*.5/100,width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.red_color}}>
                                                   </View> */}
                                                   <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.red_color}]}>{Lang_chg.orderincompleted[config.language]}</Text>
                                                   {item.order_status==0 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.place_date_time}</Text> }
                                                        {item.order_status==1 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.packing_date_time}</Text> }
                                                        {item.order_status==2 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.out_for_delivery_date_time}</Text> }
                                                        {item.order_status==3 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.deliver_date_time}</Text> }
                                                    </View>
                                                     :null

                                                }

                                               
                                                <View style={{width:'100%',flexDirection:'row',}}>
                                                        
                                                      {/*  <View style={{width:'30%', flexDirection: 'row',alignItems:'center',marginHorizontal: windowWidth * 2 / 100, marginTop: -windowHeight * 1/ 100  }}>
                                                         <View style={{width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.greyColor,justifyContent:'center'}}>
                                                        </View>
                                                             <Text  style={styles.txtitem4}>{'Qty'}</Text> 
                                                            <Text  style={styles.txtitem4}>{':'}</Text>
                                                            <Text  style={[styles.txtitem33,{}]}>{item.quantity}</Text> 
                                                        </View>
                                                         <View style={{width:'65%',}}>
                                                        {item.order_status==0 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.place_date_time}</Text> }
                                                        {item.order_status==1 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.packing_date_time}</Text> }
                                                        {item.order_status==2 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.out_for_delivery_date_time}</Text> }
                                                        {item.order_status==3 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.deliver_date_time}</Text> }
                                                         
                                                        </View> */}
                                                       
                                                </View>
                                            </View>

                                        </TouchableOpacity>
                                           
                                        )
                                    }}
                                    keyExtractor={(index) => { index.toString() }}
                                />
                            }
                        </View>
                    </View>
                </ScrollView>


            </View>
        )
    }
}



const styles = StyleSheet.create({
    icons:{width:windowWidth*10/100,
        height:windowWidth*10/100,
        resizeMode: 'cover'},
    txtitem1: {
        textAlign:config.textalign,  fontSize:  windowWidth * 3.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color2, marginHorizontal:windowWidth*2/100,
    },
    txtitem2: {
       textAlign:config.textalign,fontSize:  windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor, marginHorizontal: windowWidth*2/100,marginTop:-windowHeight*.5/100
    },
    txtitem3: {
        textAlign:config.textalign,  fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1, marginHorizontal: windowWidth*2/100,marginTop:-windowHeight*.5/100
    },
    txtitem33: {
        textAlign:config.textalign, fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1, marginHorizontal: windowWidth * 2 / 100, marginTop: 3
    },
    txtitem4: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.greyColor, marginHorizontal: windowWidth*1/100,marginTop:-windowHeight*0/100
    },
    txtitem5: {
         fontSize:  windowWidth * 4.2 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1, marginHorizontal: windowWidth*2/100,marginTop:-windowHeight*.5/100,alignSelf:'flex-end'
    },
    txtitem6: {
        fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_SemiBold,  marginHorizontal: windowWidth*2/100,marginTop:-windowHeight*.5/100,alignSelf:'flex-end'
    },
    txtitem7: {
        fontSize: windowWidth * 3.3 / 100, fontFamily: Font.Poppins_SemiBold,  marginHorizontal: windowWidth*2/100,marginTop:-windowHeight*.5/100,alignSelf:'flex-end'
    },
    
});








// <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.props.navigation.navigate('Orderdetail')}} style={{width:'100%',flexDirection:'row',marginTop:windowHeight*2/100,paddingHorizontal:windowWidth*4/100, borderBottomColor:Colors.border_color,borderBottomWidth:1,paddingBottom:windowHeight*2/100 }}>
// <View style={{width:'22%',justifyContent:'center'}}>
//     <Image style={{width:windowWidth*20/100,height:windowWidth*22/100,borderRadius:10}} source={item.image}></Image>
// </View>
// <View style={{width:'41%',}}>
//      <Text numberOfLines={1} style={styles.txtitem1}>{item.id}</Text>
//      <Text numberOfLines={1} style={styles.txtitem2}>{item.name}</Text>
//      <Text numberOfLines={1} style={styles.txtitem3}>{'Mobile'}</Text>
//      <Text numberOfLines={1} style={styles.txtitem3}>{''}</Text>
//      <View style={{flexDirection:'row',}}>
//       <Text  style={styles.txtitem4}>{'. Qty : '}</Text>
//       <Text  style={[styles.txtitem3,{}]}>{'2'}</Text>
//      </View>
// </View>
// <View style={{width:'37%',}}>
    
// <Text numberOfLines={1} style={styles.txtitem1}>{" "}</Text>
//      <Text numberOfLines={1} style={styles.txtitem5}>${item.price}</Text>
//      <Text numberOfLines={1} style={styles.txtitem3}>{' '}</Text>
//      {
//          item.type==0 ?  <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.theme_color1}]}>{'. Order Placed'}</Text>:
//          item.type==1 ?  <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.theme_color2}]}>{'. Inprogress'}</Text>:
//          item.type==2 ?  <Text numberOfLines={1} style={[styles.txtitem6,{color: 'green'}]}>{'. Completed'}</Text>:
//          item.type==3 ?  <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.red_color}]}>{'. Cancelled'}</Text>:null

//      }
//     <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.border_color1}]}>{'10-06-2021 10:20:30 am '}</Text>
// </View>
// </TouchableOpacity>



// <View style={{width:'22%',justifyContent:'center'}}>
//                                                 <Image style={{width:windowWidth*20/100,height:windowWidth*24/100,borderRadius:10}} source={{uri:config.img_url1+item.product_detail.image[0].image}}></Image>
//                                             </View>
//                                             <View style={{width:'78%',}}>
//                                                <Text numberOfLines={1} style={styles.txtitem1}>#{item.order_no}</Text>
//                                                <View style={{width:'100%',flexDirection:'row',}}>
                                                       
//                                                    <View style={{width:'70%',}}>
//                                                     <Text numberOfLines={1} style={styles.txtitem2}>{item.product_detail.product_title[config.language]}</Text>
//                                                     </View>
//                                                     <View style={{width:'30%',}}>
//                                                           <Text numberOfLines={1} style={styles.txtitem5}>${item.price}</Text>
//                                                      </View>
//                                                </View>
//                                                <Text numberOfLines={1} style={styles.txtitem3}>{item.product_detail.category_name[config.language]}</Text>
                                              
//                                                {
//                                                     item.order_status==0 ? <View style={{flexDirection:'row',paddingLeft:windowWidth*2/100,justifyContent:'flex-end'}}>
//                                                          <View style={{marginTop:windowHeight*.5/100,width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.theme_color2}}>
//                                                         </View>
//                                                          <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.theme_color2}]}>{'Order Placed'}</Text>
//                                                          </View>
//                                                          :
//                                                     item.order_status==1 ?  <View style={{flexDirection:'row',paddingLeft:windowWidth*2/100,justifyContent:'flex-end'}}>
//                                                     <View style={{marginTop:windowHeight*.5/100,width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.theme_color3}}>
//                                                    </View>
//                                                    <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.theme_color3}]}>{'Inprogress'}</Text>
//                                                     </View>
//                                                     :
                                                    
//                                                     item.order_status==2 ? <View style={{flexDirection:'row',paddingLeft:windowWidth*2/100,justifyContent:'flex-end'}}>
//                                                     <View style={{marginTop:windowHeight*.5/100,width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:'green'}}>
//                                                    </View>
//                                                    <Text numberOfLines={1} style={[styles.txtitem6,{color: 'green'}]}>{'Completed'}</Text>
//                                                     </View>
//                                                     :
                                                    
//                                                     item.order_status==3 ? <View style={{flexDirection:'row',paddingLeft:windowWidth*2/100,justifyContent:'flex-end'}}>
//                                                     <View style={{marginTop:windowHeight*.5/100,width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.red_color}}>
//                                                    </View>
//                                                    <Text numberOfLines={1} style={[styles.txtitem6,{color: Colors.red_color}]}>{'Cancelled'}</Text>
//                                                     </View>
//                                                      :null

//                                                 }

                                               
//                                                 <View style={{width:'100%',flexDirection:'row',}}>
                                                        
//                                                         <View style={{width:'30%', flexDirection: 'row',alignItems:'center',marginHorizontal: windowWidth * 2 / 100, marginTop: -windowHeight * 1/ 100  }}>
//                                                         <View style={{width:windowWidth*1.5/100,height:windowWidth*1.5/100,borderRadius:windowWidth*1/100,backgroundColor:Colors.greyColor,justifyContent:'center'}}></View>
//                                                             <Text  style={styles.txtitem4}>{'Qty'}</Text>
//                                                             <Text  style={styles.txtitem4}>{':'}</Text>
//                                                             <Text  style={[styles.txtitem33,{}]}>{item.quantity}</Text>
//                                                         </View>
//                                                         <View style={{width:'65%',}}>
//                                                         {item.order_status==0 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.place_date_time}</Text> }
//                                                         {item.order_status==1 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.packing_date_time}</Text> }
//                                                         {item.order_status==2 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.out_for_delivery_date_time}</Text> }
//                                                         {item.order_status==3 &&   <Text  style={[styles.txtitem7,{color: Colors.border_color1}]}>{item.deliver_date_time}</Text> }
                                                         
//                                                         </View>
                                                       
//                                                 </View>
//                                             </View>
