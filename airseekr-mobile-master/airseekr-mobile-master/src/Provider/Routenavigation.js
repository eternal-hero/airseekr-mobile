import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../Splash'
import Howwork from '../Howwork'
import Login from '../Login'
import Forgotpassword from '../Forgotpassword'
import Signup from '../Signup'
import Homepage from '../Homepage'
import Allcategories from '../Allcategories'
import Categorywise from '../Categorywise'
import Alllisting from '../Alllisting'
import Itemdetail from '../Itemdetail'
import Reportpage from '../Reportpage'
import Fullimage from '../Fullimage'
import Makeoffer from '../Makeoffer'
import Myads from '../Myads'
import Offerlist from '../Offerlist'
import Editpost from '../Editpost'
import Newpost from '../Newpost'
import Selectcategorie from '../Selectcategorie'
import Location from '../Location'
import Inbox from '../Inbox'
import NewInbox from '../NewInbox'
import Profile from '../Profile'
import Makeseller from '../Makeseller'
import Setting from '../Setting'
import Termsconditions from '../Termsconditions'
import Privacypolicy from '../Privacypolicy'
import Contactus from '../Contactus'
import Aboutus from '../Aboutus'
import Editprofile from '../Editprofile'
import Changepassword from '../Changepassword'
import Notification from '../Notification'
import Chat from '../Chat'
import NewChat from '../NewChat'
import Myoffer from '../Myoffer'
import Congratulations from '../Congratulations'
import Editidverification from '../Editidverification'
import Socialsignup from '../Socialsignup'
import Offerprice from '../Offerprice'
import Editoffer from '../Editoffer'
import Offeronmyads from '../Offeronmyads'
import Addbank from '../Addbank'
import Editbank from '../Editbank'
import Offerpaymentaccept from '../Offerpaymentaccept'
import Accept_reject_offer from '../Accept_reject_offer'
import Shareitemdetail from '../Shareitemdetail'
import SalePost from '../SalePost'

import HomeTicket from "../container/HomeTicket";
import BookAStall from "../container/BookAStall";
import Ticket from "../container/Ticket";
import CheckoutTicket from "../container/CheckoutTicket";
import CheckoutTicketAsGuest from "../container/CheckoutTicketAsGuest";
import OrderSummary from "../container/OrderSummary";
import OrderSuccess from "../container/OrderSuccess";
import Paypalverification from "../Paypalverification";


const Stack = createStackNavigator();

// const DrawerNavigator=({navigation })=> {
//   return (
//       <Drawer.Navigator drawerStyle={{ backgroundColor: 'transparent', width: '100%' }} initialRouteName="Home" backgroundColor='transparent'
//          drawerContent={() => <CustomDrawerCntent navigation={navigation} /> }
//           >
//           <Drawer.Screen name='Home' component={Homepage}></Drawer.Screen>
//       </Drawer.Navigator>
//   );
// }

// async function test(){
//   let item=await AsyncStorage.getItem('language_change');
//   console.log('item======'+item)
//   let first='Splash'
//   if(item!=null && item== 1){
//     first="Setting"
//   }

//   return first

// }

