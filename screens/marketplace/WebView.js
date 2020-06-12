import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { WebView as NativeWebView } from "react-native-webview";
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from "rn-placeholder";

export default function WebView({ navigation }) {
  const webViewRef = useRef();
  const [skeletonVisible, setSkeletonVisible] = useState(true);

  useEffect(() => {
    /**NAVIGATIOON */
    navigation.addListener("didFocus", () => {
      setSkeletonVisible(true);
      webViewRef.current.reload();
    });
  }, [navigation]);

  const hideSkeleton = () => {
    setSkeletonVisible(false);
  };

  const showViewError = () => {
    Alert.alert("No Internet connection", "This service requires internet connection", [{ text: "Ok", onPress: () => navigation.navigate("Home") }], { cancelable: false });
  };

  return (
    <View style={styles.container}>
      <NativeWebView ref={webViewRef} source={{ uri: "https://vetropay.com/marketplace/" }} onLoad={() => hideSkeleton()} onError={() => showViewError()} />

      {skeletonVisible && (
        <ScrollView style={{ left: 0, right: 0, bottom: 0, top: 0, position: "absolute" }}>
          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine height={50} />
              <PlaceholderLine />
            </Placeholder>
            <Placeholder Animation={Fade} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>

            <Placeholder Animation={Fade} style={{ marginTop: 16 }} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>

            <Placeholder Animation={Fade} style={{ marginTop: 16 }} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>

            <Placeholder Animation={Fade} style={{ marginTop: 16 }} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>

            <Placeholder Animation={Fade} style={{ marginTop: 16 }} Left={PlaceholderMedia} Right={PlaceholderMedia}>
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
