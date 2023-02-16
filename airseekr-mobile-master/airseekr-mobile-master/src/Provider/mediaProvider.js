
import React from 'react'
import { View } from 'react-native'
import Share from 'react-native-share';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob'
class Mediafunction {

sharedata=(title,url,subject,massege)=>{
    const options = {
        title: title,
        url: url,
        subject: subject,
        massege: massege,
        failOnCancel: false,
      }

      Share.open(options).then((res) => {
         
            return res;
        }).catch((err) => {
           
            return err;
        });

}

launchCamera = async () => {
    let result = 3
    let resultt = await ImagePicker.openCamera({
      width: 1024,
      height: 712,
      cropping: true,
      enableRotationGesture:false,
    }).then((image) => {
      result = 1;
      return image
    });
    if (result == 1) {
      return resultt
    }

}
launchVideo = async () => {
    let result = 3
    let resultt = await ImagePicker.openCamera({
      width: 1024,
      height: 512,
      cropping: false,
      enableRotationGesture:false,
       mediaType: 'video',
      
    }).then((image) => {
      result = 1;
      return image
    });
    if (result == 1) {
      return resultt
    }

}

launchGellery = async () => {
    let result = 3
    let resultt = await ImagePicker.openPicker({
      width: 1024,
      height: 712,
      mediaType: 'image',
      cropping: true,
      enableRotationGesture:false,
    }).then((image) => {
      result = 1;
      return image
    });
    if (result == 1) {
      return resultt
    }
}
launchGelleryVideo = async () => {
    let result = 3
    let resultt = await ImagePicker.openPicker({
      width: 1024,
      height: 712,
      cropping: false,
      enableRotationGesture:false,
      mediaType: 'video',
    }).then((image) => {
      result = 1;
      return image
    });
    if (result == 1) {
      return resultt
    }
}




ShareImage= async (file_url,message1,subject)=>{
  let dirs = RNFetchBlob.fs.dirs
  let imagePath = null;
  RNFetchBlob.config({
      fileCache: true  
  })
  .fetch("GET", file_url)
  // the image is now dowloaded to device's storage
  .then(resp => {
      // the image path you can use it directly with Image component
      imagePath = resp.path();
      return resp.readFile("base64");
  })
  .then(async base64Data => {
      var base64Data = `data:image/png;base64,` + base64Data;
      // here's base64 encoded image
      await Share.open({ url: base64Data,title:message1,subject:subject ,message:message1});
      // remove the file from storage
      // return dirs.unlink(imagePath);
  });
}




}
export const mediafuntion = new Mediafunction();