const Stacknav = (navigation) => {
  return (
    <Stack.Navigator
      initialRouteName={"Splash"}
    >
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="Howwork" component={Howwork} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Forgotpassword" component={Forgotpassword} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Homepage" component={Homepage} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Allcategories" component={Allcategories} options={{ headerShown: false }} />
      <Stack.Screen name="Categorywise" component={Categorywise} options={{ headerShown: false }} />
      <Stack.Screen name="Alllisting" component={Alllisting} options={{ headerShown: false }} />
      <Stack.Screen name="Itemdetail" component={Itemdetail} options={{ headerShown: false }} />
      <Stack.Screen name="Reportpage" component={Reportpage} options={{ headerShown: false }} />
      <Stack.Screen name="Fullimage" component={Fullimage} options={{ headerShown: false }} />
      <Stack.Screen name="Makeoffer" component={Makeoffer} options={{ headerShown: false }} />
      <Stack.Screen name="Myads" component={Myads} options={{ headerShown: false }} />
      <Stack.Screen name="Offerlist" component={Offerlist} options={{ headerShown: false }} />
      <Stack.Screen name="Editpost" component={Editpost} options={{ headerShown: false }} />
      <Stack.Screen name="Newpost" component={Newpost} options={{ headerShown: false }} />
      <Stack.Screen name="SalePost" component={SalePost} options={{ headerShown: false }} />
      <Stack.Screen name="Selectcategorie" component={Selectcategorie} options={{ headerShown: false }} />
      <Stack.Screen name="Location" component={Location} options={{ headerShown: false }} />
      <Stack.Screen name="Inbox" component={NewInbox} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="Makeseller" component={Makeseller} options={{ headerShown: false }} />
      <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
      <Stack.Screen name="Termsconditions" component={Termsconditions} options={{ headerShown: false }} />
      <Stack.Screen name="Privacypolicy" component={Privacypolicy} options={{ headerShown: false }} />
      <Stack.Screen name="Contactus" component={Contactus} options={{ headerShown: false }} />
      <Stack.Screen name="Aboutus" component={Aboutus} options={{ headerShown: false }} />
      <Stack.Screen name="Editprofile" component={Editprofile} options={{ headerShown: false }} />
      <Stack.Screen name="Changepassword" component={Changepassword} options={{ headerShown: false }} />
      <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={NewChat} options={{ headerShown: false }} />
      <Stack.Screen name="Myoffer" component={Myoffer} options={{ headerShown: false }} />
      <Stack.Screen name="Congratulations" component={Congratulations} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Editidverification" component={Editidverification} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Paypalverification" component={Paypalverification} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Socialsignup" component={Socialsignup} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Offerprice" component={Offerprice} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Editoffer" component={Editoffer} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Offeronmyads" component={Offeronmyads} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Accept_reject_offer" component={Accept_reject_offer} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Addbank" component={Addbank} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Editbank" component={Editbank} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Offerpaymentaccept" component={Offerpaymentaccept} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Shareitemdetail" component={Shareitemdetail} options={{ headerShown: false, gestureEnabled: false }} />

      <Stack.Screen name="HomeTicket" component={HomeTicket} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="BookAStall" component={BookAStall} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Ticket" component={Ticket} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="CheckoutTicket" component={CheckoutTicket} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="CheckoutTicketAsGuest" component={CheckoutTicketAsGuest} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="OrderSummary" component={OrderSummary} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccess} options={{ headerShown: false, gestureEnabled: false }} />

      {/*
        <Stack.Screen name="Resetpassword" component={Resetpassword} options={{ headerShown: false }}/>
        <Stack.Screen name="Editprofile" component={Editprofile} options={{ headerShown: false }}/>
        <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }}/>
        <Stack.Screen name="Changepassword" component={Changepassword} options={{ headerShown: false }}/>
        <Stack.Screen name="Chooseaddress" component={Chooseaddress} options={{ headerShown: false }}/>
        <Stack.Screen name="Addaddress" component={Addaddress} options={{ headerShown: false }}/>
        <Stack.Screen name="Aboutus" component={Aboutus} options={{ headerShown: false }}/>
        <Stack.Screen name="Termsconditions" component={Termsconditions} options={{ headerShown: false }}/>
        <Stack.Screen name="Privacypolicy" component={Privacypolicy} options={{ headerShown: false }}/>
        <Stack.Screen name="Contactus" component={Contactus} options={{ headerShown: false }}/>
        <Stack.Screen name="Mycard" component={Mycard} options={{ headerShown: false }}/>

        <Stack.Screen name="Viewmore" component={Viewmore} options={{ headerShown: false }}/>
        <Stack.Screen name="Allcategories" component={Allcategories} options={{ headerShown: false }}/>
        <Stack.Screen name="Itemdetail" component={Itemdetail} options={{ headerShown: false }}/>
        <Stack.Screen name="Search" component={Search} options={{ headerShown: false }}/>
        <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }}/>
        <Stack.Screen name="Myorder" component={Myorder} options={{ headerShown: false }}/>
        <Stack.Screen name="Cancelorder" component={Cancelorder} options={{ headerShown: false }}/>
        <Stack.Screen name="Orderdetail" component={Orderdetail} options={{ headerShown: false }}/>
        <Stack.Screen name="Favourite" component={Favourite} options={{ headerShown: false }}/>
        <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }}/>
        <Stack.Screen name="Location" component={Location} options={{ headerShown: false }}/>
        <Stack.Screen name="Fullimage" component={Fullimage} options={{ headerShown: false }}/>
        <Stack.Screen name="Editaddress" component={Editaddress} options={{ headerShown: false }}/>
        <Stack.Screen name="Categorywise" component={Categorywise} options={{ headerShown: false }}/>
        <Stack.Screen name="Checkout_buy" component={Checkout_buy} options={{ headerShown: false }}/>
        <Stack.Screen name="Congratulations" component={Congratulations} options={{ headerShown: false,gestureEnabled:false }}/>
        <Stack.Screen name="Paymentproccess" component={Paymentproccess} options={{ headerShown: false,gestureEnabled:false }}/>*/}
    </Stack.Navigator>

  );
}
export default Stacknav
