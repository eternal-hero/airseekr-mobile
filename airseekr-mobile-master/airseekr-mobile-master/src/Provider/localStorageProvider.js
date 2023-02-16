import AsyncStorage  from "@react-native-community/async-storage";
import {consolepro} from "./Messageconsolevalidationprovider/Consoleprovider";

class localStorageProvider {
    setItemString(key, value) {
        consolepro.consolelog('setItemString key',key);
         try {
               AsyncStorage.setItem(key, value);
             } catch (error) {
               consolepro.consolelog('Error13',error);
        }
    }

    getItemString(key) {
        consolepro.consolelog('getItemObject key',key);
        var item = AsyncStorage.getItem(key);
        return item;
    }

    async setItemObject(key, item) {
        consolepro.consolelog('setItemObject key',key);
        consolepro.consolelog('setItemObject item',item);
        try {
            await AsyncStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            consolepro.consolelog('Error12',error);
        }
    }

    async getItemObject(key) {
        consolepro.consolelog('getItemObject key',key);
        var item = await AsyncStorage.getItem(key);
        return JSON.parse(item);
    }

    async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            consolepro.consolelog('Error ' + error.value);
        }
    }

    async clear() {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            consolepro.consolelog('Error ' + error.value);
        }
    }
}

export const localStorage = new localStorageProvider();


// localStorage.getItemString('name').then((result) => {
//     if (result !== null) {
//         alert("First: " + result);
//     } else {
//         alert("Not saved");
//     }
// });

// var user_id = 0;

// var user_arr = localStorage.getItemObject('user_arr').then((result) => {
//     if (result !== null) {
//         user_id = result.user_id;
//         //alert("user_id: " + result.user_id);
//     } else {
//       user_id = 0;
//         //alert("Not saved");
//     }
// });
