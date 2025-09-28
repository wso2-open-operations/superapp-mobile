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
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { LOCAL_NOTIFICATIONS_KEY} from "@/constants/Constants";

interface SessionNotification {
  id: string;
  title: string;
  startTime: string;
}

export const initializeNotifications = async () => {
  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  // Configure notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  return true;
};

export const scheduleSessionNotifications = async () => {
  try {
    // Clear any existing scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Get sessions from storage
    const sessionsData = await AsyncStorage.getItem(LOCAL_NOTIFICATIONS_KEY);
    if (!sessionsData) return;

    let sessions: SessionNotification[];
    try {
      const decodedData = atob(sessionsData);
      sessions = JSON.parse(decodedData);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return;
    }
    const now = new Date();

    for (const session of sessions) {
      const sessionStartTime = new Date(session.startTime);
      const notificationTime = new Date(
        sessionStartTime.getTime() - 10 * 60 * 1000
      );

      const secondsUntilNotification = Math.floor(
        (notificationTime.getTime() - now.getTime()) / 1000
      );

      const triggerSeconds = secondsUntilNotification;

      // Schedule notification
      try {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync(
            process.env.EXPO_PUBLIC_SESSION_NOTIFICATIONS_KEY as string,
            {
              name: "Session Notifications",
              importance: Notifications.AndroidImportance.HIGH,
            }
          );
        }

        if (triggerSeconds > 0) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "WSO2 CON",
              body: `${session.title} starts in 10 minutes`,
              data: { sessionId: session.id },
            },
            trigger: {
              seconds: triggerSeconds,
              type: "timeInterval",
            } as Notifications.NotificationTriggerInput,
          });
        }
      } catch (error) {
        console.error("Error scheduling notification:", error);
      }
    }
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
};
