import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from "react-native";
import { WebView } from "react-native-webview";
import AppText from "../../resource/AppText";
import { AppButton } from "../../resource/AppButton";
import CreditHistory from "../../resource/CreditHistory";
import { getCreditStatus } from "../../containers/credit/action";
import { Spinner } from "native-base";
import { shortenNames } from "../../resource/MetaFunctions";

function Separator() {
  return <View style={styles.separator} />;
}

export default function Credit({ navigation }) {
  const userAuthentication = useSelector((state) => state.authentication.user);
  const [creditState, setCreditState] = useState({
    creditBalance: "0.00",
    duePayment: "0.00",
  });
  const [accessCredit, setAccessCredit] = useState(false);
  const [creditDataLoaded, setCreditDataLoaded] = useState(false);
  const [previousCreditDetails, setPreviousCreditDetails] = useState({});
  const [creditTempMessage, setCreditTempMessage] = useState("");

  const getGreetings = () => {
    const currentDateHour = new Date().getHours();

    if (currentDateHour < 12) {
      return (
        <AppText bold="true" styles={{ fontSize: 20 }}>
          Good Morning ☀️
        </AppText>
      );
    } else if (currentDateHour < 18) {
      return (
        <AppText bold="true" styles={{ fontSize: 20 }}>
          Good Afternoon ☀️
        </AppText>
      );
    } else {
      return (
        <AppText bold="true" styles={{ fontSize: 20 }}>
          Good evening 🌑
        </AppText>
      );
    }
  };
  const dispatch = useDispatch();

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const userCreditDetails = useSelector((state) => state.credit.status);
  const prevUserCreditDetails = usePrevious(userCreditDetails);

  useEffect(() => {
    /**NAVIGATIOON */
    navigation.addListener("didFocus", () => {
      dispatch(getCreditStatus());
    });
  }, [navigation]);

  useEffect(() => {
    if (prevUserCreditDetails) {
      // Update Credit State & Details
      setCreditState(userCreditDetails["creditState"]);

      // Can user Access Credit
      if (userCreditDetails["message"] == "User eligible" && userCreditDetails["outstanding_credit"] == false) {
        if (userAuthentication.country == "NIGERIA") {
          setAccessCredit(true);
        }
      }

      //Does User have any previous credit history
      if (userCreditDetails["last_credit_details"]) {
        setPreviousCreditDetails(userCreditDetails["last_credit_details"]);
      }

      // Update Temp message for user
      setCreditTempMessage(userCreditDetails["message"]);

      setCreditDataLoaded(true);
    } else {
      dispatch(getCreditStatus());
    }
  });

  const getBaseInfo = () => {
    if (creditTempMessage == "User does not meet credit requirement") {
      return (
        <View
          style={{
            marginTop: 16,
            height: 50,
            borderWidth: 0.5,
            borderColor: "rgba(50, 54, 63, 0.4)",
            borderRadius: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AppText styles={{ color: "rgba(50, 54, 63, 0.4)" }}>You are not eligible for credit. </AppText>

          <AppText styles={{ color: "rgba(50, 54, 63, 0.4)", marginTop: 3 }}>
            Click{" "}
            <AppText bold="true" styles={{ color: "rgba(50, 54, 63, 0.5)" }}>
              HERE
            </AppText>{" "}
            to view eligibility requriements
          </AppText>
        </View>
      );
    } else if (creditTempMessage == "User eligible") {
      if (previousCreditDetails["creditID"] !== undefined) {
        return (
          <View>
            <CreditHistory creditDetails={previousCreditDetails} />
            <TouchableWithoutFeedback onPress={() => navigation.navigate("CreditHistoryMain")}>
              <View>
                <AppText bold="true" styles={{ textAlign: "center", marginTop: 20, paddingBottom: 10, color: "#266ddc", fontSize: 16 }}>
                  View all history
                </AppText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        );
      } else {
        return (
          <View
            style={{
              marginTop: 16,
              height: 50,
              borderWidth: 0.5,
              borderColor: "rgba(50, 54, 63, 0.4)",
              borderRadius: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppText styles={{ color: "rgba(50, 54, 63, 0.4)" }}>Your account is eligible for credit. </AppText>

            <AppText styles={{ color: "rgba(50, 54, 63, 0.4)", marginTop: 3 }}>
              Click{" "}
              <AppText bold="true" styles={{ color: "rgba(50, 54, 63, 0.5)" }}>
                REQUEST CREDIT
              </AppText>{" "}
              to access our credit options
            </AppText>
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flexGrow: 0 }}>
        <View style={{ position: "relative" }}>
          <AppText styles={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "700" }}>Hello,</Text>
          </AppText>
          {getGreetings()}
          <View style={{ height: 251 }}>
            <WebView
              source={{
                html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="width: 90%; position: absolute; overflow:hidden; justify-content: center; display: flex; background-color: #F0F0F8;">
          <style>
            .container {
              width: 100%;
              max-width: 400px;
              max-height: 251px;
              height: 54vw;
              padding: 10px;
            }
      
            #ccsingle {
              position: absolute;
              right: 15px;
              top: 20px;
            }
      
            #ccsingle svg {
              width: 150px;
              max-height: 60px;
            }
      
            .creditcard svg#cardfront {
              width: 100%;
              -webkit-box-shadow: 1px 5px 6px 0px black;
              box-shadow: 1px 5px 6px 0px black;
              border-radius: 22px;
            }
      
            .creditcard .cardcolor {
              fill: #478fff;
            }
      
            .creditcard .cardcolordark {
              fill: #266ddc;
            }
      
            #svgname {
              text-transform: uppercase;
            }
      
            #cardfront .st2 {
              fill: #ffffff;
            }
      
            #cardfront .st3 {
              font-family: "Source Code Pro", monospace;
              font-weight: 600;
            }
      
            #cardfront .st4 {
              font-size: 54.7817px;
            }
      
            #cardfront .st5 {
              font-family: "Source Code Pro", monospace;
              font-weight: 400;
            }
      
            #cardfront .st6 {
              font-size: 33.1112px;
            }
      
            #cardfront .st7 {
              opacity: 0.6;
              fill: #ffffff;
            }
      
            #cardfront .st8 {
              font-size: 24px;
            }
      
            #cardfront .st9 {
              font-size: 36.5498px;
            }
      
            #cardfront .st10 {
              font-family: "Source Code Pro", monospace;
              font-weight: 300;
            }
      
            #cardfront .st11 {
              font-size: 16.1716px;
            }
      
            #cardfront .st12 {
              fill: #4c4c4c;
            }
      
            .creditcard .front,
            .creditcard .back {
              position: absolute;
              width: 100%;
              max-width: 400px;
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
              -webkit-font-smoothing: antialiased;
              color: #47525d;
            }
          </style>
          <div class="container">
            <div class="creditcard">
              <div class="front">
                <div id="ccsingle">
                  <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="750px"
                    height="471px"
                    viewBox="0 0 750 471"
                    enable-background="new 0 0 750 471"
                    xml:space="preserve"
                  >
                    <path
                      d="M111.2 0.599996C114.533 0.599996 117.4 1.73333 119.8 3.99999C122.333 6.26666 123.6 8.99999 123.6 12.2C123.6 13.9333 123.2 15.7333 122.4 17.6L73 133.2C71.8 135.733 70.1333 137.667 68 139C65.8667 140.333 63.6 141 61.2 141C58.9333 140.867 56.8 140.2 54.8 139C52.9333 137.667 51.4667 135.8 50.4 133.4L1 17.4C0.333334 16.0667 2.38419e-07 14.4 2.38419e-07 12.4C2.38419e-07 8.8 1.33333 5.93333 4 3.79999C6.66667 1.53333 9.4 0.399998 12.2 0.399998C14.4667 0.399998 16.6 1.06666 18.6 2.4C20.6 3.73333 22.1333 5.66666 23.2 8.19999L63.4 102.8L100.2 8.19999C101.267 5.79999 102.8 3.93333 104.8 2.59999C106.8 1.26666 108.933 0.599996 111.2 0.599996Z"
                      fill="#FFAF40"
                    ></path>
                    <path
                      d="M151.747 91.6C148.28 91.6 145.347 90.4667 142.947 88.2C140.68 85.9333 139.547 83.0667 139.547 79.6C139.547 76.2667 140.68 73.4667 142.947 71.2C145.347 68.9333 148.28 67.8 151.747 67.8H186.547C190.014 67.8 192.88 69 195.147 71.4C197.547 73.6667 198.747 76.5333 198.747 80C198.747 83.3333 197.547 86.1333 195.147 88.4C192.88 90.5333 190.014 91.6 186.547 91.6H151.747ZM321.844 7.8C325.977 9.93333 328.044 13.3333 328.044 18C328.044 20.8 327.044 23.5333 325.044 26.2C322.91 29 320.177 30.4 316.844 30.4C314.577 30.4 312.31 29.8 310.044 28.6C303.51 25.5333 296.444 24 288.844 24C279.51 24 271.377 26 264.444 30C257.51 33.8667 252.177 39.4 248.444 46.6C244.71 53.6667 242.844 61.8 242.844 71C242.844 86.7333 247.044 98.6667 255.444 106.8C263.977 114.933 275.11 119 288.844 119C296.977 119 304.044 117.467 310.044 114.4C312.444 113.333 314.577 112.8 316.444 112.8C319.91 112.8 322.844 114.267 325.244 117.2C327.244 119.733 328.244 122.467 328.244 125.4C328.244 127.533 327.71 129.467 326.644 131.2C325.577 132.933 324.044 134.267 322.044 135.2C311.644 140.4 300.577 143 288.844 143C275.777 143 263.777 140.267 252.844 134.8C241.91 129.2 233.177 121 226.644 110.2C220.11 99.4 216.844 86.3333 216.844 71C216.844 57.4 219.91 45.2 226.044 34.4C232.31 23.6 240.91 15.2 251.844 9.19999C262.777 3.06666 275.11 -8.58307e-06 288.844 -8.58307e-06C300.71 -8.58307e-06 311.71 2.59999 321.844 7.8ZM459.034 121.4C460.768 122.467 462.101 123.867 463.034 125.6C464.101 127.333 464.634 129.133 464.634 131C464.634 133.4 463.834 135.6 462.234 137.6C460.234 140 457.168 141.2 453.034 141.2C449.834 141.2 446.901 140.467 444.234 139C434.634 133.533 429.834 122.4 429.834 105.6C429.834 100.8 428.234 97 425.034 94.2C421.968 91.4 417.501 90 411.634 90H374.234V128.8C374.234 132.4 373.234 135.333 371.234 137.6C369.368 139.867 366.834 141 363.634 141C359.768 141 356.368 139.867 353.434 137.6C350.634 135.2 349.234 132.267 349.234 128.8V13.2C349.234 9.73333 350.368 6.86666 352.634 4.59999C355.034 2.19999 357.968 0.99999 361.434 0.99999H419.034C425.968 0.99999 432.501 2.86666 438.634 6.59999C444.768 10.3333 449.634 15.4667 453.234 22C456.968 28.5333 458.834 35.8667 458.834 44C458.834 50.6667 457.034 57.2 453.434 63.6C449.834 69.8667 445.168 74.8667 439.434 78.6C447.834 84.4667 452.434 92.3333 453.234 102.2C453.634 104.333 453.834 106.4 453.834 108.4C454.368 112.533 454.901 115.533 455.434 117.4C455.968 119.133 457.168 120.467 459.034 121.4ZM418.034 69.4C420.434 69.4 422.768 68.2667 425.034 66C427.301 63.7333 429.168 60.7333 430.634 57C432.101 53.1333 432.834 49 432.834 44.6C432.834 40.8667 432.101 37.4667 430.634 34.4C429.168 31.2 427.301 28.6667 425.034 26.8C422.768 24.9333 420.434 24 418.034 24H374.234V69.4H418.034ZM565.739 118C569.206 118 572.072 119.2 574.339 121.6C576.739 123.867 577.939 126.533 577.939 129.6C577.939 132.933 576.739 135.667 574.339 137.8C572.072 139.933 569.206 141 565.739 141H498.739C495.272 141 492.339 139.867 489.939 137.6C487.672 135.2 486.539 132.267 486.539 128.8V13.2C486.539 9.73333 487.672 6.86666 489.939 4.59999C492.339 2.19999 495.272 0.99999 498.739 0.99999H565.739C569.206 0.99999 572.072 2.13333 574.339 4.39999C576.739 6.53332 577.939 9.33332 577.939 12.8C577.939 16.1333 576.806 18.8667 574.539 21C572.272 23 569.339 24 565.739 24H511.539V58H556.739C560.206 58 563.072 59.1333 565.339 61.4C567.739 63.5333 568.939 66.3333 568.939 69.8C568.939 73.1333 567.806 75.8667 565.539 78C563.272 80 560.339 81 556.739 81H511.539V118H565.739ZM660.992 0.99999C673.526 0.99999 684.259 4.13332 693.192 10.4C702.259 16.5333 709.126 24.9333 713.792 35.6C718.592 46.1333 720.992 57.9333 720.992 71C720.992 84.0667 718.592 95.9333 713.792 106.6C709.126 117.133 702.259 125.533 693.192 131.8C684.259 137.933 673.526 141 660.992 141H613.192C609.726 141 606.792 139.867 604.392 137.6C602.126 135.2 600.992 132.267 600.992 128.8V13.2C600.992 9.73333 602.126 6.86666 604.392 4.59999C606.792 2.19999 609.726 0.99999 613.192 0.99999H660.992ZM658.992 118C670.992 118 679.992 113.6 685.992 104.8C691.992 95.8667 694.992 84.6 694.992 71C694.992 57.4 691.926 46.2 685.792 37.4C679.792 28.4667 670.859 24 658.992 24H625.992V118H658.992ZM768.961 128.8C768.961 132.267 767.694 135.2 765.161 137.6C762.628 139.867 759.694 141 756.361 141C752.761 141 749.761 139.867 747.361 137.6C745.094 135.2 743.961 132.267 743.961 128.8V13.2C743.961 9.73333 745.161 6.86666 747.561 4.59999C749.961 2.19999 753.028 0.99999 756.761 0.99999C760.094 0.99999 762.961 2.19999 765.361 4.59999C767.761 6.86666 768.961 9.73333 768.961 13.2V128.8ZM891.039 0.99999C894.639 0.99999 897.572 2.06666 899.839 4.2C902.106 6.33333 903.239 9.13333 903.239 12.6C903.239 16.0667 902.106 18.8667 899.839 21C897.572 23 894.639 24 891.039 24H859.639V128.8C859.639 132.267 858.372 135.2 855.839 137.6C853.306 139.867 850.172 141 846.439 141C842.706 141 839.639 139.867 837.239 137.6C834.839 135.2 833.639 132.267 833.639 128.8V24H802.239C798.639 24 795.706 22.9333 793.439 20.8C791.172 18.6667 790.039 15.8667 790.039 12.4C790.039 9.06666 791.172 6.33333 793.439 4.2C795.839 2.06666 798.772 0.99999 802.239 0.99999H891.039Z"
                      fill="#0E4595"
                    ></path>
                  </svg>
                </div>
                <svg
                  version="1.1"
                  id="cardfront"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 750 471"
                  style="enable-background: new 0 0 750 471;"
                  xml:space="preserve"
                >
                  <g id="Front">
                    <g id="CardBackground">
                      <g id="Page-1_1_">
                        <g id="amex_1_">
                          <path
                            id="Rectangle-1_1_"
                            class="lightcolor cardcolor"
                            d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                                          C0,17.9,17.9,0,40,0z"
                          ></path>
                        </g>
                      </g>
                      <path class="darkcolor cardcolordark" d="M750,431V193.2c-217.6-57.5-556.4-13.5-750,24.9V431c0,22.1,17.9,40,40,40h670C732.1,471,750,453.1,750,431z"></path>
                    </g>
                    <text transform="matrix(1 0 0 1 60.106 295.0121)" id="svgnumber" class="st2 st3 st4">${userAuthentication.country == "NIGERIA" ? "NGN" : "KES"} ${
                  creditState.creditBalance
                }</text>
                    <text transform="matrix(1 0 0 1 54.1064 428.1723)" id="svgname" class="st2 st5 st6">${shortenNames(userAuthentication.fullname, 16)}</text>
                    <text transform="matrix(1 0 0 1 54.1074 389.8793)" class="st7 st5 st8">Customer Name</text>
                    <text transform="matrix(1 0 0 1 479.7754 388.8793)" class="st7 st5 st8">Due payment</text>
                    <text transform="matrix(1 0 0 1 65.1054 241.5)" class="st7 st5 st8">Credit Balance</text>
                    <g>
                      <text transform="matrix(1 0 0 1 478.4219 433.8095)" id="svgexpire" class="st2 st5 st9">${creditState.duePayment}</text>
                    </g>
                    <g id="cchip">
                      <g>
                        <path
                          class="st2"
                          d="M168.1,143.6H82.9c-10.2,0-18.5-8.3-18.5-18.5V74.9c0-10.2,8.3-18.5,18.5-18.5h85.3
                                      c10.2,0,18.5,8.3,18.5,18.5v50.2C186.6,135.3,178.3,143.6,168.1,143.6z"
                        ></path>
                      </g>
                      <g>
                        <g>
                          <rect x="82" y="70" class="st12" width="1.5" height="60"></rect>
                        </g>
                        <g>
                          <rect x="167.4" y="70" class="st12" width="1.5" height="60"></rect>
                        </g>
                        <g>
                          <path
                            class="st12"
                            d="M125.5,130.8c-10.2,0-18.5-8.3-18.5-18.5c0-4.6,1.7-8.9,4.7-12.3c-3-3.4-4.7-7.7-4.7-12.3
                                          c0-10.2,8.3-18.5,18.5-18.5s18.5,8.3,18.5,18.5c0,4.6-1.7,8.9-4.7,12.3c3,3.4,4.7,7.7,4.7,12.3
                                          C143.9,122.5,135.7,130.8,125.5,130.8z M125.5,70.8c-9.3,0-16.9,7.6-16.9,16.9c0,4.4,1.7,8.6,4.8,11.8l0.5,0.5l-0.5,0.5
                                          c-3.1,3.2-4.8,7.4-4.8,11.8c0,9.3,7.6,16.9,16.9,16.9s16.9-7.6,16.9-16.9c0-4.4-1.7-8.6-4.8-11.8l-0.5-0.5l0.5-0.5
                                          c3.1-3.2,4.8-7.4,4.8-11.8C142.4,78.4,134.8,70.8,125.5,70.8z"
                          ></path>
                        </g>
                        <g>
                          <rect x="82.8" y="82.1" class="st12" width="25.8" height="1.5"></rect>
                        </g>
                        <g>
                          <rect x="82.8" y="117.9" class="st12" width="26.1" height="1.5"></rect>
                        </g>
                        <g>
                          <rect x="142.4" y="82.1" class="st12" width="25.8" height="1.5"></rect>
                        </g>
                        <g>
                          <rect x="142" y="117.9" class="st12" width="26.2" height="1.5"></rect>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </body>
      </html>
      
      `,
              }}
            />
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <AppButton
              disabled={!accessCredit}
              onPress={() => navigation.navigate("RequestCredit")}
              styles={{ width: "90%", backgroundColor: "#266ddc", height: 40, borderRadius: 4, justifyContent: "center", alignItems: "center", elevation: 7 }}
            >
              <AppText bold="true" styles={{ color: "#ffffff", textTransform: "uppercase" }}>
                Request credit
              </AppText>
            </AppButton>
          </View>

          {/**Transaction History */}
          <Separator />
        </View>

        <AppText bold="true" styles={styles.headerText}>
          Active Credit:
        </AppText>

        {creditDataLoaded ? (
          getBaseInfo()
        ) : (
          <View style={{ marginTop: 40 }}>
            <AppText styles={{ textAlign: "center" }}>Loading credit details...</AppText>
            <Spinner color="blue" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

Credit.propTypes = {
  getCreditStatus: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#F0F0F8",
  },
  headerText: {
    fontSize: 20,
    color: "#266ddc",
  },

  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth + 0.4,
  },
});
