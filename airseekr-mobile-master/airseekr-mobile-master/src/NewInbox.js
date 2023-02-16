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
  ActivityIndicator,
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
      tabData: [
        {
          pageNumber: 1,
          users: [],
        },
        {
          pageNumber: 1,
          users: [],
        },
        {
          pageNumber: 1,
          users: [],
        },
      ],
      activeIndex: 0,
      userInfo: null,
      pageCount: 100,
      onEndReachedCalledDuringMomentum: true,
      lastLoadCount: 0,
    };
    this._didFocusSubscription = props.navigation.addListener("focus", payload =>
      BackHandler.addEventListener("hardwareBackPress", handleback.handleBackPress),
    );
    this.onEndReachedCalledDuringMomentum = true;
  }

  async componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener("blur", payload =>
      BackHandler.removeEventListener("hardwareBackPress", handleback.handleBackPress),
    );
    const userdata = await localStorage.getItemObject("user_arr");
    this.setState({ userInfo: userdata });
    NetInfo.fetch().then(state => {
      this.setState({ isConnected: state.isConnected });
    });
    this.props.navigation.addListener("focus", () => {
      this.setState({
        search: "",
        issearching: false,
        isedit: false,
      });
    });
    // this.getUserData(this.state.activeIndex, this.state.tabData[this.state.activeIndex].pageNumber);
    this.getAllData();
  }

  getUserData = async (index, pageNumber) => {
    const url = `${config.baseURL}api/users?user_id=${this.state.userInfo.user_id}&pageNumber=${pageNumber}&countPerPage=${this.state.pageCount}${(index - 1) === -1 ? "" : `&user_roll=${index - 1}`}`;
    console.log(url, "url");
    apifuntion.getApi(url, 1)
      .then(res => {
        if (res?.success === "true") {
          const tabData = [...this.state.tabData];
          tabData[this.state.activeIndex].users = [...tabData[this.state.activeIndex].users, ...res.data];
          this.setState({ tabData });
        }
        console.log(res, this.state.tabData, "res");
      })
      .catch(e => console.log(e));
  };

  getAllData = async () => {
    const url = `${config.baseURL}api/users?user_id=${this.state.userInfo.user_id}&countPerPage=100000`;
    global.props.showLoader();
    apifuntion.getApi(url, 1)
      .then(res => {
        if (res?.success === "true") {
          console.log(res.data, 'data');
          firebase.database().ref('message').once('value', snapshot => {
            const objs = snapshot.val();
            const filter = Object.keys(objs).filter(k => k.split('__')?.find(s => parseInt(s) === this.state.userInfo?.user_id));
            const filData = res.data?.filter(d => d.user_id !== this.state.userInfo?.user_id && filter.find(k => k.split('__').find(s => parseInt(s) === d.user_id)));
            const tabData = [...this.state.tabData];
            tabData[0].users = filData;
            tabData[1].users = filData?.filter(d => d.user_roll === 0);
            tabData[2].users = filData?.filter(d => d.user_roll === 1);
            this.setState({tabData})
            global.props.hideLoader();
          })
        }
        console.log(res, this.state.tabData, "res");
      })
      .catch(e => console.log(e));
  }

  opennotification = () => {
    this.props.navigation.navigate("Notification");
  };
  myoffer = () => {
    this.props.navigation.navigate("Myoffer");
  };

  getUsersByTab = async (index, isAdd) => {
    // const tabData = [...this.state.tabData];
    // if (isAdd) {
    //   tabData[index].pageNumber += 1;
    // }
    this.setState({
      activeIndex: index,
      // is_serach: false,
      // txtsearch: "",
      // tabData,
    });
    // await this.getUserData(index, tabData[index].pageNumber);
  };

  _loadMoreData = (index, isAdd) => {
    console.log("=======");
    if (this.state.onEndReachedCalledDuringMomentum) {
      this.setState({ onEndReachedCalledDuringMomentum: true }, () => {
        this.getUsersByTab(index, isAdd);
      });
    }
  };

  _renderSearchResultsFooter = () => {
    return (
      <View style={{ marginBottom: 100, marginTop: 20, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#e83628" />
      </View>: null
    );
  };

  filterData = () => {
    return this.state.tabData[this.state.activeIndex]?.users?.filter(u => {
      if (this.state.activeIndex === 0) {
        return this.state.userInfo?.user_id !== u.user_id;
      } else {
        return (u.user_roll === this.state.activeIndex - 1) && (this.state.userInfo?.user_id !== u.user_id);
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.newcolor }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.newcolor }} />
        <StatusBar barStyle="light-content" backgroundColor={Colors.newcolor} hidden={false} translucent={false}
                   networkActivityIndicatorVisible={true} />
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
          <View style={{ width: "100%", backgroundColor: Colors.newcolor }}>
            <View style={{
              flexDirection: "row", justifyContent: "space-between", width: "100%",
            }}>
              <TouchableOpacity onPress={() => this.getUsersByTab(0)} activeOpacity={.7}
                                style={this.state.activeIndex == 0 ? [styles.styletopbar, { borderBottomColor: Colors.theme_color1 }] : [styles.styletopbar, { borderBottomColor: Colors.border_color1 }]}>
                {this.state.activeIndex == 0 ?
                  <Text style={[styles.Notifications_title, {}]}>{Lang_chg.txtinboxall[config.language]}</Text> :
                  <Text
                    style={[styles.Notifications_title, { color: Colors.border_color1 }]}>{Lang_chg.txtinboxall[config.language]}</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.getUsersByTab(1)} activeOpacity={.7}
                                style={this.state.activeIndex == 1 ? [styles.styletopbar, { borderBottomColor: Colors.theme_color1 }] : [styles.styletopbar, { borderBottomColor: Colors.border_color1 }]}>

                {this.state.activeIndex == 1 ?
                  <Text style={[styles.Notifications_title, {}]}>{Lang_chg.txtbuyers[config.language]}</Text> :
                  <Text
                    style={[styles.Notifications_title, { color: Colors.border_color1 }]}>{Lang_chg.txtbuyers[config.language]}</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.getUsersByTab(2)} activeOpacity={.7}
                                style={this.state.activeIndex == 2 ? [styles.styletopbar, { borderBottomColor: Colors.theme_color1 }] : [styles.styletopbar, { borderBottomColor: Colors.border_color1 }]}>
                {this.state.activeIndex == 2 ?
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
            }} />
          </View>
          <View
            style={{ width: "100%", marginTop: windowHeight * 1 / 100, alignItems: "center", alignSelf: "center" }}>
            <FlatList
              contentContainerStyle={{}}
              data={this.filterData()}
              // extraData={this.state}
              // onEndReached={() => this.callOnScrollEnd = true}
              // onMomentumScrollEnd={() => {
              //   this.callOnScrollEnd && this._loadMoreData(this.state.activeIndex, true);
              //   this.callOnScrollEnd = false;
              // }}
              // ListFooterComponent={this._renderSearchResultsFooter}
              renderItem={({ item, index }) => <TouchableOpacity key={index} onPress={() => {
                this.props.navigation.navigate("Chat", {
                  "data": {
                    "other_user_id": item.user_id,
                    "other_user_name": item.name,
                    "image": item.image,
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
                  style={{ width: "18%", paddingLeft: windowWidth * 2 / 100, marginTop: 20 }}>

                  {
                    item.image == null ?
                      <Image source={localimag.user_profile} style={styles.profileimage} /> :
                      <Animatable.Image ref={"close"}
                                        delay={400}
                                        animation="zoomInUp"
                                        source={{ uri: `${config.img_url1}${item.image}` } || localimag.user_profile}
                                        style={styles.profileimage} />
                  }
                  {/*<View style={{*/}
                  {/*  position: "absolute",*/}
                  {/*  right: windowWidth * 4 / 100,*/}
                  {/*  width: windowWidth * 4 / 100,*/}
                  {/*  height: windowWidth * 4 / 100,*/}
                  {/*  borderRadius: windowWidth * 2 / 100,*/}
                  {/*  backgroundColor: "white",*/}
                  {/*  alignItems: "center",*/}
                  {/*  justifyContent: "center",*/}
                  {/*}}>*/}
                  {/*  <View style={{*/}
                  {/*    width: windowWidth * 3.6 / 100,*/}
                  {/*    height: windowWidth * 3.6 / 100,*/}
                  {/*    borderRadius: windowWidth * 1.8 / 100,*/}
                  {/*    backgroundColor: "red",*/}
                  {/*  }}>*/}
                  {/*  </View>*/}
                  {/*</View>*/}
                </View>
                <View style={{ width: "60%", marginTop: 20 }}>
                  <View style={{}}>
                    <Text numberOfLines={1} style={styles.txtitem1}>{item.name}</Text>
                  </View>
                  {/*<View style={{ flexDirection: "row", marginTop: 2, width: "100%" }}>*/}

                  {/*  <Text style={styles.txtitem2}>{item.message}</Text>*/}

                  {/*</View>*/}
                </View>
                <View style={{ width: "19%", alignItems: "flex-end" }}>
                  <Text style={[styles.txtsmall, { marginTop: windowHeight * .5 / 100 }]}>{item.time}</Text>
                </View>
              </TouchableOpacity>}
            />
          </View>
        </View>
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
