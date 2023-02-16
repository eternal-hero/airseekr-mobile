import React, { Component } from "react"
import {
    View, Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image
} from "react-native"
export default class AppLoader extends Component {
    render() {
        return (
            <Modal
                transparent={true}
                animationType='fade'
                visible={this.props.loading}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.container}>
                    {/* Your own Custom component view*/}
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator 
                            size="large" 
                            color='#FFFFFF'
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        justifyContent: "center",
        backgroundColor: '#00000040',
        top: 0, left: 0, bottom: 0, right: 0
    },

    activityIndicatorWrapper: {
        height: 80,
        width: 80,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 6,
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
    }
})
