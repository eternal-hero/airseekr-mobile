import { Alert, ToastAndroid, NativeModules, I18nManager, Platform } from "react-native";
import { localStorage } from './localStorageProvider';
import AsyncStorage from "@react-native-community/async-storage";
import { config } from "./configProvider";
// import RNRestart from 'react-native-restart';
const locale = NativeModules.I18nManager.localeIdentifier // "fr_FR"
global.language_key = 1;
class Language_provider {
  language_get = async () => {
    var item = await AsyncStorage.getItem('language');
    console.log('check launguage option', item);
    console.log('launguage locale', locale);
    // const locale = NativeModules.SettingsManager.settings.AppleLocale ||
    //            NativeModules.SettingsManager.settings.AppleLanguages[0] // "fr_FR"

    // Android:

    if (item != null) {
      if (item == 0) {
        config.textalign = 'left';
      } else {
        config.textalign = 'right';
      }
      // config.language = item;
    } else {
      config.textalign = 'left';
      localStorage.setItemObject('language', 0);
    }
  };

  language_set = async value => {
    // var item = await AsyncStorage.getItem('language');
    localStorage.setItemObject('language_change', 1);

    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      config.textalign = 'left';
      localStorage.setItemObject('language', 0);
    } else {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      config.textalign = 'right';
      localStorage.setItemObject('language', 1);
    }

