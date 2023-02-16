import React,{Component} from 'react';
import {Text,View,StyleSheet,SafeAreaView ,Image,Dimensions,Keyboard,TextInput,FlatList,BackHandler, ScrollView,TouchableOpacity,StatusBar} from 'react-native';
import Colors from './Colors'
import { config } from './Provider/configProvider';
import { Font } from './Provider/Colorsfont';
import firebase from './Config1';
import { msgProvider, msgTitle, msgText, titlealert, handleback } from './Provider/messageProvider';
import NetInfo from '@react-native-community/netinfo';
import { firebaseprovider}  from './Provider/FirebaseProvider';
import { localStorage }  from './Provider/localStorageProvider';
import Loader from './Loader'
import CSSstyle from './Provider/css';
import Footer from './Provider/Footer';
import {consolepro} from './Provider/ConsoleProvider'
import {Languageprovider}  from './Provider/Languageprovider';
import * as Animatable from 'react-native-animatable';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
global.inboxoffcheck=0;
export default class Message extends Component{ 
  _didFocusSubscription;
  _willBlurSubscription;
    constructor(props) {
      super(props);
    this.state = { 
           Email:'',
           isConnected:true,
           loadMoreloading:false,
           page:'message',
           inboxmessage:[],
           inboxmessage2:'NA',
           loading:false,
           idex1:0,
           modalVisible1:false,
           user_id:'',
           notification_arr:'NA',
           refresh:false,
           search:'',
           issearching:false,
           isedit:false,
         
         }
         this._didFocusSubscription = props.navigation.addListener('focus', payload =>
      BackHandler.addEventListener('hardwareBackPress', handleback.handleBackPress)
    );
      
   }
   componentDidMount(){
    this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
    BackHandler.removeEventListener('hardwareBackPress', handleback.handleBackPress)
  );
    NetInfo.fetch().then(state => {
    this.setState({isConnected:state.isConnected}) });
  //Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
    this.setState({isConnected:state.isConnected})
    });
   
  
 
    this.props.navigation.addListener('focus', () => {
      this.setState({ search:'',
      issearching:false,
      isedit:false,})
      this.getMyInboxAllData1()
      firebaseprovider.firebaseUserGetInboxCount();
      this.showUserInbox()
   });
    
   }
   getMyInboxAllData1=async()=>{

    consolepro.consolelog('getMyInboxAllData123');
      userdata= await localStorage.getItemObject('user_arr')
    //------------------------------ firbase code get user inbox ---------------
    if(userdata != null){
      // alert("himanshu");
      this.setState({user_id:userdata.user_id})
      var id='u_'+userdata.user_id;
      consolepro.consolelog('inboxoffcheck',inboxoffcheck)
      if(inboxoffcheck>0)
      {
        consolepro.consolelog('getMyInboxAllDatainboxoffcheck');
        var queryOffinbox = firebase.database().ref('users/'+id+'/myInbox/').child(userChatIdGlobal);
        // queryOffinbox.off('child_added');
        queryOffinbox.off('child_changed');
      }

       var queryUpdatemyinboxmessage = firebase.database().ref('users/'+id+'/myInbox/');
        queryUpdatemyinboxmessage.on('child_changed', (data)=>{
        consolepro.consolelog('inboxkachildchangemessage',data.toJSON())
        setTimeout(()=>{  this.showUserInbox() }, 3000);
  
       
   })
   var queryUpdatemyinboxadded = firebase.database().ref('users/'+id+'/myInbox/');
   queryUpdatemyinboxadded.on('child_added', (data)=>{
    consolepro.consolelog('inboxkaadded',data.toJSON())
    setTimeout(()=>{  this.showUserInbox() }, 3000);
   
    // firebaseprovider.firebaseUserGetInboxCount();
})
    }
    }
   

   convertTimeAllFormat=(time11, format)=>
     {
       consolepro.consolelog(' convertTimeAllFormat time11',time11)
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
   
   if(format == 12){
   var ampm = hours >= 12 ? 'PM' : 'AM';
   hours = hours % 12;
   hours = hours ? hours : 12; // the hour '0' should be '12'
   minutes = minutes < 10 ? '0'+minutes : minutes;
   var strTime = hours + ':' + minutes + ' ' + ampm;
   }else if(format == 24){
   var ampm = hours >= 12 ? 'PM' : 'AM';
   //hours = hours < 10 ? '0'+hours : hours;
   minutes = minutes < 10 ? '0'+minutes : minutes;
   var strTime = hours + ':' + minutes;
   }else if(format == 'other'){
   
   var ampm = hours >= 12 ? 'PM' : 'AM';
   hours = hours % 12;
   hours = hours ? hours : 12; // the hour '0' should be '12'
   minutes = minutes < 10 ? '0'+minutes : minutes;
   var strTimeAll = hours + ':' + minutes + ' ' + ampm;
   var strTime = curr_date+'. '+m_names_sort[curr_month]+' '+curr_year+' '+strTimeAll;
   }else if(format == 'ago'){
   var strTime = timeSince(new Date(time11));
   //consoleProvider.log(new Date(time11));
   }else if(format == 'date_time'){
   var date = new Date(time11);
   
   var seconds = Math.floor((new Date() - date) / 1000);
   var interval = Math.floor(seconds / 3600);
   if(interval <= 24) {
   var ampm = hours >= 12 ? 'PM' : 'AM';
   hours = hours % 12;
   hours = hours ? hours : 12; // the hour '0' should be '12'
   minutes = minutes < 10 ? '0'+minutes : minutes;
   var strTime = hours + ':' + minutes + ' ' + ampm;
   }else{
   var curr_month = date1.getMonth()+1; //Months are zero based
   var curr_year = date1.getFullYear();
   var curr_year_small = String(curr_year);
   consolepro.consolelog('curr_year_small',curr_year_small);
     curr_year_small=curr_year_small.substring(2, 4);
   consolepro.consolelog('curr_year_small',curr_year_small);
   var strTime = curr_month+'/'+curr_date+'/'+curr_year_small;
   }
  }
    else if(format == 'date_time_full'){
    var date = new Date(time11);
    
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 3600);
    if(interval <= 24) {
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    }else{
    var curr_month = date1.getMonth()+1; //Months are zero based
    var curr_year = date1.getFullYear();
    var curr_year_small = String(curr_year);
    consolepro.consolelog('curr_year_small',curr_year_small);
      curr_year_small=curr_year_small.substring(2, 4);
    consolepro.consolelog('curr_year_small',curr_year_small);
    
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTimeAll = hours + ':' + minutes + ' ' + ampm;
    
    var strTime = curr_month+'/'+curr_date+'/'+curr_year_small+' '+strTimeAll;
    }
    
    }
    
    return strTime;
    }
    showUserInbox=async()=>{
      consolepro.consolelog('showUserInboxmesssagepabgewala');  
      let  userdata= await localStorage.getItemObject('user_arr')
      var user_id=userdata.user_id
      var login_type=userdata.login_type
      inboxoffcheck=1
      var inbox=[] 
      consolepro.consolelog('FirebaseInboxJson get in-box121',FirebaseInboxJson);
      var len=FirebaseInboxJson.length;
      consolepro.consolelog('FirebaseInboxJson len',len);
      //$('.showConversationsCount').text(len);
      if(len>0){
        // $('#chat_meassage_inbox_list').html('');
        // $('#no_data_home').hide()
        FirebaseInboxJson.sort((a, b)=> {
          var x = a.lastMsgTime, y = b.lastMsgTime;
          return x > y ? -1 : x < y ? 1 : 0;
      });
        consolepro.consolelog('FirebaseInboxJsonmessage',FirebaseInboxJson);
        console.log('FirebaseInboxJsonmessage',FirebaseInboxJson);
        let other_user_id55=0
        // $.each(FirebaseInboxJson,function(index,keyValue)
       for(let k=0; k<FirebaseInboxJson.length; k++)
        // FirebaseInboxJson.map((keyValue)=>
        { 
          let  keyValue=FirebaseInboxJson[k]
          console.log('FirebaseInboxJson[k]',FirebaseInboxJson[k])
           if(keyValue.user_id!=other_user_id55)
           {
          consolepro.consolelog('message user_id',keyValue);
          var other_user_id=keyValue.user_id;
          var blockstatus=keyValue.block_status
          other_user_id55=keyValue.user_id;
          consolepro.consolelog('other_user_id55',other_user_id55)
          consolepro.consolelog('other_user_id',other_user_id)      
          consolepro.consolelog('FirebaseUserJson',FirebaseUserJson);
          var user_data_other = FirebaseUserJson.findIndex(x => x.user_id==other_user_id);    
          consolepro.consolelog("user_data_other",user_data_other);
          if(user_data_other != -1){
            var userDataMe=FirebaseUserJson[user_data_other];
          
            consolepro.consolelog('userdata',userDataMe)
            var count=keyValue.count;
            var lastMessageType=keyValue.lastMessageType;
            var lastMsg=keyValue.lastMsg;
            var lastMsgTime=keyValue.lastMsgTime;

            // var order_id=keyValue.order_id;
            // var order_number=keyValue.order_number;
            // var chat_type=keyValue.chat_type;
            
             consolepro.consolelog('lastMsg',lastMsg);
              var userId=userDataMe.user_id;
              if(userDataMe.login_type=='app')
              {
                var userImage=config.img_url+userDataMe.image;
              }
              else{
                var userImage=config.img_url+userDataMe.image;
              }
           
            var userName=userDataMe.name;
              var onlineStatus=userDataMe.onlineStatus;
            
              var lastMsgShow='';
              if(lastMessageType == 'text'){
                lastMsgShow=lastMsg;
              }else if(lastMessageType == 'image'){
                lastMsgShow='Photo';
              }
            
              var imgOnline='';
              // if(onlineStatus == 'true'){
              //   var imgOnline='<img src="img/msg_green_dot.png" class="msg_green_dot">';
              // }
               var countHtml='';
              consolepro.consolelog('lastMsgTime',lastMsgTime);
              if(lastMsgTime != ''){
                 lastMsgTime=this.convertTimeAllFormat(lastMsgTime,'date_time');
                  // lastMsgTime=lastMsgTime
                 countHtml='';
                }else{
                    lastMsgTime='';
                  }
                if(count>0){
                  countHtml=count;                
                }  
                let data5= {
                      'name':userName,
                       'images':userImage,
                      'message':lastMsgShow,
                      'time':lastMsgTime,
                      'count':count,
                      'other_user_id':other_user_id,
                      'blockstatus':blockstatus,
                      'vip_staus_me':userdata.vip_staus_me
  
                  };
                  consolepro.consolelog('lastMsgShowlastMsgShow',lastMsgShow);
                  consolepro.consolelog('nilesh1 count',count);
                  consolepro.consolelog('upervalapushdataconsole',data5)
                  
                inbox.push(data5) 
                consolepro.consolelog('pushdataconsoleafter',inbox)
               
     
                /*var htmlData = '<li class="item-content chat_list_'+other_user_id+'" id="chat_list_'+other_user_id+'">'+
                  '<a href="/chat/'+other_user_id+'/'+userName+'/" class="item-link">'+
                    '<span><img src="'+userImage+'" '+onerror_user_placeholder+'  /></span>'+
                    '<content>'+
                      '<h3>'+userName+'</h3>'+
                      '<p class="lastMsgShow_'+other_user_id+'" id="lastMsgShow_'+other_user_id+'">'+lastMsgShow+'</p>'+
                    '</content>'+
                    '<time id="lastMsgTime_'+other_user_id+'">'+lastMsgTime+'</time>'+
                    '<span id="unreadMsgCount_'+other_user_id+'">'+countHtml+'</span>'+
                  '</a>'+
                '</li>';*/
                
     
                //  var onerror="this.src='img/error_default_image121.png'";
                // var htmlData = '<li id="chat_list_'+other_user_id+'_'+keyValue.order_number+'" data-position="'+keyValue.lastMsgTime+'">'+
                //    '<a href="/chat/'+other_user_id+'/'+keyValue.order_id+'/'+keyValue.order_number+'/'+keyValue.chat_type+'/">'+
                //     '<time>'+lastMsgTime+'</time>'+
                //     '<span> <img src="'+userImage+'" onerror="'+onerror+'"></span>'+
                //     '<content>'+
                //       '<h2>#'+keyValue.order_number+'</h2>'+
                //       '<h3>'+userName+'</h3>'+
                //       '<h4>'+lastMsgShow+'</h4>'+
                //     '</content>'+
                //     countHtml+
                //   '</a>'+
                //   '</li>';
     
                // consolepro.consolelog('nilesh2');
                // if (chat_type == 'o') {
                //   $('#chat_meassage_inbox_list').append(htmlData);
                //   $('#chat_meassage_inbox_list li').sort(sortInboxAll).appendTo('#chat_meassage_inbox_list');
                // }else if (chat_type == 's') {
                //   $('#chat_meassage_inbox_list_service').append(htmlData);
                //   $('#chat_meassage_inbox_list_service li').sort(sortInboxAll).appendTo('#chat_meassage_inbox_list_service');
                // }
              
          }
          consolepro.consolelog('inboxmessage',inbox)
            
     
        }
        
        // var length = $('#chat_meassage_inbox_list li').length;
        // var length2 = $('#chat_meassage_inbox_list_service li').length;
        
        // if(length==0){
        //   $('#no_data_home_order').show();    
        // }else{
        //   $('#no_data_home_order').hide();
        // }
        // if(length2==0){
        //   $('#no_data_home_service').show();    
        // }else{
        //   $('#no_data_home_service').hide();
        // }
      }}
      this.setState({inboxmessage:inbox,inboxmessage2:inbox,refresh:false}) 
      // this.setState({inboxmessage:'NA'}) 
      // }else{
      //   $('#chat_meassage_inbox_list').html('<li class="no_found_img"><img src="img/no-result.gif" style="width: 100%;"></li>');
      //  $('#no_data_home_order').show();
      //   $('#no_data_home_service').show();
      // }
      }
    SearchFilterFunction=(text)=> {
    //passing the inserted text in textinput
    if(text.length>0){
      this.setState({issearching:true})
    }else{
      this.setState({issearching:false})
    }
    
    let data1=this.state.inboxmessage2
    const newData = data1.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    consolepro.consolelog(newData)
    if(newData.length>0)
    {
      this.setState({
        inboxmessage: newData,
        search:text,
       
      });
    }
    else{
      this.setState({
        inboxmessage: 'NA',
        search:text,
       
      });
      this.setState({msg:'This Type of data is not available'})
    }
   
    }
    _onRefresh = () => {
      this.setState({refresh:true})
      this.showUserInbox() 
    }
   
    loadMore = () => {
      consolepro.consolelog('vikas')
     if(this.state.notification_arr!='NA')
     {
      this.setState({
        loadMoreloading:true, page: this.state.page + 1
      }, () => {
        this.getallnotification1()
      });
     }
    }

    removefrominbox=async(item,index)=>{
     
    
        var messageIdME = 'u_'+this.state.user_id+'__u_'+item.other_user_id;
        consolepro.consolelog('messageIdME',messageIdME)
       
       
        firebase.database().ref().child('message' + '/' + messageIdME+'/').remove().then(()=> {


  firebase.database().ref('users/' + 'u_'+this.state.user_id+'/myInbox/'+'u_'+item.other_user_id).remove().then(()=> {
        console.log("Createlikeuserinbox success.");
        FirebaseInboxJson=[]
        
          firebaseprovider.firebaseUserCreate(); 
        
        firebaseprovider.getMyInboxAllData();
        this.getMyInboxAllData1()
        firebaseprovider.firebaseUserGetInboxCount();
        this.showUserInbox()
        consolepro.consolelog('FirebaseUserJson',FirebaseUserJson);
        this.setState({loading:false,
          search:'',
          issearching:false,
          isedit:false,
        });
     }).catch(function(error) {
     
  
    });


        })
          
     }
      
    
    renderFooter = () => {
      //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if(this.state.loadMoreloading==true)
    {
       return (
         <ActivityIndicator
           style={{ color: '#000' }}
         />
       );
    
     }
     else{
       return null
     }
    };
    render(){
        consolepro.consolelog('cikasd')
        consolepro.consolelog('inboxmessage:',this.state.inboxmessage)
return(
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar barStyle='light-content' backgroundColor={Colors.theme_color} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} /> 
          <Loader loading={this.state.loading}/>
          <View style={styles.headers}>
                                <Text>{'           '}</Text>
                                <Text style={CSSstyle.headertext}>Chats</Text>
                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { }}>
                                {/* <Text style={[CSSstyle.headertext,{fontSize:12,}]}></Text> */}
                                <TouchableOpacity onPress={()=>{this.setState({isedit:!this.state.isedit})}} style={{ alignItems: 'center', height: 35, justifyContent: 'center' }}>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('./icons/editb.png')}></Image>
                                </TouchableOpacity>
                                 {/* Clear */}
                                </TouchableOpacity>
           </View>
           <View style={{alignSelf:'center', width: '90%', backgroundColor: Colors.white_light, flexDirection: 'row', borderRadius: 5, alignItems: 'center', marginTop: 20,justifyContent:'center' }}>
                                <TextInput
                                value={""+this.state.search+""}
                                onChangeText={(txt)=>{this.SearchFilterFunction(txt)}}
                                 maxLength={30} placeholderTextColor={Colors.gray_color} placeholder={'Search'} style={{ marginLeft: 8, width: '85%', height: 45, }}></TextInput>
                              {this.state.issearching==true ?  <TouchableOpacity onPress={()=>{this.SearchFilterFunction('')}} style={{ alignItems: 'center', height: 35, justifyContent: 'center' }}>
                                    <Image style={{ width: 23, height: 23, resizeMode: 'contain' }} source={require('./icons/cross.png')}></Image>
                                </TouchableOpacity>:
                                <View style={{ alignItems: 'center', height: 35, justifyContent: 'center' }}>
                                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('./icons/searchg.png')}></Image>
                                </View>}
                            </View>
          <View style={{width:'90%',alignSelf:'center',paddingTop:10,paddingBottom:110}}>
            
          { (this.state.inboxmessage=='NA' ||this.state.inboxmessage.length<=0) && <Image style={{width:'100%',height:windowHeight/4,marginTop:windowHeight/12}} source={require('./icons/nodata.png')}></Image>}
                                       
              

          { this.state.inboxmessage!='NA' &&this.state.inboxmessage.length>0 &&
             <FlatList
               data={this.state.inboxmessage}
               showsVerticalScrollIndicator={false}
              //  onEndReached={(x) => {this.loadMore()}}
               onEndReachedThreshold={0.5}
              //  ListFooterComponent={this.renderFooter}
               onRefresh={() => this._onRefresh()}
               refreshing={this.state.refresh}
               renderItem={({item,index})=>{
                consolepro.consolelog('item.image',item.images)
                 if(this.state.inboxmessage.length>=0)
                   {
                     consolepro.consolelog('item.image',item.images)
                     console.log('item.image',item)
                      // if(item.time.length>0 && item.message.length>0 )
                      // {
                      // console.log('item.image1',item)
                     return(
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Chat',{'data':{'other_user_id':item.other_user_id,'other_user_name':item.name,'image':item.images,'title':'',blockstatus:item.blockstatus}})}} activeOpacity={0.7} style={{}}> 
                            <View style={item.count>0 ? [styles.notofication_box, { backgroundColor: Colors.white_light }] : [styles.notofication_box, { backgroundColor: '#f9f9f9' }]}>
                                <Text style={styles.mintxt}>{item.time}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                           
                                {item.images==undefined?
                            <Image source={require('./icons/user_profile.png')} style={CSSstyle.profilimage_med}/>:
                               item.images=='NA'?
                            <Image source={require('./icons/user_profile.png')} style={CSSstyle.profilimage_med}/>:
                              item.images==null?
                            <Image source={require('./icons/user_profile.png')} style={CSSstyle.profilimage_med}/>:
                            <Animatable.Image  ref={"close"}
                             delay={500}
                             animation="zoomInUp" source={{uri:item.images}} style={CSSstyle.profilimage_med}/>
                            }
                               
                                    <View style={{ marginLeft: 15 }}>
                                        <Text style={{ fontSize: 15, color: Colors.black_color, fontFamily:Font.Poppins_Bold }}>{item.name}</Text>
                                        <Text style={{ fontSize: 13, color: Colors.gray_color, fontFamily: Font.Poppins_Regular }}>{item.message}</Text>

                                    </View>
                                </View>
                                {item.count>0 && this.state.isedit==false && <View style={styles.countview}>
                                    <Text style={{ color: Colors.white_color, fontFamily:Font.Poppins_Bold, fontSize: 8 }}>{item.count>=10?'+9':item.count}</Text>
                                </View>}
                                {this.state.isedit==true && <TouchableOpacity onPress={()=>{this.removefrominbox(item,index)}} style={styles.countview1}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('./icons/cross1.png')}></Image>
                                </TouchableOpacity>}


                            </View>
                        </TouchableOpacity>

                      //  <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Chat',{'data':{'other_user_id':item.other_user_id,'other_user_name':item.name,'image':item.images,'title':''}})}}>
                      //      <View style={{width:'100%',alignSelf:'center',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#f2f2f2',paddingVertical:15}}>
                      //          <View style={{width:'83%'}}> 
                      //       <View style={{flexDirection:'row',width:'100%'}}>
                      //           <Text style={{width:'30%',fontFamily:Font.Poppins_Regular,fontSize:12}}>{item.time}</Text>
                      //           <Text style={{width:'70%',fontSize:13,color:'gray',fontFamily:'Poppins-Light',textAlign:'right'}}>{item.name}</Text>  
                      //       </View>
                      //      <View style={{flexDirection:'row',paddingTop:3,width:'100%'}}>
                      //      {item.count==0 && 
                      //      <View style={{width:'10%'}}>
                      //        <View style={{width:20,height:20,marginTop:2,borderRadius:13,backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center',alignSelf:'flex-end'}}>
                      //           <Text style={{color:'gray',fontFamily:'Poppins-Light',fontSize:12.5,color:'#FFFFFF'}}></Text>
                      //       </View>
                      //       </View>
                      //       }
                      //       { item.count>0 && 
                      //        <View style={{width:'10%',paddingRight:5}}>
                      //      <View style={{width:20,height:20,marginTop:2,borderRadius:13,backgroundColor:Colors.buttoncolor,justifyContent:'center',alignItems:'center',alignSelf:'flex-end'}}>
                      //      <Text style={{color:'#FFFFFF',fontFamily:'Poppins-Light',fontSize:12.5,color:'#FFFFFF'}}>{item.count>=10?'+9':item.count}</Text>
                      //       </View>
                      //       </View>
                      //       }
                      //       <Text style={{fontSize:13,width:'90%',color:'gray',fontFamily:'Poppins-Light',textAlign:'right',}}>{item.message}</Text>  
                      //      </View>
                      //      </View>
                      //      <View style={{width:'17%'}}>
                      //      {item.images==undefined?
                      //       <Image source={require('./icons/user_profile.png')} style={{width:35,height:35,alignSelf:'center',resizeMode:'contain'}}/>:
                      //          item.images=='NA'?
                      //       <Image source={require('./icons/user_profile.png')} style={{width:35,height:35,alignSelf:'center',resizeMode:'contain'}}/>:
                      //         item.images==null?
                      //       <Image source={require('./icons/user_profile.png')} style={{width:35,height:35,alignSelf:'center',resizeMode:'contain'}}/>:
                      //       <Animatable.Image  ref={"close"}
                      //        delay={500}
                      //        animation="zoomInUp" source={{uri:config.img_url+item.images}} style={{width:40,height:40,borderRadius:30,alignSelf:'center'}}/>
                      //       }
                      //         </View>
                      //       </View>
                      //    </TouchableOpacity>
                     );
                          
                  }
                  else if(this.state.inboxmessage.length==1)
                  {
                    return(
                      <View style={{alignContent:'center',alignSelf:'center',alignItems:'center',marginTop:50}}>
                       <Image source={require('./icons/nodata.png')} style={{width:150,height:150,alignSelf:'center',}}/>
                    </View>
                    )
                  }
                
                }}
                 keyExtractor={(item, index) => index.toString()}
               />
              }
            </View> 

     
           
            <Footer
          activepage='Message'
          usertype={1}
          footerpage={[
            { name: 'homepage', countshow: false, image: require('./icons/home.png'), activeimage: require('./icons/homeactive.png') },
            { name: 'Message', countshow: false, image: require('./icons/message.png'), activeimage: require('./icons/chatactive.png') },
            { name: 'notification', countshow:config.countshow, image: require('./icons/homechat.png'), activeimage: require('./icons/messageactive.png') },
            { name: 'settings', countshow: false, image: require('./icons/setting.png'), activeimage: require('./icons/settingactive.png') },

          ]}
          navigation={this.props.navigation}
          imagestyle1={{ width: 20, height: 20, backgroundColor: Colors.white_color, countcolor: 'red', countbackground: 'red' }}
          count_inbox={count_inbox}

        /> 
        </View>
    )
     }
    }
    const styles=StyleSheet.create({
     
        container:{
            flex:1,
            backgroundColor:'#FFFFFF',

            },
            inputcontainer:{
                backgroundColor:'#ededed',
                width:'100%',
               flexDirection:'row',
                alignSelf:'center',
                borderRadius:5
            
            },
            buttonlayoutheader:{
                width:'100%',
                alignSelf:'center',
                paddingVertical:15,
                borderBottomWidth:1,
                borderBottomColor:'#e8e8e8'
              },
              countview: { alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10, bottom: 10, width: 17, height: 17, borderRadius: 9, backgroundColor: 'red' },
              countview1: { alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10, bottom: 10, width: 17, height: 17, borderRadius: 9, },
              mintxt: { position: 'absolute', right: 10, top: 10, color: Colors.gray_color, fontFamily:Font.Poppins_Bold, fontSize: 12 }
              , notofication_box: {
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 8,
          
          
              },
              headers: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 12,paddingHorizontal:20,alignItems:'center', },
              viewtxt: { fontSize: 16, fontFamily:Font.Poppins_Bold },
              vieww: { marginTop: 10, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', backgroundColor: Colors.white_color, borderWidth: 0.5, borderColor: Colors.gray_color, borderRadius: 8, height: windowHeight / 12 },
              touch: { marginTop: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', width: '100%', alignItems: 'center', backgroundColor: Colors.theme_color, borderRadius: 8, height: windowHeight / 12 },
             
    })