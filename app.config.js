import { AndroidConfig } from "@expo/config-plugins";

module.exports = ({ config }) => {
  //console.log(config.android);
  return {
    ...config,
    plugins: [[AndroidConfig.Permissions.withBlockedPermissions, ["android.permission.REQUEST_INSTALL_PACKAGES"]]],
  };
};
