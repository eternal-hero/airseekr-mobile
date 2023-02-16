import React, { Component } from "react";
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
} from "react-native";
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
  handleback,
} from "./Provider/utilslib/Utils";
import CSSstyle from "./css";
import Swiper from "react-native-swiper";
import FastImage from "react-native-fast-image";
import Footer from "./Provider/Footer";
import Carousel from "react-native-banner-carousel";
import CountDown from "react-native-countdown-component";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { localimag } from "../src/Provider/Localimage";
import { color } from "react-native-reanimated";
import NetInfo from "@react-native-community/netinfo";
import { firebaseprovider } from "./Provider/FirebaseProvider";
import firebase from "./Config1";

import * as Animatable from "react-native-animatable";

export default class Inbox extends Component {

  constructor(props) {
    super(props);
    this.state = {

      Email: "",
      isConnected: true,
      loadMoreloading: false,
      page: "message",
      inboxmessage: [],
      inboxmessage2: "NA",
      inboxmessage_by: "NA",
      inboxmessage_by2: "NA",
      inboxmessage_sel: "NA",
      inboxmessage_sel2: "NA",
      loading: false,
      idex1: 0,
      modalVisible1: false,
      notification_arr: "NA",
      refresh: false,
      search: "",
      issearching: false,
      isedit: false,
      user_id: "",
      is_serach: false,
      txtsearch: "",
      item_arr: "NA",
      addtocart: false,
      product_detail: "NA",
      product_id: "NA",
      product_name: "Iphonex",
      modalReport: false,
      activeindex: 0,
      // product_id: this.props.route.params.product_id,


    };
    this._didFocusSubscription = props.navigation.addListener("focus", payload =>
      BackHandler.addEventListener("hardwareBackPress", handleback.handleBackPress),
    );
  }

  componentDidMount() {
    console.log('----------')
    this._willBlurSubscription = this.props.navigation.addListener("blur", payload =>
      BackHandler.removeEventListener("hardwareBackPress", handleback.handleBackPress),
    );
    NetInfo.fetch().then(state => {
      this.setState({ isConnected: state.isConnected });
    });
    this.props.navigation.addListener("focus", () => {
      this.setState({
        search: "",
        issearching: false,
        isedit: false,
      });
      this.getMyInboxAllData1();
      firebaseprovider.firebaseUserGetInboxCount();
      this.showUserInbox();
    });

    // this.getvalue()
  }

  getMyInboxAllData1 = async () => {

    consolepro.consolelog("getMyInboxAllData123");
    const userdata = await localStorage.getItemObject("user_arr");
    //------------------------------ firbase code get user inbox ---------------
    if (userdata != null) {
      // alert("himanshu");
      this.setState({ user_id: userdata.user_id });
      var id = "u_" + userdata.user_id;
      consolepro.consolelog("inboxoffcheck", inboxoffcheck);
      if (inboxoffcheck > 0) {
        consolepro.consolelog("getMyInboxAllDatainboxoffcheck11");
        var queryOffinbox = firebase.database().ref("users/" + id + "/myInbox/").child(userChatIdGlobal);

        // queryOffinbox.off('child_added');
        queryOffinbox.off("child_changed");
      }

      var queryUpdatemyinboxmessage = firebase.database().ref("users/" + id + "/myInbox/");
      queryUpdatemyinboxmessage.on("child_changed", (data) => {
        consolepro.consolelog("inboxkachildchangemessage", data.toJSON());
        setTimeout(() => {
          this.showUserInbox();
        }, 3000);


      });
      var queryUpdatemyinboxadded = firebase.database().ref("users/" + id + "/myInbox/");
      queryUpdatemyinboxadded.on("child_added", (data) => {
        consolepro.consolelog("inboxkaadded", data.toJSON());
        setTimeout(() => {
          this.showUserInbox();
        }, 3000);

        // firebaseprovider.firebaseUserGetInboxCount();
      });
    }
  };

