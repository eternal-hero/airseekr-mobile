import React, { Component } from 'react'
import { RefreshControl, Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
export default class Alllisting extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaddata: true,
            is_serach: false,
            user_id: 0,
            txtsearch: '',
            offset: 0,
            refresh: false,
            modalVisible1: false,
            new_item: 'NA',
            new_item1: 'NA',
            category_id: 0,

        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {

            this.setState({ loaddata: true, offset: 0, shortby: 'DESC', })
            //this.getvalue() 
        });
        this.getvalue()
    }
    //------------------Get User Deatails---------------------------//
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })

        }
        this.getfilterdata()
    }
    //------------------Get All  Data---------------------------//
    getfilterdata = () => {
        // if (this.state.loaddata == true) {
        Keyboard.dismiss()
        let url = config.baseURL + 'get_search_item.php'
        var data = new FormData();
        data.append('user_id', this.state.user_id)
        data.append('search_text', this.state.txtsearch)
        consolepro.consolelog('data', data);
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('obj', obj);
            if (obj.success == 'true') {
                this.setState({
                    new_item: obj.all_product, loaddata: obj.loadmore,
                })
                if (this.state.txtsearch == '') {
                    this.setState({
                        new_item1: obj.all_product,
                    })
                }
                // if (this.state.offset == 0) {
                //     this.setState({
                //         new_item: obj.all_product, loaddata: obj.loadmore,
                //         new_item1: obj.all_product, loaddata: obj.loadmore,
                //     })
                // } else {
                //     consolepro.consolelog('offset1', this.state.offset)
                //     if (obj.all_product != 'NA') {
                //         consolepro.consolelog('this.state.new_item', this.state.new_item)
                //         consolepro.consolelog('obj.all_product', obj.all_product)
                //         let array1 = this.state.new_item
                //         let array2 = obj.all_product
                //         var newArray = array1.concat(array2);
                //         consolepro.consolelog('newArray', newArray)
                //         this.setState({ new_item: newArray,new_item1:newArray });
                //     }
                //     this.setState({ loaddata: obj.loadmore });

                // }

                // if (this.state.new_item != 'NA') {
                //     let data = this.state.new_item
                //     this.setState({
                //         offset: data.length,
                //     })
                // }


            } else {
                consolepro.consolelog('getfilterdata',);
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

        // }
    }
    //------------------when scroll and go to bottom---------------------------//
    isCloseToBottom = (nativeEvent) => {

        const paddingToBottom = 10
        return nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=

            nativeEvent.contentSize.height - paddingToBottom
    }
    //------------------call for more data---------------------------//
    loadmore = () => {

        if (this.state.loaddata == true) {
            this.getfilterdata()
        }
    }


    //--------Erase search text----------------------//
    cross_click = async () => {
        //  this.SearchFilterFunction('')
        this.setState({
            new_item: this.state.new_item1, txtsearch: ''
        })
    }
    //--------search particular item----------------------//

    SearchFilterFunction = (text) => {

        this.setState({ new_item: 'NA' })
        this.setState({ txtsearch: text })
        let data1 = this.state.new_item1
        consolepro.consolelog('data1', data1)
        if (data1 != 'NA') {
            const newData = data1.filter(function (item) {
                let searchtext = item.ads_title

                //applying filter for the inserted text in search bar
                const itemData = item.ads_title ? searchtext.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            consolepro.consolelog('newData', newData)
            let setdata = newData
            if (setdata.length > 0) {
                this.setState({ new_item: setdata })
            } else {
                this.setState({ new_item: 'NA' })
            }

        }

    }

    searchitem = () => {
        let txt = this.state.txtsearch.trim()
        if (txt == '') {
            return false
        } else {
            this.getfilterdata()
        }

    }
    searchtextitem = (txt) => {
        if (txt == '') {
            this.setState({
                new_item: this.state.new_item1, txtsearch: txt
            })
        } else {
            this.setState({
                txtsearch: txt
            })
        }
    }

    godetailpage = (item, index) => {
        consolepro.consolelog('item.ad_user_id', item.ad_user_id)
        consolepro.consolelog('this.state.user_id', this.state.user_id)
        if (item.ad_user_id == this.state.user_id) {
            // consolepro.consolelog('Myadsdetail')
            this.props.navigation.navigate('Myadsdetail', { ads_id: item.ads_id })
        } else {
            if (item.offer_by_me == false) {
                this.props.navigation.navigate('Itemdetail', { ads_id: item.ads_id })
            } else {
                this.props.navigation.navigate('Itemdetailoffer', { ads_id: item.ads_id })
            }
            //  consolepro.consolelog('Itemdetail')

        }

    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />


                <ScrollView
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        consolepro.consolelog('scroll end try', nativeEvent)
                        if (this.isCloseToBottom(nativeEvent)) {
                            consolepro.consolelog('scroll end success', nativeEvent)
                            //this.loadmore()
                        }
                    }}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={this.state.refresh}
                //         onRefresh={this._onRefresh}
                //     />
                // }

                >
                    <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                        <View style={[CSSstyle.notification_header, {
                            alignItems: 'center'
                        }]}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                            </TouchableOpacity>
                            {!this.state.is_serach && <Text style={[CSSstyle.Notifications_title, {
                                flex: 1, textAlign: 'center'
                            }]}>{Lang_chg.txtAllListing[config.language]}</Text>}

                            {this.state.new_item1 != 'NA' ?
                                <View>
                                    {!this.state.is_serach && <TouchableOpacity onPress={() => { this.setState({ is_serach: !this.state.is_serach }) }} style={{ padding: 2, justifyContent: 'center' }} >
                                        <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.searchicon}></Image>
                                    </TouchableOpacity>}
                                </View> :
                                <View>
                                    <Text>{'        '}</Text>
                                </View>}
                            {this.state.is_serach && <View style={{ backgroundColor: Colors.homebg, borderRadius: 10, width: windowWidth * 82 / 100, height: windowHeight * 5 / 100, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => { this.searchitem() }} style={{ justifyContent: 'center', width: '11%', alignItems: 'center', justifyContent: 'center' }} >
                                    <Image style={[{ width: windowWidth * 6 / 100, height: windowWidth * 6 / 100, resizeMode: 'contain', resizeMode: "contain", }]} source={localimag.searchicon}></Image>
                                </TouchableOpacity>

                                <TextInput
                                    value={"" + this.state.txtsearch + ""}
                                    onChangeText={(txt) => { this.searchtextitem(txt) }}
                                    keyboardType='default'
                                    // secureTextEntry={this.state.secureoldpassword}
                                    maxLength={40}
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    onSubmitEditing={() => { Keyboard.dismiss(); this.searchitem() }}
                                    style={[styles.txtaddtype, {}]}
                                    placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.Search[config.language]}></TextInput>
                                <TouchableOpacity onPress={() => { this.cross_click() }} style={{ padding: 2, justifyContent: 'center' }} >
                                    <Image style={[{ width: windowWidth * 4 / 100, height: windowWidth * 4 / 100, resizeMode: 'contain', resizeMode: "contain", }]} source={localimag.cross}></Image>
                                </TouchableOpacity>
                            </View>}

                        </View>


                        <View style={{ width: '100%', paddingBottom: windowHeight * 1 / 100, paddingHorizontal: '1%', }}>
                            {this.state.new_item == "NA" &&
                                <Image style={{ alignSelf: 'center', width: '70%', height: windowHeight / 3, marginTop: windowHeight / 4, resizeMode: 'contain' }} source={localimag.nodata}></Image>
                            }
                            {this.state.new_item != "NA" &&
                                <FlatList
                                    data={this.state.new_item}
                                    numColumns={2}
                                    showsHorizontalScrollIndicator={false}
                                    inverted={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => { this.godetailpage(item, index) }} style={{ width: '46.2%', backgroundColor: Colors.whiteColor, elevation: 2, shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, alignItems: 'center', alignSelf: 'center', marginHorizontal: '2%', marginBottom: windowHeight * 1 / 100, marginTop: windowHeight * 1 / 100, borderRadius: 5, }}>

                                                <View style={{ borderRadius: 5, backgroundColor: Colors.border_color, width: '100%', height: windowHeight * 22 / 100, backgroundColor: Colors.whiteColor, }}>
                                                    <ImageBackground source={item.image_arr != 'NA' ? { uri: config.img_url2 + item.image_arr[0].image } : localimag.nopreview} imageStyle={{ resizeMode: 'contain', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} style={{ width: '100%', height: windowHeight * 22 / 100, backgroundColor: Colors.white_light }} >
                                                        <View style={{ width: '100%', flexDirection: 'row', padding: windowHeight * 1 / 100, justifyContent: 'space-between', alignItems: 'center' }}>


                                                        </View>
                                                    </ImageBackground>
                                                </View>
                                                <View style={{ marginTop: windowHeight * 1 / 100, width: '100%', backgroundColor: Colors.border_color, height: 1 }}>

                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ width: '70%', }}>
                                                        <Text numberOfLines={1} style={styles.txtitem}>{item.ads_title}</Text>
                                                        <Text style={styles.txtprice}>${item.price}</Text>
                                                    </View>
                                                    <View style={{ width: '30%', alignItems: 'flex-end' }}>
                                                        <View style={{ paddingTop: windowHeight * .5 / 100, paddingHorizontal: windowHeight * 1.2 / 100 }}>
                                                            {item.fav_status == false ?
                                                                <Image style={styles.icons} source={localimag.deactivefavicon}></Image> :
                                                                <Image style={styles.icons} source={localimag.favouriteicon}></Image>}
                                                        </View>


                                                    </View>
                                                </View>



                                            </TouchableOpacity>

                                        )
                                    }}
                                    keyExtractor={(index) => { index.toString() }}
                                />
                            }
                        </View>
                    </View>
                </ScrollView>
                {/* {this.state.new_item != 'NA' && <TouchableOpacity onPress={() => { this.setState({ modalVisible1: true }) }} style={{ justifyContent: 'center', borderRadius: 20, flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: windowWidth * 3 / 100, right: windowWidth * 3 / 100, paddingHorizontal: windowWidth * 3 / 100, paddingVertical: windowWidth * 1 / 100, backgroundColor: Colors.theme_color1 }}>
                    <Image style={[CSSstyle.edittxticon, {}]} source={localimag.filter}></Image>
                    <Text style={styles.txtitem3}>{Lang_chg.filter[config.language]}</Text>
                </TouchableOpacity>} */}

            </View>
        )
    }
}



