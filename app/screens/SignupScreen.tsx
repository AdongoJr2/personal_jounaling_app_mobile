import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import Toast from 'react-native-root-toast';

interface SignupScreenProps extends AppStackScreenProps<"Signup"> { }

export const SignupScreen: FC<SignupScreenProps> = observer(function SignupScreen(_props) {
  const { navigation } = _props

  const authPasswordInput = useRef<TextInput>(null)
  const authFirstNameInput = useRef<TextInput>(null)
  const authLastNameInput = useRef<TextInput>(null)

  const [authFirstName, setAuthFirstName] = useState("")
  const [authLastName, setAuthLastName] = useState("")
  const [authUsername, setAuthUsername] = useState("")
  const [authPhoneNumber, setAuthPhoneNumber] = useState("")
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const { authenticationStore } = useStores()

  useEffect(() => {
    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [])

  console.log("Registration Success ::", authenticationStore.registrationSuccess)

  const navigateToLogin = () => {
    navigation.navigate("Login");
  }

  if (authenticationStore.registrationSuccess) {
    Toast.show("User account created successfully", {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
    })

    navigateToLogin()
  }

  // useEffect(() => {
  //   if (authenticationStore.registrationSuccess) {
  //     Toast.show("User account created successfully", {
  //       duration: Toast.durations.LONG,
  //       position: Toast.positions.TOP,
  //     })

  //     navigateToLogin()
  //   }
  // }, [])

  async function signup() {
    const payload = {
      firstName: authFirstName.trim(),
      lastName: authLastName.trim(),
      username: authUsername.trim(),
      email: authEmail.trim(),
      phoneNumber: authPhoneNumber.trim(),
      password: authPassword.trim(),
    }

    try {
      console.log(payload)

      await authenticationStore.registerUser(payload)
    } catch (error) {
      console.log(error)
    }
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="signup-heading" tx="signupScreen.signUp" preset="heading" style={$signUp} />
      <Text tx="signupScreen.enterDetails" preset="subheading" style={$enterDetails} />

      <TextField
        ref={authFirstNameInput}
        value={authFirstName}
        onChangeText={setAuthFirstName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="common.firstNameFieldLabel"
        placeholderTx="common.firstNameFieldPlaceholder"
        // helper={error}
        // status={error ? "error" : undefined}
        onSubmitEditing={() => authLastNameInput.current?.focus()}
      />

      <TextField
        ref={authLastNameInput}
        value={authLastName}
        onChangeText={setAuthLastName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="name-given"
        autoCorrect={false}
        keyboardType="default"
        labelTx="common.lastNameFieldLabel"
        placeholderTx="common.lastNameFieldPlaceholder"
      // helper={error}
      // status={error ? "error" : undefined}
      />

      <TextField
        value={authUsername}
        onChangeText={setAuthUsername}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="username"
        autoCorrect={false}
        keyboardType="default"
        labelTx="common.usernameFieldLabel"
        placeholderTx="common.usernameFieldPlaceholder"
      // helper={error}
      // status={error ? "error" : undefined}
      />

      <TextField
        value={authPhoneNumber}
        onChangeText={setAuthPhoneNumber}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="tel"
        autoCorrect={false}
        keyboardType="phone-pad"
        labelTx="common.phoneNumberFieldLabel"
        placeholderTx="common.phoneNumberFieldPlaceholder"
      // helper={error}
      // status={error ? "error" : undefined}
      />

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="common.emailFieldLabel"
        placeholderTx="common.emailFieldPlaceholder"
        // helper={error}
        // status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="common.passwordFieldLabel"
        placeholderTx="common.passwordFieldPlaceholder"
        onSubmitEditing={signup}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="signup-button"
        tx="signupScreen.signUp"
        style={$tapButton}
        preset="reversed"
        onPress={signup}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $signUp: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}