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
  notification,
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

global.userChatIdGlobal = "";
global.messagedata = [];
import { firebaseprovider } from "./Provider/FirebaseProvider";
import database from '@react-native-firebase/database';

global.blockinbox = "no";
// import Firebase from "firebase";
// import firebase from "./Config1";
import NetInfo from "@react-native-community/netinfo";

export default class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cameramodalon: false,
      reportmodal: false,
      modalVisible1: false,
      data1: [],
      user_id: "",
      chatmsg: "",
      other_user_name: "",
      data: this.props.route?.params.data || [],
      craetechat: false,
      name: "",
      message_type: "text",
      filePath: {},
      isVisible: false,
      modalVisible: false,
      fileData: "",
      fileUri: "",
      imgBlob: "",
      isConnected: true,
      loading: false,
      behavior: "position",
      bottom: 0,
      modalVisible2: false,
      usersubscribe: false,
      modalReport: false,
      onlinestatus: "true",


    };

  }

  componentDidMount() {

    NetInfo.fetch().then(state => {
      this.setState({ isConnected: state.isConnected });
    });
    //Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      this.setState({ isConnected: state.isConnected });
    });

    this.getmessagedata();

  }

  getmessagedata = async () => {
    var userdata = await localStorage.getItemObject("user_arr");
    consolepro.consolelog("getmessagedata");
    var updates = { "onlineStatus": "true" };
    var onlineStatusRef = database.ref("/users/" + userdata.user_id).update(updates);
    this.setState({ user_id: userdata.user_id, loading: true, chatmsg: this.state.data.title });


    var data = this.state.data;
    consolepro.consolelog("data", data);
    var other_user_id = data.other_user_id;
    // var item_id = data.item_id;
    consolepro.consolelog("other_user_id", other_user_id);
    // consolepro.consolelog('item_id',item_id);
    consolepro.consolelog("firebaseprovider", FirebaseUserJson);
    ///new added by rahul

    var user_id_me = userdata.user_id;
    this.chatRoomIdUpdate(user_id_me, other_user_id);


    ///new added by rahul end
    var inbox_count = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);
    consolepro.consolelog("chat name inbox count before", inbox_count);
    if (inbox_count >= 0) {
      consolepro.consolelog("chat name inbox count", inbox_count);
      var jsonData = FirebaseUserJson[inbox_count];
      consolepro.consolelog("jsonData", jsonData);
      if (jsonData.name != "NA") {
        this.setState({ name: jsonData.name, onlinestatus: jsonData.onlineStatus });

        // if (userProvider.getMe().user_type == 'user') {
        //   $('#chat_name').attr("onclick","redirectChefProfile("+other_user_id+")");
        // }
      } else {
        this.setState({ name: "Chat" });
      }

    } else {
      this.setState({ name: "Chat" });
    }
    this.show_user_message_chat();

  };

  clearchat = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure, you want to clear Chat?", [{
        text: msgTitle.no[config.language],
        onPress: () => {
        },
        style: msgTitle.cancel[config.language],
      }, {
        text: msgTitle.yes[config.language],
        onPress: () => this.ClearChatConfirm(),
      }], {
      cancelable: false,
    },
    ); // works best when the goBack is async
    return true;
  };
  ClearChatConfirm = async () => {
    this.setState({ modalReport: false });
    let userdata = await localStorage.getItemObject("user_arr");
    consolepro.consolelog("userdata", userdata);
    let data = this.state.data;
    var user_id = userdata.user_id;
    var other_user_id = data.other_user_id;
    // var item_id = data.item_id;
    var chat_type = "Item_chat";

    var messageIdME = "u_" + user_id + "__u_" + other_user_id;
    consolepro.consolelog("messageIdME", messageIdME);
    var id = "u_" + user_id;
    var otherid = "u_" + other_user_id;
    let jsonUsesadsssfrData = {};

    database.ref().child("/message" + "/" + messageIdME + "/").remove();
    // messagedata=[]
    this.setState({ data1: [] });
    let jsonUserData = {};
    var jsonUserDataMe = {
      count: 0,
      lastMessageType: "",
      lastMsg: "",
      lastMsgTime: "",
      user_id: other_user_id,
    };
    var user_id_send = "u_" + user_id;
    var other_user_id_send = "u_" + other_user_id;
    var inbox_id_me = "u_" + other_user_id;

    firebaseprovider.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
  };
  btnOpneImageOption = (response) => {

    this.setState({

      imagedata: true,
      camraon: true,
      profileimagehide: true,
      openDate: false,
    });
    let user_id = this.state.user_id;
    consolepro.consolelog("this.state.fileUri", response.path);
    var url = config.baseURL + "chat_file_upload.php";
    var data2 = new FormData();
    data2.append("user_id", user_id);
    data2.append("file_type", "image");
    data2.append("image", {
      uri: response.path,
      type: "image/jpg", // or photo.type
      name: "image.jpg",
    });
    consolepro.consolelog("url", url);
    consolepro.consolelog("data", data2);
    // this.setState({loading:true,})
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: data2,
    }).then((obj) => {
      this.setState({ loading: false });
      return obj.json();
    }).then((obj) => {
      consolepro.consolelog("obj", obj);
      if (obj.success == "true") {
        this.setState({ bottom: 0 });
        this.sendmessagecallbtn("image", obj.file);
      } else {
        if (obj.active_status == "0" || obj.msg[config.language] == msgTitle.usernotexit[config.language]) {
          config.checkUserDeactivate(this.props.navigation);
        } else {
          msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
        }
        return false;
      }


    }).catch((error) => {
      consolepro.consolelog("error", error);
      msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
    });


  };
  permmissionsendreport = () => {
    Alert.alert(
      //This is title
      // Languageprovider.Confirm[language_key],
      " ",
      //This is body text
      Languageprovider.report_permission[language_key],
      [
        {
          text: Languageprovider.YES[language_key], onPress: () => {
            this.setState({ modalVisible: false });
            this.senduserreport();
          },
        },
        {
          text: Languageprovider.NO[language_key], onPress: () => {
            this.setState({ modalVisible: false });
            consolepro.consolelog("No Pressed");
          }, style: "cancel",
        },
      ],
      { cancelable: false },
      //on clicking out side, Alert will not dismiss
    );
  };
  permmissionclearchat = () => {
    Alert.alert(
      //This is title
      Languageprovider.Confirm[language_key],
      //This is body text
      Languageprovider.Are_your_sure_you_to_clear_chat[language_key],
      [
        {
          text: Languageprovider.YES[language_key], onPress: () => {
            this.setState({ modalVisible: false });
            this.ClearChatConfirm();
          },
        },
        {
          text: Languageprovider.NO[language_key], onPress: () => {
            this.setState({ modalVisible: false });
            consolepro.consolelog("No Pressed");
          }, style: "cancel",
        },
      ],
      { cancelable: false },
      //on clicking out side, Alert will not dismiss
    );
  };
  sendmessagebtn1 = () => {

    // if(this.state.usersubscribe==true){
    consolepro.consolelog("sendmessagebtn");
    let messageType = "text";
    let message = this.state.chatmsg;
    consolepro.consolelog("message", message);
    this.chatmsg.clear();
    this.setState({ chatmsg: "" });
    if (message.length <= 0) {
      msgProvider.alert(msgTitle.information[config.language], "Please enter a message", false);
      return false;
    }
    this.sendmessagecallbtn(messageType, message);
    // }else{
    //  msgProvider.toast('Please subscribe for chat', 'center');
    //  return false
    // }


  };

  sendmessagecallbtn = async (messageType, message) => {
    let userdata = await localStorage.getItemObject("user_arr");

    let data1 = this.state.data;
    //  jhkfhjkhsdk
    var user_id = userdata.user_id;
    var other_user_id = data1.other_user_id;
    //  var item_id = data1.item_id;
    var chat_type = "Item_chat";

    var user_id_send = "u_" + user_id;
    var other_user_id_send = "u_" + other_user_id;

    var inbox_id_me = "u_" + other_user_id;
    var inbox_id_other = "u_" + user_id;
    consolepro.consolelog("inbox_id", inbox_id_me);
    consolepro.consolelog("inbox_id_other", inbox_id_other);

    //---------------------- this code for create inbox in first time -----------
    consolepro.consolelog("FirebaseInboxJsonChck", FirebaseInboxJson);
    console.log("other_user_id", other_user_id);
    console.log("FirebaseInboxJsonChck", FirebaseInboxJson);
    console.log("Firebaseuserjson", FirebaseUserJson);

    if (FirebaseUserJson.length > 0) {
      var find_inbox_index2 = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);
      console.log("find_inbox_index", find_inbox_index2);

      if (find_inbox_index2 != -1) {
        if ("myInbox" in FirebaseUserJson[find_inbox_index2]) {
          let myinbox2 = FirebaseUserJson[find_inbox_index2].myInbox;
          if (myinbox2 != undefined) {
            //  myinbox=myinbox.findIndex(x => x.user_id == other_user_id)
            console.log("myinbox2", myinbox2);
            if (inbox_id_other in myinbox2) {
              let myinboxdata = myinbox2[inbox_id_other];

              console.log("inbox_id_me", inbox_id_me);
              console.log("inbox_id_other", inbox_id_other);
              blockinbox = myinboxdata.block_status;

            }
          }
        }
      }
    }
    var find_inbox_index = FirebaseInboxJson.findIndex(x => x.user_id == other_user_id);
    consolepro.consolelog("find_inbox_index chat", find_inbox_index);
    consolepro.consolelog("other_user_id chat", other_user_id);
    if (find_inbox_index == -1) {

      var jsonUserDataMe = {
        count: 0,
        lastMessageType: "",
        lastMsg: "",
        user_id: other_user_id,
        typing_status: "no",
        block_status: "no",
        lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
      };

      var jsonUserDataother = {
        count: 0,
        lastMessageType: "",
        lastMsg: "",
        user_id: user_id,
        typing_status: "no",
        block_status: "no",
        lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,

      };

      firebaseprovider.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
      if (blockinbox != "yes") {
        firebaseprovider.UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataother);
      }


      //  consolepro.consolelog('FirebaseUserJson',FirebaseUserJson);
    }
    //---------------------- this code for create inbox in first time end -----------

    //---------------------- this code for send message to both -----------
    var messageIdME = "u_" + user_id + "__u_" + other_user_id;
    var messageIdOther = "u_" + other_user_id + "__u_" + user_id;
    var senderId = user_id;
    var inputId = "xyz";
    // var timestamp = new Date().getTime();
    var messageJson = {
      message: message,
      messageType: messageType,
      senderId: senderId,
      timestamp: Firebase.database.ServerValue.TIMESTAMP,
    };

    this.chatmsg.clear();

    firebaseprovider.SendUserMessage(messageIdME, messageJson, messageType, inputId);
    if (this.state.data.blockstatus != "yes") {
      if (blockinbox != "yes") {
        firebaseprovider.SendUserMessage(messageIdOther, messageJson, messageType, inputId);
      }

    }
    //---------------------- this code for send message to both end -----------


    //----------------update user inbox----------------------------
    var jsonUserDataMe = {
      count: 0,
      lastMessageType: messageType,
      lastMsg: message,
      lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
    };

    firebaseprovider.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);

    var user_id_me = userdata.user_id;
    var chat_room_id = other_user_id;
    this.chatRoomIdUpdate(user_id_me, chat_room_id);

    //------------------------- get other user inbox -------------------

    consolepro.consolelog("other_user_id_send", other_user_id_send);
    consolepro.consolelog("user_id_send", user_id_send);
    var count_new = 0;
    var query = database.ref("users/" + other_user_id_send + "/myInbox/" + inbox_id_other);
    query.once("value", (data) => {
      consolepro.consolelog("chat_data", data.toJSON());
      // consolepro.consolelog('user inbox data',data.val().count);
      var count_old = data.val() == null ? 0 : data.val().count;
      consolepro.consolelog("count_old_check", count_old);
      count_new = parseInt(count_old) + 1;

      var jsonUserDataOther = {
        count: count_new,
        lastMessageType: messageType,
        lastMsg: message,
        user_id: this.state.user_id,
        lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
      };
      // alert("dddd");
      // consolepro.consolelog('jsonUserDataOther',jsonUserDataOther);
      if (blockinbox != "yes") {
        firebaseprovider.UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataOther);
      }

    });
    //---------------------- send message notifications ----------------
    var title = Array("Tradematrix", "Tradematrix", "Tradematrix");
    var message_send = message;
    var SenderName = userdata.name;
    if (messageType != "text" && messageType != "location") {
      message_send = SenderName + " sent: " + messageType;
    } else {
      message_send = SenderName + " " + message_send;
    }

    var other_user_id = chat_room_id;
    consolepro.consolelog("other_user_id_noti", other_user_id);
    var message_noti = Array(message_send, message_send, message_send);
    var action_json = {
      user_id: user_id_me,
      other_user_id: other_user_id,
      chat_type: chat_type,

      action_id: 0,
      action: "chat_single",
      // action_id : user_id_me,
      SenderName: SenderName,
    };
    // alert(user_id_me);
    this.sendNotificationSignle(title, message_noti, action_json, other_user_id);
    //---------------------- send message notifications end----------------

  };
  sendNotificationSignle = async (title, message, action_json, user_id_member) => {
    let userdata = await localStorage.getItemObject("user_arr");
    consolepro.consolelog("sendNotificationSignle action_json", action_json);
    consolepro.consolelog("sendNotificationSignle message", message);
    consolepro.consolelog("sendNotificationSignle user_id_member", user_id_member);

    consolepro.consolelog("update delete_flag", user_id_member);
    consolepro.consolelog("sendNotificationSignle FirebaseUserJson", FirebaseUserJson);
    var user_check_inbox = FirebaseUserJson.findIndex(x => x.user_id == user_id_member);
    consolepro.consolelog("user_check_inbox subuser", user_check_inbox);
    if (user_check_inbox >= 0) {
      consolepro.consolelog("FirebaseUserJson subuser", FirebaseUserJson[user_check_inbox]);
      var player_id_get = FirebaseUserJson[user_check_inbox].player_id;
      var chat_room_id_get = FirebaseUserJson[user_check_inbox].chat_room_id;
      var notification_status = FirebaseUserJson[user_check_inbox].notification_status;
      var onlineStatus = FirebaseUserJson[user_check_inbox].onlineStatus;

      consolepro.consolelog("chat_room_id_get", chat_room_id_get + "//" + chat_room_id_get);
      consolepro.consolelog("player_id_get", user_id_member + "//" + player_id_get);
      consolepro.consolelog("notification_status", notification_status);
      consolepro.consolelog("onlineStatus", onlineStatus);

      if (onlineStatus == "false") {
        var user_id_me = userdata.user_id;
        consolepro.consolelog("chat_room_id_get", chat_room_id_get + "!=" + user_id_me);
        // if(chat_room_id_get != user_id_me){
        if (player_id_get != "no" && player_id_get != "123456") {
          var player_id_arr = [];
          player_id_arr.push(player_id_get);
          consolepro.consolelog("player_id_arr", player_id_arr);

          if (player_id_arr.length > 0) {
            consolepro.consolelog("rahul  notihd");
            notification.notificationfunction(message, action_json, player_id_get, title);
          }
          // }
        }
      }
    }
  };
  chatRoomIdUpdate = (user_id, other_user_id) => {
    consolepro.consolelog("chatRoomIdUpdate user_id", user_id);
    consolepro.consolelog("chatRoomIdUpdate other_user_id", other_user_id);
    var id = "u_" + user_id;
    var jsonUserDataMe = {
      chat_room_id: other_user_id,
    };
    firebaseprovider.CreateUser(id, jsonUserDataMe);
  };
  myInboxCountZeroChat = () => {
    consolepro.consolelog("myInboxCountZeroChat");
    var data = this.state.data;
    var user_id = this.state.user_id;
    var other_user_id = data.other_user_id;
    var user_id_send = "u_" + user_id;
    var other_user_id_send = "u_" + other_user_id;

    var jsonUserDataOther = {
      count: 0,
      user_id: other_user_id,
    };
    firebaseprovider.UpdateUserInboxOther(user_id_send, other_user_id_send, jsonUserDataOther);
  };

  show_user_message_chat = () => {

    //  var messagedata=[]

    this.setState({ loading: true });
    var other_user_id = this.state.data.other_user_id;
    var find_inbox_index = FirebaseInboxJson.findIndex(x => x.user_id == other_user_id);
    consolepro.consolelog("find_inbox_index chatshow_user_message_chat", find_inbox_index);
    consolepro.consolelog("other_user_id chatshow_user_message_chat", other_user_id);
    if (find_inbox_index >= 0) {
      consolepro.consolelog("inboxfinguser");
      this.myInboxCountZeroChat();
    }

    consolepro.consolelog("show_user_message");

    // var userdata= await localStorage.getItemObject('user_arr');
    var data = this.state.data;
    var user_id = this.state.user_id;
    var other_user_id = data.other_user_id;
    // var item_id = data.item_id;
    var chat_type = "Item_chat";

    var userChatId = "u_" + user_id + "__u_" + other_user_id;
    if (userChatIdGlobal == "") {
      userChatIdGlobal = userChatId;
    }
    consolepro.consolelog("userChatIdGlobal", userChatIdGlobal);
    var queryOff = database.ref("message/").child(userChatIdGlobal);
    queryOff.off("child_added");
    queryOff.off("child_changed");
    // alert('userChatId======'+userChatId);
    var image_index_me = 0;
    var image_index_other = 0;
    userChatIdGlobal = userChatId;
    var query = database.ref("message/" + userChatId).orderByChild("timestamp");
    query.on("child_added", (data) => {
      consolepro.consolelog("message child_added chat all data", data.toJSON());
      // LoadingEnd();

      var msgKey = data.key;
      var message = data.val().message;
      var messageType = data.val().messageType;
      var senderId = data.val().senderId;
      var timestamp = data.val().timestamp;
      var lastMsgTime = firebaseprovider.convertTimeAllFormat(timestamp, "date_time_full");
      var messageDataShow = "";
      consolepro.consolelog("senderId", senderId);
      consolepro.consolelog("user_id", user_id);
      if (senderId == user_id) {
        consolepro.consolelog("senderId", senderId);

        if (messageType == "text") {

          var messageJson = {
            "name": message,
            "userid": senderId,
            "messageType": messageType,
            "time": lastMsgTime,
          };
          consolepro.consolelog("messageJoson", messageJson);
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({ data1: data6 });
        } else if (messageType == "location") {
          var messageJson = {
            "name": message,
            "userid": senderId,
            "messageType": messageType,
            "time": lastMsgTime,
          };
          consolepro.consolelog("messageJoson", messageJson);
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({ data1: data6 });
        } else if (messageType == "image") {
          var messageJson = {
            "name": message,
            "userid": senderId,
            "messageType": messageType,
            "time": lastMsgTime,
          };
          consolepro.consolelog("messageJoson", messageJson);
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({ data1: data6 });

        }
      } else {
        if (messageType == "text") {
          var messageJson = {
            "name": message,
            "userid": senderId,
            "messageType": messageType,
            "time": lastMsgTime,
          };
          consolepro.consolelog("messageJson", messageJson);
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({ data1: data6 });

        } else if (messageType == "location") {
          var messageJson = {
            "name": message,
            "userid": senderId,
            "messageType": messageType,
            "time": lastMsgTime,
          };
          consolepro.consolelog("messageJson", messageJson);
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({ data1: data6 });
        } else if (messageType == "image") {
          var messageJson = {
            "name": message,
            "userid": senderId,
            "messageType": messageType,
            "time": lastMsgTime,
          };
          consolepro.consolelog("messageJoson", messageJson);
          let data6 = this.state.data1;
          data6.push(messageJson);
          this.setState({ data1: data6 });

        }
      }


      consolepro.consolelog("this.state.data1", this.state.data1);
    });

    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
    // this.setState({loading:false})
    // for(let i=0; i<messagedata.length; i++)
    // {
    //   messagedata[i]=messagedata[(messagedata.length-1)-i];
    // }

    // this.setState({loading:false})
    consolepro.consolelog("enndshowfunction");
  };
  senduserreport = async () => {
    let userdata = await localStorage.getItemObject("user_arr");
    consolepro.consolelog("userdata", userdata);
    let user_id = userdata.user_id;
    let data = this.state.data;
    var other_user_id = data.other_user_id;
    var url = config.baseURL + "report_submit.php?user_id=" + user_id + "&other_user_id=" + other_user_id + "&report_type=chat";
    consolepro.consolelog("url", url);
    this.setState({ loading: true });
    fetch(url, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": 0,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }).then((obj) => {
      this.setState({ loading: false });
      return obj.json();
    }).then((obj) => {
      consolepro.consolelog("obj", obj);

      if (obj.success == "true") {
        msgProvider.alert("", obj.msg[config.language], false);
      } else {
        msgProvider.alert("", obj.msg[config.language], false);
        if (obj.active_status == "deactivate") {

          this.props.navigation.navigate("Logout");
        }
        return false;
      }
    }).catch((error) => {
      this.setState({ loading: false });
      msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
    });
  };


  //-------------------open camera for take image----------------//
  _openCamera = () => {

    mediaprovider.launchCamera().then((obj) => {
      consolepro.consolelog("imageobj", obj);
      this.setState({ cameramodalon: false });
      this.btnOpneImageOption(obj);


    });
  };
  //-------------------open gallery for take image----------------//
  _openGellery = () => {

    mediaprovider.launchGellery().then((obj) => {
      consolepro.consolelog("imageobj", obj);
      this.setState({ cameramodalon: false });

      if (obj.mime == "image/jpeg") {
        this.btnOpneImageOption(obj);
      } else {
        this.setState({
          imagepath: "NA", takeimage: false,

        });
      }


    });
  };

  fullimage = (item) => {

    let post_arr1 = [{ "image": item.name }];
    this.props.navigation.navigate("Fullimage", { image_arr: post_arr1 });
  };


  imageerror = () => {
    let data1 = this.state.data;
    data1.image = "NA";
    this.setState({ data: data1 });
  };

  handleBackPress = async () => {
    let result = await localStorage.getItemObject("user_arr");
    var id = "u_" + userdata.user_id;
    var updates = { "onlineStatus": "false" };
    var onlineStatusRef = database.ref("users/" + id).update(updates);
    var user_id_me = result.user_id;
    this.chatRoomIdUpdate(user_id_me, "no");
    this.props.navigation.goBack();
    return true;
  };


  async goBack() {
    let result = await localStorage.getItemObject("user_arr");
    var user_id_me = result.user_id;
    this.chatRoomIdUpdate(user_id_me, "no");
    this.props.navigation.goBack();
    return true;
  }

  render() {

    return (

      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}>
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
          <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color1 }} />
          <StatusBar barStyle="light-content" backgrounColor={Colors.theme_color1} hidden={false} translucent={false}
            networkActivityIndicatorVisible={true} />
          <Cameragallery mediamodal={this.state.cameramodalon} Camerapopen={() => {
            this._openCamera();
          }} Galleryopen={() => {
            this._openGellery();
          }} Canclemedia={() => {
            this.setState({ cameramodalon: false });
          }} />

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
                  <View style={CSSstyle.modalviewinner}>
                    <View style={CSSstyle.modaaltextview}>
                      <Text style={CSSstyle.modaltxtselect}>{Lang_chg.txtOption[config.language]}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                      this.clearchat();
                    }} style={CSSstyle.modaaltextview}>
                      <Text style={CSSstyle.modaltxtother}>{Lang_chg.txtClearchat[config.language]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("Reportpage", {
                          ads_id: this.state.data.other_user_id,
                          type: "chat",
                        });
                        this.setState({ modalReport: false });
                      }}
                      style={CSSstyle.modaaltextview1}>
                      <Text style={CSSstyle.modaltxtother}>{Lang_chg.txtReport[config.language]}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={CSSstyle.modalcancelview}>
                  <TouchableOpacity onPress={() => {
                    this.setState({ modalReport: false });
                  }} style={CSSstyle.modalcanceltouch}>
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
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
              <View style={CSSstyle.notification_header}>
                {/*      <TouchableOpacity activeOpacity={.7} style={{ padding: 5 }} onPress={() => { this.props.navigation.goBack() }}>
                                <Image resizeMode="contain" style={CSSstyle.hole_top_l1} source={localimag.backw}></Image>
                            </TouchableOpacity>
                            <Text style={[CSSstyle.Notifications_title, {marginLeft:4}]}>{Lang_chg.notification[config.language]}</Text>
                             <TouchableOpacity activeOpacity={0.7} onPress={() => {this.setState({modalReport:true}) }} style={{ alignItems: 'center', justifyContent: 'center' }}  >
                               <Image resizeMode="contain" style={CSSstyle.edittxticon} source={localimag.dotsb}></Image>
                             </TouchableOpacity>

                        </View> */}
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
                        source={this.state.data.image != "NA" ? { uri: this.state.data.image } : localimag.user_profile}
                        onError={() => {
                          this.imageerror();
                        }}
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
                          //fontFamily:'Poppins-Bold',
                          //alignSelf: 'center',
                          //marginLeft: 10,
                          fontSize: (windowWidth * 4) / 100,
                          color: "black",
                          width: windowWidth * 55 / 100,

                          //textAlign:'center'


                        }}>
                        {this.state.data.other_user_name}

                      </Text>

                      {this.state.onlineStatus == "true" ?
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
                {/* <View style={{height:windowHeight*10/100,justifyContent:'center'}}>
                                              <Text style={{fontSize:windowWidth*6.5/100,color:'#fff',fontWeight:'bold'}}>Subscribe Channels</Text>
                                              </View> */}
              </View>


              <View style={{ paddingBottom: 85, backgroundColor: "#fff", width: windowWidth * 100 / 100 }}>

                <FlatList
                  data={this.state.data1}
                  showsVerticalScrollIndicator={false}

                  renderItem={({ item, index }) => {

                    return (

                      <View style={{
                        marginTop: 2,
                        width: windowWidth * 95 / 100,
                        alignSelf: "center",
                        backgroundColor: "#fff",
                      }}>
                        {this.state.user_id != item.userid &&
                          <View style={{ flexDirection: "row" }}>
                            {/* <Image
                                                    source={localimag.checkchat}
                                                    style={{ height: mobileW*8/100, width: mobileW*8/100, resizeMode: 'contain' ,alignSelf:'center'}}
                                                /> */}
                            <View
                              style={[{
                                //flexDirection: 'row',
                                //alignItems: 'center',
                                justifyContent: "space-between",
                                marginLeft: 10,
                                // height: (windowHeight * 8) / 100,
                                width: windowWidth * 60 / 100,
                                alignSelf: "flex-start",
                                //justifyContent: 'flex-start',
                                backgroundColor: "#FFF2F2",
                                marginTop: 8,
                                padding: 7,
                                //paddingTop:10,

                                borderTopEndRadius: 10,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                              }]}>


                              {item.messageType == "text" && <Text style={{
                                color: "black",
                                fontFamily: Font.Poppins_Regular,
                                fontSize: windowWidth * 3.2 / 100,
                              }}>{item.name}</Text>}
                              {item.messageType == "image" && <TouchableOpacity onPress={() => {
                                this.fullimage(item);
                              }}>
                                <Image
                                  source={{ uri: config.img_url + item.name }}
                                  style={{
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10,
                                    borderTopRightRadius: 10,
                                    height: windowHeight * 30 / 100,
                                    width: (windowWidth * 60) / 100,
                                    resizeMode: "cover",
                                    marginVertical: 0,
                                    "alignSelf": "center",
                                  }}
                                />
                              </TouchableOpacity>
                              }

                              {item.messageType != "image" && <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingTop: 3,
                                width: windowWidth * 20 / 100,
                                justifyContent: "flex-end",
                                alignSelf: "flex-end",
                              }}>

                                <Text style={{
                                  fontSize: windowWidth * 2 / 100,
                                  paddingHorizontal: 5,
                                  color: Colors.theme_color1,
                                }}>{item.time}</Text>
                              </View>}
                            </View>
                          </View>
                        }
                        {this.state.user_id == item.userid && <View
                          style={[{
                            //flexDirection: 'row',
                            //alignItems: 'center',
                            //justifyContent: 'space-between',
                            // height: (windowHeight * 8) / 100,
                            width: windowWidth * 60 / 100,
                            alignSelf: "flex-end",
                            //justifyContent:'flex-start',
                            marginTop: 13,
                            padding: item.type != "image" ? 7 : 0,
                            //paddingTop:10,
                            backgroundColor: Colors.theme_color1,
                            borderTopEndRadius: 0,
                            borderTopStartRadius: 10,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                          }]}>

                          {item.messageType == "text" && <Text style={{
                            paddingHorizontal: 5,
                            color: Colors.whiteColor,
                            fontSize: windowWidth * 3.2 / 100,
                          }}>{item.name}</Text>}

                          {item.messageType == "image" && <TouchableOpacity onPress={() => {
                            this.fullimage(item);
                          }}>
                            <Image
                              source={{ uri: config.img_url + item.name }}
                              style={{
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                borderTopLeftRadius: 10,
                                height: windowHeight * 30 / 100,
                                width: (windowWidth * 60) / 100,
                                resizeMode: "cover",
                                marginVertical: 0,
                                "alignSelf": "center",
                              }}
                            />
                          </TouchableOpacity>
                          }
                          {item.messageType != "image" && <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: windowWidth * 20 / 100,
                            justifyContent: "flex-end",
                            alignSelf: "flex-end",
                          }}>
                            {/* <Image
                                                    source={localimag.checkchat}
                                                    style={{ height: windowHeight * 2 / 100, width: (windowWidth * 2) / 100, resizeMode: 'contain' }}
                                                /> */}
                            <Text style={{
                              fontSize: windowWidth * 2 / 100,
                              paddingHorizontal: 5,
                              color: Colors.whiteColor,
                            }}>{item.time}</Text>
                          </View>}
                        </View>}

                      </View>
                    );
                  }
                  }

                  keyExtractor={(item, index) => index.toString()}
                />

              </View>

              {/* //--------------------------------------------header finish */}


              {/* //--------------------------------------------chat finish */}


            </View>
          </ScrollView>
          <View style={{
            alignSelf: "center",
            height: windowHeight * 7 / 100,
            width: windowWidth * 100 / 100,
            position: "absolute",
            bottom: Platform.OS === "ios" ? this.state.bottom : 0,
            backgroundColor: Colors.theme_color1,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}>
            <TouchableOpacity onPress={() => {
              this.setState({ cameramodalon: true });
            }} style={{ borderTopColor: Colors.whiteColor, width: mobileW * 10 / 100 }}>
              <Image source={localimag.addicon} style={{
                height: windowHeight * 5 / 100,
                width: windowWidth * 5 / 100,
                resizeMode: "contain",
                alignSelf: "center",
              }} />
            </TouchableOpacity>

            <TextInput
              style={{
                fontFamily: Font.Poppins_Regular,
                paddingLeft: 15,
                fontSize: windowHeight * 2 / 100,
                height: windowHeight * 6.5 / 100,
                width: windowWidth * 80 / 100,
                color: "white",
              }}
              value={"" + this.state.chatmsg + ""}
              ref={(input) => {
                this.chatmsg = input;
              }}
              onChangeText={(txt) => {
                this.setState({ chatmsg: txt });
              }}

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
              this.sendmessagebtn1();
            }} style={{ width: mobileW * 10 / 100, justifyContent: "center" }}>
              <Image source={localimag.sendicon} style={{
                height: windowHeight * 4.5 / 100,
                width: windowWidth * 6.5 / 100,
                resizeMode: "contain",
                alignSelf: "center",
              }} />
            </TouchableOpacity>
          </View>


        </View>
      </KeyboardAvoidingView>
    );
  }
}


const styles = StyleSheet.create({
  Notifications_title: {
    fontFamily: Font.Poppins_SemiBold,
    fontSize: windowWidth * 3.8 / 100,
    color: "#000",
    alignSelf: "center",
  },


  styletopbar: {
    width: "33.3%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: Colors.theme_color1,
    paddingTop: windowHeight * 1.5 / 100,
    paddingBottom: windowHeight * 1.5 / 100,
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
