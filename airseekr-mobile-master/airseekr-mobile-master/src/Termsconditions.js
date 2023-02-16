import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,  Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

import HTMLView from 'react-native-htmlview';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {localimag} from '../src/Provider/Localimage';
export default class Termsconditions extends Component {

    constructor(props) {
        super(props)
        this.state = {
            aboutus:''
           // aboutus:'Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remainsWarner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains Warner Bros. Movie World is a theme park on the Gold Coast in Queensland, Australia. It is owned and operated by Village Roadshows Theme Parks division. After a star-studded opening ceremony on 2 June 1991, the park opened the following day. Many park attractions are based on Warner Bros. and related DC Comics properties, including thrill rides such as Batwing Spaceshot and Superman Escape, family attractions such as Justice League: Alien Invasion 3D and Wild West Falls Adventure Ride, entertainment at the Roxy Theatre and the Hollywood Stunt Driver live show. Film characters regularly roam the grounds to interact and take photos with guests. Each afternoon, characters participate in a parade along Main Street. The seasonal Fright Nights and White Christmas events are hosted annually. The park has survived financial hardships and remains'
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
         });
    }
    getvalue=()=>{
        if(config.content_arr != "NA"){
            this.setState({aboutus:config.content_arr[2].content[config.language]})
        }
    }
    
    
    render() {

        return (
            <View style={{ flex: 1, }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color1} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                  
                     <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                                        <View style={CSSstyle.notification_header}>
                                            <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                                            </TouchableOpacity>
                                            <Text style={[CSSstyle.Notifications_title, {  }]}>{Lang_chg.termcondition111[config.language]}</Text>
                                            <View >
                                                <Text ></Text>
                                            </View>
                                      </View> 
                        
                     <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{padding:20}}>
                                 <HTMLView
                                    value={this.state.aboutus}
                                    stylesheet={styles}
                                />
                           
                          </View>
                    </ScrollView>



                      </View>
                    

              </View>         
                   

                  
        )
    }
}



const styles = StyleSheet.create({
    // p: {
  
    //     color: 'black', // make links coloured pink
    //      textAlign:'justify',
    //     marginBottom: -50,
    //     lineHeight: 24,
    //     letterSpacing: 0.8,
    //     fontStyle: 'normal',
    //     fontFamily: Font.Poppins_Regular,
    //   },
    textfont: {
        fontFamily: Font.Poppins_Regular,
        fontSize: 13,
        paddingLeft: 10
      },
      p: {
        fontWeight: '300',
        color: 'black', // make links coloured pink
        // textAlign:'justify',
        marginBottom: -50,
        lineHeight: 24,
        letterSpacing: 0.8,
        fontStyle: 'normal',
        fontFamily: Font.Poppins_Regular
      },
    terms_txt: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
      },
});