import React from "react";
import { GiftedChat } from "react-native-gifted-chat"; // 0.3.0
// import firebaseSvc from "./Provider/FirebaseSvc";
import { config } from "./Config1";
import { apifuntion, Colors, config as config1, consolepro, Font, mobileW } from "./Provider/utilslib/Utils";
import { localStorage } from "./Provider/localStorageProvider";
// import firebase from "firebase";
import { Dimensions, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import moment from 'moment'
import { localimag } from "./Provider/Localimage";
import CSSstyle from "./css";

import database from '@react-native-firebase/database';

import firebase from '@react-native-firebase/app';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


export default class NewChat extends React.Component {

  constructor(props) {
    // if (!firebase.apps.length) {

    //   firebase.initializeApp(config);
    // } else {
    //   console.log("firebase apps already running...")
    // }
    super(props);
    this.ref = database().ref(`message`);
  }

  state = {
    messages: [],
    message: null,
    userDetail: null,
  };

  async componentDidMount() {

    console.log(this.props.route.params?.data)
    const userDetail = await localStorage.getItemObject('user_arr');
    this.setState({ userDetail })
    const idArray = [userDetail.user_id, this.props.route.params?.data?.other_user_id].sort((a, b) => a > b ? 1 : -1);
    this.ref.orderByKey().equalTo(idArray.join('__')).once("value", snapshot => {
      const userdata = snapshot.val();
      console.log("data is : ", userdata)
      if (!userdata) {
        this.ref.child(idArray.join('__')).set({ 1: { createdAt: new Date().getTime() } }).then(() => {
          this.ref = database().ref(`message/${idArray.join('__')}`);
        })
      }

      this.ref = database().ref(`message/${idArray.join('__')}`);
      this.refOn(message => {
        if (message?.user?.name) {
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
          }))
        }

      }
      );
    }).catch(e => console.log(e))
  }

  componentWillUnmount() {
    this.ref.off();
  }

  get timestamp() {
    return firebase.database().ServerValue.TIMESTAMP;
  }

  refOn = callback => {
    this.ref
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  get user() {
    return {
      name: this.state.userDetail?.name,
      email: this.state.userDetail?.email,
      avatar: ((this.state.userDetail?.image && this.state.userDetail?.image !== 'NA') ? (config1.img_url + this.state.userDetail?.image) : null),
      // id: this.state.userDetail?.user_id,
      _id: this.state.userDetail?.user_id, // need for gifted-chat
    };
  }

  parse = snapshot => {
    const { createdAt: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);
    return {
      id,
      _id,
      createdAt: timestamp,
      text,
      user,
    };
  };

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user: this.user,
        createdAt: new Date().getTime(),
      };
      this.ref.push(message);
    }
  };

  handleBackPress = async () => {
    // let result = await localStorage.getItemObject("user_arr");
    // var id = "u_" + userdata.user_id;
    // var updates = { "onlineStatus": "false" };
    // var onlineStatusRef = database().ref("users/" + id).update(updates);
    // var user_id_me = result.user_id;
    // this.chatRoomIdUpdate(user_id_me, "no");
    this.props.navigation.goBack();
    return true;
  };

  render() {
    console.log(this.state.messages)
    return (
      <SafeAreaView style={{ flex: 1 }} >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: (windowHeight * 8) / 100,
            width: windowWidth * 95 / 100,
            alignSelf: "center",

          }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

            <TouchableOpacity onPress={() => {
              this.handleBackPress();
            }} style={{
              justifyContent: "center",
              height: windowHeight * 10 / 100,
              width: windowWidth * 18 / 100,
            }}>
              <Image source={localimag.backarrowicon} resizeMode={'contain'} style={{ height: windowWidth * 6.5 / 100, width: windowWidth * 6.5 / 100 }} />
            </TouchableOpacity>

            <View style={{ alignSelf: "center" }}>
              <Image
                source={this.props.route?.params?.data?.image ? { uri: (config1.img_url + this.props.route?.params?.data?.image) } : localimag.user_profile}
                // onError={() => {
                //   this.imageerror();
                // }}
                style={{
                  width: (windowWidth * 8) / 100,
                  height: (windowWidth * 8) / 100,
                  resizeMode: "cover",
                  borderRadius: windowWidth * 4 / 100,
                  alignSelf: "center",
                }}
              />
            </View>
            <View style={{ paddingLeft: 15, flexDirection: "column", justifyContent: "space-between" }}>
              <Text
                style={{
                  fontFamily: Font.Poppins_SemiBold,
                  fontSize: (windowWidth * 4) / 100,
                  color: "black",
                  width: windowWidth * 55 / 100,
                }}>
                {this.props.route?.params?.data?.other_user_name}

              </Text>

              {this.state.onlineStatus === "true" ?
                <Text style={{
                  fontFamily: Font.Poppins_Regular,
                  fontSize: (windowWidth * 3) / 100,
                  color: "green",
                  width: windowWidth * 55 / 100,

                }}>

                  {"Online"}
                </Text> :
                <Text style={{
                  fontFamily: Font.Poppins_Regular,
                  fontSize: (windowWidth * 3) / 100,
                  color: "green",
                  width: windowWidth * 55 / 100,

                }}>
                  {/* { 'Online' } */}
                </Text>
              }
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.setState({ modalReport: true });
            }}
            style={{}}>
            <Image
              source={localimag.dotsb}
              style={CSSstyle.edittxticon}
            />
          </TouchableOpacity>
        </View>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.send}
          user={this.user}
          renderTime={this.renderTimeCustom}
          renderAvatar={this.renderAvatar}
          renderInputToolbar={this.renderInputToolbar}
        />
      </SafeAreaView>
    );
  }

  renderAvatar = (props) => {
    const url = props.currentMessage?.user?.avatar ? { uri: props.currentMessage?.user?.avatar } : localimag.user_profile
    return <Image source={url} style={{ width: 36, height: 36, borderRadius: 18 }} />
  }

  renderInputToolbar = (props) => {
    return <View style={{
      alignSelf: "center",
      height: 45,
      width: windowWidth * 100 / 100,
      backgroundColor: Colors.theme_color1,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    }}>
      {/*<TouchableOpacity onPress={() => {*/}
      {/*  this.setState({ cameramodalon: true });*/}
      {/*}} style={{ borderTopColor: Colors.whiteColor, width: mobileW * 10 / 100 }}>*/}
      {/*  <Image source={localimag.addicon} style={{*/}
      {/*    height: windowHeight * 5 / 100,*/}
      {/*    width: windowWidth * 5 / 100,*/}
      {/*    resizeMode: "contain",*/}
      {/*    alignSelf: "center",*/}
      {/*  }} />*/}
      {/*</TouchableOpacity>*/}

      <TextInput
        style={{
          fontFamily: Font.Poppins_Regular,
          paddingLeft: 15,
          fontSize: windowHeight * 2 / 100,
          height: windowHeight * 6.5 / 100,
          width: windowWidth * 80 / 100,
          color: "white",
        }}
        onChangeText={(txt) => {
          this.setState({ message: txt });
        }}
        value={this.state.message}
        onFocus={() => {
          this.setState({ Numberbtn: 1, bottom: 43 });
        }}
        keyboardType={'default'}
        maxLength={250}
        returnKeyLabel={'done'}
        returnKeyType={'done'}
        onBlur={() => {
          this.setState({ bottom: 0 });
        }}
        onSubmitEditing={() => {
          this.setState({ bottom: 0 });
        }}
        placeholder="Write a message"
        placeholderTextColor={Colors.whiteColor}
        clearButtonMode="always"
      />
      <TouchableOpacity onPress={() => {
        this.send([{
          text: this.state.message,
          createdAt: new Date(),
          user: this.user,
        }]);
        const url = config1.baseURL + 'api/send_fcm_app.php';
        const data = new FormData();
        data.append('send_user_id', this.state.userDetail?.user_id)
        data.append('receiver_user_id', this.props.route.params?.data?.other_user_id)
        data.append('body', this.state.message)
        apifuntion.postApi(url, data).then((obj) => {
          consolepro.consolelog('obj==================', obj);
        }).catch(err => {
          consolepro.consolelog('err===========', err);
        });
        this.setState({ message: null })
      }} style={{ width: mobileW * 10 / 100, justifyContent: "center" }}>
        <Image source={localimag.sendicon} style={{
          height: windowHeight * 4.5 / 100,
          width: windowWidth * 6.5 / 100,
          resizeMode: "contain",
          alignSelf: "center",
        }} />
      </TouchableOpacity>
    </View>
  }

  renderTimeCustom = ({ currentMessage, position, timeFormat }) => {
    let style = {
      color: (position === 'right') ? 'white' : 'gray',
      fontSize: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 5
    }
    return (
      <Text style={style}>{((position !== 'right') ? (currentMessage.user.name + ', ') : '') + moment(currentMessage.createdAt).format(timeFormat)}</Text>
    )
  }

}
