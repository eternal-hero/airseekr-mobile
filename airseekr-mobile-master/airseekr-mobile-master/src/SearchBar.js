import React, { useEffect, useState } from "react";
import {SafeAreaView, ScrollView, Text,TouchableOpacity,View,Image} from 'react-native';
import SearchBar from "react-native-dynamic-search-bar";
import CSSstyle from './css';
import { localimag } from '../src/Provider/Localimage';
// import { apifuntion } from "./Provider/Apicallingprovider/apiProvider";
import { config, Otpprovider, Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, handleback, Currentltlg } from './Provider/utilslib/Utils'
 const SearchBar2 = (props) =>{
     const [searchText,setSearchText] = useState('')
     const [products,setProducts] = useState([])
     console.log(props?.navigation,"<----alpropoduct")
    const searchFunction = (text) => {
        const updatedData = props.route.params.data.filter((item) => {
          const item_data = `${item.ads_title.toUpperCase()})`;
          const text_data = text.toUpperCase();
          return item_data.indexOf(text_data) > -1;
        });
        setProducts(updatedData)
        // this.setState({ data: updatedData, searchValue: text });
      };
      const callBack = async()=>
      {
       props.naviagtion.goBack()
      
      }
  return(
      <SafeAreaView>
      <View>
      <SearchBar
          height={40}
          fontSize={13}
        //   fontColor="#fdfdfd"
        value={searchText}
          iconColor="#fdfdfd"
        //   shadowColor="#282828"
          cancelIconColor="#fdfdfd"
        //   backgroundColor="#ba312f"
        onClearPress={()=>{ props.navigation.goBack()}}
        onFocus={()=>{console.log("onfocus is opened")}}
        //   spinnerVisibility={spinnerVisibility}
          placeholder="Search any Product..."
        //   fontFamily="BurbankBigCondensed-Black"
        //   shadowStyle={styles.searchBarShadowStyle}
         onChangeText={(itm)=>{
            searchFunction(itm)
              setSearchText(itm)}}
        onChange={()=>{console.log("onchange is working")}}
         onPress={()=>{console.log("this is pressed")}}
        />
        <ScrollView>
            {products.map(itm=>{

         return(
             <TouchableOpacity  onPress={() => { props.navigation.navigate('Itemdetail', { ads_id: itm.ads_id })}} style={{paddingHorizontal:20,paddingVertical:10}}>
                 <Text>
                 {itm?.ads_title}
                 </Text>
             </TouchableOpacity>
         )

            })

            }
        </ScrollView>
        
      </View>
      </SafeAreaView>
  )
 }

 export default SearchBar2;