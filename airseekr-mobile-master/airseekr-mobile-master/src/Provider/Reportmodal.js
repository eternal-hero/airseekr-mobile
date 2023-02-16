import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import Colors from '../Colors';
import { consolepro } from './ConsoleProvider';
import { config } from './configProvider';
import { apifuntion } from './apiProvider';
import { msgProvider, msgTitle, msgText, titlealert, handleback } from './messageProvider';
export default class Reportmodal extends Component {
    constructor(props){
        super(props) 
       this.state={
         status:true,
         message:""
       }
     }



     alertreport = () => {
         let message=this.state.message;
         let type=this.props.data.type
        if (this.state.message.length <= 0) {
            msgProvider.toast(msgText.emptyMessage[config.language], 'center')
            return false;
        }
        if(type=='post'){
            Alert.alert(
               'Report Post',
                'Are you sure you want to report this post?', [{
                    text: msgTitle.no[config.language],
                    onPress: ()=>{this.cancel()},
                    style: msgTitle.cancel[config.language]
                }, {
                    text: msgTitle.yes[config.language],
                    onPress:()=>{this.submit(message)},
                }], {
                    cancelable: false
                }
            ); // works best when the goBack is async
            return true;
        }else if(type=='chat'){
            Alert.alert(
               'Report Chat',
                'Are you sure you want to report this chat?', [{
                    text: msgTitle.no[config.language],
                    onPress: ()=>{this.cancel()},
                    style: msgTitle.cancel[config.language]
                }, {
                    text: msgTitle.yes[config.language],
                    onPress:()=>{this.submit(message)},
                }], {
                    cancelable: false
                }
            ); // works best when the goBack is async
            return true;
        }
        else{
            Alert.alert(
                'Report User',
                'Are you sure you want to report this user?', [{
                    text: msgTitle.no[config.language],
                    onPress: ()=>{this.cancel()},
                    style: msgTitle.cancel[config.language]
                }, {
                    text: msgTitle.yes[config.language],
                    onPress:()=>{this.submit(message)},
                }], {
                    cancelable: false
                }
            ); // works best when the goBack is async
            return true;
        }


      
    };
    cancel=async(message)=>{
        this.setState({message:''});
        this.props.cancel()
    }
    submit=async(message)=>{
        this.setState({message:''});
        let post_id=this.props.data.post_id
        let user_id=this.props.data.user_id
        let type=this.props.data.type
        consolepro.consolelog(' data_report:', this.props.data)
        let url = config.baseURL + "add_post_report.php";
        var data = new FormData();
        if(type=='post'){
            data.append('post_id', post_id)
        }else{
            url = config.baseURL + "add_chat_report.php";
            data.append('other_user_id', post_id)
        }
        data.append('user_id', user_id)
        data.append('comment', message)
        apifuntion.postApi(url,data).then((obj) => {
          consolepro.consolelog('add_post_report_data', obj)
          if (obj.success == 'true') {
            if(type=='chat'){
                msgProvider.toast(obj.msg[1], 'center')
            }else{
                msgProvider.toast(obj.msg[config.language], 'center')
            }
            
            this.props.cancel()
          } else {
            if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
              usernotfound.loginFirst(this.props, obj.msg[config.language])
            } else {
              msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
            }
            return false;
          }
        }).catch(err => {
          consolepro.consolelog('err', err)
        });
    }
    

    render() {
        return (
            <View style={{}}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.status?this.props.reportmodalprp:this.state.status}
                        onRequestClose={() => {  }}
                    >
                             <TouchableOpacity 
                            activeOpacity={0.9}
                            onPress={()=>{ Keyboard.dismiss() }}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#00000090',
                                }}>
                                    <KeyboardAvoidingView style={{ flex: 1,  }}>
                                <View style={{width:'100%',backgroundColor:'white',position:'absolute',bottom:0,padding:12}}>
                                    <View style={{width:'100%',flexDirection:'row',alignItems:'center'}}>
                                   {/* <Text>{this.state.dealcount}</Text> */}
                                <TouchableOpacity style={{position:'absolute',right:5}} onPress={()=>{this.setState({message:''}); this.props.cancel(false);}}>
                                        <Image style={{width:25,height:25}} source={require('../icons/cross.png')}></Image>
                                    </TouchableOpacity></View>
                                   <View style={{borderColor:'gray',borderWidth:1,height:100,marginTop:10}}>
                                   <TextInput 
                                   ref={(txt)=>{this.report=txt}}
                                        value={"" + this.state.message + ""}                                      
                                        placeholder={'Enter Your Report'}
                                        onChangeText={(txt) => { this.setState({ message: txt,dealcount:250-txt.length }) }}
                                        keyboardType='default'
                                        maxLength={250}
                                        returnKeyLabel='next'
                                        returnKeyType='next'
                                        multiline={true} style={{height:100,textAlignVertical:'top',paddingVertical:10, color:Colors.black_color, fontFamily: "Gilroy-Regular",}} placeholderTextColor={Colors.black_color}  placeholder={'Enter report here...'}>
                                    </TextInput>
                                   </View>
                                    
                                    <View style={[styles.input_view2, {}]}>
                                        <TouchableOpacity onPress={()=>{this.alertreport()}} style={styles.touchsbmit}>
                                            <Text style={styles.txtsubmit}>{'Submit'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                        
                                </View>
                                </KeyboardAvoidingView>
                               
                            </TouchableOpacity>
                        </Modal>
                      
               
            </View>
        )
    }
}




const styles = StyleSheet.create({

input_view2: {
    width: '80%',alignSelf:'center',
    flexDirection: 'row',
    paddingVertical: 5,
    backgroundColor: '#000',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 40,
    marginBottom:5

},touchsbmit:{
    alignItems: 'center', justifyContent: 'center', width: '100%', height: 50,
},
txtsubmit:{color: Colors.white_color, marginLeft: 10, fontSize: 18, fontFamily: "Gilroy-Regular",},



});
