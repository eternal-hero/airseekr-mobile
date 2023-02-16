import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import Carousel from 'react-native-banner-carousel';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Fullimage extends Component {

    constructor(props) {
        super(props)
        this.state = {
             banner_image: this.props.route.params.image_arr
            
           
        }

    }
    componentDidMount() {
        
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.blackColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <View style={{ position: 'absolute', top: 0, zIndex: 999, width: '90%', flexDirection: 'row', paddingVertical: 15, justifyContent: 'space-between', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => { this.props.navigation.goBack()}} style={{ padding: 2 }} >
                    <Image resizeMode="contain" style={styles.icons} source={localimag.crossw}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} style={{ padding: 2 }} >
                    
                        </TouchableOpacity>
                </View>
               
            
                    <View style={{ flex: 1, backgroundColor: Colors.blackColor, }}>

                        {this.state.banner_image != 'NA' &&
                         <View 
                         style={{
                            width: '100%', height:'100%',justifyContent:'center'
                        }}
                         >

                        <Swiper  ref='swiper'  
                             scrollEnabled={true} 
                             horizontal={true} 
                             scrollsToTop={false}   
                             loop={true}
                             index={0} 
                             autoplay={true}
                             showsButtons={false}
                             dotColor='#750202'
                             activeDotColor={Colors.theme_color1}
                             showsPagination={true}  
                             buttonWrapperStyle={{color:Colors.theme_color1,}}>
                              {this.state.banner_image!="NA" && this.state.banner_image.map((item,index) =>{
                                       return   ( 
                                        
                                        <View style={{
                                            width: '100%', alignItems: 'center',

                                        }}>
                                            <FastImage
                                                onLoadStart={() => this.setState({ showDefault: false })}
                                                onLoad={() => this.setState({ showDefault: false })}
                                                style={{
                                                    width: '100%', height:'100%', alignItems: 'center', resizeMode: 'contain',
                                                }} source={{uri:config.img_url3+ item.image}}
                                                resizeMode={FastImage.resizeMode.contain} />
                                        </View>
                                        
                                        )})
                                       }
                                       </Swiper>
                            </View>
                            }
                    </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    txtdesc: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor,marginHorizontal:5
    },
    txtdesc1: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1,marginHorizontal:5
    },
    txtdesc2: {
        fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1,marginHorizontal:5
    },
    txtitem2: {
        textAlign:config.textalign, fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1,
    },
   txtitem1: {
        textAlign:config.textalign, fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Regular, color: Colors.greyColor,
    },
    txtitem3: {
        textAlign:config.textalign, fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txttime: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.whiteColor, marginHorizontal: 5, alignSelf: 'center'
    }, icons: {
        width: windowWidth * 5 / 100,
        height: windowWidth * 5 / 100,
        resizeMode: 'contain',
        alignSelf:'center'
    },
    // txtitem4: {
    //     fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor, alignSelf: 'center'
    // },
});