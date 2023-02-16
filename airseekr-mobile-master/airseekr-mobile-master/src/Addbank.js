import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView, ViewBase } from 'react-native'
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';
import FastImage from 'react-native-fast-image'
import Footer from './Provider/Footer';
import Carousel from 'react-native-banner-carousel';
import CountDown from 'react-native-countdown-component';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { localimag } from '../src/Provider/Localimage';
import { color } from 'react-native-reanimated';
import RBSheet from "react-native-raw-bottom-sheet";
import DatePicker from 'react-native-date-picker'
export default class Addbank extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showdate:'',
            user_id:'',
            firstname:'',
            lastname:'',
            email:'',
            bankname:'',
            address1:'',
            address2:'',
            city:'',
            states:'',
            zipcode:'',
            accountno:'',
            rounting:'',
            mobile:'',
            choosdate:'Choose date Of birth',
            row_date: new Date(),
            redirect:this.props.route.params.redirect
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
        });
        this.getvalue()
    }

    setdate = (res) => {

        let date = res.getDate()
        let month = res.getMonth() + 1
        let year = res.getFullYear()
        let date1= date + '-' + month + '-' + year
        let date2 = year + '-' +date + '-' + month
        this.setState({ choosdate: date2,showdate:date2, isDatePickerVisible: false, })
        // this.setState({ date: date2, isDatePickerVisible: false, })
    }
   
//-------------------get user value from local database----------------//
    getvalue = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('user_details', user_details)
        if (user_details != null) {
            this.setState({
                user_id: user_details.user_id,
                email:user_details.email.toString(),
                mobile:user_details.mobile.toString()
               
            })
           
        }
    }

    addbank = () => {
        let firstname=this.state.firstname.trim()
        if (firstname.length <= 0) {
            msgProvider.toast(Lang_chg.firstname[config.language], 'center')
            return false;
        }
        let lastname=this.state.lastname.trim()
        if (lastname.length <= 0) {
            msgProvider.toast(Lang_chg.lastname[config.language], 'center')
            return false;
        }
        let email=this.state.email.trim()
        if (email.length <= 0) {
            msgProvider.toast(Lang_chg.emptyEmail[config.language], 'center')
            return false;
        }
        
        if (config.regemail.test(email) !== true) {
            msgProvider.toast(Lang_chg.validEmail[config.language], 'center')
            return false
        }
        let phonenum=this.state.mobile.trim()
        if (phonenum.length <= 0) {
            msgProvider.toast(Lang_chg.emptyMobile[config.language], 'center')
            return false;
        }
        
        if (phonenum.length < 8) {
            msgProvider.toast(Lang_chg.validMobile[config.language], 'center')
            return false;
        }
        let showdate=this.state.showdate.trim()
        if (showdate.length <= 0) {
            msgProvider.toast(Lang_chg.choosedob[config.language], 'center')
            return false;
        }
        let bankname=this.state.bankname.trim()
        if (bankname.length <= 0) {
            msgProvider.toast(Lang_chg.bankname[config.language], 'center')
            return false;
        }
        let address1=this.state.address1.trim()
        if (address1.length <= 0) {
            msgProvider.toast(Lang_chg.address1[config.language], 'center')
            return false;
        }
        let city=this.state.city.trim()
        if (city.length <= 0) {
            msgProvider.toast(Lang_chg.address2[config.language], 'center')
            return false;
        }
        let states=this.state.states.trim()
        if (states.length <= 0) {
            msgProvider.toast(Lang_chg.statename[config.language], 'center')
            return false;
        }
        let zipcode=this.state.zipcode.trim()
        if (zipcode.length <= 0) {
            msgProvider.toast(Lang_chg.zipcode[config.language], 'center')
            return false;
        }
        let accountno=this.state.accountno.trim()
        if (accountno.length <= 0) {
            msgProvider.toast(Lang_chg.accountno[config.language], 'center')
            return false;
        }
        let rounting=this.state.rounting.trim()
        if (rounting.length <= 0) {
            msgProvider.toast(Lang_chg.rounting[config.language], 'center')
            return false;
        }
        let url = config.baseURL + "stripe_payment/add_edit_bank_account_US.php";
        var data = new FormData();

        data.append('user_id', this.state.user_id)
        data.append('firstname', firstname)
        data.append('lastname', lastname)
        data.append('dateofbirth', showdate)
        data.append('bank_name', bankname)
        data.append('user_routing', rounting)
        data.append('user_account', accountno)
        data.append('bank_address_line_1', address1)
        data.append('bank_address_line_2', this.state.address2)
        data.append('bank_city_name', city)
        data.append('bank_state_name', states)
        data.append('bank_zip_code', zipcode)
        data.append('phone_number', phonenum)
        data.append('email', email)
        
        consolepro.consolelog('addbank_data', data)
        apifuntion.postApi(url, data).then((obj) => {
                        consolepro.consolelog('test', obj)
                        if (obj.success == 'true') {
                             localStorage.setItemObject('user_arr', obj.user_details);
                            
                                if(this.state.redirect!='setting') {
                                    this.props.navigation.replace('Offerprice')
                                }else{
                                    this.props.navigation.goBack()
                                }
                            
                          
                     
                            // var user_details = obj.user_details;
                            // localStorage.setItemObject('user_arr', user_details);
                            // msgProvider.toast(obj.msg[config.language], 'long')
                            // this.props.navigation.navigate('Profile')
            
                        } else {
                            if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
                                config.checkUserDeactivate(this.props.navigation)
                            } else {
                                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                            }
                            return false;
                        }
                    }).catch(err => {
                        consolepro.consolelog('err', err);
                    });
    }

    _closeDatePicker = () => {
        this.RBSheet.close();
      }
      setDate = (d) => {
        this.setState({ row_date: d });
      }
     _setDatePicker = () => {
        
        var res = this.state.row_date;
    
    
      if (res != '') {
       
        let date = res.getDate()
        let month = res.getMonth() + 1
        let year = res.getFullYear()
        let date1= date + '-' + month + '-' + year
        let date2 = year + '-' +date + '-' + month
        this.setState({ choosdate: date2,showdate:date2, })
    }
    
    
        this.RBSheet.close();
      }

