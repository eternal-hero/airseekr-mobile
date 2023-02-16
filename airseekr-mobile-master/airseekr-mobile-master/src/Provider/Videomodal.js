import React, { Component } from 'react'
import { Text,valumekey, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Orientation,Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import Colors from '../Colors';
import { consolepro } from './ConsoleProvider';
import { config } from './configProvider';
import { apifuntion } from './apiProvider';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import Video from 'react-native-video';
import { msgProvider, msgTitle, msgText, titlealert, handleback } from './messageProvider';
export default class Videomodal extends Component {
    constructor(props){
        super(props) 
       this.state={
                currentTime: 0,
                duration: 0,
                isFullScreen:false,
                isLoading: true,
                paused: false,
                status:true,
                playerState: PLAYER_STATES.PLAYING,
                screenType: 'content',
                vediosrc: 'https://assets.mixkit.co/videos/download/mixkit-countryside-meadow-4075.mp4',
                // vediosrc:this.props.navigation.getParam('vediosrc'),
                volumesound:valumekey,
                repeatvedio:false
       }
     }


     onLoad = data => this.setState({ duration: data.duration, isLoading: false });
  
     onLoadStart = data => this.setState({ isLoading: true });
     
     onEnd = () => {
       this.setState({ playerState: PLAYER_STATES.PLAYING,currentTime: 0,paused:false });
      
       this.props.cancel()
     }
     
     onError = () => alert('Oh! ', error);
    exitFullScreen = () => {
       alert('Exit full screen');
     };
     
     enterFullScreen = () => {};
     
     onFullScreen = () => {
     
       if (this.state.screenType == 'content')
          this.setState({ screenType: 'cover',isFullScreen:true});
          else this.setState({ screenType: 'content',isFullScreen:false });
       };
     
     onSeeking = currentTime => this.setState({ currentTime });
     onReplay = () => {
       //Handler for Replay 
       this.videoPlayer.seek(0);
       
       this.setState({playerState:PLAYER_STATES.PLAYING,
         currentTime: 0,
         volumesound:valumekey,repeatvedio:false,paused:false});
       
     };
   
     onProgress = data => {
       const { isLoading, playerState } = this.state;
       // Video Player will continue progress even if the video already ended
       
       if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
         this.setState({currentTime:data.currentTime });
       }
       
     };
   onSeek = seek => {
        this.videoPlayer.seek(seek);
     };
   
     onPaused = playerState => {
       if(playerState==1)
       {
         this.setState({
           paused: !this.state.paused,
           playerState,
           volumesound:0
         });
       }
       else{
         this.setState({
           paused: !this.state.paused,
           playerState,
           volumesound:valumekey
         });
       }
       //Handler for Video Pause
         
     };
   

    render() {
        return (
            <View style={{flex:1}}>
                    <Modal
                        animationType="slide"
                        transparent={false}
                     
                        visible={this.state.status?this.props.videomodalopen:this.state.status}
                        // visible={true}

                        onRequestClose={() => { }}
                    >
                      <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
        <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color} hidden={false} translucent={false}
          networkActivityIndicatorVisible={true} />
                             <View   style={{flex: 1,backgroundColor: '#000000',}}>

                                    <Video
                                    onEnd={this.onEnd}
                                    onLoad={this.onLoad}
                                    // audioOnly={true}
                                    // controls={true}
                                    playInBackground={false}
                                    rate={1.0}
                                    onLoadStart={this.onLoadStart}
                                    onProgress={this.onProgress}
                                    paused={this.state.paused}
                                    ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                                    resizeMode={"cover"}
                                    onFullScreen={this.state.isFullScreen}
                                    source={{
                                      uri: this.props.data.videosrc
                                    }}
                                    // source={{uri:this.state.vediosrc}}
                                    // source={require('C:\Users\YD\Desktop\vikas_project\SCRATCHPROJECT\Video App\mp4 rendered\mp4 rendered\breakout rendered mp4/vid 1 introduction')}
                                    repeat={false}
                                    style={styles.mediaPlayer}
                                    volume={this.state.volumesound}
                                    />
                                    <MediaControls
                                    mainColor={Colors.statuscolor}
                                    duration={this.state.duration}
                                    isLoading={this.state.isLoading}
                                    // mainColor="#333"
                                    
                                    onFullScreen={this.onFullScreen}
                                    onPaused={this.onPaused}
                                    onReplay={this.onReplay}
                                    onSeek={this.onSeek}
                                    onSeeking={this.onSeeking}
                                    playerState={this.state.playerState}
                                    progress={this.state.currentTime}
                                    // toolbar={this.renderToolbar()}
                                    />
                                    {this.state.isFullScreen==false && <View style={{position:"absolute",top:10,left:10,justifyContent:'center',borderRadius:5,backgroundColor:'white',padding:5}}>
                                    <TouchableOpacity activeOpacity={0.9} style={{}} onPress={   this.props.cancel}>
                                        <Image source={require('../icons/backb.png')} style={{width:25,height:25,resizeMode:'contain'}}/>
                                </TouchableOpacity>
                                </View>}
                                
                               
                            </View>
                        </Modal>
                      
               
            </View>
        )
    }
}




const styles = StyleSheet.create({
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
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
