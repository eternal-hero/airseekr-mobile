import React, {Component} from 'react'
import {
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import {
    apifuntion,
    Colors,
    config,
    consolepro,
    Font,
    Lang_chg,
    localStorage,
    msgProvider, msgTitle,
    validation
} from './Provider/utilslib/Utils'
import CSSstyle from './css';
import Footer from './Provider/Footer';
import {localimag} from '../src/Provider/Localimage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            isseller:config.isseller,
            name: '',
            email:'',
            mobile: '',
            address:'',
            imagepath:'test',
            user_roll:0,
            id_verification:'',
            ABN_number:'',
            cover_image:'test',
            payoutMethod: 'bank',
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
             this.getvalue()
            this.setState({isseller:config.isseller})
        });
        // this.getvalue()
    }

    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                    user_id:user_details.user_id,
                    name:user_details.name,
                email: user_details.paypal_email && user_details.paypal_email != 'null' ? user_details.paypal_email : '',
                    mobile:(user_details.mobile).toString(),
                    address:user_details.address,
                    user_roll:user_details.user_roll,
                    id_verification:config.img_url2+user_details.id_verification,
                    ABN_number:user_details.ABN_number,
            })
            if(user_details.image!='NA'){
                this.setState({ imagepath:config.img_url1+user_details.image})
            }else{
                this.setState({ imagepath:'NA'})
            }
            if(user_details.cover_image!='NA'){
                this.setState({ cover_image:config.img_url2+user_details.cover_image})
            }else{
                this.setState({ cover_image:'NA'})
            }

        }
    }

    onPaypalVerify = async () => {
        Keyboard.dismiss();

        if (!this.state.email || config.regemail.test(this.state.email) !== true) {
            msgProvider.toast(validation.validEmail[config.language], 'center');
            return false;
        }

        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let url = config.baseAPI + 'payment-ads/paypal-account';
            var data = new FormData();
            data.append('user_id', user_details.user_id);
            data.append('email', this.state.email);
            consolepro.consolelog('continuepress', url);
            apifuntion
                .postApi(url, data)
                .then(async obj => {
                    consolepro.consolelog('test', obj);
                    if (obj.success == 'true') {
                        msgProvider.toast('Update Successfully', 'center');
                        await localStorage.setItemObject('user_arr', obj.data);
                        await this.getvalue();
                    } else {
                        msgProvider.alert(
                            msgTitle.information[config.language],
                            'Update failed, please fill a invalid email',
                            false,
                        );
                        return false;
                    }
                })
                .catch(err => {
                    consolepro.consolelog('err', err);
                });
        }
    };

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#f4f4f4', }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.newcolor }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.newcolor} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <ScrollView >
                    <View style={{ flex: 1, paddingBottom: windowHeight * 11 / 100 }}>

                        <View style={[CSSstyle.notification_header, { paddingTop: 10, paddingBottom: 5, }]}>
                            <View activeOpacity={.7} style={{ padding: 5, width: windowWidth * 30 / 100 }} >
                                <Text style={{}}>{'    '}</Text>
                            </View>
                            <View activeOpacity={.7} style={{ padding: 5, width: windowWidth *36  / 100 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Text style={[CSSstyle.Notifications_title, {}]}>{}</Text>
                            </View>
                            <View style={{ width: windowWidth * 34 / 100, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Setting') }} style={{ padding: 2, }} >
                                    <Image style={[CSSstyle.edittxticon, { resizeMode: "contain", }]} source={localimag.settingicon1}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {user_address='';  this.props.navigation.navigate('Editprofile') }} style={{ marginLeft: windowWidth * 5 / 100, padding: 2, }} >
                                    <Image style={[CSSstyle.edittxticon, { resizeMode: "contain", }]} source={localimag.editicon1}></Image>
                                </TouchableOpacity>

                            </View>

                        </View>

                         <ImageBackground  blurRadius={20} style={{ width: '100%', height: windowHeight * 32 / 100, }}
                          source={this.state.cover_image!='NA'? {uri:this.state.cover_image}:  localimag.backbg}
                         //source={this.state.cover_image!='NA'? localimag.backbg:  localimag.backbg}
                         >
                            {/* <ImageBackground

                           onLoadStart={() => this.setState({ showDefault: false })}
                                onLoad={() => this.setState({ showDefault: false })}
                                style={{
                                    width: '100%', height: windowHeight * 32 / 100, alignItems: 'center', resizeMode: 'cover',
                                }} source={this.state.cover_image!='NA'? {uri:this.state.cover_image}:  localimag.Group24}
                                resizeMode={FastImage.resizeMode.stretch} >
                                <View style={{ backgroundColor: '#00000030', width: '100%', flexDirection: 'row', marginTop: windowHeight * 18 / 100, paddingVertical: 1, paddingHorizontal: windowWidth * 7 / 100, alignItems: 'center', justifyContent: 'center' }} >
                                    <View style={{ width: '20%' }}>
                                        <Image style={[{ width: windowWidth * 15 / 100, height: windowWidth * 15 / 100, borderRadius: windowWidth * 7.5 / 100, resizeMode: "cover", }]} source={this.state.imagepath!='NA' ? {uri:this.state.imagepath}:localimag.user_profile1}></Image>
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <Text style={styles.txtitem11}>{this.state.name}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image style={[{ marginRight: 5, width: windowWidth * 4.5 / 100, height: windowWidth * 4.5 / 100, borderRadius: windowWidth * 7.5 / 100, resizeMode: "cover", }]} source={localimag.mailwhiteicon}></Image>
                                            <Text style={styles.txtitem22}>{this.state.email}</Text>
                                        </View>

                                    </View>

                                    </View>
                            </ImageBackground> */}
                             <View style={{  width: '100%',   paddingVertical: 1, paddingHorizontal: windowWidth * 7 / 100, alignItems: 'center', justifyContent: 'center' }} >
                                    <View style={{ width: '100%' ,alignItems:'center',justifyContent:'center',marginTop: windowHeight * 4/ 100,}}>
                                        <Image style={[{ width: windowWidth * 20 / 100, height: windowWidth * 20 / 100, borderRadius: windowWidth * 10 / 100, resizeMode: "cover", }]} source={this.state.imagepath!='NA' ? {uri:this.state.imagepath}:localimag.user_profile1}></Image>
                                    </View>
                                    <View style={{ width: '100%' ,alignItems:'center',justifyContent:'center',marginTop: windowHeight * 1.5/ 100,}}>
                                        <Text style={styles.txtitem11}>{this.state.name}</Text>
                                    <View style={{ marginTop: windowHeight * 3/ 100, }}>

                                            <Text style={styles.txtitem22}>{this.state.address}</Text>
                                        </View>
                                        <Text style={styles.txtitemphone11}>{'+61 '+this.state.mobile}</Text>

                                    </View>

                                    </View>

                        </ImageBackground>

                        <View><Text style={{color: Colors.blackColor, fontSize: 18, fontWeight: "bold", margin:8}}>Choose how you get paid:</Text></View>
                        <View style={styles.tabs}>
                            <TouchableOpacity onPress={() => this.setState({ payoutMethod: 'bank' })} style={[styles.tabItem, this.state.payoutMethod === 'bank' ? styles.tabActive : {}]}><Text style={this.state.payoutMethod === 'bank' ? styles.tabTextActive : null}>Bank (ID required)</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ payoutMethod: 'paypal' })} style={[styles.tabItem, this.state.payoutMethod === 'paypal' ? styles.tabActive : {}]}><Text style={this.state.payoutMethod === 'paypal' ? styles.tabTextActive : null}>Paypal</Text></TouchableOpacity>
                        </View>

                        {this.state.payoutMethod === 'bank' && (<View style={{paddingHorizontal:windowWidth*2/100,  width: '100%', marginTop: windowHeight * 3 / 100, alignSelf: 'center', alignItems: 'flex-start' }}>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image style={styles.iconss} source={localimag.phoneicon}></Image>
                                <Text style={styles.txtitemphone}>{'+61 '+this.state.mobile}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: windowHeight * 1 / 100, }}>
                                <Image style={styles.iconss} source={localimag.locationicon}></Image>
                                <Text style={styles.txtitemphone}>{this.state.address}</Text>
                            </View> */}
                           {this.state.user_roll ==0 ? <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Makeseller')}} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: windowHeight * 0.5 / 100, }}>
                                <Image style={styles.iconss} source={localimag.sellericon}></Image>
                                <Text style={{
                                    width:windowWidth * 90 / 100, textDecorationLine: 'underline', fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1,marginTop:windowHeight*.5/100
                                }}>{Lang_chg.becomeseller[config.language]}</Text>
                            </TouchableOpacity>:


                            <View style={{width:'100%', marginTop:windowHeight * 0.5 / 100,}}>

                                <View  style={{ flexDirection: 'row', marginTop: windowHeight * 0.5 / 100, }}>
                                    <Image style={styles.iconss} source={localimag.editidverification}></Image>
                                    <Text style={[styles.txtitemphone, {}]}>{Lang_chg.txtidverfication[config.language]}</Text>
                                </View>

                                <Image  imageStyle={{ borderRadius:20,}} source={this.state.id_verification!='NA'?  {uri:this.state.id_verification}: localimag.nopreview} resizeMode="cover" style={{marginTop:windowHeight*1/100,  alignItems:'flex-end', borderRadius:20, width:'100%',height:windowHeight*27/100,}} >
                                </Image>
                               {this.state.ABN_number!=null && this.state.ABN_number !='' && <Text style={[styles.txtitemphone, {marginTop:windowHeight*4/100}]}>{Lang_chg.txtABN[config.language]}</Text>}
                               {this.state.ABN_number!=null && this.state.ABN_number !='' && <Text style={[styles.txtitemphone1, {}]}>{this.state.ABN_number}</Text>}
                            </View>}
                        </View>)}

                        {this.state.payoutMethod === 'paypal' && (<View
                            style={{
                                backgroundColor: '#f4f4f4',
                                paddingBottom: (windowHeight * 2) / 100,
                            }}>

                            <View style={{width: '90%', alignSelf: 'center'}}>
                                <Text
                                    style={[
                                        styles.txttext11,
                                        {marginTop: (windowHeight * 4) / 100},
                                    ]}>
                                    Paypal Verification (optional)
                                </Text>
                                <Text style={[styles.txttext2, {}]}>
                                    Please provide your verified PayPal e-mail address
                                </Text>

                                <TextInput
                                    value={'' + this.state.email + ''}
                                    onChangeText={txt => {
                                        this.setState({email: txt});
                                    }}
                                    keyboardType="email-address"
                                    maxLength={30}
                                    returnKeyLabel="done"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss();
                                    }}
                                    style={[styles.txteditemail2, {}]}
                                    placeholderTextColor={Colors.lightfontcolor}
                                    placeholder={'Enter e-mail'}
                                />

                                <View
                                    style={{
                                        width: '100%',
                                        backgroundColor: Colors.theme_color1,
                                        height: 1,
                                        marginTop: (-windowHeight * 1) / 100,
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.onPaypalVerify();
                                    }}
                                    style={[
                                        CSSstyle.mainbutton,
                                        {
                                            marginTop: (windowHeight * 3) / 100,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: '4%',
                                        },
                                    ]}>
                                    <Text style={styles.txtlogin}>{'   '}</Text>
                                    <Text style={styles.txtlogin}>
                                        {Lang_chg.Continue[config.language]}
                                    </Text>
                                    <Image
                                        resizeMode="cover"
                                        style={styles.iconsback}
                                        source={localimag.arroww}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>)}
                    </View>

                </ScrollView>
                <Footer navigation={this.props.navigation} page={'profile'} chatcount={count_inbox} />



            </View>
        )
    }
}



