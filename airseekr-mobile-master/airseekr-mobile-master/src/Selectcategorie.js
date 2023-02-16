import React, { Component } from 'react'
import {I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Selectcategorie extends Component {

    constructor(props) {
        super(props)
        this.state = {
            txtsearch:'',
            is_serach:false,

             category_arr:main_category_arr,
            // category_arr1:this.props.route.params.category_arr,
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
        //    this.setState({txtsearch:'', is_serach:false,})
        //    this.SearchFilterFunction('')
         });
    }
    cross_click = async () => {
         this.SearchFilterFunction('')

    }
    SearchFilterFunction = (text) => {
        return false
        this.setState({ category_arr: 'NA' })
        this.setState({ txtsearch: text })
        let data1 = this.state.category_arr1
        consolepro.consolelog('data1', data1)
        if (data1 != 'NA') {
            const newData = data1.filter(function (item) {
              let searchtext=  item.category_name[config.language]

                //applying filter for the inserted text in search bar
                const itemData = item.category_name ? searchtext.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            consolepro.consolelog('newData',newData)
            let  setdata=newData
            if (setdata.length > 0) {
                this.setState({ category_arr: setdata })
            } else {
                this.setState({ category_arr: 'NA' })
            }

        }

    }

    selecetcategory=(item)=>{
         categoryname=item.category_name
         category_id=item.category_id
         this.props.navigation.goBack()
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor:Colors.whiteColor }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <ScrollView style={{}}>
                    <View style={{ flex: 1,  }}>
                        <View style={CSSstyle.notification_header}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                            </TouchableOpacity>
                           {!this.state.is_serach && <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.allcategories[config.language]}</Text>}
                           {!this.state.is_serach && <TouchableOpacity onPress={() => {this.setState({is_serach:!this.state.is_serach}) }} style={{ padding: 2,justifyContent:'center' }} >
                                <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.searchw}></Image>
                            </TouchableOpacity>}
                            {this.state.is_serach &&  <View style={{backgroundColor:Colors.homebg, borderRadius:10, width:windowWidth*75/100,height:windowHeight*5/100,justifyContent:'center',flexDirection:'row'}}>
                            <TextInput
                                 value={"" + this.state.txtsearch + ""}
                                        onChangeText={(txt) => { this.SearchFilterFunction(txt) }}
                                        keyboardType='default'
                                       // secureTextEntry={this.state.secureoldpassword}
                                        maxLength={40}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={I18nManager.isRTL == false ? [styles.txtaddtype,{textAlign:'left'}]:[styles.txtaddtype,{textAlign:'right'}]}

                                         placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.Search[config.language]}></TextInput>
                            <TouchableOpacity onPress={() => {this.cross_click() }} style={{ padding: 2,justifyContent:'center' }} >
                                <Image style={[ {width:windowWidth*4/100,  height:windowWidth*4/100, resizeMode: 'contain', resizeMode: "contain", }]} source={localimag.cross}></Image>
                            </TouchableOpacity>
                            </View>}
                        </View>
                        <View style={{ width: '100%', paddingBottom: windowHeight * 1 / 100,paddingHorizontal:windowWidth*1/100 }}>
                        {this.state.category_arr == "NA"  &&  this.state.category_arr?.length > 0 &&

                                      <Image style={{alignSelf:'center', width:'70%',height:windowHeight/3,marginTop:windowHeight/4,resizeMode:'stretch'}} source={localimag.splash}></Image>
                                      }
                           {this.state.category_arr != "NA" && this.state.category_arr?.length > 0 &&
                            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', alignItems: 'center',marginTop: windowHeight * 2 / 100, }}>
                            { this.state.category_arr?.length > 0 && this.state.category_arr.map((item, index) => (
                                 <View style={{ width: windowWidth * 32.6 / 100, alignItems: 'center', marginTop: windowHeight * 2 / 100, }}>
                                 <TouchableOpacity style={{width: windowWidth * 26 / 100, height:windowHeight*16/100, alignItems:'center',borderColor:Colors.lightfontcolor,borderWidth:1,borderRadius:8,justifyContent:'center'}} onPress={() => {this.selecetcategory(item) }}>
                                     <View style={{ width: windowWidth * 16 / 100, height: windowWidth * 17 / 100,  alignItems: 'center', justifyContent: 'center' }}>
                                         {/*<Image style={[{ width: windowWidth * 14.5 / 100, height: windowWidth * 17 / 100, resizeMode: 'contain', }]} source={ {uri:config.img_url3+item.image} }></Image>*/}
                                         <Image style={[{ width: windowWidth * 14.5 / 100, height: windowWidth * 17 / 100, resizeMode: 'contain', }]} source={ item.image?.toString().indexOf('file://') > -1 ? { uri: item.image } : item.image }></Image>
                                     </View>
                                     <Text numberOfLines={1} style={styles.txtitem2}>{item.category_name}</Text>
                                 </TouchableOpacity>
                             </View>

                                ))

                                }
                                </View>

                            }
                        </View>
                    </View>
                </ScrollView>


            </View>
        )
    }
}



const styles = StyleSheet.create({
    icons:{width:windowWidth*15/100,
        height:windowWidth*15/100,
        borderRadius:windowWidth*7.5/100,
        resizeMode: 'cover'},
    txtitem3: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, marginHorizontal: 8,marginTop:5
    },
    txtaddtype:{fontSize:windowWidth*3.8/100,width:'88%',paddingVertical:windowWidth*.1/100,fontFamily:Font.Poppins_Regular,color:Colors.blackColor},

});
