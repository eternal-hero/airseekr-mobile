import React, { Component } from 'react'
import { I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, handleback, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import { localimag } from './Provider/Localimage';
import {WebView} from 'react-native-webview'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Paymentproccess extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id:'',
            paymenturl:this.props.route.params.paymenturl,
            data:this.props.route.params.data,
            count:0
        }
    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
            consolepro.consolelog('paymenturl=', this.state.paymenturl)
            consolepro.consolelog('data=', this.state.data)
         });
    }
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            this.setState({ user_id: user_details.user_id })
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
                    var q = webViewState.url.split('=')
                    if (typeof (q) != null) {
                        let paymentid=q[1]
                        consolepro.consolelog('payment_id=', paymentid) 
                       this.adduser(paymentid)
                       
                    }
                }
            }
        }


        // if (webViewState.loading == true){
        //     //////------------------------loading on proccess time-------------------------//
        //     var txt = webViewState.title.split('//').pop().split('/')[0]
        //      consolepro.consolelog('txt=',txt)
        //     if (typeof (txt) != null) {
        //         if(txt== "mtf.gateway.mastercard.com" ){
        //             if(mscount==1){
        //                 consolepro.consolelog('loadingtrue=')
        //                 global.props.showLoader();
        //             }
        //             mscount=mscount+1
        //             consolepro.consolelog('mscount=',mscount)
                    
        //         }
        //     }

        // }
    }
    adduser=async(paymentid)=>{
       
            let user_details = await localStorage.getItemObject('user_arr');
      
            
            if(this.state.count==0 && user_details != null){
               
                this.setState({count:1})
                let url = config.baseURL + "place_order.php";
                let newdata=this.state.data
                newdata.append('paymentid',paymentid)
                
                consolepro.consolelog('newdata=', newdata) 
               
        apifuntion.postApi(url,newdata).then((obj) => {
         
          if (obj.success == 'true') {
            consolepro.consolelog('obj=', obj) 
            orderid=obj.order_no;
                    if(obj.notification_arr !='NA'){
                notification.notification_arr(obj.notification_arr)
              }
            transactionid=paymentid
            this.props.navigation.navigate('Congratulations')
        
          } else {
            if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
              usernotfound.loginFirst(this.props, obj.msg[config.language])
            } else {
               
                this.backpress()
            }
            return false;
          }
        }).catch(err => {
          consolepro.consolelog('err', err)
        });
             
    }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.homebg, }}>
            <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
            <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                networkActivityIndicatorVisible={true} />

          
                <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                    <View style={CSSstyle.notification_header}>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                            <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                        </TouchableOpacity>
                         <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtpaymentprocessing[config.language]}</Text>
                        <View style={{}}>
                                    <Text>{'      '}</Text>
                        </View>
                    </View>
                    <View style={{width:'95%',alignSelf:'center', alignItems:'center',height:'5%',justifyContent:'center'}}>
                    <Text style={styles.txtitem2}>{Lang_chg.txtpaymentpr[config.language]}</Text> 
                    </View>

                    <View style={{width:'100%',height:'90%'}}>
                        <WebView
                                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                                    source={{uri: this.state.paymenturl}}
                                    style={{marginTop: 0}}
                                />
                                </View>
                </View>
           

        </View>
        )
    }
}

const styles = StyleSheet.create({
   
    txtitem2: {
        textAlign:config.textalign, fontSize: windowWidth * 2.7 / 100, fontFamily: Font.Poppins_Bold, color: Colors.blackColor, 
    },
})