const styles = StyleSheet.create({

    iconss: { marginRight: 5, width: windowWidth * 5 / 100, height: windowWidth * 5 / 100, resizeMode: "cover", },
    txtitem11: {
       textAlign:'center', width: '100%', fontSize: windowWidth * 4.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1,
    },
    txtitem22: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor,textAlign:'center',
    },
    txtitemphone: {
       width:windowWidth * 90 / 100, fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1,
    },
    txtitemphone11: {
        marginTop: windowHeight * 1/ 100,  width:windowWidth * 90 / 100, fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor,textAlign:'center'
    },
    txtitemphone1: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1,
    },
    txtdesc: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor, marginHorizontal: 5
    },
    txtdesc1: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1, marginHorizontal: 5
    },
    txtdesc2: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1,
    },
    txtdays: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_Regular, color: Colors.border_color1, alignSelf: 'center',
    },
    txtoffers: {
        fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, alignSelf: 'center',
    },
    txtmakeoffers: {
        fontSize: windowWidth * 2.7 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center',
    },
    txtitem2: {
        textAlign: config.textalign, fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_Bold, color: Colors.theme_color1,
    },
    icons: {
        width: windowWidth * 10 / 100,
        height: windowWidth * 10 / 100,
        resizeMode: 'cover',
        alignSelf: 'center'
    }
    ,

    iconswatch: {
        width: windowWidth * 4 / 100,
        height: windowWidth * 4 / 100,
        resizeMode: 'cover',
    },
    iconsfav: {
        width: windowWidth * 10 / 100,
        height: windowWidth * 10 / 100,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    txtitem1: {
        textAlign: config.textalign, fontSize: windowWidth * 4 / 100, fontFamily: Font.Poppins_Regular, color: Colors.greyColor,
    },

    txtitem3: {
        fontSize: windowWidth * 4.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txtitemprice: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1,
    },
    txttime: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.whiteColor, marginHorizontal: 5, alignSelf: 'center'
    }, icons: {
        width: windowWidth * 4 / 100,
        height: windowWidth * 4 / 100,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    // txtitem4: {
    //     fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor, alignSelf: 'center'
    // },
    txttext1: {
        fontSize: windowWidth * 6 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txttext11: {
        fontSize: windowWidth * 5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor,
    },
    txttext2: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.lightfontcolor,
    },
    txtlogin: {
        fontSize: windowWidth * 3.9 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },
    icons: {
        width: windowWidth * 12 / 100,
        height: windowWidth * 12 / 100,
        resizeMode: 'cover',
    },iconcross: {
        width: windowWidth * 8 / 100,
        height: windowWidth * 8 / 100,
        resizeMode: 'cover',
    },
    iconsback: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 4 / 100,
        resizeMode: 'stretch',alignSelf:'center'
    },
    txteditemail2: {
        marginTop: (windowHeight * 2.5) / 100,
        fontSize: (windowWidth * 3.7) / 100,
        width: '100%',
        fontFamily: Font.Poppins_Bold,
        color: Colors.blackColor,
        height: (windowHeight * 6) / 100,
    },
    txteditemail: { marginTop: windowHeight *  3.8 / 100, fontSize: windowWidth * 3.7 / 100, width: '100%', fontFamily: Font.Poppins_Bold, color: Colors.lightfontcolor },
    txtamount: { marginTop: windowHeight *  1 / 100, fontSize: windowWidth * 5/ 100, width: '100%', fontFamily: Font.Poppins_Bold, color: Colors.lightfontcolor },
    tabs: { flexDirection: 'row', flex: 1, borderBottomWidth: 1, borderBottomColor: '#ffffff', paddingTop: 5, backgroundColor: Colors.newcolor},
    tabItem: { marginLeft: 10, borderRightWidth: 1, borderRightColor: '#dee2e6', padding: 10, paddingHorizontal: 20, borderTopLeftRadius: 5, borderTopRightRadius: 5},
    tabActive: { backgroundColor: '#ffffff', },
    tabTextActive: { fontWeight: "bold" }
});