// //-------------------call api for edit profile-----------------//
//     editprofile = () => {
//         Keyboard.dismiss()
//         let name = this.state.name.trim();
//         if (name.length <= 0) {
//             msgProvider.toast(validation.emptyFirstName[config.language], 'center')
//             return false;
//         }
//         let email = this.state.email.trim();
//         if (email.length <= 0) {
//             msgProvider.toast(validation.emptyEmail[config.language], 'center')
//             return false;
//         }

//         if (config.regemail.test(email) !== true) {
//             msgProvider.toast(validation.validEmail[config.language], 'center')
//             return false
//         }

//         let mobile = this.state.mobile.trim();
//         if (mobile.length <= 0) {
//             msgProvider.toast(validation.emptyPhone[config.language], 'center')
//             return false;
//         }
//         if (mobile.length < 10) {
//             msgProvider.toast(validation.lengthPhone[config.language], 'center')
//             return false;
//         }
//         let location = this.state.address.trim();
//         if (location.length <= 0) {
//             msgProvider.toast(validation.emptyAddress[config.language], 'center')
//             return false;
//         }


//         let url = config.baseURL + "edit_profile.php";
//         var data = new FormData();
//         data.append('user_id', this.state.user_id)
//         data.append('name', name)
//         data.append('email', email)
//         data.append("mobile", mobile)
//         data.append("address", location)
//         data.append("latitude", this.state.latitude)
//         data.append("longitude", this.state.longitude)
//         data.append("type", 0)
//         data.append("abn_number", 0)
//         if (this.state.takeimage == true) {
//             data.append('profile_pic', {
//                 uri: this.state.imagepath,
//                 type: 'image/jpg',
//                 name: 'image.jpg'
//             })
//         }
//         if (this.state.takecoverimage == true) {
//             data.append('profile_pic_cover', {
//                 uri: this.state.imagepath1,
//                 type: 'image/jpg',
//                 name: 'image.jpg'
//             })
//         }

