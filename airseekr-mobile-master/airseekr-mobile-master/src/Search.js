import React, { Component } from 'react'
import {I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {
            search:false,
            txtsearch:'',
            new_item:'NA',
            new_item1: [{ 'name': 'MObile One Plus', 'image': localimag.testimage, 'price': 200, 'type': 1 },
            { 'name': 'New Brand Mobile', 'image': localimag.testimage1, 'price': 300, 'type': 0 },
            { 'name': 'MObile One Plus', 'image': localimag.testimage2, 'price': 200, 'type': 0 },
            { 'name': 'MObile One Plus', 'image': localimag.testimage3, 'price': 200, 'type': 0 },
            { 'name': 'New Brand Mobile', 'image': localimag.testimage1, 'price': 300, 'type': 0 },
            { 'name': 'MObile One Plus', 'image': localimag.testimage2, 'price': 200, 'type': 0 },

            ],


        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            // this.getvalue()
            this.setState({
                txtsearch:'',
              })
          
         });
         this.getvalue()
    }

    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
          this.setState({
            user_id:user_details.user_id,
         
          })
          
          this.getsearchdata()
           
        }
      }

      getsearchdata=()=>{
        this.setState({
            new_item: 'NA'
          })
          if(this.state.txtsearch!=''){
            this.setState({search:true   })
          }else{
            this.setState({search:false})
          }
          Keyboard.dismiss()
        let url = config.baseURL+'get_search_item.php?user_id='+this.state.user_id+'&search_text='+this.state.txtsearch
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('getsearchdata', obj);
                this.setState({
                    new_item: obj.all_product,
                  })
               
            } else {
                if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
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

    addfavourite=(item,index)=>{
        let url = config.baseURL+'add_remove_favourite.php?user_id='+this.state.user_id+'&product_id='+item.product_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('favstatus', obj);
                let data=this.state.new_item
                data[index].fav_status=!item.fav_status
                this.setState({
                    new_item:data,
                })
              
            } else {
                if (obj.active_status =="0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
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
    cross=()=>{
        this.setState({txtsearch:'',search:false});
        setTimeout(() => {
            this.getsearchdata()
        }, 200);
        
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.homebg, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />


                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: Colors.homebg, }}>
                        <View style={styles.notification_header}>
                            <TouchableOpacity activeOpacity={.7} style={{ width:'15%',alignSelf:'center' }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                            </TouchableOpacity>
                           
                            <View onPress={() => { }} style={{width:'85%',backgroundColor:Colors.homebg, borderRadius:10,flexDirection:'row',paddingVertical:5 }} >
                                <TouchableOpacity onPress={()=>{this.getsearchdata()}} style={{width:'15%',alignItems:'center',justifyContent:'center'}}>
                                   <Image style={[CSSstyle.edittxticon, { resizeMode: "contain", }]} source={localimag.searchb}></Image>
                                </TouchableOpacity>
                                <TextInput 
                                 value={"" + this.state.txtsearch + ""}
                                        onChangeText={(txt) => { this.setState({ txtsearch: txt }) }}
                                        keyboardType='default'
                                       // secureTextEntry={this.state.secureoldpassword}
                                        maxLength={40}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { this.getsearchdata() }}
                                        style={I18nManager.isRTL == false ? [styles.txtaddtype,{textAlign:'left'}]:[styles.txtaddtype,{textAlign:'right'}]}
                                         placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.searchhere[config.language]}></TextInput>
                                 {this.state.search == true ? <TouchableOpacity onPress={()=>{this.cross()}} style={{width:'10%',alignItems:'center',justifyContent:'center'}}>
                                   <Image style={[ {  width:windowWidth*4/100,  height:windowWidth*4/100, resizeMode: 'contain' }]} source={localimag.cross}></Image>
                                </TouchableOpacity>:
                                <View style={{width:'10%',alignItems:'center',justifyContent:'center'}}>
                               
                             </View>}
                            </View>
                        </View>
                        <View style={{ width: '100%', paddingBottom: windowHeight * 1 / 100,paddingHorizontal: '3%',  }}>
                        {this.state.new_item == "NA"  &&  
                                      <Image style={{alignSelf:'center', width:'70%',height:windowHeight/3,marginTop:windowHeight/4,resizeMode:'stretch'}} source={localimag.splash}></Image>
                                      } 
                            {this.state.new_item != "NA" &&
                                <FlatList
                                    data={this.state.new_item}
                                    numColumns={2}
                                    style={{ width: '100%', alignSelf: 'center', }}
                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                        return (

                                            <TouchableOpacity activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('Itemdetail',{'product_id':item.product_id}) }} style={{ width: '46%', backgroundColor: Colors.whiteColor, elevation: 2, shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, alignItems: 'center', alignSelf: 'center', marginHorizontal: '2%', marginBottom: windowHeight * 1 / 100, marginTop: windowHeight * 1 / 100, borderRadius: 10, padding: 2 }}>

                                                <View style={{borderRadius:10,backgroundColor:Colors.border_color, width: '100%', height: windowHeight * 27 / 100, backgroundColor: Colors.border_color1 }}>
                                                    <ImageBackground source={{uri:config.img_url2+item.product_detail.image[0].image}} imageStyle={{ borderRadius: 10, }} style={{ width: '100%', height: windowHeight * 27 / 100, backgroundColor: Colors.white_light }}
                                                // resizeMode={FastImage.resizeMode.stretch}
                                                >
                                                    <View style={{ width: '100%', flexDirection: 'row', padding: windowHeight * 1 / 100, justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {item.recent_time != 'NA' ? <View style={{ padding: 2, width: '40%', flexDirection: 'row', backgroundColor: Colors.theme_color3, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={styles.txttime}>{'Recent'}</Text>
                                                        </View> :
                                                            <View>
                                                            </View>}
                                                        <TouchableOpacity onPress={() => {this.addfavourite(item,index) }} style={{ width: '20%', alignItems: 'center' }}>
                                                            {item.fav_status==false ? 

                                                                <View style={{ padding: 4,backgroundColor:'#00000030',borderRadius:windowWidth*5/100 }}>
                                                                <Image style={CSSstyle.icons} source={localimag.heart}></Image>
                                                                 </View>
                                                            :
                                                            <View style={{ padding: 4,backgroundColor:'#00000030',borderRadius:windowWidth*5/100 }}>
                                                           <Image style={CSSstyle.icons} source={localimag.heartactive}></Image>
                                                  </View>
                                                           }
                                                        </TouchableOpacity>

                                                    </View>
                                                </ImageBackground>
                                                </View>
                                                <Text numberOfLines={1} style={styles.txtitem}>{item.product_detail.product_title[config.language]}</Text>
                                                <Text style={styles.txtitem1}>{item.product_detail.category_name[config.language]}</Text>
                                                <Text style={styles.txtitem2}>${item.product_detail.price}</Text>


                                            </TouchableOpacity>



                                            // <View style={{ width: '46%', backgroundColor: Colors.whiteColor, elevation: 2,shadowColor: "#000",  shadowOffset: { width: 2,height: 2, }, shadowOpacity: 0.20, alignItems: 'center', alignSelf: 'center', marginHorizontal: '2%', marginBottom: windowHeight * 1 / 100, marginTop: windowHeight * 1 / 100, borderRadius: 10, padding: 2 }}>

                                            //     <ImageBackground source={item.image} imageStyle={{ borderRadius: 10, }} style={{ width: '100%', height: windowHeight * 27 / 100, backgroundColor: Colors.white_light }}
                                            //     // resizeMode={FastImage.resizeMode.stretch}
                                            //     >
                                            //         <View style={{ width: '100%', flexDirection: 'row', padding: windowHeight * 1 / 100, justifyContent: 'space-between', alignItems: 'center' }}>
                                            //             {item.type == 1 ? <View style={{ padding: 2, width: '40%', flexDirection: 'row', backgroundColor: Colors.theme_color3, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                            //                 {/* <Image style={styles.icons} source={localimag.watch}></Image> */}
                                            //                 <Text style={styles.txttime}>{'Recent'}</Text>
                                            //             </View> :
                                            //                 <View></View>}
                                            //             <TouchableOpacity onPress={() => { }} style={{ width: '20%', alignItems: 'center' }}>
                                            //                 <Image style={CSSstyle.icons} source={localimag.heart}></Image>
                                            //             </TouchableOpacity>

                                            //         </View>
                                            //     </ImageBackground>
                                            //     <Text numberOfLines={1} style={styles.txtitem}>{item.name}</Text>
                                            //     <Text style={styles.txtitem1}>{'Mobile'}</Text>
                                            //     <Text style={styles.txtitem2}>${item.price}</Text>


                                            // </View>
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
    txtaddtype:{fontSize:windowWidth*3.8/100,width:'73%',paddingVertical:windowWidth*.1/100,fontFamily:Font.Poppins_Regular,color:Colors.blackColor},
  notification_header :{ flexDirection: 'row',
    
    paddingLeft: windowWidth*6/100,
    paddingRight: windowWidth*6/100,
    backgroundColor: Colors.theme_color1,
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,},
    txtitem: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: 5
    },

    txtitem1: {
        fontSize: windowWidth * 3.2 / 100, fontFamily: Font.Poppins_Regular, color: Colors.greyColor, alignSelf: 'flex-start', marginHorizontal: 5
    },
    txttime: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.whiteColor, marginHorizontal: 5, alignSelf: 'center'
    },
    txtitem2: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1, alignSelf: 'flex-end', marginHorizontal: 5
    },


    icons: {
        width: windowWidth * 3.5 / 100,
        height: windowWidth * 3.5 / 100,
        marginLeft: 5,
        resizeMode: 'contain'
    },



});