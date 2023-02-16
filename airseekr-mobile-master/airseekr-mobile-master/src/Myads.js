import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import Footer from './Provider/Footer';
import Carousel from 'react-native-banner-carousel';
import CountDown from 'react-native-countdown-component';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import { color } from 'react-native-reanimated';
export default class Myads extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            item_arr: 'NA',

            product_detail: 'NA',
            product_id: 'NA',
            myads_arr: 'NA',
            myfavourite_arr: 'NA',
            modalReport: false,
            activeindex: 0

        }

    }
    componentDidMount() {
        consolepro.consolelog('product_id', this.state.product_id)
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
        });
        // this.getvalue()
    }

    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
            this.getitemdata()

        }
    }

    getitemdata = () => {
        let url = config.baseURL + 'get_my_ads_favourite.php?user_id=' + this.state.user_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('myfavads', obj);
                if (obj.product != 'NA') {
                    this.setState({
                        myfavourite_arr: obj.my_favourite,
                        myads_arr: obj.my_offers

                    })
                }


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



    errorimage = (index) => {
        let data = this.state.myads_arr
        data[index].image_arr = 'NA'
        this.setState({ myads_arr: data })
    }

    //-------------------open notification screen------------------------//
    opennotification = () => {

        this.props.navigation.navigate('Notification')


    }
    //-------------------open notification screen------------------------//
    myoffer = () => {

        this.props.navigation.navigate('Myoffer')

    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.newcolor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.newcolor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.newcolor} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalReport}
                    onRequestClose={() => {
                        this.setState({ modalReport: false })
                    }}>

                    <View style={{ flex: 1, backgroundColor: '#00000030', alignItems: 'center' }}>
                        <View style={{ position: 'absolute', bottom: 2, width: windowWidth, }}>
                            <View style={{ alignSelf: 'center', width: '100%', alignItems: 'center' }}>
                                <View style={{ width: '94%', backgroundColor: Colors.mediabackground, borderRadius: 15, paddingVertical: windowWidth * 3.5 / 100 }}>
                                    <View style={{ borderBottomColor: Colors.border_color, borderBottomWidth: 1, width: '100%', paddingVertical: windowWidth * 2 / 100 }}>
                                        <Text style={{ fontFamily: Font.Poppins_Regular, textAlign: 'center', fontSize: windowWidth * 3.5 / 100, color: Colors.mediatextcolor }}>{Lang_chg.txtOption[config.language]}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Reportpage'); this.setState({ modalReport: false }) }} style={{ width: '100%', paddingVertical: windowWidth * 2 / 100 }}>
                                        <Text style={{ fontFamily: Font.Poppins_Regular, textAlign: 'center', fontSize: windowWidth * 4 / 100, color: Colors.mediatextcolor }}>{Lang_chg.txtReport[config.language]}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ marginTop: 15, alignSelf: 'center', borderRadius: 15, backgroundColor: Colors.mediabackground, width: '94%', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => { this.setState({ modalReport: false }) }} style={{ alignSelf: 'center', width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: windowWidth * 3.5 / 100 }}>
                                    <Text style={{ fontFamily: Font.Poppins_Regular, fontSize: windowWidth * 4 / 100, color: 'red' }}>{Lang_chg.cancelmedia[config.language]}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView >
                    <View style={{ flex: 1, backgroundColor: Colors.newcolor, paddingBottom: windowHeight * 11 / 100, }}>
                        {/* borderBottomColor:Colors.border_color,borderBottomWidth:2,  */}
                        <View style={CSSstyle.notification_header}>
                            <TouchableOpacity activeOpacity={.7} style={{ justifyContent: 'center' }} onPress={() => { this.opennotification() }}>
                                {check_notification_num <= 0 ? <Image resizeMode="contain" style={CSSstyle.icons} source={localimag.notificationicon}></Image> :
                                    <Image resizeMode="contain" style={CSSstyle.icons} source={localimag.notificationss}></Image>}
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', }}>
                                {/* <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.home[config.language]}</Text> */}

                                <Text style={[CSSstyle.Notifications_title, { color: Colors.theme_color1 }]}>{'A I R S E E K R'}</Text>
                            </View>
                            <TouchableOpacity activeOpacity={.7} style={{ justifyContent: 'center' }} onPress={() => {
                                this.myoffer()

                            }}>
                                <Image resizeMode="contain" style={{
                                    width: windowWidth * 7 / 100,
                                    height: windowWidth * 7 / 100,
                                    resizeMode: 'contain'
                                }} source={localimag.blackoffericon}></Image>
                            </TouchableOpacity>

                        </View>



                        <View style={{ width: '100%' }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}>
                                <TouchableOpacity onPress={() => { this.setState({ activeindex: 0 }) }} activeOpacity={.7} style={this.state.activeindex == 0 ? [styles.styletopbar, { borderBottomColor: Colors.theme_color1, }] : [styles.styletopbar, { borderBottomColor: Colors.border_color1, }]} >
                                    {this.state.activeindex == 0 ? <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtmyads[config.language]}</Text> :
                                        <Text style={[CSSstyle.Notifications_title, { color: Colors.border_color1 }]}>{Lang_chg.txtmyads[config.language]}</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ activeindex: 1 }) }} activeOpacity={.7} style={this.state.activeindex == 1 ? [styles.styletopbar, { borderBottomColor: Colors.theme_color1, }] : [styles.styletopbar, { borderBottomColor: Colors.border_color1, }]} >
                                    {this.state.activeindex == 1 ?
                                        <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtfavourite[config.language]}</Text> :
                                        <Text style={[CSSstyle.Notifications_title, { color: Colors.border_color1 }]}>{Lang_chg.txtfavourite[config.language]}</Text>}
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '100%', height: 3, backgroundColor: Colors.border_color, marginTop: -3, zIndex: -1 }}></View>
                        </View>


                        {this.state.activeindex == 0 ? <View style={{ width: '94%', marginTop: windowHeight * 1 / 100, alignItems: 'center', alignSelf: 'center' }}>

                            {this.state.myads_arr == "NA" &&
                                <Image style={{ alignSelf: 'center', width: windowWidth * 75 / 100, height: windowHeight / 3, marginTop: windowHeight / 5, resizeMode: 'contain' }} source={localimag.nodata}></Image>
                            }
                            {this.state.myads_arr != "NA" &&

                                this.state.myads_arr.map((item, index) => (


                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Itemdetail', { ads_id: item.ads_id }) }} style={{ width: '100%', flexDirection: 'row', borderRadius: 3, backgroundColor: Colors.newcolor, elevation: 2, shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, alignSelf: 'center', marginTop: windowHeight * 1.5 / 100, marginBottom: windowHeight * .2 / 100 }}>
                                        <View style={{ width: '35%', }}>
                                            <FastImage
                                                onError={(error) => { this.errorimage(index) }}
                                                source={item.image_arr != 'NA' ?
                                                    { uri: config.img_url2 + item.image_arr[0].image } : localimag.nopreview}

                                                style={{ width: windowWidth * 28 / 100, height: windowWidth * 30 / 100, resizeMode: 'cover', borderRadius: 3 }}
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                        </View>
                                        <View style={{ width: '65%', paddingTop: windowHeight * .8 / 100, }}>
                                            <View style={{ flexDirection: 'row', height: windowHeight * 6 / 100, }}>
                                                <Text numberOfLines={2} style={styles.txtitem1}>{item.ads_title}</Text>
                                                <Text numberOfLines={1} style={styles.txtitemprice}>${item.price}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    {/* <Image style={styles.smallicons} source={localimag.calender}></Image> */}
                                                    {item.address != 'NA' && <Text numberOfLines={1} style={styles.txtsmall}>{item.address}</Text>}
                                                </View>

                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    {/* <Image style={styles.smallicons} source={localimag.calender}></Image> */}
                                                    <Text style={styles.txtsmall}>{item.create_date}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginLeft: windowWidth * 10 / 100 }}>
                                                    {/* <Image style={styles.smallicons} source={localimag.clockicon10}></Image> */}
                                                    <Text style={styles.txtsmall}>{item.create_time}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginTop: 2, paddingVertical: windowHeight * .3 / 100, }}>
                                                {/* <Image style={styles.iconswatch} source={localimag.redoffericon}></Image> */}
                                                <Text style={[styles.txtoffers, {}]}>{Lang_chg.txtOffers[config.language]}

                                                </Text>
                                                {item.offer_count >= 0 && <Text style={[styles.txtoffers, { marginLeft: windowWidth * 5 / 100 }]}>{item.offer_count}</Text>}


                                            </View>

                                        </View>

                                    </TouchableOpacity>


                                ))
                            }





                        </View> :
                            <View style={{ width: '100%', marginTop: 10 }}>

                                {this.state.myfavourite_arr == "NA" &&
                                    <Image style={{ alignSelf: 'center', width: windowWidth * 75 / 100, height: windowHeight / 3, marginTop: windowHeight / 5.17, resizeMode: 'contain' }} source={localimag.nodata}></Image>
                                }
                                {this.state.myfavourite_arr != "NA" &&
                                    <FlatList
                                        data={this.state.myfavourite_arr}
                                        numColumns={2}
                                        showsHorizontalScrollIndicator={false}
                                        inverted={false}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('Itemdetail', { ads_id: item.ads_id }) }} style={{ width: '46.2%', backgroundColor: Colors.newcolor1, elevation: 2, shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, alignItems: 'center', alignSelf: 'center', marginHorizontal: '2%', marginBottom: windowHeight * 1 / 100, marginTop: windowHeight * 1 / 100, borderRadius: 5, }}>

                                                    <View style={{ borderRadius: 5, backgroundColor: Colors.border_color, width: '100%', height: windowHeight * 22 / 100, backgroundColor: Colors.newcolor1, }}>
                                                        <ImageBackground source={item.image_arr != 'NA' ? { uri: config.img_url2 + item.image_arr[0].image } : localimag.nopreview} imageStyle={{ resizeMode: 'contain', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} style={{ width: '100%', height: windowHeight * 22 / 100, backgroundColor: Colors.white_light }} >
                                                            <View style={{ width: '100%', flexDirection: 'row', padding: windowHeight * 1 / 100, justifyContent: 'space-between', alignItems: 'center' }}>


                                                            </View>
                                                        </ImageBackground>
                                                    </View>
                                                    <View style={{ marginTop: windowHeight * 1 / 100, width: '100%', backgroundColor: Colors.border_color, height: 1 }}>

                                                    </View>

                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ width: '70%', }}>
                                                            <Text numberOfLines={1} style={styles.txtitemfav}>{item.ads_title}</Text>
                                                            <Text style={styles.txtpricefav}>${item.price}</Text>
                                                        </View>
                                                        <View style={{ width: '30%', alignItems: 'flex-end' }}>
                                                            <View style={{ paddingTop: windowHeight * .5 / 100, paddingHorizontal: windowHeight * 1.2 / 100 }}>

                                                                <Image style={styles.iconsfav} source={localimag.favouriteicon}></Image>
                                                            </View>


                                                        </View>
                                                    </View>



                                                </TouchableOpacity>

                                            )
                                        }}
                                        keyExtractor={(index) => { index.toString() }}
                                    />
                                }
                            </View>}

                    </View>
                </ScrollView>
                <Footer navigation={this.props.navigation} page={'myads'} chatcount={count_inbox} />



            </View>
        )
    }
}