  convertTimeAllFormat = (time11, format) => {
    consolepro.consolelog(" convertTimeAllFormat time11", time11);
    time11 = parseInt(time11);

    var date1 = new Date(time11);

    var curr_day = date1.getDay();
    var curr_date = date1.getDate();
    var curr_month = date1.getMonth(); //Months are zero based
    var curr_year = date1.getFullYear();

    var hours = date1.getHours();
    var minutes = date1.getMinutes();

    // consoleProvider.log('hours',hours);
    // consoleProvider.log('minutes',minutes);

    if (format == 12) {
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
    } else if (format == 24) {
      var ampm = hours >= 12 ? "PM" : "AM";
      //hours = hours < 10 ? '0'+hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes;
    } else if (format == "other") {

      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTimeAll = hours + ":" + minutes + " " + ampm;
      var strTime = curr_date + ". " + m_names_sort[curr_month] + " " + curr_year + " " + strTimeAll;
    } else if (format == "ago") {
      var strTime = timeSince(new Date(time11));
      //consoleProvider.log(new Date(time11));
    } else if (format == "date_time") {
      var date = new Date(time11);

      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = Math.floor(seconds / 3600);
      if (interval <= 24) {
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + " " + ampm;
      } else {
        var curr_month = date1.getMonth() + 1; //Months are zero based
        var curr_year = date1.getFullYear();
        var curr_year_small = String(curr_year);
        consolepro.consolelog("curr_year_small", curr_year_small);
        curr_year_small = curr_year_small.substring(2, 4);
        consolepro.consolelog("curr_year_small", curr_year_small);
        var strTime = curr_month + "/" + curr_date + "/" + curr_year_small;
      }
    } else if (format == "date_time_full") {
      var date = new Date(time11);

      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = Math.floor(seconds / 3600);
      if (interval <= 24) {
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + " " + ampm;
      } else {
        var curr_month = date1.getMonth() + 1; //Months are zero based
        var curr_year = date1.getFullYear();
        var curr_year_small = String(curr_year);
        consolepro.consolelog("curr_year_small", curr_year_small);
        curr_year_small = curr_year_small.substring(2, 4);
        consolepro.consolelog("curr_year_small", curr_year_small);

        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTimeAll = hours + ":" + minutes + " " + ampm;

        var strTime = curr_month + "/" + curr_date + "/" + curr_year_small + " " + strTimeAll;
      }

    }

    return strTime;
  };
  showUserInbox = async () => {
    consolepro.consolelog("showUserInboxmesssagepabgewala");
    let userdata = await localStorage.getItemObject("user_arr");
    var user_id = userdata.user_id;
    var login_type = userdata.login_type;
    inboxoffcheck = 1;
    var inbox = [];
    var inboxsel = [];
    var inboxbuy = [];
    consolepro.consolelog("FirebaseInboxJson get in-box121", FirebaseInboxJson);
    var len = FirebaseInboxJson.length;
    consolepro.consolelog("FirebaseInboxJson len", len);
    //$('.showConversationsCount').text(len);
    if (len > 0) {
      // $('#chat_meassage_inbox_list').html('');
      // $('#no_data_home').hide()
      FirebaseInboxJson.sort((a, b) => {
        var x = a.lastMsgTime, y = b.lastMsgTime;
        return x > y ? -1 : x < y ? 1 : 0;
      });
      consolepro.consolelog("FirebaseInboxJsonmessage", FirebaseInboxJson);
      console.log("FirebaseInboxJsonmessage", FirebaseInboxJson);
      let other_user_id55 = 0;
      // $.each(FirebaseInboxJson,function(index,keyValue)
      for (let k = 0; k < FirebaseInboxJson.length; k++)
        // FirebaseInboxJson.map((keyValue)=>
      {
        let keyValue = FirebaseInboxJson[k];
        console.log("FirebaseInboxJson[k]", FirebaseInboxJson[k]);
        if (keyValue.user_id !== other_user_id55) {
          consolepro.consolelog("message user_id", keyValue);
          var other_user_id = keyValue.user_id;
          var blockstatus = keyValue.block_status;
          other_user_id55 = keyValue.user_id;
          consolepro.consolelog("other_user_id55", other_user_id55);
          consolepro.consolelog("other_user_id", other_user_id);
          consolepro.consolelog("FirebaseUserJson", FirebaseUserJson);
          var user_data_other = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);
          consolepro.consolelog("user_data_other", user_data_other);
          if (user_data_other != -1) {
            var userDataMe = FirebaseUserJson[user_data_other];

            consolepro.consolelog("userdata", userDataMe);
            var count = keyValue.count;
            var lastMessageType = keyValue.lastMessageType;
            var lastMsg = keyValue.lastMsg;
            var lastMsgTime = keyValue.lastMsgTime;

            // var order_id=keyValue.order_id;
            // var order_number=keyValue.order_number;
            // var chat_type=keyValue.chat_type;

            consolepro.consolelog("lastMsg", lastMsg);
            var userId = userDataMe.user_id;
            if (userDataMe.login_type == "app") {
              var userImage = config.img_url + userDataMe.image;
            } else {
              var userImage = config.img_url + userDataMe.image;
            }

            var userName = userDataMe.name;
            var onlineStatus = userDataMe.onlineStatus;

            var lastMsgShow = "";
            if (lastMessageType == "text") {
              lastMsgShow = lastMsg;
            } else if (lastMessageType == "image") {
              lastMsgShow = "";
            }

            var imgOnline = "";
            // if(onlineStatus == 'true'){
            //   var imgOnline='<img src="img/msg_green_dot.png" class="msg_green_dot">';
            // }
            var countHtml = "";
            consolepro.consolelog("lastMsgTime", lastMsgTime);
            if (lastMsgTime != "") {
              lastMsgTime = this.convertTimeAllFormat(lastMsgTime, "date_time");
              // lastMsgTime=lastMsgTime
              countHtml = "";
            } else {
              lastMsgTime = "";
            }
            if (count > 0) {
              countHtml = count;
            }
            consolepro.consolelog("userdata.user_roll", userdata.user_roll);
            let data5 = {
              "name": userName,
              "images": userImage,
              "message": lastMsgShow,
              "time": lastMsgTime,
              "count": count,
              "other_user_id": other_user_id,
              "blockstatus": blockstatus,
              "vip_staus_me": userdata.vip_staus_me,
              "user_roll": userdata.user_roll,

            };
            consolepro.consolelog("lastMsgShowlastMsgShow", lastMsgShow);
            consolepro.consolelog("nilesh1 count", count);
            consolepro.consolelog("upervalapushdataconsole", data5);

            inbox.push(data5);
            if (userdata.user_roll == 0) {
              inboxbuy.push(data5);
            } else {
              inboxsel.push(data5);
            }
            consolepro.consolelog("pushdataconsoleafter", inbox);

          }
          consolepro.consolelog("inboxmessage", inbox);


        }


      }
    }
    this.setState({
      inboxmessage: inbox,
      inboxmessage2: inbox,
      inboxmessage_by: inboxbuy,
      inboxmessage_by: inboxbuy,
      inboxmessage_sel: inboxsel,
      inboxmessage_sel2: inboxsel,
      refresh: false,
    });

  };
  search = (text) => {
    let txt = text.trim();

    if (this.state.activeindex == 0) {
      if (txt == "") {
        this.setState({ txtsearch: txt });
        this.setState({ inboxmessage: this.state.inboxmessage2 });
      } else {
        consolepro.consolelog("this.state.inboxmessage2", this.state.inboxmessage2);
        this.setState({ txtsearch: txt });

        if (this.state.inboxmessage2 != "NA" && this.state.inboxmessage2.length > 0) {
          this.SearchFilterFunction(txt, 0, this.state.inboxmessage2);
        } else {
          this.setState({ inboxmessage: "NA" });
        }
      }

    } else if (this.state.activeindex == 1) {
      if (txt == "") {
        this.setState({ txtsearch: txt });
        this.setState({ inboxmessage_by: this.state.inboxmessage_by2 });
      } else {
        this.setState({ txtsearch: txt });
        consolepro.consolelog("this.state.inboxmessage_by2", this.state.inboxmessage_by2);
        if (this.state.inboxmessage_by2 != "NA" && this.state.inboxmessage_by2.length > 0) {
          this.SearchFilterFunction(txt, 1, this.state.inboxmessage_by2);
        } else {
          this.setState({ inboxmessage_by: "NA" });
        }

      }
    } else {
      if (txt == "") {
        this.setState({ txtsearch: txt });
        this.setState({ inboxmessage_sel: this.state.inboxmessage_sel2 });
      } else {
        this.setState({ txtsearch: txt });
        if (this.state.inboxmessage_sel2 != "NA" && this.state.inboxmessage_sel2.length > 0) {
          this.SearchFilterFunction(txt, 2, this.state.inboxmessage_sel2);
        } else {
          this.setState({ inboxmessage_sel: "NA" });
        }

      }
    }
  };
  SearchFilterFunction = (text, type, arr) => {
    //passing the inserted text in textinput
    if (text.length > 0) {
      this.setState({ issearching: true });
    } else {
      this.setState({ issearching: false });
    }

    let data1 = arr;
    consolepro.consolelog("data1", data1);
    const newData = data1.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    consolepro.consolelog(newData);
    if (newData.length > 0) {
      if (type == 0) {
        this.setState({ inboxmessage: newData, txtsearch: text });
      }
      if (type == 1) {
        this.setState({ inboxmessage_by: newData, txtsearch: text });
      }
      if (type == 2) {
        this.setState({ inboxmessage_sel: newData, txtsearch: text });
      }

    } else {
      if (type == 0) {
        this.setState({ inboxmessage: "NA" });
      }
      if (type == 1) {
        this.setState({ inboxmessage_by: "NA" });
      }
      if (type == 2) {
        this.setState({ inboxmessage_sel: "NA" });
      }

      this.setState({ msg: "This Type of data is not available", txtsearch: text });
    }

  };
  _onRefresh = () => {
    this.setState({ refresh: true });
    this.showUserInbox();
  };
  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (this.state.loadMoreloading == true) {
      return (
        <ActivityIndicator
          style={{ color: "#000" }}
        />
      );

    } else {
      return null;
    }
  };
  getvalue = async () => {
    let user_details = await localStorage.getItemObject("user_arr");
    consolepro.consolelog("user_details", user_details);
    if (user_details != null) {
      this.setState({
        user_id: user_details.user_id,
      });
      this.getitemdata();

    }
  };

  getitemdata = () => {
    let url = config.baseURL + "get_item_detail.php?user_id=" + this.state.user_id + "&product_id=" + this.state.product_id;
    consolepro.consolelog("url", url);
    apifuntion.getApi(url).then((obj) => {
      if (obj.success == "true") {
        consolepro.consolelog("itemdetail", obj);
        if (obj.product != "NA") {
          this.setState({
            item_arr: obj.product,
            product_detail: obj.product.product_detail,
            addtocart: obj.product.cart_status,
          });
        } else {

          this.props.navigation.goBack();

        }

      } else {
        if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
          config.checkUserDeactivate(this.props.navigation);
        } else {
          msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
        }
        return false;
      }

    }).catch((err) => {
      consolepro.consolelog("err", err);

    });
  };

  errorimage = (index) => {
    consolelog.consolepro("data11", this.state.inboxmessage);
    let data = this.state.inboxmessage;
    data[index].images = "NA";
    this.setState({ inboxmessage: data });
  };
  errorimageby = (index) => {
    let data = this.state.inboxmessage_by;
    data[index].images = "NA";
    this.setState({ inboxmessage_by: data });
  };
  errorimagesel = (index) => {
    let data = this.state.inboxmessage_sel;
    data[index].images = "NA";
    this.setState({ inboxmessage_sel: data });
  };


  //-------------------open notification screen------------------------//
  opennotification = () => {

    this.props.navigation.navigate("Notification");


  };
