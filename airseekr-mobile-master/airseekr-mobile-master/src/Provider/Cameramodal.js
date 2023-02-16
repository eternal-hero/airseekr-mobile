import React, { Component } from 'react'
import { Text, View ,Modal,TouchableOpacity} from 'react-native'
import { Font } from './Colorsfont';
export default class Cameramodal extends Component {
    constructor(props){
        super(props) 
       this.state={
         status:true
       }
     }
    render() {
        return (
            <View style={{}}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                     
                        visible={this.state.status?this.props.cameramodal:this.state.status}
                        // visible={true}

                        onRequestClose={() => {  }}
                    >
                        <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
                          
                            <View style={{ borderRadius: 20, width: "100%", position: 'absolute', bottom: 0, }}>

                                <View style={{ backgroundColor: "#ffffff", borderRadius: 20, width: "100%", paddingVertical: 20 }}>
                                    <TouchableOpacity
                                        onPress={this.props.opencamera}
                                    >
                                        <Text style={{ color: 'black', fontSize: 18, fontFamily:Font.Poppins_Bold, alignSelf: 'center' }}>{this.props.data.first}</Text>
                                    </TouchableOpacity>
                                    <View style={{ borderBottomColor: '#D0D7DE', borderBottomWidth: 2, marginTop: 10 }}></View>
                                    <TouchableOpacity
                                        onPress={this.props.opengallery}
                                    >
                                        <Text style={{ color: 'black', fontSize: 18, fontFamily:Font.Poppins_Bold, alignSelf: 'center', marginTop: 10 }}>{this.props.data.second}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ backgroundColor: "#ffffff", borderRadius: 20, width: "100%", paddingVertical: 20, marginVertical: 15 }}>
                                    <TouchableOpacity
                                         onPress={this.props.cancel}
                                    >
                                        <Text style={{ color: 'red', fontSize: 18, fontFamily:Font.Poppins_Bold, alignSelf: 'center' }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                              
                            </View>

                            





                        </View>
                    </Modal>
                   
               
            </View>
        )
    }
}
