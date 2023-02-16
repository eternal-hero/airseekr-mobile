import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Cancelorder extends Component {

    constructor(props) {
        super(props)
        this.state = {
            describe:'',
            reson_list:[
                {'reson':'I dont want to order','isselect':true},
                {'reson':'Want to order with another vendor','isselect':false},
                {'reson':'Order by mistake','isselect':false},
                {'reson':'Not Needed','isselect':false},
                {'reson':'Other reason','isselect':false},
            ]
        }

    }
    componentDidMount() {

    }
    selectitem=(index)=>{
         let data= this.state.reson_list
         for(let i=0;i<data.length;i++  ){
             data[i].isselect=false
         }
         data[index].isselect=true
         this.setState({reson_list:data})

    }
    render() {

        return (
            <View style={{ flex: 1,backgroundColor: Colors.whiteColor }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.whiteColor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                    <ScrollView>

                   
                <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                    <View style={CSSstyle.notification_header}>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                            <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                        </TouchableOpacity>
                        <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.cancelreason[config.language]}</Text>
                        <View >
                            <Text ></Text>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingBottom: windowHeight * 1 / 100,marginTop:10 }}>
                            
                            {this.state.reson_list != "NA" &&
                                 <FlatList
                                     data={this.state.reson_list}
                                   
                                     showsHorizontalScrollIndicator={false}
                                     inverted={false}
                                     renderItem={({ item, index }) => {
                                        return (
 
                                            <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.selectitem(index)}} style={{width:'100%',flexDirection:'row',justifyContent:'space-between',marginTop:windowHeight*2/100,paddingHorizontal:windowWidth*4/100, borderBottomColor:Colors.border_color,borderBottomWidth:1,paddingBottom:windowHeight*2/100 }}>
                                              <Text  style={styles.txtitem3}>{item.reson}</Text>
                                             {item.isselect==true && <Image  style={styles.icon} source={localimag.right}></Image>
                                                }  
                                             </TouchableOpacity>
                                         )
                                     }}
                                     keyExtractor={(index) => { index.toString() }}
                                 />
                             }
                         </View>



                    <View style={[styles.mainview,{marginTop:windowHeight*5/100}]}>
                           <View style={{width:'12%',alignItems:'center',}}>
                                <Image  style={styles.icon} source={localimag.pencil1}></Image>
                            </View>
                            <View style={{width:'88%',marginHorizontal:3,}}>    
                                <TextInput 
                                 value={"" + this.state.describe + ""}
                                        onChangeText={(txt) => { this.setState({ describe: txt }) }}
                                        keyboardType='default'
                                     multiline={true}
                                        maxLength={250}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={{fontSize:windowWidth*3.8/100,fontFamily:Font.Poppins_Regular,marginTop:-windowHeight*1.5/100,  textAlignVertical:'top',width:'100%',height:windowHeight*15/100,color:Colors.blackColor}} placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.describe[config.language]}></TextInput>
                            </View>
                            
                        </View>

                  

                    <TouchableOpacity onPress={() => { }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 4 / 100, backgroundColor: Colors.red_color }]}>

                        <Text style={styles.txtlogin}>{Lang_chg.cancelnow[config.language]}</Text>
                    </TouchableOpacity>

                </View>
                </ScrollView>
            </View>



        )
    }
}



const styles = StyleSheet.create({
    txtlogin: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    },
    icon: {
        width: windowWidth * 5 / 100,
        height: windowWidth * 5 / 100,
        resizeMode: 'contain'
    },txtitem3: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1, marginHorizontal: windowWidth*2/100,alignSelf:'center'
    },
    mainview: { width: '80%',borderRadius:10, paddingVertical: 10, borderColor: Colors.border_color, borderWidth: 1, flexDirection: 'row', backgroundColor: Colors.whiteColor, alignSelf: 'center', },
});