import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

const messaging = getMessaging();

const requestUserPermissionIOS = async () => {
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;
  return enabled;
};

const requestUserPermissionAndroid = async (): Promise<boolean> => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const requestUserPermission = async () => {
  let enabled = false;
  if (Platform.OS === "ios") {
    enabled = await requestUserPermissionIOS();
  } else if (Platform.OS === "android") {
    enabled = await requestUserPermissionAndroid();
  }

  if (enabled) {
    try {
      const fcmToken = await getToken(messaging);
      if (fcmToken) {
        // TODO: Add user token to backend
      } else {
        console.log("Failed to get FCM token.");
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  } else {
    console.log("User permission not granted");
  }
};