const styles = StyleSheet.create({
    txtitemfav: {
        marginLeft: windowWidth * 3 / 100, fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: windowWidth * 1.2 / 100
    },
    iconsfav: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 6 / 100,
        resizeMode: 'cover'
    },
    txtpricefav: {
        marginLeft: windowWidth * 3 / 100, fontSize: windowWidth * 3.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'flex-start', marginHorizontal: windowWidth * 1.5 / 100
    },
    styletopbar: { borderBottomWidth: 2, width: '50%', alignItems: 'center', justifyContent: 'center', paddingTop: windowHeight * 2 / 100, paddingBottom: windowHeight * .2 / 100, },
    smallicons: {
        width: windowWidth * 3 / 100,
        height: windowWidth * 3 / 100,
        resizeMode: 'cover',
        alignSelf: 'center'
    }
    ,

    iconswatch: {
        width: windowWidth * 3.5 / 100,
        height: windowWidth * 3.5 / 100,
        resizeMode: 'cover',
        alignSelf: 'center'
    },

    txtitem1: {
        width: '60%', fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtsmall: {
        marginLeft: 3, marginTop: 1, fontSize: windowWidth * 2.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1,
    },
    txtoffers: {
        fontSize: windowWidth * 2.6 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'center',
    },

    txtitemprice: {
        textAlign: 'right', width: '40%', fontSize: windowWidth * 3.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, paddingRight: 3
    },

});