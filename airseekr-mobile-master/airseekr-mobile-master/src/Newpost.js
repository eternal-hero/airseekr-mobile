import React, { Component } from 'react'
import {
  Text,
  BackHandler,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  View,
  StyleSheet,
  Keyboard,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';
import {
  config,
  Otpprovider,
  Mapprovider,
  apifuntion,
  Colors,
  Font,
  validation,
  mobileH,
  mobileW,
  SocialLogin,
  Cameragallery,
  mediaprovider,
  localStorage,
  Lang_chg,
  consolepro,
  msgProvider,
  msgTitle,
  msgText,
  Currentltlg,
} from './Provider/utilslib/Utils';
import CSSstyle from './css';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import Footer from './Provider/Footer';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
} from '@react-native-firebase/admob';
import { Constants } from './utils/constants';

const photodata = [
  { id: 0, image: 'NA', file: 'NA', status: false },
  { id: 1, image: 'NA', file: 'NA', status: false },
  { id: 2, image: 'NA', file: 'NA', status: false },
  { id: 3, image: 'NA', file: 'NA', status: false },
  { id: 4, image: 'NA', file: 'NA', status: false },
];
export default class Newpost extends Component {
                 constructor(props) {
                   super(props);
                   this.state = {
                     user_id: '',
                     cateagoryname: 'Choose Category',
                     seeekingitem: '',
                     budget: '',
                     specificitem: '',
                     latitude: config.latitude,
                     longitude: config.longitude,
                     location: 'Enter suburb',
                     location2: '',
                     photodata: photodata,
                     cameramodalon: false,
                   };
                 }
                 componentDidMount() {
                   let pic_arr = this.state.photodata;
                   for (let i = 0; i < pic_arr.length; i++) {
                     pic_arr[i].image = 'NA';
                   }
                   this.setState({ photodata: pic_arr });

                   this.props.navigation.addListener(
                     'focus',
                     () => {
                       this.getvalue();
                       this.getaddress();
                       // this.setState({ photodata: photodata });
                     },
                   );
                   // this.getvalue()
                 }
                 //--------------------------get user detail from local database---------------------//
                 getvalue = async () => {
                   let user_details = await localStorage.getItemObject(
                     'user_arr',
                   );
                   consolepro.consolelog(
                     'user_details',
                     user_details,
                   );
                   if (user_details != null) {
                     this.setState({
                       user_id: user_details.user_id,
                     });
                   }
                 };
                 //--------------------------get user selected address---------------------//
                 getaddress = async () => {
                   if (user_address != '') {
                     this.setState({
                       location: user_address,
                       location2: user_address2,
                       latitude: user_address_lat,
                       longitude: user_address_long,
                     });
                   }
                 };

                 _openCamera = () => {
                   mediaprovider.launchCamera().then(obj => {
                     consolepro.consolelog('imageobj', obj);
                     this.setState({ cameramodalon: false });
                     let data = this.state.photodata;
                     for (let i = 0; i < data.length; i++) {
                       if (data[i].image == 'NA') {
                         data[i].image = obj.path;
                         break;
                       }
                     }
                     this.setState({
                       photodata: data,
                     });
                   });
                 };

