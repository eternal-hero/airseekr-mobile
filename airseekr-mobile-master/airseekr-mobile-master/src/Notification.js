import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

import FastImage from 'react-native-fast-image'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';

import { SwipeListView } from 'react-native-swipe-list-view';
export default class Notification extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            notification_arr: 'NA',
        }
    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            // this.getvalue()

        });
        this.getvalue()
    }

    getvalue = async () => {
        check_notification_num = 0
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
            this.getnotificationdata()

        }
    }

    getnotificationdata = () => {
        let url = config.baseURL + 'get_notification.php?user_id=' + this.state.user_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog('getnotificationdata', obj);
            if (obj.success == 'true') {
                this.setState({ notification_arr: obj.notification_arr })
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

    delete_confirm_all = () => {


        Alert.alert(
            'Clear Notifications',
            'Are you sure, you want to clear notifications', [{
                text: msgTitle.no[config.language],
                onPress: () => { },
                style: msgTitle.cancel[config.language]
            }, {
                text: msgTitle.yes[config.language],
                onPress: () => this.clearall()
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };

    clearall = async () => {

        let url = config.baseURL + "delete_all_notification.php";

        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let user_id = user_details.user_id

            var data = new FormData();
            data.append('user_id', user_id)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('getnotificationdata', obj);
                if (obj.success == 'true') {
                    this.setState({
                        notification_arr: 'NA',
                    })
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
    }


    deletesingle = async (item, index) => {

        let url = config.baseURL + "delete_single_notification.php";
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let user_id = user_details.user_id
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('notification_id', item.notification_message_id)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('post delete_single_notification', obj)
                if (obj.success == 'true') {
                    let data = this.state.notification_arr
                    data.splice(index, 1)

                    if (data.length == 0) {
                        this.setState({ notification_arr: 'NA' })
                    } else {
                        this.setState({ notification_arr: data })
                    }
                } else {
                    if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                        config.checkUserDeactivate(this.props.navigation)
                    } else {
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    }
                    return false;
                }
            }).catch(err => {
                consolepro.consolelog('err', err)
            });
        }

    }
    //--------------------notification redirection
    redirection = (item) => {

        if (item.action == 'edit_ads') {
            this.props.navigation.navigate('Itemdetail', { ads_id: item.action_id })
        }

        if (item.action == 'reject_offer' || item.action == 'accept_offer' || item.action == 'accept_offer_user' || item.action == 'edit_offer' || item.action == 'send_offer') {
            this.props.navigation.navigate('Accept_reject_offer', { offer_id: item.action_id })
        }


    }


    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.newcolor }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.newcolor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.newcolor} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <ScrollView>

                    <View style={{ flex: 1, backgroundColor: Colors.newcolor, }}>
                        <View style={[CSSstyle.notification_header,{elevation: 2, shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20,}]}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.leftarrow}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, { marginLeft: 4 }]}>{Lang_chg.notification[config.language]}</Text>
                            {this.state.notification_arr != "NA" ? <TouchableOpacity activeOpacity={0.7} onPress={() => { this.delete_confirm_all() }} style={{ alignItems: 'center', justifyContent: 'center' }}  >
                                <Text style={[styles.txtlogin, {}]}>{Lang_chg.clear[config.language]}</Text>
                            </TouchableOpacity> :
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}  >
                                    <Text style={[styles.txtlogin, {}]}>{'             '}</Text>
                                </View>}

                        </View>
                        <View style={styles.other_gift_photo}>
                            {this.state.notification_arr == "NA" &&
                                <Image style={{ alignSelf: 'center', width: '70%', height: windowHeight / 3, marginTop: windowHeight / 4, resizeMode: 'contain' }} source={localimag.nodata}></Image>
                            }



                            {this.state.notification_arr != "NA" &&

                                <SwipeListView
                                    contentContainerStyle={{ paddingBottom:windowHeight*1,backgroundColor:Colors.newcolor  }}
                                    data={this.state.notification_arr}
                                    disableLeftSwipe={true}
                                    renderItem={data => (
                                        <TouchableOpacity activeOpacity={1} onPress={() => { this.redirection(data.item) }} style={{ width: '100%',height:windowHeight*13/100, flexDirection: 'row', backgroundColor: Colors.newcolor1, borderBottomColor: Colors.border_color1, borderBottomWidth: 0,borderTopColor: Colors.border_color1, borderTopWidth: 0, paddingHorizontal: '2%', alignSelf: 'center', marginTop: windowHeight * 1.5 / 100, marginBottom: windowHeight * .2 / 100, paddingVertical: windowHeight*0/100,elevation: 2, shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, }}>
                                            <View style={{ width: '21%', paddingLeft: windowWidth * 5 / 100, marginTop: windowHeight * .5 / 100 }}>
                                                {data.item.action == 'login' ? <FastImage
                                                    source={localimag.splash}

                                                    style={{marginTop:windowHeight*0.8/100, width: windowWidth * 11 / 100, height: windowWidth * 11 / 100, resizeMode: 'cover', borderRadius: windowWidth * 5.5 / 100 }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                /> :
                                                    <FastImage
                                                        source={data.item.image != 'NA' ?
                                                            { uri: config.img_url3 + data.item.image } : localimag.splash}

                                                        style={{marginTop:windowHeight*0.8/100, width: windowWidth * 11 / 100, height: windowWidth * 11 / 100, resizeMode: 'cover', borderRadius: windowWidth * 5.5 / 100 }}
                                                        resizeMode={FastImage.resizeMode.cover}
                                                    />
                                                }
                                            </View>
                                            <View style={{ width: '75%',marginTop:windowHeight*0.8/100 }}>
                                                <View style={{ flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                    <View style={{width:'75%', }}>
                                                       <Text numberOfLines={1} style={styles.txtitem1}>{data.item.name}</Text>
                                                    </View>
                                                    <View style={{ width:'25%'}}>
                                                        <Text style={[styles.txtsmall, { textAlign:'right' }]}>{data.item.createtime}</Text>
                                                   </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 2, width: '100%' }}>

                                                    <Text numberOfLines={3}  style={styles.txtitem2}>{data.item.message}</Text>

                                                </View>
                                            </View>
                                            {/* <View style={{ width: '19%', alignItems: 'flex-end', }}>
                                                <TouchableOpacity onPress={() => { this.deletesingle(item, index) }} style={{ padding: 3 }}>

                                                    <Image style={{ width: windowWidth * 5 / 100, height: windowWidth * 5 / 100, }} source={localimag.crossicon}></Image>
                                                </TouchableOpacity> 


                                               
                                            </View> */}

                                        </TouchableOpacity>
                                    )}
                                    renderHiddenItem={(data, rowMap) => (
                                        <View style={{marginTop: windowHeight * 1.5 / 100,}}>
                                            <TouchableOpacity onPress={() => {this.deletesingle(data.item, data.index)}} style={{backgroundColor:'red', width: windowWidth * 40 / 100, alignItems: 'center', justifyContent: 'center',  alignSelf: 'flex-start',paddingVertical:windowHeight*2/100,height:windowHeight*13/100,  }}>
                                                <Text style={{  alignSelf: 'center',color:Colors.whiteColor }} >{Lang_chg.DELETE[config.language]}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    leftOpenValue={windowWidth * 40 / 100}
                                    rightOpenValue={-windowWidth * 40 / 100}
                                />







                                // this.state.notification_arr.map((item, index) => (


                                //     <TouchableOpacity activeOpacity={0.9} onPress={() => { this.redirection(item)}} style={{ width: '100%', flexDirection: 'row', backgroundColor: Colors.whiteColor, borderBottomColor: Colors.border_color, borderBottomWidth: 2, paddingHorizontal: '2%', alignSelf: 'center', marginTop: windowHeight * 1.5 / 100, marginBottom: windowHeight * .2 / 100, paddingBottom: 3 }}>
                                //         <View style={{ width: '21%', paddingLeft: windowWidth * 5 / 100, marginTop: windowHeight * .5 / 100 }}>
                                //            {item.action == 'login' ? <FastImage
                                //                 source={localimag.splash }

                                //                 style={{ width: windowWidth * 11 / 100, height: windowWidth * 11 / 100, resizeMode: 'cover', borderRadius: windowWidth * 5.5 / 100 }}
                                //                 resizeMode={FastImage.resizeMode.cover}
                                //             />:
                                //             <FastImage
                                //             source={item.image != 'NA' ?
                                //                 {uri:config.img_url3+item.image} :localimag.splash }

                                //             style={{ width: windowWidth * 11 / 100, height: windowWidth * 11 / 100, resizeMode: 'cover', borderRadius: windowWidth * 5.5 / 100 }}
                                //             resizeMode={FastImage.resizeMode.cover}
                                //         />
                                //         }
                                //         </View>
                                //         <View style={{ width: '60%', }}>
                                //             <View style={{}}>
                                //                 <Text numberOfLines={1} style={styles.txtitem1}>{item.name}</Text>
                                //             </View>
                                //             <View style={{ flexDirection: 'row', marginTop: 2, width: '100%' }}>

                                //                 <Text style={styles.txtitem2}>{item.message}</Text>

                                //             </View>
                                //         </View>
                                //         <View style={{ width: '19%', alignItems: 'flex-end', }}>
                                //             <TouchableOpacity onPress={()=>{this.deletesingle(item,index)}} style={{ padding: 3 }}>

                                //                 <Image style={{ width: windowWidth * 5 / 100, height: windowWidth * 5 / 100, }} source={localimag.crossicon}></Image>
                                //             </TouchableOpacity>


                                //             <Text style={[styles.txtsmall, { marginTop: windowHeight * 4 / 100, }]}>{item.createtime}</Text>
                                //         </View>

                                //     </TouchableOpacity>

                                // ))
                            }
                            {/* {this.state.notification_arr != "NA" &&
                            <FlatList
                                data={this.state.notification_arr}
                                horizontal={false}

                                showsHorizontalScrollIndicator={false}
                                inverted={false}
                                renderItem={({ item, index }) => {
                                    return (

                                        <TouchableOpacity activeOpacity={1} onPress={()=>{this.redirection(item) }} style={styles.notification_main_parent}>
                                            <View style={styles.notofication_box}>

                                            <View style={styles.noti_img_profile}>
                                                    {item.image=='NA' ?
                                                    <Image style={styles.noti_employe} source={localimag.splash}></Image>:
                                                    <Image style={styles.noti_employe} source={item.image !='NA'? {uri:config.img_url1+item.image }: localimag.user_profile }></Image>}
                                                </View>

                                                  <View style={styles.noto_txt_detail}>
                                                     <Text numberOfLines={1} style={styles.noti_passage}>{item.name}</Text>
                                                    <Text numberOfLines={2} style={styles.noti_passage1}>{item.message}</Text>
                                                </View>

                                                <View style={styles.notification_cross}>
                                                    <TouchableOpacity style={{alignItems:'flex-end'}} activeOpacity={.7} onPress={() => {this.deletesingle(item,index)  }}>
                                                        <Image resizeMode="contain" style={styles.noti_cross} source={localimag.cross}></Image>

                                                    </TouchableOpacity>

                                                    <Text numberOfLines={1} style={styles.noti_time}>{item.createtime}</Text>
                                                </View>

                                              

                                               

                                            </View>
                                        </TouchableOpacity>

                                    )
                                }}
                                keyExtractor={(index) => { index.toString() }}
                            />
                        } */}
                        </View>





                    </View>
                </ScrollView>
            </View>



        )
    }
}



const styles = StyleSheet.create({
    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1, alignSelf: 'center',
    },
    txtitem1: {
         width: '100%', fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtitem2: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1,
    },
    txtsmall: {
        fontSize: windowWidth * 2.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1,
    },
    other_gift_photo: {
        backgroundColor:Colors.newcolor,
        paddingBottom: 20,
    },


});