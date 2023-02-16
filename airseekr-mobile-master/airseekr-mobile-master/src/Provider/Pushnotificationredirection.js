import React from 'react';
import { config } from './configProvider';
import { localStorage } from './localStorageProvider';
import { msgProvider, msgTitle, msgText } from './messageProvider';
import {notification} from './NotificationProvider';
global.propsnavigation
class Pushnotificationredirection {
	//----------------- message buttons
    constructor(){

    }
    redirectfun(props)
         {
            propsnavigation=props;
         }

         onOpened=async(openResult)=>{
           let navigation=propsnavigation
            console.log('openResult: ', openResult.notification.payload.body);

            var datajson=openResult.notification.payload.additionalData.p2p_notification.action_json;
             var user_id =  datajson.user_id;
             var other_user_id = datajson.other_user_id;
             var action_id = datajson.action_id;
             var action = datajson.action;
             var  userdata = await localStorage.getItemObject('user_arr')
             console.log('datajson_user_id', datajson.user_id)


              if(userdata.user_id==other_user_id)
              {
                other_user_id=datajson.user_id
              }

            // this.setState({loading:false})
            if(userdata!=null)
            {
              if(userdata.user_id!=other_user_id)
                {
                  console.log('navigation run')
                  if(item.action=='like_vedio')
                   {
                       navigation.navigate('Showlivevedio',{'streming_id':action_id,livestatus:0})
                    }
                  else if(item.action=='comment_vedio')
                    {
                   navigation.navigate('Showlivevedio',{'streming_id':action_id,livestatus:0})
                  }}

             }
            else{

            navigation.navigation.navigate('Login')
            }
          }
           onIds(device) {
              console.log('Device info: ', device);
              player_id_me1=device.userId
           }
}

export const pushnotification = new Pushnotificationredirection();
