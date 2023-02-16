import React, { Component } from "react"
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Font, mediaprovider } from '../utilslib/Utils';
import AppLoader from './AppLoader'
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';

const AppContext = React.createContext({})
export const AppConsumer = AppContext.Consumer

export class AppProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      isConnected: false,
      backonline: false,

    }

  }
  componentDidMount() {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      this.setState({ isConnected: state.isConnected })
      if (state.isConnected == false) {
        this.checkconnection()
      }
    });
  }
  showProgress = () => this.setState({ loading: true })
  hideProgress = () => this.setState({ loading: false })

  checkconnection = () => {
    const mytimer = setInterval(() => {
      this.checkconnection2(mytimer)
    }, 800);

  }
  checkconnection2 = (mytimer) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        clearInterval(mytimer);
        this.setState({ backonline: true })
      }
    })
  }

  selectcamerimage = async () => {
    await mediaprovider.launchCamera().then((res) => {
      this.setState({ mediaopen: false });
      return Mediaresult = res;
    }).catch((error) => {
      Mediaresult = error
    });
  }
  render() {
    const { loading } = this.state
    const funcs = {
      showLoader: this.showProgress,
      hideLoader: this.hideProgress,

    }

    return (
      <AppContext.Provider
        value={{ ...funcs }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.newcolor }}>
          <StatusBar
            hidden={false}
            StatusBarStyle='light-content'
            backgroundColor={Colors.statusbarcolor}
            translucent={false}
            networkActivityIndicatorVisible={true}
          >
          </StatusBar>

          {this.props.children}
          <AppLoader loading={loading} />


          {!this.state.isConnected && <View style={{ position: 'absolute', bottom: 5, width: '100%', backgroundColor: Colors.internetbackcolor }}>
            <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: 14, color: Colors.internettextcolor }} >No Internet connection</Text>
          </View>}
          {this.state.backonline && <View style={{ position: 'absolute', bottom: 5, width: '100%', backgroundColor: Colors.onlinebackcolor }}>
            <TouchableOpacity onPress={setTimeout(() => { this.setState({ backonline: false }) }, 5000)}>
              <Animatable.Text animation='zoomIn' duration={3000} iterationCount='infinite' style={{ textAlign: 'center', color: Colors.onlinetextcolor, paddingVertical: 5, fontSize: 14 }} >Back online</Animatable.Text>
            </TouchableOpacity>
          </View>}

        </SafeAreaView>
      </AppContext.Provider>
    )
  }
}
