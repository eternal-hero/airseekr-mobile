import { config } from '../configProvider';
// import {notification} from '../NotificationProvider';
import { Dimensions } from 'react-native';
import { localStorage } from '../localStorageProvider';
import { Lang_chg } from '../Language_provider';
import { consolepro } from '../Messageconsolevalidationprovider/Consoleprovider';
import {
  msgProvider,
  msgTitle,
  msgText,
  handleback,
} from '../Messageconsolevalidationprovider/messageProvider';
import { validation } from '../Messageconsolevalidationprovider/Validation_provider';
import { Currentltlg } from '../Curentlatlong';
import Cameragallery from '../Mediaprovider/Cameragallery';
import { mediaprovider } from '../Mediaprovider/Mediaprovider';
import { SocialLogin } from '../Apicallingprovider/SocialLoginProvider';
import { apifuntion } from '../Apicallingprovider/apiProvider';
import { Colors, Font } from '../Colorsfont';
import { localimag } from '../Localimageprovider/Localimage';
import Mapprovider from '../Mapprovider';
import { notification } from '../NotificationProvider';
import Otpprovider from '../Otpprovider';
const mobileH = Math.round(Dimensions.get('window').height);
const mobileW = Math.round(Dimensions.get('window').width);
const slugConverter = str => {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
  const to =
    'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
};
export {
  config,
  Otpprovider,
  localimag,
  Mapprovider,
  apifuntion,
  Colors,
  Font,
  validation,
  mobileH,
  mobileW,
  SocialLogin,
  Cameragallery,
  mediaprovider,
  localStorage,
  Lang_chg,
  consolepro,
  msgProvider,
  msgTitle,
  msgText,
  handleback,
  Currentltlg,
  notification,
  slugConverter,
};