//-------------------open notification screen------------------------//
  myoffer = () => {

    this.props.navigation.navigate("Myoffer");

  };


  render() {

    return (
      <View style={{ flex: 1, backgroundColor: Colors.newcolor }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.newcolor }} />
        <StatusBar barStyle="light-content" backgroundColor={Colors.newcolor} hidden={false} translucent={false}
                   networkActivityIndicatorVisible={true} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalReport}
          onRequestClose={() => {
            this.setState({ modalReport: false });
          }}>

          <View style={{ flex: 1, backgroundColor: "#00000030", alignItems: "center" }}>
            <View style={{ position: "absolute", bottom: 2, width: windowWidth }}>
              <View style={{ alignSelf: "center", width: "100%", alignItems: "center" }}>
                <View style={{
                  width: "94%",
                  backgroundColor: Colors.mediabackground,
                  borderRadius: 15,
                  paddingVertical: windowWidth * 3.5 / 100,
                }}>
                  <View style={{
                    borderBottomColor: Colors.border_color,
                    borderBottomWidth: 1,
                    width: "100%",
                    paddingVertical: windowWidth * 2 / 100,
                  }}>
                    <Text style={{
                      fontFamily: Font.Poppins_Regular,
                      textAlign: "center",
                      fontSize: windowWidth * 3.5 / 100,
                      color: Colors.mediatextcolor,
                    }}>{Lang_chg.txtOption[config.language]}</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate("Reportpage");
                    this.setState({ modalReport: false });
                  }} style={{ width: "100%", paddingVertical: windowWidth * 2 / 100 }}>
                    <Text style={{
                      fontFamily: Font.Poppins_Regular,
                      textAlign: "center",
                      fontSize: windowWidth * 4 / 100,
                      color: Colors.mediatextcolor,
                    }}>{Lang_chg.txtReport[config.language]}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{
                marginTop: 15,
                alignSelf: "center",
                borderRadius: 15,
                backgroundColor: Colors.mediabackground,
                width: "94%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
              }}>
                <TouchableOpacity onPress={() => {
                  this.setState({ modalReport: false });
                }} style={{
                  alignSelf: "center",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: windowWidth * 3.5 / 100,
                }}>
                  <Text style={{
                    fontFamily: Font.Poppins_Regular,
                    fontSize: windowWidth * 4 / 100,
                    color: "red",
                  }}>{Lang_chg.cancelmedia[config.language]}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: Colors.newcolor, paddingBottom: windowHeight * 11 / 100 }}>

            <View style={[CSSstyle.notification_header, { backgroundColor: Colors.newcolor }]}>
              <TouchableOpacity activeOpacity={.7} style={{ justifyContent: "center" }} onPress={() => {
                this.opennotification();
              }}>
                {check_notification_num <= 0 ?
                  <Image resizeMode="contain" style={CSSstyle.icons} source={localimag.notificationicon}></Image> :
                  <Image resizeMode="contain" style={CSSstyle.icons} source={localimag.notificationss}></Image>}
              </TouchableOpacity>
              <View style={{ justifyContent: "center" }}>
                {/* <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.home[config.language]}</Text> */}

                <Text style={[CSSstyle.Notifications_title, {}]}>{"I N B O X"}</Text>
              </View>
              <TouchableOpacity activeOpacity={.7} style={{ justifyContent: "center" }} onPress={() => {
                this.myoffer();

              }}>
                <Image resizeMode="contain" style={{
                  width: windowWidth * 7 / 100,
                  height: windowWidth * 7 / 100,
                  resizeMode: "contain",
                }} source={localimag.blackoffericon}></Image>
              </TouchableOpacity>

            </View>


            {/* <View style={[CSSstyle.notification_header, { paddingTop: 10, paddingBottom: 10, }]}>
                    {!this.state.is_serach &&  <View style={{ padding: 2, justifyContent: 'center' }} >
                                <Text>{'         '}</Text>
                            </View>}

                            {!this.state.is_serach && <Text style={[CSSstyle.Notifications_title, {}]}>{Lang_chg.txtinbox[config.language]}</Text>}
                           {!this.state.is_serach && <TouchableOpacity onPress={() => {this.setState({is_serach:!this.state.is_serach}) }} style={{ padding: 2,justifyContent:'center' }} >
                                <Image style={[CSSstyle.icons, { resizeMode: "contain", }]} source={localimag.searchicon}></Image>
                            </TouchableOpacity>}
                            {this.state.is_serach &&  <View style={{backgroundColor:Colors.homebg, borderRadius:10, width:windowWidth*95/100,height:windowHeight*5/100,flexDirection:'row'}}>
                            <TextInput
                                 value={"" + this.state.txtsearch + ""}
                                        onChangeText={(txt) => {this.search(txt)  }}
                                        keyboardType='default'
                                       // secureTextEntry={this.state.secureoldpassword}
                                        maxLength={40}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        style={ [styles.txtaddtype,{}]}
                                         placeholderTextColor={Colors.blackColor} placeholder={Lang_chg.Search1[config.language]}></TextInput>
                            <TouchableOpacity onPress={() => {this.search("") }} style={{ padding: 2,justifyContent:'center' }} >
                                <Image style={[ {width:windowWidth*4/100,  height:windowWidth*4/100, resizeMode: 'contain', resizeMode: "contain", }]} source={localimag.cross}></Image>
                            </TouchableOpacity>
                            </View>}


                        </View> */}
            <View style={{ width: "100%", backgroundColor: Colors.newcolor }}>
              <View style={{
                flexDirection: "row", justifyContent: "space-between", width: "100%",
              }}>
                <TouchableOpacity onPress={() => {
                  this.setState({
                    activeindex: 0,
                    is_serach: false,
                    txtsearch: "",
                    inboxmessage_sel: this.state.inboxmessage_sel2,
                    inboxmessage_by: this.state.inboxmessage_by2,
                  });
                }} activeOpacity={.7}
                                  style={this.state.activeindex == 0 ? [styles.styletopbar, { borderBottomColor: Colors.theme_color1 }] : [styles.styletopbar, { borderBottomColor: Colors.border_color1 }]}>
                  {this.state.activeindex == 0 ?
                    <Text style={[styles.Notifications_title, {}]}>{Lang_chg.txtinboxall[config.language]}</Text> :
                    <Text
                      style={[styles.Notifications_title, { color: Colors.border_color1 }]}>{Lang_chg.txtinboxall[config.language]}</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.setState({
                    activeindex: 1,
                    is_serach: false,
                    txtsearch: "",
                    inboxmessage_sel: this.state.inboxmessage_sel2,
                    inboxmessage: this.state.inboxmessage2,
                  });
                }} activeOpacity={.7}
                                  style={this.state.activeindex == 1 ? [styles.styletopbar, { borderBottomColor: Colors.theme_color1 }] : [styles.styletopbar, { borderBottomColor: Colors.border_color1 }]}>

                  {this.state.activeindex == 1 ?
                    <Text style={[styles.Notifications_title, {}]}>{Lang_chg.txtbuyers[config.language]}</Text> :
                    <Text
                      style={[styles.Notifications_title, { color: Colors.border_color1 }]}>{Lang_chg.txtbuyers[config.language]}</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.setState({
                    activeindex: 2,
                    is_serach: false,
                    txtsearch: "",
                    inboxmessage_by: this.state.inboxmessage_by2,
                    inboxmessage: this.state.inboxmessage2,
                  });
                }} activeOpacity={.7}
                                  style={this.state.activeindex == 2 ? [styles.styletopbar, { borderBottomColor: Colors.theme_color1 }] : [styles.styletopbar, { borderBottomColor: Colors.border_color1 }]}>
                  {this.state.activeindex == 2 ?
                    <Text style={[styles.Notifications_title, {}]}>{Lang_chg.txtsellers[config.language]}</Text> :
                    <Text
                      style={[styles.Notifications_title, { color: Colors.border_color1 }]}>{Lang_chg.txtsellers[config.language]}</Text>}

                </TouchableOpacity>
              </View>
              <View style={{
                width: "100%",
                height: 3,
                backgroundColor: Colors.border_color,
                marginTop: -3,
                zIndex: -1,
              }}/>
            </View>


            {this.state.activeindex == 0 &&
            <View
              style={{ width: "100%", marginTop: windowHeight * 1 / 100, alignItems: "center", alignSelf: "center" }}>

              {(this.state.inboxmessage == "NA" || this.state.inboxmessage.length <= 0) &&
              <Image style={{
                alignSelf: "center",
                width: windowWidth * 75 / 100,
                height: windowHeight / 3,
                marginTop: windowHeight / 5,
                resizeMode: "contain",
              }} source={localimag.nodata}/>
              }
              {this.state.inboxmessage != "NA" && this.state.inboxmessage.length > 0 &&

              this.state.inboxmessage.map((item, index) => (


                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate("Chat", {
                    "data": {
                      "other_user_id": item.other_user_id,
                      "other_user_name": item.name,
                      "image": item.images,
                      "title": "",
                      blockstatus: item.blockstatus,
                    },
                  });
                }} style={{
                  width: "100%",
                  flexDirection: "row",
                  backgroundColor: Colors.whiteColor,
                  borderBottomColor: Colors.border_color,
                  borderBottomWidth: 2,
                  paddingHorizontal: "2%",
                  alignSelf: "center",
                  marginTop: windowHeight * 1.5 / 100,
                  marginBottom: windowHeight * .2 / 100,
                  paddingBottom: windowHeight * 2 / 100,
                }}>
                  <View
                    style={{ width: "18%", paddingLeft: windowWidth * 2 / 100, marginTop: windowHeight * .5 / 100 }}>

                    {item.images == undefined ?
                      <Image source={localimag.user_profile} style={styles.profileimage} /> :
                      item.images == "NA" ?
                        <Image source={localimag.user_profile} style={styles.profileimage} /> :
                        item.images == null ?
                          <Image source={localimag.user_profile} style={styles.profileimage} /> :
                          <Animatable.Image ref={"close"}
                                            delay={400}
                                            onError={(error) => {
                                              this.errorimage(index);
                                            }}
                                            animation="zoomInUp"
                                            source={item.images != "NA" ? { uri: item.images } : localimag.user_profile}
                                            style={styles.profileimage} />
                    }
                    <View style={{
                      position: "absolute",
                      right: windowWidth * 4 / 100,
                      width: windowWidth * 4 / 100,
                      height: windowWidth * 4 / 100,
                      borderRadius: windowWidth * 2 / 100,
                      backgroundColor: "white",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <View style={{
                        width: windowWidth * 3.6 / 100,
                        height: windowWidth * 3.6 / 100,
                        borderRadius: windowWidth * 1.8 / 100,
                        backgroundColor: "red",
                      }}>
                      </View>
                    </View>


                  </View>
                  <View style={{ width: "60%" }}>
                    <View style={{}}>
                      <Text numberOfLines={1} style={styles.txtitem1}>{item.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 2, width: "100%" }}>

                      <Text style={styles.txtitem2}>{item.message}</Text>

                    </View>
                  </View>
                  <View style={{ width: "19%", alignItems: "flex-end" }}>
                    {/* {item.count > 0 ?
                                                   <View style={{width:windowWidth*4.5/100,height:windowWidth*4.5/100,backgroundColor:Colors.theme_color1,borderRadius:windowWidth*2/100,alignItems:'center',justifyContent:'center'}}>
                                                       <Text style={[styles.txtsmall,{}]}>{item.count >=10 ? '+9':item.count}</Text>
                                                     </View>:
                                                     <Text style={[styles.txtsmall,{marginTop:windowHeight*4/100,}]}>{' '}</Text>
                                                     }  */}
                    {/* <Text style={[styles.txtsmall,{marginTop:windowHeight*4/100,}]}>{item.time}</Text>  */}
                    <Text style={[styles.txtsmall, { marginTop: windowHeight * .5 / 100 }]}>{item.time}</Text>
                  </View>

                </TouchableOpacity>

              ))
              }
            </View>}

            {this.state.activeindex == 1 && <View
              style={{ width: "100%", marginTop: windowHeight * 1 / 100, alignItems: "center", alignSelf: "center" }}>
              {(this.state.inboxmessage_by == "NA" || this.state.inboxmessage_by.length <= 0) &&
              <Image style={{
                alignSelf: "center",
                width: windowWidth * 75 / 100,
                height: windowHeight / 3,
                marginTop: windowHeight / 5,
                resizeMode: "contain",
              }} source={localimag.nodata}></Image>
              }

              {this.state.inboxmessage_by != "NA" && this.state.inboxmessage_by.length > 0 &&

              this.state.inboxmessage_by.map((item, index) => (


                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate("Chat", {
                    "data": {
                      "other_user_id": item.other_user_id,
                      "other_user_name": item.name,
                      "image": item.images,
                      "title": "",
                      blockstatus: item.blockstatus,
                    },
                  });
                }} style={{
                  width: "100%",
                  flexDirection: "row",
                  backgroundColor: Colors.whiteColor,
                  borderBottomColor: Colors.border_color,
                  borderBottomWidth: 2,
                  paddingHorizontal: "2%",
                  alignSelf: "center",
                  marginTop: windowHeight * 1.5 / 100,
                  marginBottom: windowHeight * .2 / 100,
                  paddingBottom: windowHeight * 2 / 100,
                }}>
                  <View
                    style={{ width: "18%", paddingLeft: windowWidth * 2 / 100, marginTop: windowHeight * .5 / 100 }}>

                    {item.images == undefined ?
                      <Image source={localimag.user_profile} style={styles.profileimage} /> :
                      item.images == "NA" ?
                        <Image source={localimag.user_profile} style={styles.profileimage} /> :
                        item.images == null ?
                          <Image source={localimag.user_profile} style={styles.profileimage} /> :
                          <Animatable.Image ref={"close"}
                                            delay={400}
                                            onError={(error) => {
                                              this.errorimageby(index);
                                            }}
                                            animation="zoomInUp"
                                            source={item.images != "NA" ? { uri: item.images } : localimag.user_profile}
                                            style={styles.profileimage} />
                    }
                    <View style={{
                      position: "absolute",
                      right: windowWidth * 4 / 100,
                      width: windowWidth * 4 / 100,
                      height: windowWidth * 4 / 100,
                      borderRadius: windowWidth * 2 / 100,
                      backgroundColor: "white",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <View style={{
                        width: windowWidth * 3.6 / 100,
                        height: windowWidth * 3.6 / 100,
                        borderRadius: windowWidth * 1.8 / 100,
                        backgroundColor: "red",
                      }}>
                      </View>
                    </View>

                  </View>
                  <View style={{ width: "60%" }}>
                    <View style={{}}>
                      <Text numberOfLines={1} style={styles.txtitem1}>{item.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 2, width: "100%" }}>

                      <Text style={styles.txtitem2}>{item.message}</Text>

                    </View>
                  </View>
                  <View style={{ width: "19%", alignItems: "flex-end" }}>
                    {/* {item.count > 0 ?
                                                   <View style={{width:windowWidth*4.5/100,height:windowWidth*4.5/100,backgroundColor:Colors.theme_color1,borderRadius:windowWidth*2/100,alignItems:'center',justifyContent:'center'}}>
                                                       <Text style={[styles.txtsmall,{}]}>{item.count >=10 ? '+9':item.count}</Text>
                                                     </View>:
                                                     <Text style={[styles.txtsmall,{marginTop:windowHeight*4/100,}]}>{' '}</Text>
                                                     }  */}
                    <Text style={[styles.txtsmall, { marginTop: windowHeight * .5 / 100 }]}>{item.time}</Text>
                  </View>

                </TouchableOpacity>

              ))
              }
            </View>}

            {this.state.activeindex == 2 && <View
              style={{ width: "100%", marginTop: windowHeight * 1 / 100, alignItems: "center", alignSelf: "center" }}>
              {(this.state.inboxmessage_sel == "NA" || this.state.inboxmessage_sel.length <= 0) &&
              <Image style={{
                alignSelf: "center",
                width: windowWidth * 75 / 100,
                height: windowHeight / 3,
                marginTop: windowHeight / 5,
                resizeMode: "contain",
              }} source={localimag.nodata}></Image>
              }

              {this.state.inboxmessage_sel != "NA" && this.state.inboxmessage_sel.length > 0 &&

              this.state.inboxmessage_sel.map((item, index) => (


                <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate("Chat", {
                    "data": {
                      "other_user_id": item.other_user_id,
                      "other_user_name": item.name,
                      "image": item.images,
                      "title": "",
                      blockstatus: item.blockstatus,
                    },
                  });
                }} style={{
                  width: "100%",
                  flexDirection: "row",
                  backgroundColor: Colors.whiteColor,
                  borderBottomColor: Colors.border_color,
                  borderBottomWidth: 2,
                  paddingHorizontal: "2%",
                  alignSelf: "center",
                  marginTop: windowHeight * 1.5 / 100,
                  marginBottom: windowHeight * .2 / 100,
                  paddingBottom: windowHeight * 2 / 100,
                }}>
                  <View
                    style={{ width: "18%", paddingLeft: windowWidth * 2 / 100, marginTop: windowHeight * .5 / 100 }}>

                    {item.images == undefined ?
                      <Image source={localimag.user_profile} style={styles.profileimage} /> :
                      item.images == "NA" ?
                        <Image source={localimag.user_profile} style={styles.profileimage} /> :
                        item.images == null ?
                          <Image source={localimag.user_profile} style={styles.profileimage} /> :
                          <Animatable.Image ref={"close"}
                                            delay={400}
                                            onError={(error) => {
                                              this.errorimagesel(index);
                                            }}
                                            animation="zoomInUp"
                                            source={item.images != "NA" ? { uri: item.images } : localimag.user_profile}
                                            style={styles.profileimage} />
                    }

                    <View style={{
                      position: "absolute",
                      right: windowWidth * 4 / 100,
                      width: windowWidth * 4 / 100,
                      height: windowWidth * 4 / 100,
                      borderRadius: windowWidth * 2 / 100,
                      backgroundColor: "white",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <View style={{
                        width: windowWidth * 3.6 / 100,
                        height: windowWidth * 3.6 / 100,
                        borderRadius: windowWidth * 1.8 / 100,
                        backgroundColor: "red",
                      }}>
                      </View>
                    </View>

                  </View>
                  <View style={{ width: "60%" }}>
                    <View style={{}}>
                      <Text numberOfLines={1} style={styles.txtitem1}>{item.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 2, width: "100%" }}>

                      <Text style={styles.txtitem2}>{item.message}</Text>

                    </View>
                  </View>
                  <View style={{ width: "19%", alignItems: "flex-end" }}>
                    {/* {item.count > 0 ?
                                                   <View style={{width:windowWidth*4.5/100,height:windowWidth*4.5/100,backgroundColor:Colors.theme_color1,borderRadius:windowWidth*2/100,alignItems:'center',justifyContent:'center'}}>
                                                       <Text style={[styles.txtsmall,{}]}>{item.count >=10 ? '+9':item.count}</Text>
                                                     </View>:
                                                     <Text style={[styles.txtsmall,{marginTop:windowHeight*4/100,}]}>{' '}</Text>
                                                     }  */}
                    <Text style={[styles.txtsmall, { marginTop: windowHeight * 0.5 / 100 }]}>{item.time}</Text>
                  </View>

                </TouchableOpacity>


              ))
              }
            </View>}

          </View>
        </ScrollView>
        <Footer navigation={this.props.navigation} page={"chat"} chatcount={count_inbox} />


      </View>
    );
  }
}