//         apifuntion.postApi(url, data).then((obj) => {
//             consolepro.consolelog('test', obj)
//             if (obj.success == 'true') {
//                 var user_details = obj.user_details;
//                 localStorage.setItemObject('user_arr', user_details);
//                 msgProvider.toast(obj.msg[config.language], 'long')
//                 this.props.navigation.navigate('Profile')

//             } else {
//                 if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
//                     config.checkUserDeactivate(this.props.navigation)
//                 } else {
//                     msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
//                 }
//                 return false;
//             }
//         }).catch(err => {
//             consolepro.consolelog('err', err);
//         });
//     }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <RBSheet
                                    ref={ref => {
                                        this.RBSheet = ref;
                                    }}

                                    height={500}
                                    openDuration={200}
                                    closeDuration={200}
                                    customStyles={{
                                        container: {
                                        }
                                    }}
                                    >
                                    <View style={{ backgroundColor: Colors.theme_color1, paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => { this._closeDatePicker() }}>
                                        <Text style={{ color: '#ffffff', fontFamily: Font.Poppins_Bold }}>{'close'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={1} onPress={() => { this._closeDatePicker() }}>
                                        <Text style={{ color: '#ffffff', fontFamily: Font.Poppins_Bold }} onPress={() => { this._setDatePicker() }}>{Lang_chg.Done[config.language]}</Text>
                                        </TouchableOpacity>

                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                        <DatePicker

                                        date={this.state.row_date}
                                        onDateChange={(date) => this.setDate(date)}
                                        mode='date'
                                         maximumDate={new Date()}
                                        />
                                    </View>
                                    </RBSheet>
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                  <KeyboardAvoidingView style={{ flex: 1, }}
                    behavior={Platform.OS === "ios" ? "padding" : null}>
                    <ScrollView >
                        <View style={{ backgroundColor: Colors.whiteColor, paddingBottom: windowHeight * 2 / 100 }}>

                            <View style={CSSstyle.notification_header}>
                                <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                    <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                                </TouchableOpacity>
                                <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.addbank[config.language]}</Text>
                                <View >
                                    <Text >{'      '}</Text>
                                </View>
                            </View>



                            <View style={{ width: '90%', marginTop: windowHeight * 3 / 100, alignSelf: 'center', alignItems: 'flex-start' }}>
                                {/* //---------------------------------------------- */}



                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.firstname + ""}
                                            onChangeText={(txt) => { this.setState({ firstname: txt }) }}
                                            keyboardType='default'
                                            maxLength={60}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.firstname[config.language]}></TextInput>
                                    </View>

                                </View>
                              
                             
                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.lastname + ""}
                                            onChangeText={(txt) => { this.setState({ lastname: txt }) }}
                                            keyboardType='default'
                                            maxLength={60}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.lastname[config.language]}></TextInput>
                                    </View>

                                </View>
                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.email + ""}
                                            onChangeText={(txt) => { this.setState({ email: txt }) }}
                                            keyboardType='email-address'
                                            maxLength={70}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.emptyEmail[config.language]}></TextInput>
                                    </View>

                                </View>
                                <View style={styles.viewstyle}>
                                   
                                   <View style={{ width: '100%', flexDirection: 'row' }}>
                                       <Text style={{ fontSize: windowWidth * 3.5 / 100, width: '10%', fontFamily: Font.Poppins_Regular, color: Colors.blackColor, alignSelf: 'center' }}> {'+61'}</Text>
                                       <TextInput
                                           value={"" + this.state.mobile + ""}
                                           onChangeText={(txt) => { this.setState({ mobile: txt }) }}
                                           keyboardType='number-pad'
                                           maxLength={15}
                                           returnKeyLabel='done'
                                           returnKeyType='done'
                                           onSubmitEditing={() => { Keyboard.dismiss() }}
                                           style={[styles.txteditemail, {}]}
                                           placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.emptyMobile[config.language]}></TextInput>
                                   </View>

                               </View>

                               <View style={styles.viewstyle}>
                                    
                               <TouchableOpacity onPress={() => this.RBSheet.open()} style={{width: '100%', flexDirection: 'row',paddingHorizontal:3}}>
                                        <Text  style={{fontSize: windowWidth * 3.4 / 100, width: '90%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor }}>
                                            {this.state.choosdate}</Text> 
                                        {/* <DateTimePicker
                                            isVisible={this.state.isDatePickerVisible}
                                            mode="date"
                                            maximumDate={new Date()}
                                            onConfirm={(date) => { this.setdate(date) }}
                                            onCancel={() => { this.setState({ isDatePickerVisible: false }) }}
                                        /> */}
                                    </TouchableOpacity>

                                </View>
                                {/* <TouchableOpacity onPress={() => this.RBSheet.open()}
                                    style={{ marginTop: windowHeight * 2 / 100, width: '100%', paddingVertical: windowHeight * 1.5 / 100, flexDirection: 'row', borderBottomColor: 'red', borderBottomWidth: .5, alignSelf: 'center', justifyContent: 'center',}}>
                                     <Text  style={{fontSize:16,color:Colors.gray_color}}>{this.state.choosdate}</Text> 
                                      </TouchableOpacity> */}
          

                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.bankname + ""}
                                            onChangeText={(txt) => { this.setState({ bankname: txt }) }}
                                            keyboardType='default'
                                            maxLength={100}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.bankname[config.language]}></TextInput>
                                    </View>

                                </View>
                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.address1 + ""}
                                            onChangeText={(txt) => { this.setState({ address1: txt }) }}
                                            keyboardType='default'
                                            maxLength={100}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.address1[config.language]}></TextInput>
                                    </View>

                                </View>
                                {/* <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.address2 + ""}
                                            onChangeText={(txt) => { this.setState({ address2: txt }) }}
                                            keyboardType='default'
                                            maxLength={100}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.address2[config.language]}></TextInput>
                                    </View>

                                </View> */}
                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.city + ""}
                                            onChangeText={(txt) => { this.setState({ city: txt }) }}
                                            keyboardType='default'
                                            maxLength={50}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.cityname[config.language]}></TextInput>
                                    </View>

                                </View>
                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.states + ""}
                                            onChangeText={(txt) => { this.setState({ states: txt }) }}
                                            keyboardType='default'
                                            maxLength={50}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.statename[config.language]}></TextInput>
                                    </View>

                                </View>
                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.zipcode + ""}
                                            onChangeText={(txt) => { this.setState({ zipcode: txt }) }}
                                            keyboardType='number-pad'
                                            maxLength={10}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.zipcode[config.language]}></TextInput>
                                    </View>

                                </View>
                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.accountno + ""}
                                            onChangeText={(txt) => { this.setState({ accountno: txt }) }}
                                            keyboardType='number-pad'
                                            maxLength={20}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.accountno[config.language]}></TextInput>
                                    </View>

                                </View>
                                <View style={styles.viewstyle}>
                                    
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        <TextInput
                                            value={"" + this.state.rounting + ""}
                                            onChangeText={(txt) => { this.setState({ rounting: txt }) }}
                                            keyboardType='default'
                                            maxLength={15}
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail, {}]}
                                            placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.rounting[config.language]}></TextInput>
                                    </View>

                                </View>
                              
                                <TouchableOpacity onPress={() => { this.addbank() }} style={[CSSstyle.mainbutton, { marginTop: windowHeight * 7 / 100, }]}>

                                    <Text style={styles.txtlogin}>{Lang_chg.addbank1[config.language]}</Text>
                                </TouchableOpacity>


                                {/* //------------------------------------------    */}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>




            </View>
        )
    }
}



const styles = StyleSheet.create({


    viewstyle: { marginTop: windowHeight * 2 / 100, width: '100%', paddingVertical: windowHeight * 1.5 / 100, flexDirection: 'row', borderBottomColor: 'red', borderBottomWidth: .5, alignSelf: 'center', justifyContent: 'center', },
    iconview: { width: '9%', justifyContent: 'center', alignItems: 'center' },

    icon: {
        width: windowWidth * 6 / 100,
        height: windowWidth * 6 / 100,
        resizeMode: 'contain'
    },
    txteditemail: { fontSize: windowWidth * 3.5 / 100, width: '90%', paddingVertical: windowWidth * .1 / 100, fontFamily: Font.Poppins_Regular, color: Colors.blackColor },

    txtlogin: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor, alignSelf: 'center'
    },


});
