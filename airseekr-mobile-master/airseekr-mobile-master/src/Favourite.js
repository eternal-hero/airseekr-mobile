import React, { Component } from 'react'
import { I18nManager, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Favourite extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            new_item: 'NA',
            new_item1: 'NA',
            txtsearch: '',
            is_serach: false,
            new_item2: [{ 'name': 'Mobile One Plus', 'image': localimag.testimage, 'price': 200, 'type': 1 },
            { 'name': 'New Brand Mobile', 'image': localimag.testimage1, 'price': 300, 'type': 0 },
            { 'name': 'Mobile One Plus', 'image': localimag.testimage2, 'price': 200, 'type': 0 },
            { 'name': 'Mobile One Plus', 'image': localimag.testimage3, 'price': 200, 'type': 0 },
            { 'name': 'New Brand Mobile', 'image': localimag.testimage1, 'price': 300, 'type': 0 },
            { 'name': 'Mobile One Plus', 'image': localimag.testimage2, 'price': 200, 'type': 0 },

            ],


        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.setState({
                txtsearch: '',
                is_serach: false,
            })
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
            this.getfavouritedata()
        }
    }

    getfavouritedata = () => {
        let url = config.baseURL + 'get_favourite.php?user_id=' + this.state.user_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('favouritedata', obj);
                this.setState({
                    new_item: obj.favourite_item,
                    new_item1: obj.favourite_item,
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

    addfavourite = (item, index) => {
        let url = config.baseURL + 'add_remove_favourite.php?user_id=' + this.state.user_id + '&product_id=' + item.product_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {

                consolepro.consolelog('favstatus', obj);
                var find_index = this.state.new_item1.findIndex(x => x.product_id == item.product_id);
                if (find_index != -1) {
                    let data = this.state.new_item1
                    data.splice(find_index, 1);
                    if (data.length > 0) {
                        this.setState({
                            new_item: data,
                            new_item1: data,
                            txtsearch: '',
                            is_serach: false,
                        })
                    } else {
                        this.setState({
                            new_item: 'NA',
                            new_item1: 'NA',
                            txtsearch: '',
                            is_serach: false,
                        })
                    }
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




    cross_click = async () => {
        this.SearchFilterFunction('')

    }
    SearchFilterFunction = (text) => {
        //  this.setState({ category_arr: 'NA' })
        this.setState({ txtsearch: text })
        let data1 = this.state.new_item1
        consolepro.consolelog('data1', data1)
        if (data1 != 'NA') {
            const newData = data1.filter(function (item) {
                let searchtext = item.product_detail.product_title[config.language]
                //applying filter for the inserted text in search bar
                const itemData = item.product_detail.product_title ? searchtext.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            consolepro.consolelog('newData', newData)

            if (newData.length > 0) {
                this.setState({ new_item: newData })
            } else {
                this.setState({ new_item: 'NA' })
            }

        }

    }



    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.homebg, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: Colors.homebg, }}>
                        <View style={CSSstyle.notification_header}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                            </TouchableOpacity>


                            {!this.state.is_serach && <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.favourites[config.language]}</Text>}
                            {!this.state.is_serach && <View style={{justifyContent:'center'}}>
                                {this.state.new_item != 'NA' ? <TouchableOpacity onPress={() => { this.setState({ is_serach: !this.state.is_serach }) }} style={{ padding: 2, justifyContent: 'center' }} >
                                    <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.searchw}></Image>
                                </TouchableOpacity> :
                                    <View style={{ padding: 2, justifyContent: 'center' }} >
                                        <Text>{'      '}</Text>
                                    </View>}

                            </View>
                            }
                            {this.state.is_serach && <View style={{ backgroundColor: Colors.homebg, borderRadius: 10, width: windowWidth * 75 / 100, height: windowHeight * 5 / 100, justifyContent: 'center', flexDirection: 'row' }}>
                                <TextInput
                                    value={"" + this.state.txtsearch + ""}
                                    onChangeText={(txt) => { this.SearchFilterFunction(txt) }}
                                    keyboardType='default'
                                    // secureTextEntry={this.state.secureoldpassword}
                                    maxLength={40}
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    style={I18nManager.isRTL == false ? [styles.txtaddtype, { textAlign: 'left' }] : [styles.txtaddtype, { textAlign: 'right' }]}

                                    placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.Search[config.language]}></TextInput>
                                <TouchableOpacity onPress={() => { this.cross_click() }} style={{ padding: 2, justifyContent: 'center' }} >
                                    <Image style={[{ width: windowWidth * 4 / 100, height: windowWidth * 4 / 100, resizeMode: 'contain', resizeMode: "contain", }]} source={localimag.cross}></Image>
                                </TouchableOpacity>
                            </View>}

                        </View>
                        <View style={{ width: '100%', paddingHorizontal: '3%', paddingBottom: windowHeight * 1 / 100 }}>
                            {this.state.new_item == "NA" &&

                                <Image style={{ alignSelf: 'center', width: '70%', height: windowHeight / 3, marginTop: windowHeight / 4, resizeMode: 'contain' }} source={localimag.nodata}></Image>
                            }
                            {this.state.new_item != "NA" &&
                                <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', alignItems: 'center', }}>
                                    {this.state.new_item.map((item, index) => (
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => { this.props.navigation.navigate('Itemdetail', { 'product_id': item.product_id }) }} style={{ width: '46%', backgroundColor: Colors.whiteColor, elevation: 2, shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, alignItems: 'center', alignSelf: 'center', marginHorizontal: '2%', marginBottom: windowHeight * 1 / 100, marginTop: windowHeight * 1 / 100, borderRadius: 10, padding: 2 }}>

                                            <View style={{ borderRadius: 10, backgroundColor: Colors.border_color, width: '100%', height: windowHeight * 27 / 100, backgroundColor: Colors.whiteColor }}>
                                                <ImageBackground source={{ uri: config.img_url2 + item.product_detail.image[0].image }} imageStyle={{resizeMode:'contain', borderRadius: 10, }} style={{ width: '100%', height: windowHeight * 27 / 100, backgroundColor: Colors.white_light }}
                                                // resizeMode={FastImage.resizeMode.stretch}
                                                >
                                                    <View style={{ width: '100%', flexDirection: 'row', padding: windowHeight * 1 / 100, justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {item.recent_time != 'NA' ? <View style={{ padding: 2, width: '60%', flexDirection: 'row', backgroundColor: Colors.theme_color3, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Image style={styles.icons} source={localimag.watch}></Image>
                                                            <Text style={styles.txttime}>{item.recent_time}</Text>
                                                        </View> :
                                                            <View>
                                                            </View>}
                                                        <TouchableOpacity onPress={() => { this.addfavourite(item, index) }} style={{ width: '20%', alignItems: 'center' }}>
                                                            <Image style={CSSstyle.icons} source={localimag.heartactive}></Image>
                                                        </TouchableOpacity>

                                                    </View>
                                                </ImageBackground>
                                            </View>
                                            <Text numberOfLines={1} style={styles.txtitem}>{item.product_detail.product_title[config.language]}</Text>
                                            <Text style={styles.txtitem1}>{item.product_detail.category_name[config.language]}</Text>
                                            <Text style={styles.txtitem2}>${item.product_detail.price}</Text>


                                        </TouchableOpacity>
                                    ))

                                    }
                                </View>

                            }
                        </View>
                    </View>
                </ScrollView>

            </View>
        )
    }
}



const styles = StyleSheet.create({
    txtitem: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: 5
    },
    txtflter: {
        fontSize: windowWidth * 4.2 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: 25, marginVertical: 10
    },
    txtitem1: {
        fontSize: windowWidth * 3.2 / 100, fontFamily: Font.Poppins_Regular, color: Colors.greyColor, alignSelf: 'flex-start', marginHorizontal: 5
    },
    txttime: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.whiteColor, marginHorizontal: 5, alignSelf: 'center'
    },
    txtitem2: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1, alignSelf: 'flex-end', marginHorizontal: 5
    },
    txtitem3: {
        fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, marginHorizontal: 8
    },
    interestbg: {
        marginTop: 8,
        marginRight: 5,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    icons: {
        width: windowWidth * 3.5 / 100,
        height: windowWidth * 3.5 / 100,
        marginLeft: 5,
        resizeMode: 'contain'
    },
    txtaddtype: { fontSize: windowWidth * 3.8 / 100, width: '88%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },



});