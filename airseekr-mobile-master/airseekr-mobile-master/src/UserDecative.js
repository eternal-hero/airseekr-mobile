import { Alert, ToastAndroid, Platform } from "react-native";
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import { localStorage } from './Provider/localStorageProvider';
import { config } from './Provider/configProvider';

class UserNotFound{

	 loginFirst(props,txt){
	
		Alert.alert(
			msgTitle.information[config.language],
			txt,
			[
				{
					text: msgTitle.ok[config.language],
					onPress: () => { 
					localStorage.removeItem('user_arr');
					localStorage.removeItem('user_login');
					localStorage.clear();
					props.navigation.navigate('login')},
				},
			],
			{ cancelable: false },
		);
 }
}
export const usernotfound = new UserNotFound();