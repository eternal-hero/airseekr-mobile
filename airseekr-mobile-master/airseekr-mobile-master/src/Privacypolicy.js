import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,  Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
import CSSstyle from './css';

import HTMLView from 'react-native-htmlview';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {localimag} from '../src/Provider/Localimage';
export default class Privacypolicy extends Component {

    constructor(props) {
        super(props)
        this.state = {
           aboutus:'<style>.dot_ulli_list{margin-left: 20px;}.privacy_foter_gmail_section{width: 100%; float: left; margin-bottom: 11px;}.privacy_left{width: 15%; float: left;}.privacy_left01{width: 85%; float: left;}.privacy_left01 p{margin: 0;}.privacy_left p{margin: 0;}</style><div class="page-body panel-body"> <h3><strong>Privacy Policy</strong></h3> <div class="privacy_order_ol"> <p>This User Privacy Notice applies to your use of this website and all Airseekr applications, services (including payment services), products and tools (collectively the "Services"), regardless of how you access or use these Services, including access via mobile devices and apps.</p><h4>INTRODUCTION</h4> <p>We take our privacy obligations seriously and we are committed to making sure that we handle personal information in accordance with Australian Privacy Principles (APPs), which are contained in the Privacy Act 1988 (Privacy Act). This privacy policy sets out how we store, maintain, use and disclose personal information. Personal information is defined in the Privacy Act to mean any information or an opinion about an identified individual, or an individual who is reasonably identifiable, whether the information or opinion is true or not, and whether or not the information or opinion is recorded in a material form. By providing personal information to us, you consent to our storage, maintenance, use and disclose of your personal information in accordance with this privacy policy. We may change this privacy policy from time to time by posting an updated copy on our website and we encourage you to check our website regularly to ensure that you are aware of our most current privacy policy.</p><h4>WHAT PERSONAL DATA DO WE COLLECT AND PROCESS?</h4> <p>We collect your personal data when you use our services, create a new Airseekr account, provide us with information via a web form, add or update information in your Airseekr account or otherwise interact with us.</p><h4>PURPOSES OF DATA PROCESSING</h4> <p>We process your personal data for various purposes and based on several different legal bases that allow this proceeding. For example, we process your personal data to provide and improve our services, to provide you with a personalised user experience on this website, to contact you about your Airseekr account and our services, to provide customer service and to detect, prevent, mitigate and investigate fraudulent or illegal activity. We also share your information with third parties, including service providers acting on our behalf, for these purposes.</p><h4>TYPES OF PERSONAL INFORMATION WE COLLECT</h4> <p>The personal information we collect about you may include the following:</p><ul class="dot_ulli_list"> <li>o Name;</li><li>o Mailing or street address;</li><li>o Email address;</li><li>o Social media information;</li><li>o Telephone number and other contact details;</li><li>o Age;</li><li>o Date of birth;</li><li>o Credit card information;</li><li>o Information about your legal requirements;</li><li>o Information about your business or personal circumstances;</li><li>o Information in connection with client surveys, questionnaires and promotions;</li><li>o Your device identity and type, IP address, geo-location information, page view statistics, advertising data and standard web log information; and</li><li>o Any other information provided by you to us via this website or our online presence, or otherwise required by us or provided by you.</li></ul> <h4>HOW WE COLLECT PERSONAL INFORMATION</h4> <p>We may collect personal information either directly from you, or from third parties, including where you:</p><ul class="dot_ulli_list"> <li>o Contact us through on our website;</li><li>o Communicate with us via email, telephone, SMS, social applications (such as LinkedIn, Facebook, Twitter or Instagram) or otherwise;</li><li>o Interact with our website, social applications, services, content and advertising; and</li><li>o Invest in our business or enquire as to a potential purchase in our business.</li></ul> <p>We may also collect personal information from you when you use or access our website or our social media pages. This may be done through use of web analytics tools (including Google Analytics), ‘cookies’ or other similar tracking technologies that allow us to track and analyse your website usage. Cookies are small files that store information on your computer, mobile phone or other device and enable and allow the creator of the cookie to identify when you visit different websites. If you do not wish information to be stored as a cookie, you can disable cookies in your web browser.</p><h4>DISCLOSURE OF YOUR PERSONAL INFORMATION</h4> <p>We collect and use personal information for the following purposes:</p><ul class="dot_ulli_list"> <li>o To provide services or information to you;</li><li>o For record keeping and administrative purposes;</li><li>o To provide information about you to our contractors, employees, consultants, agents or other third parties for the purpose of providing services to you;</li><li>o To improve and optimise our service offering and customer experience;</li><li>o To comply with our legal obligations, resolve disputes or enforce our agreements with third parties;</li><li>o To send you marketing and promotional messages and other information that may be of interest to you and for the purpose of direct marketing (in accordance with the Spam Act). In this regard, we may use email, SMS, social media or mail to send you direct marketing communications. You can opt out of receiving marketing materials from us by using the optout facility provided (e.g. an unsubscribe link);</li><li>o To send you administrative messages, reminders, notices, updates, security alerts, and other information requested by you; and</li><li>o To consider an application of employment from you.</li><p>We may disclose your personal information to cloud-providers, contractors and other third parties located outside Australia. If we do so, we will take reasonable steps to ensure that any overseas recipient deals with such personal information in a manner consistent with the APPs.</p></ul> <h4>SECURITY</h4> <p>We take reasonable steps to ensure your personal information is secure and protected from misuse or unauthorised access. Our information technology systems are password protected, and we use a range of administrative and technical measure to protect these systems. However, we cannot guarantee the security of your personal information.</p><h4>STORAGE DURATION</h4> <p>Your personal data will be stored by us and our service providers in accordance with applicable data protection laws to the extent necessary for the processing purposes set out in this User Privacy Notice. Subsequently, we will delete your personal data in accordance with our data retention and deletion policy or take steps to properly render the data anonymous, unless we are legally obliged to keep your personal data longer (e.g for legal compliance, tax, accounting or auditing purposes). As far as legally permissible or required, we restrict the processing of your data instead of deleting it (e.g by restricting access to it). This applied in particular to cases where we may still need the data for the execution of the contract or for the assertion of or defence against legal claims, or where such retention is otherwise required or permitted by law. In these cases, the duration of the restriction of processing depends on the respective statutory limitation or retention periods. The data will be deleted after the relevant limitation or retention periods have expired.</p><h4>LINKS</h4> <p>Our website may contain links to other websites. Those links are provided for convenience and may not remain current or be maintained. We are not responsible for the privacy practices of those linked websites and we suggest you review the privacy policies of those websites before using them.</p><h4>REQUESTING ACCESS OR CORRECTING YOUR PERSONAL INFORMATION</h4> <p>If you wish to request access to the personal information we hold about you, please contact us using the contact details set out below including your name and contact details. We may need to verify your identity before providing you with your personal information. In some cases, we may be unable to provide you with access to all your personal information and where this occurs, we will explain why. We will deal with all requests for access to personal information within a reasonable timeframe.</p><p>If you think that any personal information we hold about you is inaccurate, please contact us using the contact details set out below and we will take reasonable steps to ensure that it is corrected.</p><h4>COMPLAINTS</h4> <p>If you wish to complain about how we handle your personal information, please contact us using the details set out below including your name and contact details. We will investigate your complaint promptly and respond to you within a reasonable time and in accordance with our legal obligations.</p><h4>CONTACT US</h4> <p>For further information about our Privacy Policy or practices please contact us using the details set out below: </p><ul class="privacy_foter_gmail_section"> <li> <div class="privacy_left"> <p>Email</p></div><div class="privacy_left01"> <p>: support@airseekr.com</p></div></li><li> <div class="privacy_left"> <p>Post</p></div><div class="privacy_left01"> <p>: Att: Privacy Team, Airseekr PO Box 192, Concord, NSW, 2137</p></div></li></ul> <p>Our privacy policy was last updated on 8 July 2021.</p></div></div>'
        }

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            this.getvalue()
         });
    }
    getvalue=()=>{
        if(config.content_arr != "NA"){
            this.setState({aboutus:config.content_arr[1].content[config.language]})
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
                                            <Text style={[CSSstyle.Notifications_title, {  }]}>{Lang_chg.privacypolicy1[config.language]}</Text>
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
