import React, { Component } from 'react'
import { Switch,Linking, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Setting extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id:'',
            logintype:'app',
            notification:true,
            user_roll:0,
            bank:false
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
            user_id:user_details.user_id,
            logintype:user_details.login_type,
            user_roll:user_details.user_roll
          })
          if (user_details.notification_status == 0) {
            this.setState({ notification: false })
        }

        if(user_details.bankdetail!='NA'){
            this.setState({ bank: true })
        }
            if(config.content_arr == "NA"){
                this.getallcontent()
            }


        }
      }
      getallcontent=()=>{

        consolepro.consolelog('getallcontent')
        let url = config.baseURL+'get_all_content.php?Submit=Submit'
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('obj.content_arr', obj.content_arr);
                config.content_arr=obj.content_arr;
                if(config.device_type=='ios'){
                    config.guest_status=obj.guest_status;
                }else{
                    config.guest_status =false
                }

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

    languagechange=async()=>{
        return false
        Lang_chg.language_set()
    }



    shareapp=()=>{

        let url='NA'
        if(config.content_arr[6].content[0]!=null){
            url=config.content_arr[6].content[0]
        }
            mediaprovider.sharedata('Share',url,'Airseekr app','');

    }

    rateapp=()=>{

        if(Platform.OS=='ios'){
            if(config.content_arr[5].content[0]!=null){
                Linking.openURL(config.content_arr[5].content[0])
            }else{
                Linking.openURL('https://www.apple.com/in/app-store/')
            }

        }else{
            if(config.content_arr[4].content[0]!=null){

                Linking.openURL(config.content_arr[4].content[0])
            }else{
                Linking.openURL('https://play.google.com/store')
            }

        }

    }
    updatenotification=async(txt)=>{

            this.setState({notification:!this.state.notification})
            let notificationst=0
            if(txt==true){
                notificationst=1
            }
            let user_details = await localStorage.getItemObject('user_arr');
            consolepro.consolelog('user_details', user_details)
            if (user_details != null) {
                let user_id=user_details.user_id;
                    let url = config.baseURL + "notification_update.php?user_id="+user_id+'&notification_status='+notificationst;
                    apifuntion.getApi(url).then((obj) => {
                        consolepro.consolelog('notification_update_obj', obj)
                        if (obj.success == 'true') {
                            localStorage.setItemObject('user_arr',obj.user_details);
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


    }

    logout=()=>{
        Alert.alert(
            'Logout',
           'Are you sure, you want to logout?', [{
                text: msgTitle.no[config.language],
                onPress: () => {},
                style: msgTitle.cancel[config.language]
            }, {
                text: msgTitle.yes[config.language],
                onPress: () => config.AppLogout(this.props.navigation)
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;

    }

    render() {

        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <ScrollView style={{  }} >
                    <View style={CSSstyle.notification_header}>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.navigate("Homepage") }}>
                            <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                        </TouchableOpacity>
                        <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.setting[config.language]}</Text>
                        <View >
                            <Text ></Text>
                        </View>
                    </View>

                    <Text style={styles.settintxt}>{Lang_chg.account[config.language]}</Text>
                    <TouchableOpacity onPress={()=>{user_address='';   this.props.navigation.navigate('Editprofile')}} activeOpacity={0.7} style={[styles.itemview,{marginTop:5,}]}>
                        <View style={{width:'70%', flexDirection:'row'}}>
                             <View style={{width:'17%',justifyContent:'center'}}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.notificationicon}></Image>
                              </View>
                              <View style={{width:'83%',paddingVertical:10}}>
                                    <Text style={styles.settintxt1}>{Lang_chg.pushnotification[config.language]}</Text>
                              </View>
                        </View>
                        <View style={{width:'30%', flexDirection:'row',justifyContent:'flex-end'}}>
                        <Switch style={styles.push_onof} trackColor={{ false: Colors.black_color, true:Colors.theme_color1 }}
                                                thumbColor={Colors.whiteColor} ios_backgroundColor={Colors.whiteColor}
                                                onValueChange={(txt) => {  this.updatenotification(txt)
                                                 }} value={this.state.notification}
                                            />
                        </View>


                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Editprofile')}} activeOpacity={0.7} style={[styles.itemview,{marginTop:5}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.settingprofileicon}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.editprofile[config.language]}</Text>
                              </View>

                    </TouchableOpacity>
                   {this.state.user_roll==1 && <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Editidverification')}} activeOpacity={0.7} style={[styles.itemview,{marginTop:5}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.editidverification}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.editidverfication[config.language]}</Text>
                              </View>

                    </TouchableOpacity>}

                    {/*{this.state.user_roll==1 && <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Paypalverification')}} activeOpacity={0.7} style={[styles.itemview,{marginTop:5}]}>*/}
                    {/*    <View style={styles.itemimage}>*/}
                    {/*        <Image  style={[CSSstyle.icons,{}]} source={localimag.editidverification}></Image>*/}
                    {/*    </View>*/}
                    {/*    <View style={styles.itemtxtview}>*/}
                    {/*        <Text style={styles.settintxt1}>Paypal</Text>*/}
                    {/*    </View>*/}

                    {/*</TouchableOpacity>}*/}

                    {this.state.user_roll==1 && config.guest_status==false && <View>
                   { this.state.bank==false ? <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Addbank',{redirect:'setting'})}} activeOpacity={0.7} style={[styles.itemview,{marginTop:5}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.bankbuilding}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.addbank[config.language]}</Text>
                              </View>

                    </TouchableOpacity>:
                     <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Editbank')}} activeOpacity={0.7} style={[styles.itemview,{marginTop:5}]}>
                     <View style={styles.itemimage}>
                         <Image  style={[CSSstyle.icons,{}]} source={localimag.bankbuilding}></Image>
                     </View>
                     <View style={styles.itemtxtview}>
                           <Text style={styles.settintxt1}>{Lang_chg.editbank[config.language]}</Text>
                     </View>

           </TouchableOpacity>}
           </View>}

                  {this.state.logintype=='app' &&  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Changepassword')}} activeOpacity={0.7}style={[styles.itemview,{marginTop:0}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.passwordicon}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.changepassword[config.language]}</Text>
                              </View>

                    </TouchableOpacity>
                    }

                     <View style={{width:'100%',height:2,marginBottom:windowHeight*1/100, backgroundColor:Colors.border_color,marginTop:5}}></View>
                    <Text style={[styles.settintxt,{marginTop:5}]}>{Lang_chg.support[config.language]}</Text>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Termsconditions') }} activeOpacity={0.7} style={[styles.itemview,{}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.termsconditionsicon}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.termcondition11[config.language]}</Text>
                              </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Privacypolicy')}} activeOpacity={0.7} style={[styles.itemview,{}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.privacypolicyicon}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.privacypolicy1[config.language]}</Text>
                              </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Aboutus')}} activeOpacity={0.7} style={[styles.itemview,{}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.aboutus}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.aboutus[config.language]}</Text>
                              </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Contactus')}} activeOpacity={0.7} style={[styles.itemview,{}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.contacticon}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.constactus[config.language]}</Text>
                              </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.shareapp()}} activeOpacity={0.7} style={[styles.itemview,{}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.shareicon}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.shareapp[config.language]}</Text>
                              </View>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.rateapp()}} activeOpacity={0.7} style={[styles.itemview,{}]}>
                              <View style={styles.itemimage}>
                                  <Image  style={[CSSstyle.icons,{}]} source={localimag.rateappicon}></Image>
                              </View>
                              <View style={styles.itemtxtview}>
                                    <Text style={styles.settintxt1}>{Lang_chg.rateapp[config.language]}</Text>
                              </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { this.logout() }} style={ {flexDirection:'row',borderRadius:windowWidth*10/100, width:'90%',paddingVertical:10,backgroundColor:Colors.logoutbgcolor,alignSelf:'center',justifyContent:'center',marginTop: windowHeight * 6 / 100,marginBottom:10 }}>
                    <Image  style={[{ width:windowWidth*5/100, height:windowWidth*5/100,resizeMode: 'contain',alignSelf:'center',marginRight:8}]} source={localimag.logouticon}></Image>
                        <Text style={styles.txtlogin}>{Lang_chg.logout[config.language]}</Text>
                    </TouchableOpacity>
                </ScrollView>
                </View>

            </View>



        )
    }
}



const styles = StyleSheet.create({
   settintxt:{marginLeft:'16%', fontSize:windowWidth*3.8/100,fontFamily:Font.Poppins_SemiBold,color:Colors.border_color1,marginHorizontal:windowWidth*5/100,marginTop:windowHeight*2/100},
   settintxt1:{fontSize:windowWidth*3.8/100,fontFamily:Font.Poppins_Regular,color:Colors.blackColor,},
itemview:{width:'90%',flexDirection:'row',justifyContent:'center',paddingVertical:3,alignSelf:'center'},
itemimage:{width:'12%',justifyContent:'center'},
itemtxtview:{width:'88%',paddingVertical:10},
txtlogin:{
    fontSize:windowWidth*4/100,fontFamily:Font.Poppins_SemiBold,color:Colors.red_color,alignSelf:'center'
},


});