const styles = StyleSheet.create({
  profileimage:
    {
      width: windowWidth * 11 / 100,
      height: windowWidth * 11 / 100,
      resizeMode: "cover",
      borderRadius: windowWidth * 5.5 / 100,
    }
  ,
  txtaddtype: {
    marginLeft: 3,
    fontSize: windowWidth * 3.2 / 100,
    width: "89%",
    paddingVertical: windowWidth * .1 / 100,
    fontFamily: Font.Poppins_Regular,
    color: Colors.blackColor,
  },

  Notifications_title: {
    fontFamily: Font.Poppins_SemiBold,
    fontSize: windowWidth * 3.8 / 100,
    color: "#000",
    alignSelf: "center",
  },


  styletopbar: {
    borderBottomWidth: 2,
    width: "33.3%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: windowHeight * 2 / 100,
    paddingBottom: windowHeight * .2 / 100,
  },


  txtitem1: {
    alignSelf: "center",
    width: "100%",
    fontSize: windowWidth * 3.5 / 100,
    fontFamily: Font.Poppins_SemiBold,
    color: Colors.blackColor,
  },
  txtitem2: {
    fontSize: windowWidth * 3 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1,
  },
  txtsmall: {
    fontSize: windowWidth * 2.5 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.border_color1,
  },
  txtcount: {
    fontSize: windowWidth * 2.2 / 100, fontFamily: Font.Poppins_SemiBold, color: Colors.whiteColor,
  },


});
