import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,  Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import FastImage from 'react-native-fast-image'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {localimag} from '../src/Provider/Localimage';
export default class Mycard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            totalamount:0,
            user_id:'',
            isempty:true,
            mycard_arr:'NAA',
            mycard_arr1:[
                { 'item_image': localimag.testimage,'item_name': 'Mobile One Plus','price':700 },
                { 'item_image': localimag.testimage1,'item_name': 'New Brand Mobile','price':300 },
            ]
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
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
            this.getcartdata()

        }
    }

    getcartdata = () => {
        let url = config.baseURL + 'get_mycart.php?user_id=' + this.state.user_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('get_mycart', obj);
            if (obj.success == 'true') {
                if(obj.cart_item!='NA'){
                    this.setState({mycard_arr:obj.cart_item})
                    let amount=0;
                    for(let i=0;i<obj.cart_item.length;i++){
                        amount=amount+obj.cart_item[i].price
                    }
                    this.setState({ totalamount:amount,isempty:false})
                     consolepro.consolelog('totalamount', this.state.totalamount);

                }else{
                    this.setState({  isempty:true,mycard_arr:'NA'})
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

    removefromcart=async(cart_id,index)=>{
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let  user_id= user_details.user_id;
            let url = config.baseURL + 'remove_to_cart.php'
            let data=new FormData();
            data.append('user_id',user_id);
            data.append('cart_id',cart_id);
            consolepro.consolelog('data', data);
            apifuntion.postApi(url,data).then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                   if(cart_id>0){
                        let data = this.state.mycard_arr
                        let price=data[index].price
                        data.splice(index, 1);
                        if (data.length > 0) {
                            this.setState({
                                mycard_arr: data,
                                totalamount:this.state.totalamount-price
                            })
                        } else {
                            this.setState({
                                mycard_arr: 'NA',
                                isempty: true,
                                totalamount:0
                            })
                        }
                   }else{
                    this.setState({
                        mycard_arr: 'NA',isempty:true,
                        totalamount:0
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

    }

    confirm=()=>{
        Alert.alert(
            msgTitle.clearcart[config.language],
            msgTitle.msgclearcart[config.language], [{
                text: msgTitle.no[config.language],
                onPress: () => {},
                style: msgTitle.cancel[config.language]
            }, {
                text: msgTitle.yes[config.language],
                onPress: () => this.removefromcart(0)
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    }

    incrementitem=async(item,index)=>{
        let quantity= item.quantity+1
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let data=this.state.mycard_arr
            let priceperitem= data[index].product_detail.price/data[index].quantity
            let itemprice=priceperitem*quantity
            let  user_id= user_details.user_id;
            let url = config.baseURL + 'add_to_cart.php'
            let data1=new FormData();
            data1.append('user_id',user_id);
            data1.append('product_id',item.product_id);
            data1.append('vendor_id',item.product_detail.vendor_id);
            data1.append('quantity',quantity);
            data1.append('price',itemprice);
            consolepro.consolelog('data', data1);
            apifuntion.postApi(url,data1).then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                    let data2=this.state.mycard_arr
                    let priceperitem= data2[index].price/data2[index].quantity
                    data2[index].price=priceperitem*quantity
                    data2[index].quantity=quantity
                   this.setState({mycard_arr:data2,totalamount:this.state.totalamount+priceperitem})
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
    
    decrementitem=async(item,index)=>{
        if(item.quantity>1){
        let quantity= item.quantity-1
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let data=this.state.mycard_arr
            let priceperitem= data[index].product_detail.price/data[index].quantity
            let itemprice=priceperitem*quantity
            let  user_id= user_details.user_id;
            let url = config.baseURL + 'add_to_cart.php'
            let data1=new FormData();
            data1.append('user_id',user_id);
            data1.append('product_id',item.product_id);
            data1.append('vendor_id',item.product_detail.vendor_id);
            data1.append('quantity',quantity);
            data1.append('price',itemprice);
            consolepro.consolelog('data', data1);
            apifuntion.postApi(url,data1).then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                    let data2=this.state.mycard_arr
                    let priceperitem= data2[index].price/data2[index].quantity
                    data2[index].price=priceperitem*quantity
                    data2[index].quantity=quantity
                   this.setState({mycard_arr:data2,totalamount:this.state.totalamount-priceperitem})
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
    
    render() {

        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                     <View  style={{  backgroundColor: Colors.whiteColor,height:'100%' }}>
                                   <View style={{height:'10%',}}>
                                        <View style={CSSstyle.notification_header}>
                                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.navigate('Homepage') }}>
                                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                                            </TouchableOpacity>
                                            <Text style={[CSSstyle.Notifications_title, {  }]}>{Lang_chg.cart[config.language]}</Text>
                                           
                                            <View style={{alignItems:'center',justifyContent:'center'}}>
                                           { this.state.isempty==false ?<TouchableOpacity onPress={()=>{this.confirm()}} style={{borderRadius:10,paddingVertical:2,paddingHorizontal:10,backgroundColor:Colors.theme_color3,justifyContent:'center'}} >
                                            <Text style={{ fontFamily: Font.Poppins_SemiBold,    fontSize: windowWidth*3.7/100,    color: '#fff',
                                              alignSelf:'center'}}>{Lang_chg.clear[config.language]}</Text>
                                            </TouchableOpacity>
                                            :<Text>{'       '}</Text>
                                            }
                                           </View>
                                           
                                      </View>
                                       </View>
                                      {this.state.isempty==false &&   <View style={{width:'100%',height:'90%', alignItems:'center',}}>
                                            <View style={{width:'100%',height:'83%', alignItems:'center',}}>
                                            {this.state.mycard_arr != "NA" &&
                                                            <FlatList
                                                                data={this.state.mycard_arr}
                                                                horizontal={false}
                                                                showsHorizontalScrollIndicator={false}
                                                                inverted={false}
                                                                renderItem={({ item, index }) => {
                                                                    return (

                                                                        <View style={{width:'95%',flexDirection:'row',borderRadius:10,backgroundColor:Colors.whiteColor,elevation:2,shadowColor: "#000",  shadowOffset: { width: 2,height: 2, }, shadowOpacity: 0.20,padding:5, alignSelf:'center',marginTop:windowHeight*2/100,marginBottom:windowHeight*.2/100}}>
                                                                            <View style={{width:'40%',padding:5}}>
                                                                            <FastImage
                                                                                source={item.product_detail.image != 'NA' ?
                                                                               {uri:config.img_url2+item.product_detail.image[0].image} : localimag.testimage}
                                                                                style={{width: windowWidth*28/100,height:windowWidth*28/100,resizeMode:'cover',borderRadius:10}}
                                                                                resizeMode={FastImage.resizeMode.cover}
                                                                            />
                                                                            </View>
                                                                            <View style={{width:'60%',marginTop:5}}>
                                                                                <Text numberOfLines={2} style={styles.txtitem}>{item.product_detail.product_title[config.language]}</Text>
                                                                                <Text style={styles.txtitem1}>{item.product_detail.category_name[config.language]}</Text>
                                                                                <Text style={styles.txtitem2}>${item.price}</Text>
                                                                                <View style={{width:'100%',flexDirection:'row',marginTop:5}}>
                                                                                <View style={{width:'70%',flexDirection:'row'}}>
                                                                                    <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.incrementitem(item,index)}}>
                                                                                    <Image style={CSSstyle.icons} source={localimag.increase}></Image>
                                                                                    </TouchableOpacity>
                                                                                
                                                                                    <Text style={styles.txtitem3}>{item.quantity}</Text>
                                                                                    <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.decrementitem(item,index)}}>
                                                                                    <Image style={CSSstyle.icons} source={localimag.decrease}></Image>
                                                                                    </TouchableOpacity>
                                                                                </View>

                                                                                    <TouchableOpacity onPress={()=>{this.removefromcart(item.cart_id,index)}} style={{width:'30%',alignItems:'flex-end',paddingHorizontal:10}}>
                                                                                        <Image style={CSSstyle.icons} source={localimag.removeitem}></Image>
                                                                                    
                                                                                </TouchableOpacity>
                                                                                </View>



                                                                            </View>

                                                                        </View>


                                                                    )
                                                                }}
                                                                keyExtractor={(index) => { index.toString() }}
                                                            />
                                                        }
                                                </View>

                                                <View style={{width:'100%',height:'8%',backgroundColor:Colors.logoutbgcolor,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:windowWidth*3/100,paddingVertical:windowHeight*2/100}}>
                                                      <Text style={[styles.txtitem,{alignSelf:'center'}]}>{Lang_chg.totalamount[config.language]}</Text>
                                                      <Text style={[styles.txtitem4,{alignSelf:'center'}]}>{'$'+this.state.totalamount}</Text>
                                                </View>
                                                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Checkout')}} style={{width:'100%',height:'9%',backgroundColor:Colors.theme_color1,padding:10,justifyContent:'center'}}>
                                                    
                                                    <Text style={styles.txtlogin}>{Lang_chg.Continue[config.language]}</Text>
                                                </TouchableOpacity>

                                      </View>}
                                       
                                     

                      {this.state.isempty==true && this.state.mycard_arr =='NA' &&  <View style={{width:'100%',alignItems:'center',marginTop:windowHeight*15/100,}}>
                      <View >
                      <Image resizeMode="contain" style={{width:windowWidth*20/100,height:windowHeight*20/100}} source={localimag.blankcart}></Image>
                      </View>
                      
                       <Text style={{width:'80%',textAlign:'center', fontFamily: Font.Poppins_SemiBold,    fontSize: windowWidth*4/100,    color: Colors.border_color1,
                                              alignSelf:'center'}}>{Lang_chg.emptytext[config.language]}</Text>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Homepage')}} style={[CSSstyle.mainbutton,{marginTop:windowHeight*3/100,width:'80%',}]}>
                                    
                                    <Text style={styles.txtlogin}>{Lang_chg.shopnow[config.language]}</Text>
                                </TouchableOpacity>
                       </View>}
                      </View>

              </View>         
                   
        )
    }
}



const styles = StyleSheet.create({
    txtlogin:{
        fontSize:windowWidth*4/100,fontFamily:Font.Poppins_Bold,color:Colors.whiteColor,alignSelf:'center'
    },
    txtitem:{
        textAlign:config.textalign, fontSize:windowWidth*4/100,fontFamily:Font.Poppins_SemiBold,color:Colors.blackColor,
    },
    txtitem1:{
        textAlign:config.textalign,fontSize:windowWidth*3.5/100,fontFamily:Font.Poppins_Regular,color:Colors.greyColor,
    },
    txtitem2:{
        textAlign:config.textalign, fontSize:windowWidth*4.2/100,fontFamily:Font.Poppins_Bold,color:Colors.theme_color1,
    },
    txtitem4:{
        fontSize:windowWidth*4.5/100,fontFamily:Font.Poppins_Bold,color:Colors.theme_color3,
    },
    txtitem3:{
        fontSize:windowWidth*3.5/100,fontFamily:Font.Poppins_Bold,color:Colors.blackColor,marginLeft:windowWidth*4/100,marginRight:windowWidth*4/100
    },
    mainview:{width:'90%',paddingVertical:10,borderColor:Colors.border_color,borderWidth:1, flexDirection:'row',backgroundColor:Colors.whiteColor,alignSelf:'center',},
});