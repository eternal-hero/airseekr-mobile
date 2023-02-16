import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView, ViewBase } from 'react-native'
import { config, Otpprovider,notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import { color } from 'react-native-reanimated';
import {WebView} from 'react-native-webview'
export default class Offerpaymentaccept extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id:'',
            paymenturl:this.props.route.params.paymenturl,
            offer_data:this.props.route.params.offer_data,
            transaction_id:'',
            showmodal2:false,
            count:0

        }

    }
    componentDidMount() {
        consolepro.consolelog('offer_data', this.state.offer_data)
        this.props.navigation.addListener('focus', () => {
        });
        this.getvalue()
    }
//-------------------get user value from local database----------------//
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
           if (config.guest_status==true && config.device_type=='ios'){
               let result = Math.random().toString(36).substring(2,7);
                   this.acceptoffer(result)
            }
        }
    }
    backpress = () => {
        this.props.navigation.goBack()
    }
    _onNavigationStateChange(webViewState) {
        consolepro.consolelog('webViewState=', webViewState)
        if (webViewState.loading == false) {
            var t = webViewState.url.split('/').pop().split('?')[0]
           
            if (typeof (t) != null) {
                if(t== "payment_success_final.php"){
                    var q = webViewState.url.split('=').pop().split('&')
                    if (typeof (q) != null) {
                        let paymentid=q[0]
                        consolepro.consolelog('payment_id=', paymentid) 
                        this.acceptoffer(paymentid)
                     //  this.setState({transaction_id:paymentid,showmodal2:true})
                       
                    }
                }else if(t== "payment_cancel.php"){
                    msgProvider.toast(Lang_chg.paymentcancel[config.language], 'center')
                    this.backpress()
                }
            }
        }
    }

    acceptoffer=async(paymentid)=>{
        let user_details = await localStorage.getItemObject('user_arr');
       
        if(this.state.count==0 && user_details != null){
            let user_id= user_details.user_id;
            this.setState({count:1})
            let url = config.baseURL + "accept_offer.php";
            let newdata=this.state.offer_data
            newdata.append('transaction_id',paymentid)
            consolepro.consolelog('newdata', newdata)
            apifuntion.postApi(url,newdata ).then((obj) => {
                consolepro.consolelog('test111', obj)
                if (obj.success == 'true') {
                    if(obj.notification_arr !='NA'){
                        notification.notification_arr(obj.notification_arr)
                    }
                    homerefresh=true
           
                    setTimeout(() => {
                               this.setState({transaction_id:paymentid,showmodal2:true})  
                    }, 600);
                } else {
                    if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                        config.checkUserDeactivate(this.props.navigation)
                    } else {
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    }
                    return false;
                }
            }).catch(err => {
                consolepro.consolelog('err11', err);
            });

        }
        }
    

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />


                
                <Modal transparent
                        visible={this.state.showmodal2}
                    >
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={styles.modelview}>
                                <View style={{ width: '80%', borderRadius: 15, backgroundColor: 'white', padding: 20 }}>
                                    <View style={{ width: '100%', flexDirection: 'row', marginTop: 5}}>

                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 18, color: 'black', fontFamily: Font.Poppins_Bold }}>{"Payment Success"}</Text>

                                        </View>

                                    </View>
                                    <Text style={{ fontFamily: Font.Poppins_Regular, fontSize: 14, color: Colors.gray_color, marginTop: 10, textAlign: 'center' }}>
                                       {"Transaction id : "+this.state.transaction_id}
                                    </Text>
                                  
                                    <Text style={{fontFamily: Font.Poppins_Regular, paddingBottom: 20, fontSize: 14, color: Colors.gray_color, marginTop: 5, textAlign: 'center' }}>
                                    {'Date : '+new Date().toLocaleString()+''}
                                    </Text>

                                    <TouchableOpacity  onPress={()=>{this.setState({showmodal2:false});  this.props.navigation.goBack()}} style={{backgroundColor:'green',width:'30%',alignSelf:'center',padding:10, borderRadius: 8}}>
                                    <Text style={{fontFamily:Font.Poppins_Bold,  fontSize: 15, color: Colors.white_color,  textAlign: 'center' }}>
                                       {"Ok"}
                                    </Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </SafeAreaView>

                    </Modal>
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                  <KeyboardAvoidingView style={{ flex: 1, }}
                    behavior={Platform.OS === "ios" ? "padding" : null}>
                    <ScrollView >
                        <View style={{ backgroundColor: Colors.whiteColor, paddingBottom: windowHeight * 1 / 100 }}>

                            <View style={[CSSstyle.notification_header,{}]}>
                                <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                    <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                                </TouchableOpacity>
                                <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.paymentprocess[config.language]}</Text>
                                <View >
                                    <Text >{'      '}</Text>
                                </View>
                            </View>
                            {(config.guest_status==true && config.device_type=='ios') ?
                             <View style={{width:'100%',height:windowHeight*89/100,}}>
                               
                             </View>:
                             <View style={{width:'100%',height:windowHeight*89/100,}}>
                                    <WebView
                                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                                    source={{uri: this.state.paymenturl}}
                                    style={{marginTop: 0}}
                                />
                                </View>
                                
                                }
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>




            </View>
        )
    }
}



const styles = StyleSheet.create({

    modelview: {
        height: '100%',
        width: '100%',
        backgroundColor: '#00000090',
        justifyContent: 'center',
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },

    viewstyle: { marginTop: windowHeight * 2 / 100, width: '100%', paddingVertical: windowHeight * 1.5 / 100, flexDirection: 'row', borderBottomColor: 'red', borderBottomWidth: .5, alignSelf: 'center', justifyContent: 'center', },
    iconview: { width: '9%', justifyContent: 'center', alignItems: 'center' },

    icon: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 6 / 100,
        resizeMode: 'contain'
    },
    txteditemail: { fontSize: windowWidth * 3.5 / 100, width: '90%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },

    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },


});
