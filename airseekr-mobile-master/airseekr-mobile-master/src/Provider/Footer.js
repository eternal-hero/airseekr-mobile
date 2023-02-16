import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Text, View, Image, TextInput, StyleSheet, ScrollView, Switch, Modal, TouchableOpacity, Dimensions, Alert, FlatList, BackHandler } from 'react-native';
// import Styles from '../Provider/Coustomstyle'
// import Loader from './Loader';

import { localimag } from '../Provider/Localimage';
// import {firebaseprovider}  from './providers/FirebaseProvider';
import { localStorage, msgProvider, config, msgText, msgTitle, Colors, Font, mobileH, mobileW,  } from './utilslib/Utils';
let navigation = '';
let userid =0;
export default class Footer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            color: '',
            modalVisible1: false,
            loading: false,
            isConnected: true,
            userimage: ''
        }

    }

    // usercheckbtn = async (page) => {

    //     this.props.functionremove
    //     const navigation = this.props.navigation;
    //     let userdata = await localStorage.getItemObject('user_arr')
    //     console.log('userdata', userdata)
    //     if (userdata == null) {

    //         if (this.props.usertype == 1) {
    //             navigation.navigate(page)
    //         }
    //         else {
    //             if (userdata.profile_complete == 0 && userdata.otp_verify == 1) {
    //                 for (let i = 0; i < this.props.footerpage.length; i++) {
    //                     if (page == this.props.footerpage[i].name) {
    //                         navigation.navigate(page)
    //                     }
    //                 }
    //             }
    //             else {
    //                 this.setState({ modalVisible1: true })
    //             }
    //         }
    //     } else {
    //         this.setState({ modalVisible1: true })
    //     }
    // }
    Checkuser = () => {

        Alert.alert(
            'Confirm',
            'Please first login',
            [
                {
                    text: msgTitle.cancel[0],
                },
                {
                    text: msgTitle.ok[0],
                    // onPress: () =>  this.btnPageLoginCall(),
                    onPress: async () => {
                        await localStorage.setItemObject('skip_status','no');
                        navigation.navigate('Login') }
                },
            ],
            { cancelable: false },
        );
    }

    //  checklimitpost=async()=>{
    //     let userdata=await localStorage.getItemObject('user_arr')
    //    console.log('userada',userdata)
    //     let user_id=0
    //     selleraddress1='NA'
    //     if(userdata!=null)
    //       {
    //         user_id=userdata.user_id
    //       }
    //  if(this.state.isConnected===true)
    //     {
    //         this.setState({loading:true})
    //      var url = config.baseURL+'post_limit.php?user_id='+user_id+'&action=today_post'
    //      console.log("url:"+url);


    //      fetch(url,{
    //         method: 'Get',
    //         headers: new Headers(config.headersapi),

    //         }).then((obj)=>{ console.log('obj',obj); this.setState({loading:false,refresh:false});    return  obj.json();}).then((obj)=>{
    //      console.log('obj',obj)
    //          if(obj.success == 'true'){
    //          if(obj.today_limit!="no")
    //          {
    //             this.props.navigation.navigate('AddPost')
    //          }
    //          else{
    //              msgProvider.toast(Languageprovider.Your_limit_for_adding_posts[language_key],"center")
    //          }



    //           }

    //           else{
    //             msgProvider.alert(msgTitle.error[config.language], obj.msg[config.language], false);
    //             if(obj.active_status=="deactivate")
    //             {
    //              this.props.navigation.navigate('Logout')
    //             }

    //             return false;
    //        }
    //      }).catch((error)=> {
    //        console.log("-------- error ------- "+error);
    //        msgProvider.alert(msgTitle.server[config.language],msgText.servermessage[config.language], false);
    //          this.setState({loading: false,refresh:false});
    //    });
    //   }
    //   else{
    //      msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
    //    }
    //     }
    myads=()=>{
        if(userid==0){
            this.Checkuser()
        }else{
            navigation.navigate('Myads')
        }
    }
    newpost= async ()=>{
        if(userid === 0){
            this.Checkuser()
        }else{
            let userdata= await localStorage.getItemObject('user_arr')
            if (userdata?.user_roll === 0) {
                category_id='';
                navigation.navigate('Newpost')
            } else if (userdata?.user_roll === 1) {
                navigation.navigate('SalePost')
            }

        }
    }
    inbox=()=>{
        if(userid==0){
            this.Checkuser()
        }else{
            navigation.navigate('Inbox')
        }
    }
    profile=()=>{
        if(userid==0){
            this.Checkuser()
        }else{
            navigation.navigate('Profile')
        }
    }
    render() {
        // console.log('foter page count_inbox',count_inbox)
        console.log('this.props.page', this.props.page + '/n')
         navigation = this.props.navigation;
        userid = this.props.user_id;
        return (
            <ImageBackground resizeMode={'stretch'} source={localimag.footerimage} style={{ width: '100%', position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center', height: mobileH * 9 / 100 }}>
                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center',  alignItems: 'center', height: mobileH * 8 / 100, justifyContent: 'center' }}>
                    <TouchableOpacity style={Styles.footericoncontainer} onPress={() => { this.props.navigation.navigate('HomeTicket') }}>
                        {this.props.page == 'home' ? <View style={Styles.imageview}>
                            <Image source={require('../icons/homeactive.png')} style={Styles.footerimage} />
                            {/* <Text style={Styles.txthead}>Home</Text> */}
                        </View> :
                            <View style={Styles.imageview}>
                                <Image source={require('../icons/deactivatehomeicon.png')} style={Styles.footerimage} />
                                {/* <Text style={Styles.txthead1}>Home</Text> */}
                            </View>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.footericoncontainer} onPress={() => { this.myads() }}>
                    {this.props.page=='myads'?
                        <View style={Styles.imageview}>
                            <Image source={require('../icons/myadsactaive.png')} style={Styles.footerimage} />
                            {/* <Text style={Styles.txthead}>My Ads</Text> */}
                        </View>:
                        <View style={Styles.imageview}>
                        <Image source={require('../icons/addsicon.png')} style={Styles.footerimage} />
                        {/* <Text style={Styles.txthead1}>My Ads</Text> */}
                    </View>}
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.footericoncontainer} onPress={() => {this.newpost() }}>
                        <View style={[Styles.imageview, { position: 'absolute', top: -mobileH * 0 / 100 }]}>
                            <Image source={require('../icons/posticon.png')} style={Styles.footerimageaddbotton} />
                            {/* <Text style={{marginTop: -1, fontSize: mobileW * 2.7 / 100, color: Colors.lightfontcolor, fontFamily: Font.Poppins_Regular }}>Post an ad</Text> */}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.footericoncontainer} onPress={() => { this.inbox() }}>
                    {this.props.page=='chat'?   <View style={Styles.imageview}>
                            <ImageBackground source={require('../icons/chatactive.png')} style={Styles.footerimage}  resizeMode= {'contain'} >
                            {this.props.chatcount >0 &&<View style={{alignSelf:'flex-end',  backgroundColor:Colors.whiteColor,width:mobileW*2/100,height:mobileW*2/100,borderRadius:mobileW*1/100}}>
                             </View>}
                             </ImageBackground>
                            {/* <Text style={Styles.txthead}>Chat</Text> */}
                        </View>:
                        <View style={Styles.imageview}>
                        <ImageBackground source={require('../icons/chaticon22.png')} style={Styles.footerimage}  resizeMode= {'contain'}
                         >
                              {this.props.chatcount >0 && <View style={{alignSelf:'flex-end',  backgroundColor:Colors.whiteColor,width:mobileW*2/100,height:mobileW*2/100,borderRadius:mobileW*1/100}}>
                             </View>}
                             </ImageBackground>
                        {/* <Text style={Styles.txthead1}>Chat</Text> */}
                    </View>}
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.footericoncontainer} onPress={() => { this.profile() }}>
                    {this.props.page=='profile'? <View style={Styles.imageview}>
                            <Image source={require('../icons/profileacative.png')} style={Styles.footerimage} />
                            {/* <Text style={Styles.txthead}>Profile</Text> */}
                        </View>:
                         <View style={Styles.imageview}>
                         <Image source={require('../icons/profileicon.png')} style={Styles.footerimage} />
                         {/* <Text style={Styles.txthead1}>Profile</Text> */}
                     </View>}
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}
const Styles = StyleSheet.create({
    txthead1: { marginTop: 3, fontSize: mobileW * 2.7 / 100, color: Colors.lightfontcolor, fontFamily: Font.Poppins_Regular },
    txthead: { marginTop: 3, fontSize: mobileW * 2.7 / 100, color: Colors.whiteColor, fontFamily: Font.Poppins_Regular },
    footericoncontainer: {
        width: '21%', height: mobileH * 7 / 100, alignItems: 'center', justifyContent: 'center'
    },
    imageview: {
        width: '100%', alignItems: 'center', justifyContent: 'center',
    },
    footerimage: {
        width: mobileW *5 / 100, height: mobileW * 5 / 100, resizeMode: 'contain',
    },
    footerimageaddbotton: {
        width: mobileW * 13 / 100, height: mobileW * 13 / 100, resizeMode: 'contain'
    }
})
