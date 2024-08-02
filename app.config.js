import { AndroidConfig } from "@expo/config-plugins";

module.exports = ({ config }) => {
  //console.log(config.android);
  return {
    ...config,
    plugins: [
      "expo-asset",
      "expo-font",
      "expo-secure-store",
      [
        AndroidConfig.Permissions.withBlockedPermissions,
        ["android.permission.REQUEST_INSTALL_PACKAGES"],
      ],
    ],
    updates: {
      url: "https://u.expo.dev/969b74fb-e7a7-48ca-99cd-db4a3c4684ee",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
  };
};
