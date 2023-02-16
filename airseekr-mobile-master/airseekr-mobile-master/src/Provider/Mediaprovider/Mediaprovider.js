import ImagePicker from 'react-native-image-crop-picker';
//  import RNFetchBlob from 'rn-fetch-blob'
 import Share from 'react-native-share';
class mediaProvider {
   //  ShareImage= async (file_url,message1,subject)=>{
   //  let dirs = RNFetchBlob.fs.dirs
   //  let imagePath = null;
   //  RNFetchBlob.config({
   //      fileCache: true  
   //  })
   //  .fetch("GET", file_url)
   //  // the image is now dowloaded to device's storage
   //  .then(resp => {
   //      // the image path you can use it directly with Image component
   //      imagePath = resp.path();
   //      return resp.readFile("base64");
   //  })
   //  .then(async base64Data => {
   //      var base64Data = `data:image/png;base64,` + base64Data;
   //      // here's base64 encoded image
   //      await Share.open({ url: base64Data,title:message1,subject:subject ,message:message1});
   //      // remove the file from storage
   //      // return dirs.unlink(imagePath);
   //  });
   //  }
     launchCamera = async (crop) => {
    let cropvalue=crop==null?false:crop
    return new Promise((resolve, reject) => {
     ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: cropvalue,
      includeBase64:true,
      includeExif:true,
      compressImageQuality:0.4,
      }).then((res) => {
         console.log('res',res);
        resolve(res);
        }).catch((error) => {
         console.log('error',error);
           reject(error);
        });
     })
     }



    launchGellery = async (crop) => {
    let cropvalue=crop==null?false:crop
    return new Promise((resolve, reject) => {
       ImagePicker.openPicker({
       width: 300,
       height: 400,
       cropping: cropvalue,
       includeBase64:true,
       includeExif:true,
       compressImageQuality:0.4,
     }).then((res) => {
        resolve(res);
      }).catch((error) => {
         reject(error);
      });
     });
    }
    MultipleselectGellery = async (crop) => {
    let cropvalue=crop==null?false:crop
    return new Promise((resolve, reject) => {
       ImagePicker.openPicker({
       width: 300,
       height: 400,
       cropping: cropvalue,
       includeBase64:true,
       includeExif:true,
       multiple:true,
       maxFiles:10 ,
       showsSelectedCount :true,
       compressImageQuality:0.4,
     }).then((res) => {
        resolve(res);
      }).catch((error) => {
         reject(error);
      });
     });
     }
    vedioRecorder = async (crop) => {
    let cropvalue=crop==null?false:crop
    return new Promise((resolve, reject) => {
    ImagePicker.openCamera({
      mediaType: 'video',
      width: 300,
      height: 400,
      includeBase64: true,
      duration: 3,
      cropping: cropvalue,
    }).then((res) => {
      resolve(res);
    }).catch((error) => {
       reject(error);
    });
   });
  }



  sharedata=(title,url,subject,massege)=>{
   const options = {
       title: title,
        url: url,
       subject: subject,
       massege: massege ,
       failOnCancel: false,
     }
     Share.open(options).then((res) => {
           // console.log(res);
           return res;
       }).catch((err) => {
           // err && console.log(err);
           return err;
       });

}
}

export const mediaprovider = new mediaProvider();

