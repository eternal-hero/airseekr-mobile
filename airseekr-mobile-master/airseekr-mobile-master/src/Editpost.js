import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,notification, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import Carousel from 'react-native-banner-carousel';
import CountDown from 'react-native-countdown-component';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import { color } from 'react-native-reanimated';

const photodata = [
    { 'id': 0, image: 'NA', file: 'NA', status: false },
    { 'id': 1, image: 'NA', file: 'NA', status: false },
    { 'id': 2, image: 'NA', file: 'NA', status: false },
    { 'id': 3, image: 'NA', file: 'NA', status: false },
    { 'id': 4, image: 'NA', file: 'NA', status: false },

]
export default class Editpost extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            cateagoryname: 'Choose Category',
            seeekingitem: '',
            budget: '',
            specificitem: '',
            location: 'Enter suburb',
            location2: '',
            photodata: photodata,
            photodata1: [],
            cameramodalon: false,
            ads_detail:this.props.route.params.ads_detail,
            latitude: config.latitude,
            longitude: config.longitude,
            imagecount:0
        }

    }
    componentDidMount() {

        this.props.navigation.addListener('focus', () => {
            this.getvalue()
            this.getaddress()
            // this.setState({ photodata: photodata });
        });
        let pic_arr = this.state.photodata
        for (let i = 0; i < pic_arr.length; i++) {
            pic_arr[i].image = 'NA'
        }
        this.setState({ photodata: pic_arr });
        let data=this.state.ads_detail
        setTimeout(() => {
           
            this.setState({
            location: data.location,
            location2: data.location2,
            latitude:data.latitude,
            longitude: data.longitude,
            seeekingitem:data.title,
            budget:data.price,
            specificitem:data.description,

        })
        }, 200);
        user_address=data.location
        user_address2=data.location2
        user_address_lat=data.latitude,
        user_address_long=data.longitude,
        category_id=data.category_id
        categoryname=data.category_name
        let pic_arr1 = this.state.photodata
        let image_arr=data.image_arr
        if(image_arr!='NA'){
            for (let j = 0; j < image_arr.length; j++) {
                pic_arr1[j].image = config.img_url2+image_arr[j].image
                pic_arr1[j].status=true
                pic_arr1[j].id=image_arr[j].ads_image_id
            }
        }
       

        this.setState({imagecount:image_arr.length, photodata: pic_arr1})

    }

    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
            })
        }
    }

    getaddress = async () => {
        if (user_address != '') {
            this.setState({
                location: user_address,
                location2: user_address2,
                latitude: user_address_lat,
                longitude: user_address_long,

            })
        }
    }

    getitemdata = () => {
        let url = config.baseURL + 'get_item_detail.php?user_id=' + this.state.user_id + '&product_id=' + this.state.product_id
        consolepro.consolelog('url', url);
        apifuntion.getApi(url).then((obj) => {
            if (obj.success == 'true') {
                consolepro.consolelog('itemdetail', obj);
                if (obj.product != 'NA') {
                    this.setState({
                        item_arr: obj.product,
                        product_detail: obj.product.product_detail,
                        addtocart: obj.product.cart_status
                    })
                }
                else {
                 
                        this.props.navigation.goBack();
                  
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

    _openCamera = () => {

        mediaprovider.launchCamera().then((obj) => {
            consolepro.consolelog('imageobj', obj)
            this.setState({ cameramodalon: false })
            let data = this.state.photodata
            for (let i = 0; i < data.length; i++) {
                if (data[i].image == 'NA') {
                    data[i].image = obj.path
                    // data[i].status=true
                    break;
                }
                // data2.push({'id': i, image: config.img_url1 + images_arr[i].image, file: 'NA', status: true, userimage: images_arr[i].user_image_id, type: 1})

            }
            this.setState({
                photodata: data
            })
        })
    }

    _openGellery = () => {

        mediaprovider.launchGellery().then((obj) => {
            consolepro.consolelog('imageobj', obj)
            this.setState({ cameramodalon: false })
            if (obj.mime == "image/jpeg") {
                let data = this.state.photodata
                for (let i = 0; i < data.length; i++) {
                    if (data[i].image == 'NA') {
                        data[i].image = obj.path
                        // data[i].status=true
                        break;
                    }
                    // data2.push({'id': i, image: config.img_url1 + images_arr[i].image, file: 'NA', status: true, userimage: images_arr[i].user_image_id, type: 1})

                }
                this.setState({
                    photodata: data
                })

            } else {
                // this.setState({
                //   imagepath:'NA',takeimage:false

                // })
            }

        })
    }
    cameraclcik = (item, index) => {
        if (item.image == 'NA') {
            this.setState({ cameramodalon: true, })
        }
    }
    deleteiamage = (index) => {
        let data = this.state.photodata
        data[index].image = 'NA';
        this.setState({
            photodata: data
        })
    }
    deleteiamage_server = (index) => {
       
        Alert.alert(
            msgTitle.alert[config.language],
            msgTitle.msgdeleteimage[config.language], [{
                text: msgTitle.no[config.language],
                onPress: () => { },
                style: msgTitle.cancel[config.language]
            }, {
                text: msgTitle.yes[config.language],
                onPress: () => this.deletefromserver(index)
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    }

    deletefromserver=async(index)=>{
        let url = config.baseURL + "delete_ads_image.php";
        let user_details = await localStorage.getItemObject('user_arr');
        if (user_details != null) {
            let data1 = this.state.photodata
            let imageid=  data1[index].id
            let user_id = user_details.user_id
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('ads_id', this.state.ads_detail.ads_id)
            data.append('ads_image_id', imageid)
            consolepro.consolelog('data', data);
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('itemdetaissl', obj);
                if (obj.success == 'true') {
                   setTimeout(() => {
                    data1[index].image='NA';
                    data1[index].status=false;
                    let temp_arr=[];
                    for(let i=0;i<data1.length;i++){
                       if(data1[i].image!='NA'){
                        temp_arr.push(data1[i]) 
                       }
                    }
                    consolepro.consolelog('temp_arr', temp_arr);
                    let new_arr=[]
                    for(let j=0;j<5;j++){
                        if(temp_arr.length>j){
                            consolepro.consolelog('temp_a', j);
                            new_arr.push(temp_arr[j])
                        }else{
                          new_arr.push( { 'id': j, image: 'NA', file: 'NA', status: false })
                        }
                     }
                     consolepro.consolelog('new_arr', new_arr);
                     this.setState({photodata:new_arr,imagecount:this.state.imagecount-1})




                   }, 500);
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

    //--------------------------Create new ads---------------------//
    editadspost = async () => {
        Keyboard.dismiss()
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            let user_id = user_details.user_id

            if (category_id == '' || category_id == null) {
                msgProvider.toast(validation.emptycategory[config.language], 'center')
                return false;
            }
            let title = this.state.seeekingitem.trim()
            if (title.length <= 0) {
                msgProvider.toast(validation.emptytitle[config.language], 'center')
                return false;
            }
            let budget = this.state.budget.trim()
            if (budget.length <= 0) {
                msgProvider.toast(validation.emptybudget[config.language], 'center')
                return false;
            }
            let description = this.state.specificitem.trim()
            if (description.length <= 0) {
                msgProvider.toast(validation.emptyspecific[config.language], 'center')
                return false;
            }
            // let image_arr = this.state.photodata
            // let imageavailable = false
            // for (let j = 0; j < image_arr.length; j++) {
            //     if (image_arr[j].image != 'NA') {
            //         imageavailable = true
            //     }
            // }
            // if (imageavailable == false) {
            //     msgProvider.toast(validation.emptyadsimage[config.language], 'center')
            //     return false;
            // }

            let location = user_address;
            let location2 = user_address2;
            if (location.length <= 0) {
                msgProvider.toast(validation.emptyAddress[config.language], 'center')
                return false;
            }

            let url = config.baseURL + "edit_my_ads.php";
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('ads_id', this.state.ads_detail.ads_id)
            data.append('category_id', category_id)
            data.append('item_title', title)
            data.append('price', this.state.budget)
            data.append("address", location)
            data.append("address2", location2)
            data.append("latitude", this.state.latitude)
            data.append("longitude", this.state.longitude)
            data.append("item_description", description)
            let image_arr = this.state.photodata
           
            for (let i = 0; i < image_arr.length; i++) {
                if (image_arr[i].image != 'NA' && image_arr[i].status==false) {
                    data.append('ads_image[]', {
                        uri: image_arr[i].image,
                        type: 'image/jpg',
                        name: 'image.jpg'
                    })
                }

            }
            consolepro.consolelog('send data', data)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('test111', obj)
                if (obj.success == 'true') {
                    if(obj.notification_arr !='NA'){
                        notification.notification_arr(obj.notification_arr)
                    }
                        msgProvider.toast(obj.msg[config.language], 'center')
                        user_address = ''
                        user_address2 = ''
                        category_id = ''
                        this.props.navigation.navigate('Homepage')
                   
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
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.newcolor1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.newcolor1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />

                <Cameragallery mediamodal={this.state.cameramodalon} Camerapopen={() => { this._openCamera() }} Galleryopen={() => { this._openGellery() }} Canclemedia={() => { this.setState({ cameramodalon: false }) }} />

                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.whiteColor }}
                    behavior={Platform.OS === "ios" ? "padding" : null}>
                <ScrollView >
                    <View style={{ backgroundColor: Colors.newcolor, paddingBottom: windowHeight * 4 / 100 }}>

                        {/* <View style={[CSSstyle.notification_header, { paddingTop: 10, paddingBottom: 10, }]}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backarrowicon}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txteditpost[config.language]}</Text>
                            <View style={{ padding: 2, justifyContent: 'center' }} >
                                <Text>{'    '}</Text>
                            </View>
                        </View> */}
                         <View style={[CSSstyle.notification_header, {backgroundColor: Colors.newcolor1, elevation:1,shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20, paddingTop: 10, paddingBottom: 10, }]}>
                            <TouchableOpacity activeOpacity={.7} style={{width:windowWidth*33/100, padding: 5 }} onPress={() => {  this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.leftarrow}></Image>
                            </TouchableOpacity>
                            <View style={{width:windowWidth*33/100,justifyContent:'center'}}>
                                 <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txteditpost[config.language]}</Text>
                            </View>
                           
                            <View style={{justifyContent:'center',width:windowWidth*30/100,  justifyContent: 'center',alignItems:'flex-end',paddingHorizontal:windowWidth*0/100 }} >
                               <TouchableOpacity style={{paddingHorizontal:windowWidth*2/100}} onPress={()=>{this.editadspost()}}>
                                     <Text style={[styles.edittext1]}>{'Submit'}</Text>
                               </TouchableOpacity>
                                
                            </View>
                        </View>

                        <View style={{ width: '100%', alignItems: 'center', alignSelf: 'center' }}>

                        {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('Selectcategorie') }} style={[styles.mainview, { marginTop: windowHeight * 4 / 100 }]}>
                                <View style={styles.txtview}>
                                {category_id == '' || category_id == null ?
                                        <Text style={[styles.edittext, {}]}>{this.state.cateagoryname} </Text> :
                                        <Text style={[styles.edittext, {}]}>{categoryname} </Text>
                                    }
                                </View>
                                <View style={styles.imageview}>
                                    <Image style={styles.icon} source={localimag.selectarrowicon}></Image>
                                </View>
                            </TouchableOpacity> */}

                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Selectcategorie') }} style={[styles.mainview, { marginTop: windowHeight * 0.5 / 100,backgroundColor:Colors.newcolor, }]}>
                                 <Text style={[styles.txtitem1, { }]}>{Lang_chg.category1[config.language]}</Text>
                                
                                <View style={styles.txtview}>
                                    {category_id == '' || category_id == null ?
                                        <Text style={[styles.edittext, {}]}>{this.state.cateagoryname} </Text> :
                                        <Text style={[styles.edittext, {}]}>{categoryname} </Text>
                                    }
                                </View>
                                
                            </TouchableOpacity>

                            <View style={[styles.mainview, {backgroundColor:Colors.newcolor1, }]}>
                                  <Text style={[styles.txtitem1, { }]}>{Lang_chg.whatisit1[config.language]}</Text>
                                
                                <View style={{ width: '94%',alignSelf:'center' }}>

                                    <TextInput
                                        value={"" + this.state.seeekingitem + ""}
                                        onChangeText={(txt) => { this.setState({ seeekingitem: txt }) }}
                                        keyboardType='default'
                                        maxLength={70}
                                       
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { }}
                                        style={[styles.edittext, { height: windowHeight * 5 / 100 }]}
                                        placeholderTextColor={Colors.lightfontcolor} placeholder={Lang_chg.txtseeeingitem[config.language]}></TextInput>
                                </View>
                               
                            </View>



                            <View style={[styles.mainview, { backgroundColor:Colors.newcolor, }]}>
                            <Text style={[styles.txtitem1, { }]}>{Lang_chg.Budget1[config.language]}</Text>
                                
                                <View style={{ width: '94%',alignSelf:'center' }}>
                                    <TextInput
                                        value={"" + this.state.budget + ""}
                                        onChangeText={(txt) => { this.setState({  budget: txt }) }}
                                        keyboardType='number-pad'
                                        maxLength={70}
                                        
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => {  }}
                                        style={[styles.edittext,{height:windowHeight*5/100}]}
                                        placeholderTextColor={Colors.lightfontcolor} placeholder={Lang_chg.txtbudget[config.language]}></TextInput>
                                </View>

                            </View>



                             <View style={styles.mainview1}>
                                <Text style={[styles.txtitem1, { }]}>{Lang_chg.Specific1[config.language]}</Text>
                           
                                <View style={{ width: '94%',alignSelf:'center' }}>
                                    <TextInput
                                        value={"" + this.state.specificitem + ""}
                                        onChangeText={(txt) => { this.setState({  specificitem: txt }) }}
                                        keyboardType='default'
                                        maxLength={150}
                                        multiline={true}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => {  }}
                                        style={[styles.edittext,{textAlignVertical:'top',height:windowHeight*7/100}]}
                                        placeholderTextColor={Colors.lightfontcolor} placeholder={Lang_chg.txtspecificitem[config.language]}></TextInput>
                                </View>
                                
                            </View>


                            {/* <Text style={[styles.txtitem, { marginTop: windowHeight * 3 / 100 }]}>{Lang_chg.txtuploadphoto[config.language]}</Text>
                            <Text style={[styles.edittext,{ }]}>{"Upload example photos of what you're seeking"}</Text> */}

                            <Text style={[styles.txtitem1, { marginTop: windowHeight * 3 / 100,paddingHorizontal:windowWidth*3/100 }]}>{Lang_chg.txtuploadphoto1[config.language]}</Text>
                            <View style={{ width:'94%',alignSelf:'center',paddingLeft:windowWidth*3.8/100,alignItems:'flex-start', marginTop: windowHeight * 1.2 / 100}}>
                              <Text style={[styles.edittext, {textAlign:'left'}]}>{"Upload example photos of what you're seeking"}</Text>
                           </View>

                           <View style={{backgroundColor:Colors.newcolor,paddingHorizontal:windowWidth*3/100, flexDirection: 'row', width: '100%', alignSelf: 'center', marginTop: windowHeight * 2 / 100,paddingBottom:windowHeight*2/100 }}>
                                <FlatList
                                    data={this.state.photodata}
                                    horizontal={true}

                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity style={{ marginHorizontal: windowWidth*3/100, width: windowWidth * 18 / 100, height: windowWidth * 16 / 100 }} onPress={() => { this.cameraclcik(item, index) }}>
                                            {item.image == 'NA' ? <View style={{ width: '100%', height: '100%', backgroundColor: '#e3d8d8',  justifyContent: 'center' }}>
                                                <Image style={{ width: windowWidth * 4 / 100, height: windowWidth * 4 / 100, resizeMode: 'cover', alignSelf: 'center' }} source={localimag.plus} />
                                            </View> :
                                                <View style={{ width: '100%', height: '100%', backgroundColor: '#e3d8d8',  justifyContent: 'center' }}>
                                                    <ImageBackground imageStyle={{  }} style={{ width: windowWidth * 18 / 100, height: windowWidth * 16 / 100, resizeMode: 'cover', alignSelf: 'center' }} source={{ uri: item.image }} >
                                                       {item.status==false ? <TouchableOpacity onPress={() => { this.deleteiamage(index) }}>
                                                            <Image style={{ width: 20, height: 20, borderRadius: 50, alignSelf: 'flex-end' }} source={localimag.crossicon} />
                                                        </TouchableOpacity>:
                                                        <View>
                                                        {this.state.imagecount>1 && <TouchableOpacity onPress={() => { this.deleteiamage_server(index) }}>
                                                            <Image style={{ width: 20, height: 20, borderRadius: 50, alignSelf: 'flex-end' }} source={localimag.crossicon} />
                                                        </TouchableOpacity>}
                                                        </View>}
                                                    </ImageBackground>


                                                </View>}


                                        </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>


                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Location') }} style={[styles.mainview, {backgroundColor:Colors.newcolor1  }]}>
                               
                               <Text style={[styles.txtitem1, { }]}>{Lang_chg.Location1[config.language]}</Text>
                              
                                   <View style={[styles.txtview,{marginLeft:windowWidth*2/100}]}>
                                    <Text style={[styles.edittext, {}]}>{this.state.location} </Text>
                                </View>
                               
                            </TouchableOpacity>

                            {/* <TouchableOpacity onPress={() => { this.editadspost() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 10 / 100, }]}>

                                <Text style={styles.txtlogin}>{Lang_chg.submit[config.language]}</Text>
                            </TouchableOpacity> */}
                        </View>


                    </View>
                </ScrollView>
                </KeyboardAvoidingView>



            </View>
        )
    }
}



const styles = StyleSheet.create({


    edittext: { fontSize: windowWidth * 3.4 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.lightfontcolor, },
    edittext1: { fontSize: windowWidth * 3.5 / 100,  paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.theme_color1, },
    
    img: {
        width: windowWidth * 24 / 100,
        height: windowWidth * 24 / 100,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },
    mainview1: { paddingHorizontal:windowWidth*3/100,  width: '100%',height:windowHeight*13/100, paddingVertical: windowHeight * 1.5 / 100, backgroundColor:Colors.newcolor1,  alignSelf: 'center', justifyContent: 'center', },
    mainview: { paddingHorizontal:windowWidth*3/100,height:windowHeight*13/100, width: '100%',   alignSelf: 'center',justifyContent:'center' },
    imageview: { width: '10%', paddingTop: windowHeight * .6 / 100, alignItems: 'center' },
    txtview: { width: '94%', paddingVertical: windowHeight * 1 / 100,alignSelf:'center' },

    icon: {
        width: windowWidth * 4 / 100,
        height: windowWidth * 4 / 100,
        resizeMode: 'cover', alignSelf: 'center'
    },

    txteditemail: { paddingVertical: windowHeight * .1 / 100, fontSize: windowWidth * 3.7 / 100, width: '100%', fontFamily: Font.Poppins_Bold, color: Colors.lightfontcolor },
    txtitem: {
        width: '100%', paddingVertical: windowWidth * .1 / 100, fontSize: windowWidth * 4.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: windowWidth * 0 / 100

    },
    txtitem1: {
        width: '100%', paddingVertical: windowWidth * .1 / 100, fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: windowWidth * 0 / 100

    },
    // edittext:{fontSize: windowWidth * 3.7 / 100, width: '100%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.lightfontcolor,},
   
    // img: {
    //     width: windowWidth * 24 / 100,
    //     height: windowWidth * 24 / 100,
    //     resizeMode: 'contain',
    //     alignSelf: 'center'
    // },
    // txtlogin: {
    //     fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    // },
    // // viewstyle:{ width: '90%', alignItems: 'center', alignSelf: 'center'},
    // mainview: { width: '100%', flexDirection: 'row', borderBottomColor: 'red', borderBottomWidth: 1, alignSelf: 'center', },
    // imageview: { width: '10%', justifyContent: 'center', alignItems: 'center' },
    // txtview: { width: '90%' ,paddingVertical:windowHeight*1/100},

    // icon: {
    //     width: windowWidth * 4 / 100,
    //     height: windowWidth * 4 / 100,
    //     resizeMode: 'cover', alignSelf: 'center'
    // },

    // txteditemail: { paddingVertical: windowHeight * .5 / 100, fontSize: windowWidth * 3.7 / 100, width: '100%', fontFamily: Font.Poppins_Bold, color: Colors.lightfontcolor },
    // txtitem: {
    //     width: '100%', paddingVertical: windowWidth * .1 / 100,fontSize: windowWidth * 4.4 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', marginHorizontal: windowWidth * 0 / 100
        
    // },

});