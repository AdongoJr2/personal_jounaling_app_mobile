import "@expo/metro-runtime"
import React from "react"
import { RootSiblingParent } from 'react-native-root-siblings';
import * as SplashScreen from "expo-splash-screen"
import App from "./app/app"

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return (
    <RootSiblingParent>
      <App hideSplashScreen={SplashScreen.hideAsync} />
    </RootSiblingParent>
  )
}

export default IgniteApp
