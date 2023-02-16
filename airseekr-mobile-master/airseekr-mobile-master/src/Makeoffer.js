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
export default class Makeoffer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            cameramodalon: false,
            report: '',
            imagepath: 'NA',
            modalprice: false,
            amount: '$420.12',
            takeimage:false,
            Abn_number:'',
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
       });
    }

    _openCamera = () => {

        mediaprovider.launchCamera().then((obj) => {
            consolepro.consolelog('imageobj',obj)
            this.setState({ cameramodalon: false })
            this.setState({
              imagepath: obj.path,takeimage:true
            })
          })
    }

    _openGellery = () => {
        mediaprovider.launchGellery().then((obj) => {
            consolepro.consolelog('imageobj',obj)
            this.setState({ cameramodalon: false })
            if(obj.mime== "image/jpeg"){
              this.setState({
                imagepath: obj.path,takeimage:true
      
              })
            }else{
              this.setState({
                imagepath:'NA',takeimage:false
        
              })
            }
           
          })
    }

    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })

        }
    }
    continuepress=async()=>{
        Keyboard.dismiss()
        if (this.state.takeimage == false){
            msgProvider.toast(validation.emptyIdpic[config.language], 'center')
            return false;
        }
       
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let url = config.baseURL + "edit_profile.php";
            var data = new FormData();
            data.append('user_id', user_details.user_id)
            data.append('name', user_details.name)
            data.append('email', user_details.email)
            data.append("mobile",user_details.mobile)
            data.append("address",user_details.address)
            data.append("latitude",user_details.latitude)
            data.append("longitude",user_details.longitude)
            data.append("type",1)
            data.append("abn_number",this.state.Abn_number)
            if (this.state.takeimage == true) {
                        data.append('profile_id', {
                            uri: this.state.imagepath,
                            type: 'image/jpg', 
                            name: 'image.jpg'
                        })
                        }
            
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('test', obj)
                if (obj.success == 'true') { 
                    consolepro.consolelog('test1', obj)
                    var user_details = obj.user_details;
                    localStorage.setItemObject('user_arr', user_details);


                    if(config.guest_status==true && config.device_type=='ios'){
                        this.props.navigation.replace('Offerprice')
                    }else{
                        this.props.navigation.replace('Addbank',{redirect:'other'})
                    }
                    // this.props.navigation.replace('Offerprice')
                   
        
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

   

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Cameragallery mediamodal={this.state.cameramodalon} Camerapopen={() => { this._openCamera() }} Galleryopen={() => { this._openGellery() }} Canclemedia={() => { this.setState({ cameramodalon: false }) }} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalprice}
                    onRequestClose={() => {

                    }}>

                    <View style={{ flex: 1, backgroundColor: '#00000090', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: windowWidth, }}>
                            <View style={{ alignSelf: 'center', width: '100%', alignItems: 'center' }}>
                                <View style={{ alignItems: 'center', width: '85%', backgroundColor: Colors.mediabackground, borderRadius: 15, paddingVertical: windowWidth * 3.5 / 100 }}>
                                    <View style={{ width: '85%', }}>
                                        <Text style={{ marginTop: windowHeight * 1 / 100, fontFamily: Font.Poppins_SemiBold, textAlign: 'center', fontSize: windowWidth * 4.5 / 100, color: Colors.mediatextcolor }}>{Lang_chg.txtenterofff[config.language]}</Text>
                                        <TextInput
                                            value={"" + this.state.amount + ""}
                                            onChangeText={(txt) => { this.setState({ amount: txt }) }}
                                            keyboardType='number-pad'
                                            maxLength={30}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txtamount, {}]}
                                            placeholderTextColor={Colors.lightfontcolor} ></TextInput>

                                        <View style={{ width: '100%', backgroundColor: Colors.theme_color1, height: 1, marginTop: - windowHeight * 1 / 100 }}>
                                        </View>
                                        <TouchableOpacity onPress={() => { this.setState({ modalprice: false }); this.props.navigation.navigate('Congratulations') }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 6 / 100, marginBottom: windowHeight * 2 / 100 }]}>

                                            <Text style={styles.txtlogin}>{Lang_chg.send[config.language]}</Text>

                                        </TouchableOpacity>
                                    </View>
                                   
                                </View>
                            </View>

                        </View>
                    </View>
                </Modal>



                <ScrollView >
                    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, paddingBottom: windowHeight * 2 / 100 }}>

                        <View style={[CSSstyle.notification_header, { paddingTop: 10, paddingBottom: 5, }]}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: '90%', alignSelf: 'center' }}>

                            <Text style={[styles.txttext1, { marginTop: windowHeight * 3 / 100 }]}>{Lang_chg.txtidverfication[config.language]}</Text>
                            <Text style={[styles.txttext2, {}]}>{Lang_chg.txtidforverfication[config.language]}</Text>
                            <View style={{ width: '100%', height: windowHeight * 27 / 100, marginTop: windowHeight * 5 / 100 }}>
                                {this.state.imagepath == 'NA' ? <TouchableOpacity onPress={() => { this.setState({ cameramodalon: true, }) }} style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: Colors.border_color1, width: '100%', height: windowHeight * 27 / 100, }}>
                                    <Image resizeMode="contain" style={styles.icons} source={localimag.greycameraicon}></Image>
                                </TouchableOpacity> :
                                    <ImageBackground imageStyle={{ borderRadius: 20, }} resizeMode="cover" style={{ alignItems: 'flex-end', borderRadius: 20, width: '100%', height: windowHeight * 27 / 100, }} source={{ uri: this.state.imagepath }}>
                                        <TouchableOpacity onPress={() => { this.setState({imagepath:'NA',takeimage:false}) }}>
                                            <Image resizeMode="contain" style={styles.iconcross} source={localimag.crossicon}></Image>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                }

                            </View>
                            <Text style={[styles.txttext1, { marginTop: windowHeight * 4 / 100 }]}>{Lang_chg.txtABN[config.language]}</Text>
                            <Text style={[styles.txttext2, {}]}>{Lang_chg.txtABN1[config.language]}</Text>

                            <TextInput
                                value={"" + this.state.Abn_number + ""}
                                onChangeText={(txt) => { this.setState({ Abn_number: txt }) }}
                                keyboardType='default'
                                maxLength={30}
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                style={[styles.txteditemail, {}]}
                                placeholderTextColor={Colors.lightfontcolor} placeholder={Lang_chg.txtenterdesc[config.language]}></TextInput>

                            <View style={{ width: '100%', backgroundColor: Colors.theme_color1, height: 1, marginTop: - windowHeight * 1 / 100 }}>
                            </View>
                            <TouchableOpacity onPress={() => {this.continuepress() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 13 / 100, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '4%' }]}>
                                <Text style={styles.txtlogin}>{'   '}</Text>
                                <Text style={styles.txtlogin}>{Lang_chg.Continue[config.language]}</Text>
                                <Image resizeMode="cover" style={styles.iconsback} source={localimag.arroww}></Image>

                            </TouchableOpacity>

                        </View>

                    </View>
                </ScrollView>




            </View>
        )
    }
}



const styles = StyleSheet.create({
    txttext1: {
        fontSize: windowWidth * 6 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txttext2: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.lightfontcolor,
    },
    txtlogin: {
        fontSize: windowWidth * 3.9 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },
    icons: {
        width: windowWidth * 12 / 100,
        height: windowWidth * 12 / 100,
        resizeMode: 'cover',
    }, iconcross: {
        width: windowWidth * 8 / 100,
        height: windowWidth * 8 / 100,
        resizeMode: 'cover',
    },
    iconsback: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 4 / 100,
        resizeMode: 'stretch', alignSelf: 'center'
    },

    txteditemail: { marginTop: windowHeight * 2.5 / 100, fontSize: windowWidth * 3.7 / 100, width: '100%', fontFamily: Font.Poppins_Bold, color: Colors.lightfontcolor, height: windowHeight * 6 / 100 },
    txtamount: { paddingVertical: windowHeight * 1.5 / 100, marginTop: windowHeight * 1 / 100, fontSize: windowWidth * 4.5 / 100, width: '100%', fontFamily: Font.Poppins_Bold, color: Colors.lightfontcolor },


});