                 _openGellery = () => {
                   mediaprovider.launchGellery().then(obj => {
                     consolepro.consolelog('imageobj', obj);
                     this.setState({ cameramodalon: false });
                     if (obj.mime == 'image/jpeg') {
                       let data = this.state.photodata;
                       for (let i = 0; i < data.length; i++) {
                         if (data[i].image == 'NA') {
                           data[i].image = obj.path;

                           break;
                         }
                       }
                       this.setState({
                         photodata: data,
                       });
                     }
                   });
                 };
                 //-----------------check already image or not-----------------//
                 cameraclcik = (item, index) => {
                   if (item.image == 'NA') {
                     this.setState({ cameramodalon: true });
                   }
                 };
                 //--------------------------delete images---------------------//
                 deleteiamage = index => {
                   let data = this.state.photodata;
                   data[index].image = 'NA';
                   this.setState({
                     photodata: data,
                   });
                 };
                 //--------------------------Create new ads---------------------//
                 newpostadd = async () => {
                   Keyboard.dismiss();
                   let user_details = await localStorage.getItemObject(
                     'user_arr',
                   );
                   consolepro.consolelog(
                     'user_details',
                     user_details,
                   );
                   if (user_details != null) {
                     let user_id = user_details.user_id;

                     if (
                       category_id == '' ||
                       category_id == null
                     ) {
                       msgProvider.toast(
                         validation.emptycategory[
                           config.language
                         ],
                         'center',
                       );
                       return false;
                     }
                     let title = this.state.seeekingitem.trim();
                     if (title.length <= 0) {
                       msgProvider.toast(
                         validation.emptytitle[config.language],
                         'center',
                       );
                       return false;
                     }
                     let budget = this.state.budget.trim();
                     if (budget.length <= 0) {
                       msgProvider.toast(
                         validation.emptybudget[config.language],
                         'center',
                       );
                       return false;
                     }
                     let description = this.state.specificitem.trim();
                     if (description.length <= 0) {
                       msgProvider.toast(
                         validation.emptyspecific[
                           config.language
                         ],
                         'center',
                       );
                       return false;
                     }
                     let image_arr = this.state.photodata;
                     let imageavailable = false;
                     for (let j = 0; j < image_arr.length; j++) {
                       if (image_arr[j].image != 'NA') {
                         imageavailable = true;
                       }
                     }
                     // if (imageavailable == false) {
                     //     msgProvider.toast(validation.emptyadsimage[config.language], 'center')
                     //     return false;
                     // }

                     let location = user_address;
                     let location2 = user_address2;
                     if (location.length <= 0) {
                       msgProvider.toast(
                         validation.emptyAddress[
                           config.language
                         ],
                         'center',
                       );
                       return false;
                     }

                     let url =
                       config.baseURL + 'add_new_post.php';
                     var data = new FormData();
                     data.append('user_id', user_id);
                     data.append('category_id', category_id);
                     data.append('item_title', title);
                     data.append('price', this.state.budget);
                     data.append('address', location);
                     data.append('address2', location2);
                     data.append(
                       'latitude',
                       this.state.latitude,
                     );
                     data.append(
                       'longitude',
                       this.state.longitude,
                     );
                     data.append(
                       'item_description',
                       description,
                     );
                     for (let i = 0; i < image_arr.length; i++) {
                       if (image_arr[i].image != 'NA') {
                         data.append('ads_image[]', {
                           uri: image_arr[i].image,
                           type: 'image/jpg',
                           name: 'image.jpg',
                         });
                       }
                     }

                     consolepro.consolelog('send data', data);

                     apifuntion
                       .postApi(url, data)
                       .then(obj => {
                         consolepro.consolelog('test111', obj);
                         if (obj.success == 'true') {
                           homerefresh = true;

                           msgProvider.toast(
                             obj.msg[config.language],
                             'center',
                           );
                           user_address = '';
                           user_address2 = '';
                           category_id = '';
                           this.props.navigation.navigate(
                             'Homepage',
                           );
                         } else {
                           if (
                             obj.active_status == '0' ||
                             obj.msg[config.language] ==
                               msgTitle.usernotexit[
                                 config.language
                               ]
                           ) {
                             config.checkUserDeactivate(
                               this.props.navigation,
                             );
                           } else {
                             msgProvider.alert(
                               msgTitle.information[
                                 config.language
                               ],
                               obj.msg[config.language],
                               false,
                             );
                           }
                           return false;
                         }
                       })
                       .catch(err => {
                         consolepro.consolelog('err11', err);
                       });
                   }
                 };

