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
import {
  LOCAL_NOTIFICATIONS_KEY,
  NOTIFICATION_LEAD_TIME_MINUTES,
  isAndroid,
} from "@/constants/Constants";

interface SessionData {
  data: Array<{
    id: string;
    title: string;
    startTime: string;
  }>;
  superapp_notification_title: string;
}

// Function to initialize notification service
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

// Function to schedule Notifications
export const scheduleSessionNotifications = async () => {
  try {
    // Clear any existing scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Get sessions from storage
    const sessionsData = await AsyncStorage.getItem(LOCAL_NOTIFICATIONS_KEY);
    if (!sessionsData) return;

    let sessionData: SessionData;
    try {
      const decodedData = atob(sessionsData);
      sessionData = JSON.parse(decodedData);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return;
    }
    const now = new Date();

    for (const session of sessionData.data) {
      const sessionStartTime = new Date(session.startTime);
      const notificationTime = new Date(
        sessionStartTime.getTime() - NOTIFICATION_LEAD_TIME_MINUTES * 60 * 1000
      );

      const secondsUntilNotification = Math.floor(
        (notificationTime.getTime() - now.getTime()) / 1000
      );

      const triggerSeconds = secondsUntilNotification;

      // Schedule notification
      try {
        if (isAndroid) {
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
              title: sessionData.superapp_notification_title,
              body: `${session.title} starts in ${NOTIFICATION_LEAD_TIME_MINUTES} minutes`,
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
