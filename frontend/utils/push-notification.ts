// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
import {
  isAndroid,
  isIos,
  NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_CHANNEL_NAME,
} from "@/constants/Constants";
import notifee, { AndroidImportance } from "@notifee/react-native";
import {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getMessaging,
  getToken,
  hasPermission,
  onMessage,
  onTokenRefresh,
  requestPermission,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";

const messaging = getMessaging();

// Request notification permission for iOS
const requestNotificationPermissionIOS = async () => {
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;
  return enabled;
};

// Request notification permission for Android
const requestNotificationPermissionAndroid = async (): Promise<boolean> => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (isIos) {
    await requestNotificationPermissionIOS();
  } else if (isAndroid) {
    await requestNotificationPermissionAndroid();
  }
};

// Get the FCM token
export const getFCMToken = async (): Promise<string | null> => {
  const hasPerm = await hasPermission(messaging);
  if (
    hasPerm === AuthorizationStatus.AUTHORIZED ||
    hasPerm === AuthorizationStatus.PROVISIONAL
  ) {
    try {
      const token = await getToken(messaging);
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  } else {
    console.warn("User has not granted notification permissions.");
  }
  return null;
};

/**
 * Sets up a listener for when the FCM token is refreshed.
 * Returns an unsubscribe function to be called on cleanup.
 * @param onRefresh - The callback function to execute with the new token.
 */
export const setupTokenRefreshListener = (
  onRefresh: (token: string) => void
): (() => void) => {
  const unsubscribe = onTokenRefresh(messaging, onRefresh);
  return unsubscribe;
};

/**
 * Sets up a listener for when the FCM message is received.
 * @returns An unsubscribe function to be called on cleanup.
 */
export function setupMessagingListener() {
  const unsubscribe = onMessage(messaging, async (remoteMessage) => {
    showNotification(remoteMessage);
  });

  return unsubscribe;
}

/**
 * Displays a foreground notification using Notifee.
 * @param remoteMessage - The remote message containing the notification data.
 */
const showNotification = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) => {
  const { notification } = remoteMessage;
  if (notification) {
    const { title, body } = notification;
    const channelId = await notifee.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: NOTIFICATION_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
      },
    });
  } else {
    console.warn("No foreground notification object found");
  }
};
