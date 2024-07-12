import { api } from "app/services/api"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    registrationSuccess: false,
    registrationSuccessMessage: "",
    registrationErrorMessage: "",
    registrationApiData: types.maybe(types.string),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationError() {
      // if (store.authEmail.length === 0) return "can't be blank"
      // if (store.authEmail.length < 6) return "must be at least 6 characters"
      // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
      //   return "must be a valid email address"
      return ""
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    async registerUser(payload: any) {
      const response = await api.registerUser(payload)
      if (response.kind === "ok") {
        store.setProp("registrationSuccess", true)
        store.setProp("registrationSuccessMessage", response.data?.message ?? "Success")
        store.setProp("registrationApiData", response.data?.data)
      } else {
        store.setProp("registrationSuccess", false)
        store.setProp("registrationErrorMessage", response.data?.message ?? "Error")
        store.setProp("registrationApiData", response.data?.data)

        console.error(`Error registering user: ${JSON.stringify(response)}`)
      }
    },
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> { }
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> { }
