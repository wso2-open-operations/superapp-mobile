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
import { ENABLE_FIREBASE } from "@/constants/Constants";
import {
  loadLastSentFCMToken,
  pushFcmToken,
} from "@/context/slices/deviceSlice"; // The async thunk
import { AppDispatch, RootState } from "@/context/store";
import {
  getFCMToken,
  requestNotificationPermission,
  setupTokenRefreshListener,
} from "@/utils/push-notification";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * A custom hook to manage the FCM push notification token lifecycle.
 * Automatically requests permission, gets the token, and sends it to the backend
 * as soon as the user is authenticated. It also handles token refreshes.
 *
 * @param onLogout - The logout function to pass to the async thunk for handling auth errors.
 */
export const usePushNotificationHandler = ({
  onLogout,
}: {
  onLogout: () => Promise<void>;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { lastSentFCMToken } = useSelector((state: RootState) => state.device);

  const onLogoutRef = useRef(onLogout);
  onLogoutRef.current = onLogout;

  useEffect(() => {
    if (!ENABLE_FIREBASE) return;
    dispatch(loadLastSentFCMToken());

    if (accessToken) {
      const getAndPushToken = async () => {
        try {
          await requestNotificationPermission();

          const fcmToken = await getFCMToken();

          if (fcmToken && fcmToken !== lastSentFCMToken) {
            dispatch(pushFcmToken({ fcmToken, onLogout: onLogoutRef.current }));
          } else {
            console.warn(
              "No FCM token received or token is the same as the last sent token."
            );
          }
        } catch (error) {
          console.error("Error occurred during FCM token setup:", error);
        }
      };

      getAndPushToken();

      const unsubscribe = setupTokenRefreshListener((refreshedToken) => {
        if (refreshedToken && refreshedToken !== lastSentFCMToken) {
          dispatch(
            pushFcmToken({
              fcmToken: refreshedToken,
              onLogout: onLogoutRef.current,
            })
          );
        } else {
          console.warn(
            "Refreshed token was null/undefined or the same as the last sent token."
          );
        }
      });

      return () => {
        unsubscribe();
      };
    } else {
      console.warn("No accessToken — push notification setup skipped.");
    }
  }, [accessToken, dispatch, lastSentFCMToken, onLogoutRef]);
};
