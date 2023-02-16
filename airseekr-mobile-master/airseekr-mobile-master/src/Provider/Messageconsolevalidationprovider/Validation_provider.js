import {msgProvider,msgText,msgTitle,config} from '../utilslib/Utils';
class Validation_provider {
   emptyEmail = ['Please enter email', 'التحقق من صحة'];
	validEmail=['Please enter valid email']
	emptyPassword = ['Please enter password', 'التحقق من صحة'];
	lengthPassword=['Password length should be minimum 6 character'];
     lengthnewPassword=['New password length should be minimum 6 character'];
	emptyOldPassword=['Please enter old password', 'التحقق من صحة'];
	emptynewPassword=['Please enter new password', 'التحقق من صحة'];
	emptyconfirmPassword=['Please enter confirm password', 'التحقق من صحة'];
	emptyconfirm=['please enter right password'];
	verifypassword=['Password and confirm password not match'];
	verifynewpassword=['New password and confirm password not match'];
	oldnewpassword=[' Old password and new password should be diffrent'];
  //-------------------- Registration messages ---------------
	emptyFirstName = ['Please enter name', 'التحقق من صحة'];
	emptyABN = ['Please enter ABN number', 'التحقق من صحة'];
	emptyLastName = ['Please enter last name', 'التحقق من صحة'];
	emptyPhone = ['Please enter mobile number', 'التحقق من صحة'];
     emptycoupon= ['Please enter coupon code', 'التحقق من صحة'];
   lengthPhone=['Mobile number should be minimum 7 digit'];
   lengthABN=['ABN length should be minimum 10 '];
   emptyAddress = ['Please choose suburb', 'التحقق من صحة'];
   emptyIdpic = ['Please upload your id for verification', 'التحقق من صحة'];
   emptyAddresstype = ['Please choose address type', 'التحقق من صحة'];
   emptylocation = ['Please choose atleast one location', 'التحقق من صحة'];
	//-------------------- Registration messages ---------------
	loginFirst = ['Please login first', 'التحقق من صحة'];
	emptyContactResion = ['Please select contact reason', 'التحقق من صحة'];
	emptyContactMessage = ['Please enter message', 'التحقق من صحة'];
	emptyreportMessage = ['Please enter description', 'التحقق من صحة'];
   networkconnection=['Unable to connect. Please check that you are connected to the Internet and try again.','Unable to connect. Please check that you are connected to the Internet and try again.'];
   servermessage=['An Unexpected error occured , Please try again .If the problem continues , Please do contact us','An Unexpected error occured , Please try again .If the problem continues , Please do contact us'];
//-------------------- OTP messages ---------------

emptyOTP = ['Please enter otp', ''];
lengthOTP=['OTP should be 4 digit'];

//-------------------- Create new post ---------------
emptycategory = ['Please choose category', ''];
emptytitle = ['Please enter the item that you are seeking', ''];
emptySellTitle = ['Please enter the title that you are selling', ''];
emptybudget= ['Please enter your budget', ''];
emptyspecific= ["Please enter the specifics items you're seeking", ''];
emptyadsimage= ["Please upload atleast one image", ''];


//-------------------- Create new offer ---------------
emptysomething= ["Please try after sometime", ''];
emptyofferprice= ["Please enter offer price", ''];
emptydeliveryotion= ["Please select atleast one delivery option", ''];
emptyquickprice= ["Please enter quick delivery price", ''];
emptyexpresprice= ["Please enter express post price", ''];
emptystandardprice= ["Please enter standard post price", ''];
emptyofferlist= ["There is no offer available", ''];

// ________________________________ end validation___________________________________________

   usernotallow_validation(props,pagename){
      console.log('navigation',props)
       console.log('navigation',props.navigation)
        Alert.alert(
         msgTitle.information[config.language],
         msgTitle.account_deactivate_title[config.language],
          [
               {
                  text: msgTitle.ok[config.language],
                  onPress: () => { localStorage.removeItem('user_arr');
                  localStorage.clear();
                  props.navigation.navigate(pagename)},
               },
           ],
          { cancelable: false },
      );
}
 getDateTime=()=> {
   var now     = new Date();
   var year    = now.getFullYear();
   var month   = now.getMonth()+1;
   var day     = now.getDate();
   var hour    = now.getHours();
   var minute  = now.getMinutes();
   var second  = now.getSeconds();
   if(month.toString().length == 1) {
        month = '0'+month;
   }
   if(day.toString().length == 1) {
        day = '0'+day;
   }
   if(hour.toString().length == 1) {
        hour = '0'+hour;
   }
   if(minute.toString().length == 1) {
        minute = '0'+minute;
   }
   if(second.toString().length == 1) {
        second = '0'+second;
   }
   var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
    return dateTime;
}
}
export const validation = new Validation_provider();
