import React, { Component } from 'react'
import { I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import { color } from 'react-native-reanimated';
export default class Addaddress extends Component {

    constructor(props) {
        super(props)
        this.state = {
            add_type: 'Address Type',
            address: '',
            setdefault: 0,
            address_type: 2,
            user_id: '',
            addmodal: false

        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.setState({ address: config.newaddress })
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

        }
    }

    addresssubmit = () => {
        let addresstype = this.state.address_type;
        if (addresstype == 2) {
            msgProvider.toast(validation.emptyAddresstype[config.language], 'center')
            return false;
        }
        let address = this.state.address;
        if (address.length <= 0) {
            msgProvider.toast(validation.emptyAddress[config.language], 'center')
            return false;
        }

        let url = config.baseURL + "add_shiping_add.php";
        var data = new FormData();

        data.append('user_id', this.state.user_id)
        data.append('address', this.state.address)
        data.append('latitude', config.newlatitude)
        data.append("longitude", config.newlongitude)
        data.append("set_default",this.state.setdefault)
        data.append("address_type",this.state.address_type)
        this.setState({ password: '' })
        consolepro.consolelog('test', data)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj);
            if (obj.success == 'true') {
               
                    this.backpress()
                

            } else {
                consolepro.consolelog('obj.active_status', obj.active_status);
                if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                    config.checkUserDeactivate(this.props.navigation)
                } else {
                 
                        this.backpress()
                     
                     }
                return false;
            }
        }).catch(err => {
            consolepro.consolelog('err', err);
        });

    }

    backpress = () => {
        config.newaddress = ''
        this.props.navigation.goBack()
    }
    setdefault1 = () => {
        if (this.state.setdefault == 0) {
            this.setState({ setdefault: 1 })
        } else {
            this.setState({ setdefault: 0 })
        }
    }


    render() {

        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.addmodal}
                    onRequestClose={() => {
                        this.setState({ addmodal: false })
                    }}>

                    <View style={{ flex: 1, backgroundColor: '#00000030', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: '94%', borderRadius: 15, paddingVertical: windowWidth * 3.5 / 100, backgroundColor: Colors.mediabackground, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }} >
                            <TouchableOpacity activeOpacity={0.9} onPress={() => {this.setState({add_type:Lang_chg.txthomechoose[config.language],address_type:0,addmodal:false}) }} style={{ width: '100%', paddingVertical: windowWidth * 1 / 100, borderBottomColor: Colors.border_color, borderBottomWidth: 1 }}>
                                <Text style={{ fontFamily: Font.Poppins_SemiBold, textAlign: 'center', fontSize: windowWidth * 4 / 100, color: Colors.mediatextcolor }}>{Lang_chg.txthomechoose[config.language]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({add_type:Lang_chg.txtofficechoose[config.language],address_type:1,addmodal:false}) }} style={{ width: '100%', paddingVertical: windowWidth * 1 / 100 }}>
                                <Text style={{ fontFamily: Font.Poppins_SemiBold, textAlign: 'center', fontSize: windowWidth * 4 / 100, color: Colors.mediatextcolor }}>{Lang_chg.txtofficechoose[config.language]}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                <TouchableOpacity activeOpacity={0.9} onPress={() => { Keyboard.dismiss() }} style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                    <View style={CSSstyle.notification_header}>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.backpress() }}>
                            <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                        </TouchableOpacity>
                        <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.addaddress[config.language]}</Text>
                        <View >
                            <Text >{'      '}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => { this.setState({ addmodal:true }) }} style={[styles.mainview, { marginTop: windowHeight * 7 / 100 }]}>

                        <View style={{ width: '87%', paddingHorizontal: windowWidth * 1 / 100, alignItems: 'center' }}>
                            <Text style={I18nManager.isRTL == false ? [styles.txtaddtype, { textAlign: 'left' }] : [styles.txtaddtype, { textAlign: 'left' }]}>{this.state.add_type}</Text>
                        </View>
                        <View  style={{ width: '12%', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: windowWidth * 4 / 100, height: windowWidth * 4 / 100, resizeMode: 'contain' }} source={localimag.arrowd}></Image>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Location') }} style={[styles.mainview, { marginTop: windowHeight * 3 / 100 }]}>

                        <View style={{ width: '87%', paddingHorizontal: windowWidth * 3.8 / 100, }}>
                            {this.state.address != "" ? <Text style={I18nManager.isRTL == false ? [styles.txtaddtype1, { textAlign: 'left' }] : [styles.txtaddtype, { textAlign: 'left' }]}>{this.state.address}</Text> :
                                <Text style={I18nManager.isRTL == false ? [styles.txtaddtype1, { textAlign: 'left' }] : [styles.txtaddtype1, { textAlign: 'left' }]}>{Lang_chg.enteraddress[config.language]}</Text>
                            }

                            {/* <TextInput 
                                        value={"" + this.state.address + ""}
                                        onChangeText={(txt) => { this.setState({ address: txt }) }}
                                        keyboardType='default'
                                        
                                       // secureTextEntry={this.state.secureoldpassword}
                                        maxLength={250}
                                        multiline={true}
                                        returnKeyLabel='next'
                                        returnKeyType='next'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={I18nManager.isRTL == false ? [styles.edtstyle,{textAlign:'left'}]:[styles.edtstyle,{textAlign:'right'}]}
                                        
                                        placeholderTextColor={Colors.blackColor} 
                                        placeholder={Lang_chg.enteraddress[config.language]}></TextInput> */}
                        </View>
                        <View onPress={() => { }} style={{ width: '12%', alignItems: 'center', }}>
                            <Image style={CSSstyle.edittxticon} source={localimag.mapicon}></Image>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginTop: windowHeight * 1.5 / 100 }}>
                        <TouchableOpacity onPress={() => { this.setdefault1() }} style={{ width: 22, height: 22, alignSelf: 'center', marginRight: 10 }}>
                            {this.state.setdefault == 1 ? <Image resizeMode="contain" style={{ width: 19, height: 19, }} source={localimag.addselect}></Image> :
                                <Image resizeMode="contain" style={{ width: 19, height: 19, }} source={localimag.addunselect}></Image>}
                        </TouchableOpacity>
                        <Text style={I18nManager.isRTL == false ? [styles.txtaddtype, { textAlign: 'left' }] : [styles.txtaddtype, { textAlign: 'left' }]}>{'Set Default'}</Text>

                    </View>



                    <TouchableOpacity onPress={() => { this.addresssubmit() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 3 / 100, }]}>

                        <Text style={styles.txtlogin}>{Lang_chg.submit[config.language]}</Text>
                    </TouchableOpacity>

                </TouchableOpacity>

            </View>



        )
    }
}



const styles = StyleSheet.create({
    edtstyle: { textAlignVertical: 'top', fontSize: windowWidth * 3.8 / 100, width: '100%', height: windowHeight * 15 / 100, paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },
    txtaddtype: { fontSize: windowWidth * 3.8 / 100, width: '90%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },
    txtaddtype1: { height: windowHeight * 15 / 100, fontSize: windowWidth * 3.8 / 100, width: '90%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },
    txtlogin: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    },
    mainview: { width: '90%', paddingVertical: 10, borderColor: Colors.border_color, borderWidth: 1, flexDirection: 'row', backgroundColor: Colors.whiteColor, alignSelf: 'center', },
});