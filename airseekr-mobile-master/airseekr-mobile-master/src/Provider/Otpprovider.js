import React, { Component } from 'react'
import { Modal, Text, View,StyleSheet,TouchableOpacity,Image,Keyboard,TextInput} from 'react-native'
import {Colors,mediaprovider,config,localStorage,mobileW,localimag,Currentltlg,Lang_chg} from './utilslib/Utils';
import CountDown from 'react-native-countdown-component';
export default class Otpprovider extends Component {
    constructor(props) {
        super(props);
        this.state = {

           otptime:false,
          };
         }
      render() {
        return (
            <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.otpmodal}
            onRequestClose={() => { console.log('phone mode') }}
            >
            <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center"}}>
                <View style={{ backgroundColor: Colors.whiteColor, borderRadius: 20, width: mobileW * 80 / 100, }}>
                  <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ modalVisible: true }) }} >
                    <View style={{ padding: 10, width: mobileW * 80 / 100, paddingHorizontal: 20 }}>
                      <Text style={{ alignSelf: "center", fontSize: 26, fontFamily: 'Piazzolla-Bold' }}>{Lang_chg.verificationotp[config.language]}</Text>
                      <Text style={{ fontFamily: 'Piazzolla-Bold', alignSelf: "center" }}>{Lang_chg.verificationcodeheding[config.language]}</Text>
                   {this.props.email!=null &&   <Text style={{ fontFamily: 'Piazzolla-Bold', alignSelf: "center" }}>{Lang_chg.phoneotp[config.language]} : {this.props.email}</Text>}
                       <TextInput
                        placeholder={Lang_chg.Enter_otp[config.language]}
                        placeholderTextColor='#d1d1d1'
                        keyboardType='number-pad'
                        returnKeyLabel='done'
                        returnKeyType='done'
                        ref={(input) =>{this.otp=input;}}
                        onSubmitEditing={()=>{Keyboard.dismiss()}}
                        onFocus={() => {this.setState({errorno:0,activeinput:1})}}
                        onChangeText={(txt) => { this.setState({ otp: txt }) }}
                        maxLength={4}
                        style={{ fontFamily: 'Piazzolla-Regular',textAlign:'center', paddingLeft: 10, marginHorizontal: 30, borderWidth: 2, borderColor: Colors.greyColor, borderRadius: 0, marginTop: 10, fontSize: 16, height: 40 }}
                        value={this.props.otp!=null?this.props.otp:null}
                      />

                    </View>
                    <View
                      style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                        marginTop: 20, width: '100%'
                      }}
                    ></View>
                    <View style={{ marginBottom: 25, flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
                    {this.props.showcount == false && <View style={{alignSelf:'center'}}>
                        <CountDown
                        until={60 * 2}
                        size={mobileW*4/100}
                        onFinish={() => {this.props.hidecount()}}
                        digitStyle={{backgroundColor: '#FFF'}}
                        digitTxtStyle={{color:Colors.otpcountcolor}}
                        timeLabelStyle={{color:'#eb133a',fontSize:1,}}
                        timeToShow={['M', 'S']}
                        timeLabels={{m: '', s: ''}}
                        showSeparator={true}

                    />
                     </View>}

                      {this.props.showcount == true &&
                      <View style={{alignSelf:'center'}}>
                      <TouchableOpacity onPress={() => { this.Resendotpbtn() }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Piazzolla-Bold', color: Colors.Otpresedcolor }}>{Lang_chg.resend[config.language]}</Text>
                      </TouchableOpacity>
                      </View>
                      }
                      <View style={{alignSelf:'center'}}>
                      <TouchableOpacity
                        onPress={() => { this.Otpveryfication() }}
                      >
                        <Text style={{ fontSize: 18, fontFamily: 'Piazzolla-Bold', color:Colors.otpverifycolor}}>{Lang_chg.verify[config.language]}</Text>
                      </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{position:'absolute',right:15,top:15}}>
                  <Text style={{ fontSize: 18, fontFamily: 'Piazzolla-Bold', color: Colors.otpverifycolor }} onPress={()=>{this.otpclosemodal()}}>{Lang_chg.edit[config.language]}</Text>
                  </View>
                </View>
              </View>

          </Modal>
        )
    }
}