const styles = StyleSheet.create({
    txtaddtype: { marginLeft: 3, fontSize: windowWidth * 3.2 / 100, width: '78%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },

    txtitem: {
        marginLeft: windowWidth * 3 / 100, fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: windowWidth * 1.2 / 100
    },
    icons: {
        width: windowWidth * 7 / 100,
        height: windowWidth * 7 / 100,
        resizeMode: 'contain'
    },
    txtprice: {
        marginLeft: windowWidth * 3 / 100, fontSize: windowWidth * 3.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'flex-start', marginHorizontal: windowWidth * 1.5 / 100
    },
    // txtflter: {
    //     fontSize: windowWidth * 4.2 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: 25, marginVertical: 10
    // },
    // txtitem1: {
    //     fontSize: windowWidth * 3.2 / 100, fontFamily: Font.Poppins_Regular, color: Colors.greyColor, alignSelf: 'flex-start', marginHorizontal: 5
    // },
    // txttime: {
    //     fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.whiteColor, marginHorizontal: 3, alignSelf: 'center'
    // },
    // txtitem2: {
    //     fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1, alignSelf: 'flex-end', marginHorizontal: 5
    // },
    // txtitem3: {
    //     fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, marginHorizontal: 8
    // },
    // interestbg: {
    //     marginTop: 8,
    //     marginRight: 5,
    //     borderRadius: 15,
    //     paddingVertical: 5,
    //     paddingHorizontal: 10,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },


    // txtitem33: {
    //     fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_Regular, marginTop: 5, color: Colors.blackColor, alignSelf: 'center'
    // },



});