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
  LOCAL_NOTIFICATIONS_KEY,
  NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_CHANNEL_NAME,
  NOTIFICATION_LEAD_TIME_MINUTES,
  isAndroid,
} from "@/constants/Constants";
import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  try {
    if (isAndroid) {
      await notifee.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: NOTIFICATION_CHANNEL_NAME,
        importance: AndroidImportance.HIGH,
      });
    }

    return true;
  } catch (error) {
    console.error("Error initializing notifications:", error);
    return false;
  }
};

// Schedule notifications for sessions
export const scheduleSessionNotifications = async () => {
  try {
    // Cancel all previously scheduled notifications
    await notifee.cancelAllNotifications();

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

      if (notificationTime.getTime() > now.getTime()) {
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: notificationTime.getTime(),
        };

        await notifee.createTriggerNotification(
          {
            title: sessionData.superapp_notification_title,
            body: `${session.title} starts in ${NOTIFICATION_LEAD_TIME_MINUTES} minutes`,
            android: {
              channelId: NOTIFICATION_CHANNEL_ID,
              pressAction: {
                id: "default",
              },
            },
            data: {
              sessionId: session.id,
            },
          },
          trigger
        );
      }
    }
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
};

// Clear notifications and local storage on logout
export const clearNotifications = async () => {
  try {
    await notifee.cancelAllNotifications();
    await AsyncStorage.removeItem(LOCAL_NOTIFICATIONS_KEY);
  } catch (error) {
    console.error("Error clearing notifications:", error);
  }
};
