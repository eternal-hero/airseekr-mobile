import { Platform, I18nManager } from 'react-native';
import { localStorage } from './localStorageProvider';
import { config } from './configProvider';
global.language_key = 0;
global.bold = 'normal';
import _ from 'lodash';

//--------------------------- Config Provider Start -----------------------
class Language_provider {
  t = (key, lang_key = 0) => {
    const keys = _.get(this, key);
    try {
      if (!keys?.length) {
        return key;
      }
      if (keys && keys[lang_key]) {
        return keys[lang_key];
      }
      return keys[0];
    } catch (e) {
      return key;
    }
  };
  //--------------------------- Config Provider End -----------------------
  massege_validation = ['plese enter massege', 'الرجاء إدخال الرسالة'];
  Clear_Chat = ['Clear Chat', 'حذف المحادثة'];
  Report_User = ['Report User', 'التبليغ عن المستخدم'];
  Action = ['Action', 'اختر'];
  report_permission = [
    'Are your sure you want to report ?',
    'هل ترغب بالتبليغ عن هذا المستخدم',
  ];
  Are_your_sure_you_to_clear_chat = [
    'Are your sure you to clear chat ?',
    'هل ترغب بحذف المحادثة',
  ];
  Search_Location = ['Search Location', 'البحث'];
  NO = ['NO', 'إلغاء'];
  YES = ['YES', 'إلغاء'];
  Password = ['Password', 'كلمة المرور'];
  Cancel = ['Cancel', 'لا'];
  Cancel_report = ['Cancel', 'إلغاء'];
  ok = ['Ok', 'نعم'];
  Message = ['Message', 'اكتب رسالة'];
  Send = ['Send', 'إرسال'];
  Logout = ['Logout', 'تسجيل خروج'];

  BECOMEASELLER = ['Become a seller'];
  BOOKASTALL = ['Book a stall'];
  BROWSEMARKETPLACE = ['Browse Market Place'];
  POSTWHATYOUARESEEKING = ['Post What You Are Seeking'];
  POSTANITEMFORSALE = ['Post An Item For Sale'];
  CHOOSEMARKETPLACE = ['Choose Marketplace'];
  CHOOSEADATE = ['Choose a Date'];
  SIGNINSIGNUP = ['Sign In/Sign Up'];
  SIGNIN = ['Sign In'];
  SIGNUP = ['Sign Up'];
  ORUSE = ['or use'];
  SELECTATICKET = ['Select a ticket'];
  NEXT = ['Next'];
  ORDERSUMMARY = ['Order Summary'];
  CHECKOUT = ['Checkout'];
  CREDITCARD = ['Credit Card'];
  PAYPAL = ['Paypal'];
  CHECKOUTASGUEST = ['Checkout As Guest'];
  PAYMENTSUCCESS = ['Payment Success'];
  PAYMENTFAILED = ['Payment Failed'];
  USERNAME = ['username'];
  USERNAMEOREMAIL = ['username or email'];
  PASSWORD = ['password'];
  CARDNAME = ['Card Name'];
  WELCOME = ['Welcome'];
  MOREABOUTYOU = ['More About You'];
  SUBMIT = ['Submit'];
  OR = ['Or'];
  TOTAL = ['Total'];
  DISCOUNT = ['Discount'];
  TOTAL_CHECKOUT = ['Total Checkout'];
  SELECTPAYMENTMETHOD = ['Select Payment Method'];
  PROMOTON_CODE_LABEL = ['Promo code'];

  get_languagedata = async () => {
    let item = await localStorage.getItemObject('language');
    if (item != null) {
      config.language = item;
    } else {
      localStorage.setItemObject('language', 0);
    }
  };
  set_languagedata = value => {
    config.language = value;
    localStorage.setItemObject('language', value);
  };
}

export const Languageprovider = new Language_provider();
