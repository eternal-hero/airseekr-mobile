import React, { Component } from 'react'
import { I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Chooseaddress extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            address_arr: 'NA',
            mediamodal: false,
            currentindex: 0
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
            this.getaddress()

        }
    }

    getaddress = () => {

        let url = config.baseURL + 'get_address.php?user_id=' + this.state.user_id
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('obj.content_arr', obj);
                this.setState({ address_arr: obj.address_arr })
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

    changeaddress = (index) => {
        let data = this.state.address_arr
        for (let i = 0; i < data.length; i++) {
            data[i].status_default = 0
        }
        data[index].status_default = 1
        // user_address = data[index].address
        // user_address_id = data[index].user_address_id
        // user_address_lat = data[index].latitude
        // user_address_long = data[index].longitude
        this.setState({ address_arr: data })
    }

    setcurrent=()=>{
        let data = this.state.address_arr
        for (let i = 0; i < data.length; i++) {
            if(data[i].status_default == 1){
                user_address = data[i].address
                user_address_id = data[i].user_address_id
                user_address_lat = data[i].latitude
                user_address_long = data[i].longitude
            }
        }
        if(user_address==''){
            msgProvider.toast(validation.emptylocation[config.language], 'center')
            return false;
        }else{
            this.props.navigation.goBack()
        }
        
       
        
    }


    editaddress = () => {
        this.setState({ mediamodal: false })
        let arr = this.state.address_arr[this.state.currentindex]
        consolepro.consolelog('arr', arr);
        config.newaddress = arr.address;
        config.newlatitude = arr.latitude;
        config.newlongitude = arr.longitude;
        this.props.navigation.navigate('Editaddress', { addressdata: arr })
    }

    deleteconfirm = () => {
        this.setState({ mediamodal: false })
        Alert.alert(
            msgTitle.alert[config.language],
            Lang_chg.msgConfirmTextdelete[config.language],
            [
                {
                    text: msgTitle.cancel[config.language],
                },
                {
                    text: msgTitle.ok[config.language],
                    onPress: () => this.deleteaddress(),
                },
            ],
            { cancelable: false },
        );
    }

    deleteaddress = () => {

        let arr = this.state.address_arr[this.state.currentindex]
        consolepro.consolelog('arr', arr)
        this.setState({ mediamodal: false })
        let url = config.baseURL + "edit_remove_address.php";
        var data = new FormData();
        data.append('user_id', this.state.user_id)
        data.append('address', arr.address)
        data.append('latitude', arr.latitude)
        data.append("longitude", arr.newlongitude)
        data.append("set_default", arr.setdefault)
        data.append("address_type", arr.address_type)
        data.append("address_id", arr.user_address_id)
        data.append("type", 'delete')
        consolepro.consolelog('test', data)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj);
            if (obj.success == 'true') {
                user_address = ''
                user_address_id = ''
                user_address_lat = ''
                user_address_long = ''
                let data = this.state.address_arr
                data.splice(this.state.currentindex, 1)
                if (data.length > 0) {
                    this.setState({ address_arr: data })
                } else {
                    this.setState({ address_arr: 'NA' })
                }

            } else {
                consolepro.consolelog('obj.active_status', obj.active_status);
                if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
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


    render() {

        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.mediamodal}
                    onRequestClose={() => {
                        this.setState({ mediamodal: false })
                    }}>

                    <View style={{ flex: 1, backgroundColor: '#00000030', alignItems: 'center' }}>
                        <View style={{ position: 'absolute', bottom: 2, width: windowWidth, }}>
                            <View style={{ alignSelf: 'center', width: '100%', }}>
                                <TouchableOpacity style={{ width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }} activeOpacity={0.9} onPress={() => { this.editaddress() }}>
                                    <View style={{ width: '94%', backgroundColor: Colors.mediabackground, borderRadius: 15, paddingVertical: windowWidth * 3.5 / 100 }}>
                                        <Text style={{ fontFamily: Font.Poppins_SemiBold, textAlign: 'center', fontSize: windowWidth * 4 / 100, color: Colors.mediatextcolor }}>{Lang_chg.Mediaedit[config.language]}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: '100%', alignSelf: 'center', marginTop: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.deleteconfirm() }}>
                                    <View style={{ width: '94%', backgroundColor: Colors.mediabackground, borderRadius: 15, paddingVertical: windowWidth * 3.5 / 100 }}>
                                        <Text style={{ fontFamily: Font.Poppins_SemiBold, textAlign: 'center', fontSize: windowWidth * 4 / 100, color: Colors.mediatextcolor }}>{Lang_chg.Mediadelete[config.language]}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 15, alignSelf: 'center', borderRadius: 15, backgroundColor: Colors.mediabackground, width: '94%', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => { this.setState({ mediamodal: false }) }} style={{ alignSelf: 'center', width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: windowWidth * 3.5 / 100 }}>
                                    <Text style={{ fontFamily: Font.Poppins_SemiBold, fontSize: windowWidth * 4 / 100, color: 'red' }}>{Lang_chg.cancelmedia[config.language]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>




                <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                    <View style={CSSstyle.notification_header}>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                            <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                        </TouchableOpacity>
                        <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.chooseaddress[config.language]}</Text>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.navigate('Addaddress') }}>
                            <Image resizeMode="contain" style={CSSstyle.icons} source={localimag.addadres}></Image>
                        </TouchableOpacity>
                    </View>


                    <View style={{ width: '100%', alignItems: 'center', paddingBottom: windowHeight * 12 / 100 }}>

                        {this.state.address_arr == "NA" &&

                            <Image style={{ width: '70%', height: windowHeight / 3, marginTop: windowHeight / 4, resizeMode: 'contain' }} source={localimag.nodata}></Image>
                        }

                        {this.state.address_arr != "NA" &&
                            <FlatList
                                data={this.state.address_arr}
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                inverted={false}
                                renderItem={({ item, index }) => {
                                    return (

                                        <View style={[styles.mainview, { marginTop: windowHeight * 3 / 100, borderBottomWidth: 1, borderBottomColor: Colors.border_color, }]}>
                                            <View style={{
                                                width: windowWidth * 10 / 100, alignItems: 'center', paddingTop: 5
                                            }}>
                                                {item.status_default == 0 ?
                                                    <TouchableOpacity onPress={() => { this.changeaddress(index) }}>
                                                        <Image style={{ width: windowWidth * 6 / 100, height: windowWidth * 6 / 100, resizeMode: 'contain' }} source={localimag.addres_unselect}></Image>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity onPress={() => { this.changeaddress(index) }}>
                                                        <Image style={{ width: windowWidth * 6 / 100, height: windowWidth * 6 / 100, resizeMode: 'contain' }} source={localimag.addres_select}></Image>
                                                    </TouchableOpacity>}
                                            </View>
                                            <View style={{ width: windowWidth * 70 / 100, marginHorizontal: 3, }}>
                                                <Text style={I18nManager.isRTL == false ? [styles.txthome, { textAlign: 'left' }] : [styles.txthome, { textAlign: 'left' }]} >{item.address_type_name}</Text>
                                                <Text style={I18nManager.isRTL == false ? [styles.txthome1, { textAlign: 'left' }] : [styles.txthome1, { textAlign: 'left' }]} >{item.address}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => { this.setState({ currentindex: index, mediamodal: true }) }} style={{ width: windowWidth * 10 / 100, alignItems: 'center', marginTop: 5 }}>
                                                <Image style={CSSstyle.edittxticon} source={localimag.more}></Image>
                                            </TouchableOpacity>
                                        </View>
                                    )

                                }}
                                keyExtractor={(index) => { index.toString() }}
                            />
                        }
                    </View>
                </View>
                <HideWithKeyboard>
                {this.state.address_arr != "NA" &&  <View style={{ width: '100%', backgroundColor: Colors.theme_color1 }}>
                    <TouchableOpacity onPress={() => { this.setcurrent() }} style={[CSSstyle.mainbutton, {}]}>

                        <Text style={styles.txtlogin11}>{Lang_chg.txtsetcurrent[config.language]}</Text>
                    </TouchableOpacity>
                </View>}
                </HideWithKeyboard>

            </View>



        )
    }
}



const styles = StyleSheet.create({
    txtlogin11: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    },
    txthome1: { fontSize: windowWidth * 3.7 / 100, width: '100%', fontFamily: Font.Poppins_Regular, color: Colors.blackColor },
    txthome: { fontSize: windowWidth * 4.2 / 100, width: '100%', fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor },
    txtlogin: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.whiteColor, alignSelf: 'center'
    },
    mainview: { width: windowWidth * 90 / 100, paddingVertical: 10, flexDirection: 'row', backgroundColor: Colors.whiteColor, alignSelf: 'center', },
});