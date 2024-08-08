import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  normalizeFontSize,
  onboarding as onboardingData,
} from "../../resources/utils";
import NextButton from "../../resources/NextOnboardingButton";
import VETROPAY_LOGO_MARK from "../../assets/logo_mark.png";
import AppText from "../../resources/AppText";
const EXPO_IMAGE_BLUR =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Onboarding = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef?.current.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      navigation.replace("Login");
      onPressFinish();
    }
  };

  // ASYNC STORAGE FOR SET ITEM ONBOARDING
  const onPressFinish = async () => {
    try {
      await AsyncStorage.setItem("ONBOARDED", "true");
      navigation.replace("Login");
    } catch (error) {
      //   Toast.show({
      //     type: ALERT_TYPE.DANGER,
      //     textBody: 'Error while loading screen',
      //     autoClose: 1000,
      //   });
    }
  };
  function renderHeaderSection() {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          marginTop: 10,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          source={VETROPAY_LOGO_MARK}
          contentFit="contain"
          transition={1000}
          placeholder={{ EXPO_IMAGE_BLUR }}
          style={{
            width: 50,
            height: 64,
          }}
        />

        <TouchableOpacity onPress={onPressFinish}>
          <AppText
            bolder
            styles={{
              fontSize: normalizeFontSize(16),
              color: "#266ddc",
            }}
          >
            Skip
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }
  function renderContent() {
    const { width } = useWindowDimensions();
    return (
      <View
        style={{
          alignItems: "center",
          marginTop: 30,
          flex: 1,
        }}
      >
        <FlatList
          data={onboardingData}
          horizontal
          keyExtractor={(item) => `${item?.id.toString()}`}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          showsHorizontalScrollIndicator={false}
          ref={slidesRef}
          pagingEnabled
          bounces={false}
          renderItem={({ item, index }) => {
            return (
              <View
                key={index}
                style={{
                  width,
                }}
              >
                <Image
                  source={item.image}
                  contentFit="contain"
                  transition={1000}
                  placeholder={{ EXPO_IMAGE_BLUR }}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 300,
                  }}
                />

                <View
                  style={{
                    marginTop: 80,
                    width: 100,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    marginBottom: 20,
                    alignSelf: "center",
                  }}
                >
                  {Array(onboardingData.length)
                    .fill(0)
                    .map((_, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            width: currentIndex == index ? 32 : 10,
                            height: 10,
                            backgroundColor:
                              currentIndex == index ? "#266ddc" : "#dddddd",
                            borderRadius: 10,
                          }}
                        ></View>
                      );
                    })}
                </View>

                <View
                  style={{
                    marginTop: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}
                >
                  <AppText
                    bolder
                    styles={{
                      color: "#0d0d0d",
                      fontSize: normalizeFontSize(24),
                    }}
                  >
                    {item.title}
                  </AppText>

                  <View
                    style={{
                      paddingTop: 10,
                    }}
                  >
                    <AppText
                      light
                      styles={{
                        color: "gray",
                        fontSize: normalizeFontSize(14),
                      }}
                    >
                      {item.description}
                    </AppText>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
  function renderNextButton() {
    return (
      <View
        style={{
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <NextButton
          scrollTo={scrollTo}
          percentage={(currentIndex + 1) * (100 / onboardingData.length)}
          totalItems={onboardingData.length}
          currentIndex={currentIndex}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        {renderHeaderSection()}
        {renderContent()}

        {renderNextButton()}
      </SafeAreaView>
    </View>
  );
};
export default Onboarding;
