import NetInfo from '@react-native-community/netinfo';
import { config } from '../../Provider/utilslib/Utils'
class ApiContainer {

  getApi = async (url,loader) => {
      // process token key
      let time = Math.floor(Date.now() / 1000);
      let strKey = config.privateTokenKey + time;
      let token = config.MD5(strKey);
      if(url.indexOf('?') > 0) {
          url += '&';
      } else {
          url += '?';
      }
      url += 'time=' + time + '&token=' + token;
      console.log("checkData",url);
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
         if(loader!==1){
          global.props.showLoader();
         }
          fetch(url, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
               Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
             },
           }).then((response) => {
            global.props.hideLoader();
            return response.json();})
            .then((obj) => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch((error) => {
              global.props.hideLoader();
              reject(error);
            });
        }else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      })
    })
  }
  postApi = async (url,data) => {
      // process token key
      let time = Math.floor(Date.now() / 1000);
      let publicKey = "";
      if(data._parts != undefined) {
          let newData = data._parts;
          for (let _index in newData) {
              console.log("_dataAPI:",newData[_index]);
              if(newData[_index][0] == "user_id") {
                  publicKey += newData[_index][1];
              }
              if(newData[_index][0] == "id") {
                  publicKey += newData[_index][1];
              }
          }
      }
      let strKey = config.privateTokenKey + time + publicKey;
      data.append('time',time);
      data.append("token",config.MD5(strKey));
      if(publicKey.length > 0) {
          data.append('public_key',publicKey);
      }
      console.log("checkData",data);
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          global.props.showLoader();
          fetch(url, {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
               Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
             },
             body:data
           }).then((response) =>  {
             global.props.hideLoader();
           return response.json();})
            .then((obj) => {
              global.props.hideLoader();
              console.log(obj, 'obj')
              resolve(obj);
            })
            .catch((error) => {
              global.props.hideLoader();
              reject(error);
            });
        }else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      })
    })
  }
  postApi1 = async (url,data) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {

          fetch(url, {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
               Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
             },
             body:data
           }).then((response) =>  {
            global.props.hideLoader();
               return response.json();})
            .then((obj) => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch((error) => {
              global.props.hideLoader();
              reject(error);
            });
        }else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      })
    })
  }


}
//--------------------------- Config Provider End -----------------------
export const apifuntion = new ApiContainer();