    // RNRestart.Restart()
  };
  // Media option ///////////////////
  MediaCamera = ['Camera', ''];
  Mediagallery = ['Gallery', ''];
  Mediaedit = ['Edit', ''];
  Mediadelete = ['Delete', ''];
  cancelmedia = ['Cancel', ''];
  // Map Provider /////////////////////

  titlesearchlocation = ['Search Location', ''];
  // last name====================
  //Otp provider +++++++++++++++++

  Enter_otp = ['Enter Otp'];
  phoneotp = ['Otp Number'];
  edit = ['Edit'];
  verificationotp = ['Verification'];
  verificationcodeheding = ['Please type the verification code sent to'];
  Otp_validation = ['Please enter otp'];
  resend = ['RESEND'];
  verify = ['VERIFY'];

  emptyName = ['Please enter  name', 'Please enter  name'];
  NameMinLength = [
    ' name must be of minimum 3 characters',
    ' name must be of minimum 3 characters',
  ];
  NameMaxLength = [
    ' name cannot be more than 50 characters.',
    ' name cannot be more than 50 characters.',
  ];
  validName = ['Enter valid  name', 'Enter valid  name'];
  //email============================
  emptyEmail = ['Please enter email', 'Please enter email'];
  emailMaxLength = [
    'Email cannot be more than 50 characters',
    'Email cannot be more than 50 characters',
  ];
  validEmail = ['Please enter valid email', 'Please enter valid email'];
  //city============
  emptyCity = ['Please select city', 'Please select city'];
  //DOB============
  emptydob = ['Please select date of birth', 'Please select date of birth'];
  //DOB============
  emptygender = ['Please select gender', 'Please select gender'];

  //password=========================
  emptyPassword = ['Please enter password', 'Please enter password'];
  PasswordMinLength = [
    'Password must be of minimum 6 characters',
    'Password must be of minimum 6 characters',
  ];
  PasswordMaxLength = [
    'Password cannot be more than 16 characters',
    'Password cannot be more than 16 characters',
  ];
  //cpassword=====================
  // For Confirm Password
  emptyConfirmPWD = [
    'Please confirm your password',
    'Please confirm your password',
  ];
  ConfirmPWDMatch = ['Password does not match', 'Password does not match'];
  ConfirmPWDMinLength = [
    'Confirm password must be of minimum 6 characters',
    'Confirm password must be of minimum 6 characters',
  ];
  ConfirmPWDMaxLength = [
    'Confirm password cannot be more than 16 characters',
    'Confirm password cannot be more than 16 characters',
  ];

  //phone no===============
  emptyMobile = ['Please enter mobile number', 'Please enter mobile number'];
  MobileMinLength = [
    'Mobile number must be of minimum 10 digits',
    'Mobile number must be of minimum 10 digits',
  ];
  MobileMaxLength = [
    'Mobile number cannot be more than 12 digits',
    'Mobile number cannot be more than 12 digits',
  ];
  validMobile = [
    'Please enter valid mobile number ',
    'Please enter valid mobile number',
  ];
  //boat add=============
  //boat name=====
  emptyBoatName = ['Please enter boat name', 'Please enter boat name'];
  BoatNameMinLength = [
    'Boat name must be of minimum 3 characters',
    'Boat name must be of minimum 3 characters',
  ];
  BoatNameMaxLength = [
    'Boat name cannot be more than 50 characters.',
    'Boat name cannot be more than 50 characters.',
  ];
  //boat number ================
  emptyBoatNumber = ['Please enter boat number', 'Please enter boat number'];
  BoatNumberMinLength = [
    'Boat Number must be of minimum 3 characters',
    'Boat Number must be of minimum 3 characters',
  ];
  BoatNumberMaxLength = [
    'Boat Number cannot be more than 50 characters.',
    'Boat Number cannot be more than 50 characters.',
  ];
  //boat registration_no ================
  emptyBoatRegistration_no = [
    'Please enter registration number',
    'Please enter registration number',
  ];
  BoatRegistration_noMinLength = [
    'Registration number must be of minimum 3 characters',
    'Registration number must be of minimum 3 characters',
  ];
  Boatregistration_noMaxLength = [
    'Registration number cannot be more than 50 characters.',
    'Registration number cannot be more than 50 characters.',
  ];
  //boat year===============
  emptyBoatYear = ['Please enter boat year', 'Please enter boat year'];
  //boat length===============
  emptyBoatLength = ['Please enter boat length', 'Please enter boat length'];
  //boat capacity===============
  emptyBoatCapacity = [
    'Please enter boat capacity',
    'Please enter boat capacity',
  ];
  //boat cabins===============
  emptyBoatCabins = ['Please enter no of cabins', 'Please enter no of cabins'];
  //boat toilets===============
  emptyBoatToilets = [
    'Please enter no of toilets',
    'Please enter no of toilets',
  ];
  //city============
  emptyCity = ['Please select city', 'Please select city'];
  //DOB============
  emptydob = ['Please select date of birth', 'Please select date of birth'];
  //gender==========
  emptygender = ['Please select gender', 'Please select gender'];
  //about==========
  emptyabout = ['Please enter about text', 'Please enter about text'];
  maxlenabout = [
    'About cannot be more than 250 characters.',
    'About cannot be more than 250 characters.',
  ];
  minlenabout = [
    'About must be of minimum 3 characters.',
    'About must be of minimum 3 characters.',
  ];
  //address==========
  emptyaddress = ['Please enter address text', 'Please enter address text'];
  maxlenaddress = [
    'Address cannot be more than 250 characters.',
    'Address cannot be more than 250 characters.',
  ];
  minlenaddress = [
    'Address must be of minimum 3 characters.',
    'Address must be of minimum 3 characters.',
  ];
  // For old Password
  emptyoldPassword = [
    'Please enter old password',
    'Please enter new password',
    'Please enter new password',
  ];
  PasswordoldMinLength = [
    'Old password must be of minimum 6 characters',
    'New password must be of minimum 6 characters',
  ];
  PasswordoldMaxLength = [
    'Old password cannot be more than 16 characters',
    'New password cannot be more than 16 characters',
  ];
  // For New Password
  emptyNewPassword = ['Please enter new password', 'Please enter new password'];
  PasswordNewMinLength = [
    'New password must be of minimum 6 characters',
    'New password must be of minimum 6 characters',
  ];
  PasswordNewMaxLength = [
    'New password cannot be more than 16 characters',
    'New password cannot be more than 16 characters',
  ];
  // For Confirm Password
  emptyConfirmPWD = [
    'Please confirm your password',
    'Please confirm your password',
  ];
  ConfirmPWDMatch = ['Password does not match', 'Password does not match'];
  ConfirmPWDMinLength = [
    'Confirm password must be of minimum 6 characters',
    'Confirm password must be of minimum 6 characters',
  ];
  ConfirmPWDMaxLength = [
    'Confirm password cannot be more than 16 characters',
    'Confirm password cannot be more than 16 characters',
  ];
  //Message====
  emptyMessage = ['Please enter message text', 'Please enter message text'];
  maxlenMessage = [
    'Message cannot be more than 250 characters.',
    'Message cannot be more than 250 characters.',
  ];
  minlenMessage = [
    'Message must be of minimum 3 characters.',
    'Message must be of minimum 3 characters.',
  ];
  //---------------------------share app page---------------------------//
  headdingshare = [
    'I’ve shared a link with you to a great new App',
    'I’ve shared a link with you to a great new App',
  ];
  sharelinktitle = ['MyBoat App Link', 'MyBoat App Link'];
  //==========================Confirmation Messages=============================
  cancel = ['Cancel', 'Cancel'];
  Yes = ['Yes', 'Yes'];
  No = ['No', 'No'];
  ok = ['Ok', 'Ok'];
  save = ['Save', 'Save'];
  Done = ['Done', 'Done'];
  Confirm = ['Confirm', 'Confirm'];
  Save = ['Save', 'Save'];
  Skip = ['Skip', 'Skip'];
  Clear = ['Clear', 'Clear'];
  titleexitapp = ['Exip App', 'Exip App'];
  exitappmessage = [
    'Do you want to exit app',
    'Do you want to exit app',
    'Você quer sair do aplicativo',
  ];
  msgConfirmTextLogoutMsg = [
    'Are you sure you want to Logout?',
    'Are you sure you want to Logout?',
  ];
  msgConfirmTextdelete = [
    'Are you sure you want to delete?',
    'Are you sure you want to delete?',
  ];
  msgLoginError = ['Please login first?', 'Please login first?'];
  //===========static text change
  loginName = ['Enter Name', 'Enter Name'];
  loginEmail = ['Email', 'Email'];
  loginpassword = ['Passwod', 'Password'];
  logincpass = ['Confirm Password', 'Confirm Password'];
  loginterm1 = [
    'By signing up, you agree to our',
    'By signing up, you agree to our',
  ];
  loginterm2 = [' terms of service', ' terms of service'];
  loginterm3 = [' and', ' and'];
  loginterm4 = [' privacy policy', ' privacy policy'];
  Signup_txt = ['Signup', 'Signup'];
  Login_txt = ['Login', 'Login'];
  do_you1 = ['Do you have an account?', 'Do you have an account?'];
  html_Privacy_Policy = [' Privacy Policy ', ' Privacy Policy '];
  text_About_Us = [' About Us', ' About Us '];
  text_Terms_And_Conditions = [
    ' Terms And Conditions ',
    ' Terms And Conditions ',
  ];
  contact_to_ad_text = ['Contact To Admin', 'Contact To Admin'];

  //=========signup=======
  text_sign_in = ['Sign in', 'Sign in'];
  text_sign_in1 = [
    'Sign in your social media account',
    'Sign in your social media account',
  ];
  text_remember_me = ['Remember me', 'Remember me'];
  text_Guest = ['Continue As A Guest', 'Continue As A Guest'];
  dont_have_acc = ['Don’t have an account?', 'Don’t have an account?'];
  txt_signup = ['Sign up', 'Sign up'];
  //============Otp===========
  otp_verification = ['Verification', 'Verification'];
  otp_verification1 = [
    'Otp verification code sent on',
    'Otp verification code sent on',
  ];
  txt_edit = ['Edit', 'Edit'];
  txt_otp = ['Otp', 'Otp'];
  txt_RESEND = ['RESEND', 'RESEND'];
  txt_VERIFY = ['VERIFY', 'VERIFY'];
  //==========forgot================
  txt_Forgot_Pass1 = ['Forgot Password', 'Forgot Password'];
  txt_Forgot_Pass2 = [
    'Please enter your email for reset account',
    'Please enter your email for reset account',
  ];
  txt_Forgot_Pass3 = ['Submit', 'Submit'];
  //edit profile=================
  Choose_City = ['Choose City', 'Choose City'];
  Choose_Gender = ['Select Gender', 'Select Gender'];
  female_txt = ['Female', 'Female'];
  male_txt = ['Male', 'Male'];
  Edit_Profile_txt = ['Edit Profile', 'Edit Profile'];
  dob_txt = ['Date of birth', 'Date of birth'];
  Gender_txt = ['Gender', 'Gender'];
  about_txt = ['About', 'About'];
  Take_a_photo_txt = ['Take a photo', 'Take a photo'];
  Choose_from_library_txt = ['Choose from library', 'Choose from library'];
  settings_txt = ['Settings', 'Settings'];
  my_waallet_txt = ['My Wallet', 'My Wallet'];
  Address_txt = ['Address', 'Address'];
  Optional_txt = ['Optional', 'Optional'];
  logout_txt = ['Logout', 'Logout'];
  //change pass================
  change_language_txt = ['Change Password', 'Change Password'];
  old_pass_txt = ['Old Password', 'Old Password'];
  new_pass_txt = ['New Password', 'New Password'];
  c_pass_txt = ['Confirm Password', 'Confirm Password'];
  txt_Submit = ['Submit', 'Submit'];
  //setting============
  text_account = ["Account", "Account"]
  text_Notification_Setting = ["Notification Setting", "Notification Setting"]
  text_Change_Language = ["Change Language", "Change Language"]
  text_support = ['Support', "support"]
  text_share_app = ['Share App', "Share App"]
  text_rate_app = ['Rate App', "Rate App"]
  //change notification==============
  txt_Notification_Settings = ["Notification Settings", "Notification Settings"]
  txt_Chat_Notifications = ["Chat Notifications", "Chat Notifications"]
  txt_Trip_Notifications = ["Trip Notifications", "Trip Notifications"]
  txt_Promotion_notification = ["Promotional Notifications", "Promotional Notifications"]

  //contact us=============
  txt_message = ["Message", "Message"]
  contact_us_txt = ["Contact Us", "Contact Us"]
  Send_txt = ["Send", "Send"]

  data_not_found = ['Data not found', "Data not found"]

  //home===========
  txt_explore = ['Explore', "Explore"]
  txt_type_of_trips = ['Type Of Trips', "Type Of Trips"]
  txt_view_all = ['View All', "View All"]
  txt_Popular_Boats = ['Popular Boats', "Popular Boats"]
  txt_pff = ['OFF', "OFF"]

  //add boat============
  add_boat_txt = ['Add Boat', "Add Boat"]
  boat_name_txt = ['Boat Name', "Boat Name"]
  boat_no_txt = ['Boat Number', "Boat Number"]
  boat_reg_txt = ['Boat register number', "Boat register number"]
  boat_year_txt = ['Boat year', "Boat year"]
  boat_len_txt = ['Boat length', "Boat length"]
  boat_cap_txt = ['Boat capacity', "Boat capacity"]
  //add advertisement-------------
  select_trip_type = ['Select Trip Type', "Select Trip Type"]
  data_not_found = ['Data Not Found', "Data Not Found"]
  Minimum_Hours_txt = ['Minimum Hours', "Minimum Hours"]
  Ideal_Hours_txt = ['Ideal Hours', "Ideal Hours"]
  Select_Boat_txt = ['Select Boat', "Select Boat"]
  Year_txt = ['Years', "Years"]
  Capacity_txt = ['Capacity', "Capacity"]
  Hours_txt = ['Hours', "Hours"]
  Upload_pictures_txt = ['Upload pictures', "Upload pictures"]
  Please_pictures_txt = ['Please upload (Max 3 pictures)', "Please upload (Max 3 pictures)"]
  Enter_Title_Arabic_txt = ['Enter Title in Arabic', "Enter Title in Arabic"]
  Enter_Title_englis_txt = ['Enter Title in English', "Enter Title in English"]
  contact_number_txt = ['Contact Number', "Contact Number"]
  max_people_txt = ['Max Number of People', "Max Number of People"]
  place_of_boat_txt = ['Place of boat', "Place of boat"]
  select_trip_txt = ['Select trip type', "Select trip type"]
  description_ar_txt = ['Descriptions In Arabic', "Descriptions In Arabic"]
  description_en_txt = ['Descriptions In English', "Descriptions in English"]
  Rental_Price_txt = ["Rental Price", "Rental Price"]
  Extrea_per_txt = ["Extra per hour price", "Extra per hour price"]
  discount_per_txt = ["Discount %", "Discount %"]

  Extra_hours_price_txt = ["Extra Hours Price", "Extra Hours Price"]
  discount_per_txt = ["Discount %", "Discount %"]
  lenghth_txt = ["Length", "Length"]
  toilets_txt = ["Toilets", "Toilets"]
  cabins_txt = ["Cabins", "Cabins"]
  Description_txt = ["Description", "Description"]
  Address_txt = ["Address", "Address"]
  rental_amt_txt = ["Rental Amount", "Rental Amount"]
  book_now_txt = ["Book Now", "Book Now"]

  //booking=========
  noOfGustErr = ['You can not insert more than', "You can not insert more than"]
  noOfGustErr1 = ['guest', 'guest']
  timeErr = ['Please Select Time', 'Please Select Time']
  dateErr = ['Please Select Date', 'Please Select Date']
  VailidNoOfGeuest = ['Number of guest should be only digit', 'Number of guest should be only digit']
  BookongAmtErrMessage = ["In your wallet not have enough balance So you have to pay some amount online", "In your wallet not have enough balance So you have to pay some amount online"]


  text_account = ['Account', 'Account'];
  text_Notification_Setting = ['Notification Setting', 'Notification Setting'];
  text_Change_Language = ['Change Language', 'Change Language'];
  text_support = ['Support', 'support'];
  text_share_app = ['Share App', 'Share App'];
  text_rate_app = ['Rate App', 'Rate App'];
  //change notification==============
  txt_Notification_Settings = [
    'Notification Settings',
    'Notification Settings',
  ];
  txt_Chat_Notifications = ['Chat Notifications', 'Chat Notifications'];
  txt_Trip_Notifications = ['Trip Notifications', 'Trip Notifications'];
  txt_Promotion_notification = [
    'Promotional Notifications',
    'Promotional Notifications',
  ];

  //contact us=============
  txt_message = ['Message', 'Message'];
  contact_us_txt = ['Contact Us', 'Contact Us'];
  Send_txt = ['Send', 'Send'];

  data_not_found = ['Data not found', 'Data not found'];

  //home===========
  txt_explore = ['Explore', 'Explore'];
  txt_type_of_trips = ['Type Of Trips', 'Type Of Trips'];
  txt_view_all = ['View All', 'View All'];
  txt_Popular_Boats = ['Popular Boats', 'Popular Boats'];
  txt_pff = ['OFF', 'OFF'];

  //add boat============
  add_boat_txt = ['Add Boat', 'Add Boat'];
  boat_name_txt = ['Boat Name', 'Boat Name'];
  boat_no_txt = ['Boat Number', 'Boat Number'];
  boat_reg_txt = ['Boat register number', 'Boat register number'];
  boat_year_txt = ['Boat year', 'Boat year'];
  boat_len_txt = ['Boat length', 'Boat length'];
  boat_cap_txt = ['Boat capacity', 'Boat capacity'];
  //add advertisement-------------
  select_trip_type = ['Select Trip Type', 'Select Trip Type'];
  data_not_found = ['Data Not Found', 'Data Not Found'];
  Minimum_Hours_txt = ['Minimum Hours', 'Minimum Hours'];
  Ideal_Hours_txt = ['Ideal Hours', 'Ideal Hours'];
  Select_Boat_txt = ['Select Boat', 'Select Boat'];
  Year_txt = ['Years', 'Years'];
  Capacity_txt = ['Capacity', 'Capacity'];
  Hours_txt = ['Hours', 'Hours'];
  Upload_pictures_txt = ['Upload pictures', 'Upload pictures'];
  Please_pictures_txt = [
    'Please upload (Max 3 pictures)',
    'Please upload (Max 3 pictures)',
  ];
  Enter_Title_Arabic_txt = ['Enter Title in Arabic', 'Enter Title in Arabic'];
  Enter_Title_englis_txt = ['Enter Title in English', 'Enter Title in English'];
  contact_number_txt = ['Contact Number', 'Contact Number'];
  max_people_txt = ['Max Number of People', 'Max Number of People'];
  place_of_boat_txt = ['Place of boat', 'Place of boat'];
  select_trip_txt = ['Select trip type', 'Select trip type'];
  description_ar_txt = ['Descriptions In Arabic', 'Descriptions In Arabic'];
  description_en_txt = ['Descriptions In English', 'Descriptions in English'];
  Rental_Price_txt = ['Rental Price', 'Rental Price'];
  Extrea_per_txt = ['Extra per hour price', 'Extra per hour price'];
  discount_per_txt = ['Discount %', 'Discount %'];

  Extra_hours_price_txt = ['Extra Hours Price', 'Extra Hours Price'];
  discount_per_txt = ['Discount %', 'Discount %'];
  lenghth_txt = ['Length', 'Length'];
  toilets_txt = ['Toilets', 'Toilets'];
  cabins_txt = ['Cabins', 'Cabins'];
  Description_txt = ['Description', 'Description'];
  Address_txt = ['Address', 'Address'];
  rental_amt_txt = ['Rental Amount', 'Rental Amount'];
  book_now_txt = ['Book Now', 'Book Now'];

  //booking=========
  noOfGustErr = [
    'You can not insert more than',
    'You can not insert more than',
  ];
  noOfGustErr1 = ['guest', 'guest'];
  timeErr = ['Please Select Time', 'Please Select Time'];
  dateErr = ['Please Select Date', 'Please Select Date'];
  VailidNoOfGeuest = [
    'Number of guest should be only digit',
    'Number of guest should be only digit',
  ];
  BookongAmtErrMessage = [
    'In your wallet not have enough balance So you have to pay some amount online',
    'In your wallet not have enough balance So you have to pay some amount online',
  ];

  //loginmain=========

  // welcome = ['Welcome','']
  // chooselogin = ['PLease choose your login option','']
  // loginwithnum = ['Login with Number','']
  // loginwithapple = ['Login with Apple','']
  // loginwithgoogle = ['Login with Google','']
  // loginwithfacebook = ['Login with Facebook','']
  // registernow = ['Register Now','']

  // donthaveacc = ['Dont have an account ?','']
  signup = ['Sign up', ''];
  login = ['Login', ''];
  login1 = ['LOGIN', 'LOGIN'];
  submit = ['Submit', ''];
  // login1 = ['Please enter your login details','']
  mobile = ['Mobile', ''];
  password = ['Password', ''];
  password1 = ['**********', ''];
  confrmpassword = ['Confirm Password', ''];
  name = ['Name', ''];
  firstname = ['Please enter first name', ''];
  cityname = [' Please enter suburb', ''];
  statename = ['Please enter state name', ''];
  lastname = ['Please enter last name', ''];
  address1 = ['Please enter address', ''];
  address2 = ['Please enter address2', ''];
  zipcode = ['Please enter post code', ''];
  accountno = ['Please enter account no.', ''];
  rounting = ['Please enter BSB', ''];
  choosedob = ['Please choose date of birth', ''];
  bankname = ['Please enter bank name', ''];
  signInWithGoogle = ['Sign in with Google', ''];
  signInWithApple = ['Sign in with Apple', ''];
  continueWithGoogle = ['Continue with Google', ''];
  continueWithApple = ['Continue with Apple', ''];
  forgotpassword = ['Forgot Password?', ''];
  orlogin = ['Or Login with', ''];
  orsignup = ['Or Signup with', ''];
  notmem = ['Not a member yet?  ', ''];
  signuphre1 = ['SIGN UP HERE', 'SIGN UP HERE'];
  signuphre = ['Signup Here', ''];
  enteremail = ['Please enter your email', ''];
  // goback = ['Go Back','']
  // forgot1 = ['Please enter your mobile for reset','']
  // signup = ['Signup','']
  // signup1 = ['Please enter your details','']
  bysign = ['By clicking the sign up button  ', ''];
  termcondition = ['terms and conditions', ''];
  termcondition11 = ['Terms And Conditions', ''];
  termcondition111 = ['Terms Conditions', ''];
  termcondition1 = ['you accept our terms and conditions', ''];
  privacypolicy = ['our privacy policy', ''];
  and = ['  and  ', ''];
  and1 = ['  \n and  ', ''];
  alreadyaccount = ['Already have an account?  ', ''];
  loginhere = ['Login Here', ''];
  // privacypolicy = ['Privacy Policies','']
  privacypolicy1 = ['Privacy Policy', ''];
  // nodatadata = ['No Data Found','']
  verification = ['Verification', ''];
  verification1 = [
    'Please type the verification code sent to mail and please check your junk folder',
    '',
  ];
  verify = ['Verify', ''];
  resend = ['Resend', ''];
  edit = ['Edit', ''];
  otp = ['OTP', ''];
  adscategory = ['Categories', ''];
  viewall = ['View all', 'View all'];

  recentAds1 = [
    'What people are seeking and selling:',
    'What people are seeking and selling:',
  ];
  recentAds = ['Recent Ads', 'Recent Ads'];
  // resetpassword=['Reset Password','']
  editprofile = ['Edit Profile', ''];
  addbank = ['Add Bank', ''];
  paymentprocess = ['Payment Processing', ''];
  editbank = ['Edit Bank', ''];
  editprofile = ['Edit Profile', ''];
  pushnotification = ['Push Notification', ''];
  editidverfication = ['Edit ID Verification', ''];
  update = ['Update', ''];
  addbank1 = ['Add', ''];
  setting = ['Settings', ''];
  profile = ['Profile', ''];
  account = ['Account', ''];
  // profile=['Profile','']
  changepassword = ['Change Password', ''];
  // manageadress=['Manage Address','']
  // language=['Language','']
  support = ['Support', ''];
  aboutus = ['About US', ''];
  constactus = ['Contact Us', ''];
  shareapp = ['Share App', ''];
  rateapp = ['Rate App', ''];
  logout = ['Logout', ''];
  newpassword = ['New Password', ''];
  oldpassword = ['Old Password', ''];
  confirmnewpassword = ['Confirm New Password', ''];
  // chooseaddress=['Choose Address','']
  // addaddress=['Add Address','']
  // editaddress=['Edit Address','']
  // enteraddress=['Enter Address','']
  send = ['Send', ''];
  email = ['Email', ''];
  email1 = ['username@email.com', ''];
  show = ['Show', ''];
  hide = ['Hide', ''];
  message = ['Message', ''];
  // cart=['Cart','']
  clear = ['Clear', ''];
  // shopnow=['Shop Now','']
  // shopmore=['Shop More','']
  Continue = ['Continue', ''];
  // emptytext=["Your cart is empty, still you havn't added any item in the cart",'']
  totalamount = ['Total', ''];
  home = ['Home', ''];
  // seemore=["See More",'']
  // viewmore=["View More",'']
  // newadded=["New Added",'']
  // alllisting=["All Listing",'']
  // filter=["Filter",'']
  // shortby=["Short By",'']
  // brand=["Brand",'']
  // reset=["Reset",'']
  // apply=["Apply",'']
  allcategories = ['All Categories', ''];
  // description=["Description",'']
  addtocart = ['Add To Cart', ''];
  // addedtocart=["Added To Cart",'']
  // buynow=["Buy Now",'']
  // searchhere=["Search here",'']
  notification = ['Notifications', ''];
  // myorder=['My Orders','']
  // order=['Orders','']
  // favourites=['Favourites','']
  // cancelreason=['Cancel Reason','']
  // cancelnow=['Cancel Now','']
  // cancelnow1=['Cancel Order','']
  // describe=['Describe','']
  // orderdid=['Orderd id ','']
  // orderplaced=['Order Placed','']
  // orderinprogress=['Inprogress','']
  // orderincompleted=['Completed','']
  // orderincancelled=['Cancelled','']
  // shipinadd=['Shipping Address','']
  // orderdetail=['Order Details','']
  // itemprice=['Item Price','']
  tax = ['Commision', ''];
  // shipingcharge=['Shipping Charge','']
  // couponapply=['Coupon Applied','']
  // total=['Total','']
  // checkout=['Checkout','']
  // change=['Change','']
  // remove=['Remove','']
  // addcoupon=['Add Coupon?','']
  // entercoupon=['Enter Coupon','']
  // proceedpay=['Proceed to Pay','']
  // chooseaddres=['Choose Address','']
  selectlocation = ['Select Location', ''];
  // searchlocation=['Search Location','']
  // txtalign=['Search Location','']
  // txthomechoose=['Home','']
  // txtofficechoose=['Office','']
  Search = ['Search', ''];
  Search1 = ['Search chat', ''];
  Congratulations = ['Thank You', ''];
  Congratulations1 = ['Your Offer has been successfully sent', ''];
  // txnid=['Txn id','']
  // txtplaced=['Placed','']
  // txtpackaging=['Packaging','']
  // txtoutfordelvery=['Outfor Delivery','']
  // txtdelivered=['Delivered','']
  // txtall=['All','']
  // txtsetcurrent=['Set as current location','']
  // txtpaymentprocessing=['Payment Processing','']
  // txtpaymentpr=["Please don't press back until the payment process",'']

  txtAllListing = ['What people are seeking and selling', ''];
  txtDetail = ['Details', ''];
  txtBuyNow = ['Buy Now']
  txtViewPhotos = ['View Photos', ''];
  txtMakeOffer = ['Make Offer', ''];
  txtPurchase = ['Purchase', ''];
  txtOption = ['Select Option', ''];
  txtReport = ['Report', ''];
  txtClearchat = ['Clear Chat', ''];
  txtenterdesc = ['Enter Description', ''];
  txtidverfication = ['ID Verification', ''];
  txtidforverfication = ['Please upload your id for verification', ''];
  txtABN = ['ABN: (optional)', ''];
  txtABN1 = [' Please enter ABN: (optional)', ''];
  txtenterofff = [' Enter Offer Price', ''];
  txtDeleteoffer = ['Delete Offer', ''];
  txteditofff = ['Edit Offer', ''];
  txtmyads = ['My Ads', ''];
  txtfavourite = ['Favourites', ''];
  txtOffers = ['Offers', ''];
  txtAccept = ['Accept', ''];
  txtAccepted = ['Accepted', ''];
  txtPending = ['Pending', ''];
  txtReject = ['Reject', ''];
  txtRejected = ['Rejected', ''];
  txtWaitSeller = ['Waiting for seller to accept', ''];
  txtmarkascomplete = ['Mark as delivered', ''];
  txteditpost = ['Edit Post', ''];
  txtpost = ['Post', ''];
  txtpost1 = ['POST NEW AD', ''];
  txtseeeingitem = ['What is the item that you are seeking?', ''];
  txtTitle = ['Enter title of your product', ''];
  txtbudget = ["What's your budget?", ''];
  txtspecificitem = ["What are the specifics of the items you're seeking?", ''];
  txtuploadphoto = ['Upload Photos Here', ''];
  txtuploadphoto1 = ['5 Upload Photos Here', ''];
  category1 = ['1 Category', ''];
  whatisit1 = ['2 What is it?', ''];
  Budget1 = ['3 Budget', ''];
  Specific1 = ['4 Specific', ''];
  Location1 = ['6 Location', ''];

  txtinbox = ['Inbox', ''];
  txtinboxall = ['All', ''];
  txtbuyers = ['Buyers', ''];
  txtsellers = ['Sellers', ''];
  becomeseller = ['Become a Seller', ''];
  txtmyoffer = ['My Offers', ''];
  txtmyoffer1 = ['MY OFFERS', ''];
  txtABNnumber = ['Enter ABN number', ''];
  txtcreateoffer = ['Create Offer', ''];
  txteditoffer = ['Edit Offer', ''];
  txtwhatsoffer = ["What's your offer", ''];
  txtadsoffer = ['Offer', ''];
  txtadsofferprice = ['Offer Price', ''];
  txtwhatsoffer1 = ["What's your offer?", ''];
  txtMatch = ['Match $', ''];
  deliveryoption = ['Delivery options', ''];
  youWillGet = ['You will get:', ''];
  deliverydetails = ['Delivery details', ''];
  freepickup = ['Free pickup from', ''];
  quickdelivery = ['Quick delivery for', ''];
  expressdelivery = ['Express Post', ''];
  standarddelivery = ['Standard Post', ''];
  quickdeliveryc = ['Quick delivery', ''];
  notdelete = ["You can't delete now", ''];
  notedit = ["Now you can't edit this offer", ''];
  paymentcancel = ['Payment cancel, please try again', ''];
  DELETE = ['DELETE', 'DELETE'];
}
export const Lang_chg = new Language_provider();