                 render() {
                   return (
                     <TouchableOpacity
                       activeOpacity={0.9}
                       onPress={() => {
                         Keyboard.dismiss();
                       }}
                       style={{
                         flex: 1,
                         backgroundColor: Colors.whiteColor,
                       }}>
                       <SafeAreaView
                         style={{
                           flex: 0,
                           backgroundColor: Colors.newcolor1,
                         }}
                       />
                       <StatusBar
                         barStyle="light-content"
                         backgroundColor={Colors.newcolor1}
                         hidden={false}
                         translucent={false}
                         networkActivityIndicatorVisible={
                           true
                         }
                       />

                       <Cameragallery
                         mediamodal={
                           this.state.cameramodalon
                         }
                         Camerapopen={() => {
                           this._openCamera();
                         }}
                         Galleryopen={() => {
                           this._openGellery();
                         }}
                         Canclemedia={() => {
                           this.setState({
                             cameramodalon: false,
                           });
                         }}
                       />

                       <KeyboardAvoidingView
                         style={{
                           flex: 1,
                           backgroundColor:
                             Colors.whiteColor,
                         }}
                         behavior={
                           Platform.OS === 'ios'
                             ? 'padding'
                             : null
                         }>
                         <BannerAd
                           //  unitId={TestIds.BANNER}
                           unitId={
                             Platform.OS === 'android'
                               ? Constants.admob_android_unit_id
                               : Constants.admob_ios_unit_id
                           }
                           size={BannerAdSize.SMART_BANNER}
                         />
                         <ScrollView>
                           <View
                             style={{
                               backgroundColor:
                                 Colors.newcolor,
                               paddingBottom:
                                 (windowHeight * 2) / 100,
                             }}>
                             <View
                               style={[
                                 CSSstyle.notification_header,
                                 {
                                   backgroundColor:
                                     Colors.newcolor1,
                                   elevation: 1,
                                   shadowColor: '#000',
                                   shadowOffset: {
                                     width: 2,
                                     height: 2,
                                   },
                                   shadowOpacity: 0.2,
                                   paddingTop: 10,
                                   paddingBottom: 10,
                                 },
                               ]}>
                               <TouchableOpacity
                                 activeOpacity={0.7}
                                 style={{
                                   width:
                                     (windowWidth * 33) /
                                     100,
                                   padding: 5,
                                 }}
                                 onPress={() => {
                                   this.setState({
                                     photodata: photodata,
                                   });
                                   this.props.navigation.goBack();
                                 }}>
                                 <Image
                                   resizeMode="contain"
                                   style={
                                     CSSstyle.hole_top_l1
                                   }
                                   source={
                                     localimag.leftarrow
                                   }
                                 />
                               </TouchableOpacity>
                               <View
                                 style={{
                                   width:
                                     (windowWidth * 33) /
                                     100,
                                   justifyContent: 'center',
                                 }}>
                                 <Text
                                   style={[
                                     CSSstyle.Notifications_title,
                                     {},
                                   ]}>
                                   {
                                     Lang_chg.txtpost1[
                                       config.language
                                     ]
                                   }
                                 </Text>
                               </View>

                               <View
                                 style={{
                                   justifyContent: 'center',
                                   width:
                                     (windowWidth * 30) /
                                     100,
                                   justifyContent: 'center',
                                   alignItems: 'flex-end',
                                   paddingHorizontal:
                                     (windowWidth * 0) / 100,
                                 }}>
                                 <TouchableOpacity
                                   style={{
                                     paddingHorizontal:
                                       (windowWidth * 2) /
                                       100,
                                   }}
                                   onPress={() => {
                                     this.newpostadd();
                                   }}>
                                   <Text
                                     style={[
                                       styles.edittext1,
                                     ]}>
                                     {'Submit'}
                                   </Text>
                                 </TouchableOpacity>
                               </View>
                             </View>

                             <View
                               style={{
                                 width: '100%',
                                 alignItems: 'center',
                                 alignSelf: 'center',
                               }}>
                               <TouchableOpacity
                                 onPress={() => {
                                   this.props.navigation.navigate(
                                     'Selectcategorie',
                                   );
                                 }}
                                 style={[
                                   styles.mainview,
                                   {
                                     marginTop:
                                       (windowHeight * 0.5) /
                                       100,
                                     backgroundColor:
                                       Colors.newcolor,
                                   },
                                 ]}>
                                 <Text
                                   style={[
                                     styles.txtitem1,
                                     {},
                                   ]}>
                                   {
                                     Lang_chg.category1[
                                       config.language
                                     ]
                                   }
                                 </Text>

                                 <View
                                   style={styles.txtview}>
                                   {category_id == '' ||
                                   category_id == null ? (
                                     <Text
                                       style={[
                                         styles.edittext,
                                         {},
                                       ]}>
                                       {
                                         this.state
                                           .cateagoryname
                                       }{' '}
                                     </Text>
                                   ) : (
                                     <Text
                                       style={[
                                         styles.edittext,
                                         {},
                                       ]}>
                                       {categoryname}{' '}
                                     </Text>
                                   )}
                                 </View>
                                 {/* <View style={styles.imageview}>
                                    <Image style={styles.icon} source={localimag.selectarrowicon}></Image>
                                </View> */}
                               </TouchableOpacity>

                               <View
                                 style={[
                                   styles.mainview,
                                   {
                                     backgroundColor:
                                       Colors.newcolor1,
                                   },
                                 ]}>
                                 <Text
                                   style={[
                                     styles.txtitem1,
                                     {},
                                   ]}>
                                   {
                                     Lang_chg.whatisit1[
                                       config.language
                                     ]
                                   }
                                 </Text>

                                 <View
                                   style={{
                                     width: '94%',
                                     alignSelf: 'center',
                                   }}>
                                   <TextInput
                                     value={
                                       '' +
                                       this.state
                                         .seeekingitem +
                                       ''
                                     }
                                     onChangeText={txt => {
                                       this.setState({
                                         seeekingitem: txt,
                                       });
                                     }}
                                     keyboardType="default"
                                     maxLength={70}
                                     returnKeyLabel="done"
                                     returnKeyType="done"
                                     onSubmitEditing={() => {}}
                                     style={[
                                       styles.edittext,
                                       {
                                         height:
                                           (windowHeight *
                                             5) /
                                           100,
                                       },
                                     ]}
                                     placeholderTextColor={
                                       Colors.lightfontcolor
                                     }
                                     placeholder={
                                       Lang_chg
                                         .txtseeeingitem[
                                         config.language
                                       ]
                                     }
                                   />
                                 </View>
                               </View>

                               <View
                                 style={[
                                   styles.mainview,
                                   {
                                     backgroundColor:
                                       Colors.newcolor,
                                   },
                                 ]}>
                                 <Text
                                   style={[
                                     styles.txtitem1,
                                     {},
                                   ]}>
                                   {
                                     Lang_chg.Budget1[
                                       config.language
                                     ]
                                   }
                                 </Text>

                                 <View
                                   style={{
                                     width: '94%',
                                     alignSelf: 'center',
                                   }}>
                                   <TextInput
                                     value={
                                       '' +
                                       this.state.budget +
                                       ''
                                     }
                                     onChangeText={txt => {
                                       this.setState({
                                         budget: txt,
                                       });
                                     }}
                                     keyboardType="number-pad"
                                     maxLength={70}
                                     returnKeyLabel="done"
                                     returnKeyType="done"
                                     onSubmitEditing={() => {}}
                                     style={[
                                       styles.edittext,
                                       {
                                         height:
                                           (windowHeight *
                                             5) /
                                           100,
                                       },
                                     ]}
                                     placeholderTextColor={
                                       Colors.lightfontcolor
                                     }
                                     placeholder={
                                       Lang_chg.txtbudget[
                                         config.language
                                       ]
                                     }
                                   />
                                 </View>
                               </View>

                               <View
                                 style={styles.mainview1}>
                                 <Text
                                   style={[
                                     styles.txtitem1,
                                     {},
                                   ]}>
                                   {
                                     Lang_chg.Specific1[
                                       config.language
                                     ]
                                   }
                                 </Text>

                                 <View
                                   style={{
                                     width: '94%',
                                     alignSelf: 'center',
                                   }}>
                                   <TextInput
                                     value={
                                       '' +
                                       this.state
                                         .specificitem +
                                       ''
                                     }
                                     onChangeText={txt => {
                                       this.setState({
                                         specificitem: txt,
                                       });
                                     }}
                                     keyboardType="default"
                                     maxLength={150}
                                     multiline={true}
                                     returnKeyLabel="done"
                                     returnKeyType="done"
                                     onSubmitEditing={() => {}}
                                     style={[
                                       styles.edittext,
                                       {
                                         textAlignVertical:
                                           'top',
                                         height:
                                           (windowHeight *
                                             7) /
                                           100,
                                       },
                                     ]}
                                     placeholderTextColor={
                                       Colors.lightfontcolor
                                     }
                                     placeholder={
                                       Lang_chg
                                         .txtspecificitem[
                                         config.language
                                       ]
                                     }
                                   />
                                 </View>
                                 {/* <View style={styles.imageview}>
                                    <Image style={styles.icon} source={localimag.editarrowicon}></Image>
                                </View> */}
                               </View>

                               <Text
                                 style={[
                                   styles.txtitem1,
                                   {
                                     marginTop:
                                       (windowHeight * 3) /
                                       100,
                                     paddingHorizontal:
                                       (windowWidth * 3) /
                                       100,
                                   },
                                 ]}>
                                 {
                                   Lang_chg.txtuploadphoto1[
                                     config.language
                                   ]
                                 }
                               </Text>
                               <View
                                 style={{
                                   width: '94%',
                                   alignSelf: 'center',
                                   paddingLeft:
                                     (windowWidth * 3.8) /
                                     100,
                                   alignItems: 'flex-start',
                                   marginTop:
                                     (windowHeight * 1.2) /
                                     100,
                                 }}>
                                 <Text
                                   style={[
                                     styles.edittext,
                                     { textAlign: 'left' },
                                   ]}>
                                   {
                                     "Upload example photos of what you're seeking"
                                   }
                                 </Text>
                               </View>

                               <View
                                 style={{
                                   backgroundColor:
                                     Colors.newcolor,
                                   paddingHorizontal:
                                     (windowWidth * 3) / 100,
                                   flexDirection: 'row',
                                   width: '100%',
                                   alignSelf: 'center',
                                   marginTop:
                                     (windowHeight * 2) /
                                     100,
                                   paddingBottom:
                                     (windowHeight * 2) /
                                     100,
                                 }}>
                                 <FlatList
                                   data={
                                     this.state.photodata
                                   }
                                   horizontal={true}
                                   renderItem={({
                                     item,
                                     index,
                                   }) => {
                                     return (
                                       <TouchableOpacity
                                         style={{
                                           marginHorizontal:
                                             (windowWidth *
                                               3) /
                                             100,
                                           width:
                                             (windowWidth *
                                               18) /
                                             100,
                                           height:
                                             (windowWidth *
                                               16) /
                                             100,
                                         }}
                                         onPress={() => {
                                           this.cameraclcik(
                                             item,
                                             index,
                                           );
                                         }}>
                                         {item.image ==
                                         'NA' ? (
                                           <View
                                             style={{
                                               width: '100%',
                                               height:
                                                 '100%',
                                               backgroundColor:
                                                 '#e3d8d8',
                                               justifyContent:
                                                 'center',
                                             }}>
                                             <Image
                                               style={{
                                                 width:
                                                   (windowWidth *
                                                     4) /
                                                   100,
                                                 height:
                                                   (windowWidth *
                                                     4) /
                                                   100,
                                                 resizeMode:
                                                   'cover',
                                                 alignSelf:
                                                   'center',
                                               }}
                                               source={
                                                 localimag.plus
                                               }
                                             />
                                           </View>
                                         ) : (
                                           <View
                                             style={{
                                               width: '100%',
                                               height:
                                                 '100%',
                                               backgroundColor:
                                                 '#e3d8d8',
                                               justifyContent:
                                                 'center',
                                             }}>
                                             <ImageBackground
                                               imageStyle={{}}
                                               style={{
                                                 width:
                                                   (windowWidth *
                                                     18) /
                                                   100,
                                                 height:
                                                   (windowWidth *
                                                     16) /
                                                   100,
                                                 resizeMode:
                                                   'cover',
                                                 alignSelf:
                                                   'center',
                                               }}
                                               source={{
                                                 uri:
                                                   item.image,
                                               }}>
                                               <TouchableOpacity
                                                 onPress={() => {
                                                   this.deleteiamage(
                                                     index,
                                                   );
                                                 }}>
                                                 <Image
                                                   style={{
                                                     width: 20,
                                                     height: 20,
                                                     borderRadius: 50,
                                                     alignSelf:
                                                       'flex-end',
                                                   }}
                                                   source={
                                                     localimag.crossicon
                                                   }
                                                 />
                                               </TouchableOpacity>
                                             </ImageBackground>
                                           </View>
                                         )}
                                       </TouchableOpacity>
                                     );
                                   }}
                                   keyExtractor={(
                                     item,
                                     index,
                                   ) => index.toString()}
                                 />
                               </View>
                               <TouchableOpacity
                                 onPress={() => {
                                   this.props.navigation.navigate(
                                     'Location',
                                   );
                                 }}
                                 style={[
                                   styles.mainview,
                                   {
                                     backgroundColor:
                                       Colors.newcolor1,
                                   },
                                 ]}>
                                 <Text
                                   style={[
                                     styles.txtitem1,
                                     {},
                                   ]}>
                                   {
                                     Lang_chg.Location1[
                                       config.language
                                     ]
                                   }
                                 </Text>

                                 <View
                                   style={[
                                     styles.txtview,
                                     {
                                       marginLeft:
                                         (windowWidth * 2) /
                                         100,
                                     },
                                   ]}>
                                   {config.newaddress ==
                                     '' ||
                                   config.newaddress ==
                                     null ? (
                                     <Text
                                       style={[
                                         styles.edittext,
                                         {},
                                       ]}>
                                       {this.state.location}{' '}
                                     </Text>
                                   ) : (
                                     <Text
                                       style={[
                                         styles.edittext,
                                         {},
                                       ]}>
                                       {config.newaddress}{' '}
                                     </Text>
                                   )}
                                 </View>
                                 {/* <View style={styles.imageview}>
                                    <Image style={styles.icon} source={localimag.locationicon}></Image>
                                </View> */}
                               </TouchableOpacity>

                               {/* <TouchableOpacity onPress={() => { this.newpostadd() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 10 / 100, }]}>

                                <Text style={styles.txtlogin}>{Lang_chg.submit[config.language]}</Text>
                            </TouchableOpacity> */}
                             </View>
                           </View>
                         </ScrollView>
                       </KeyboardAvoidingView>
                     </TouchableOpacity>
                   );
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

});