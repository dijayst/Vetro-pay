import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { View, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text as RNtext } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import AppText from "../../resources/AppText";
import { MaterialIcons } from "@expo/vector-icons";

import { getSysPeriod, getVisualizerData } from "../../containers/transactions/action";
import { Spinner } from "native-base";

export default function FinanceVisualizer() {
  const [systemPeriod, setSystemPeriod] = useState([]);
  const [visualizerDataLoaded, setVisualizerDataLoaded] = useState(false);
  const [userSelectSystemPeriod, setUserSelectSystemPeriod] = useState("");
  const [userPeriodIncome, setUserPeriodIncome] = useState("0.00");
  const [userPeriodExpenses, setUserPeriodExpenses] = useState("0.00");
  const [userPeriodDate, setUserPeriodDate] = useState("");
  const [userPeriodVisualizerData, setUserPeriodVisualizerData] = useState([]);

  const dispatch = useDispatch();
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const userAuthentication = useSelector((state) => state.authentication.user);
  const currency = `${userAuthentication.country == "NIGERIA" ? "NGN" : "KES"}`;

  const userSystemPeriod = useSelector((state) => state.transactions.userperiod);
  const visualizerData = useSelector((state) => state.transactions.visualizer);
  const prevVisualizerData = usePrevious(visualizerData);

  useEffect(() => {
    /** SYSTEM PERIOD */
    if (userSystemPeriod.length == 0) {
      dispatch(getSysPeriod());
    } else {
      if (userSystemPeriod.status == "success") {
        setSystemPeriod(userSystemPeriod.data);
      }
    }

    if (prevVisualizerData) {
      if (prevVisualizerData.length !== visualizerData.length) {
        if (visualizerData[visualizerData.length - 1]["status"] == "success") {
          setUserPeriodIncome(visualizerData[visualizerData.length - 1]["data"]["totalIncome"]);
          setUserPeriodExpenses(visualizerData[visualizerData.length - 1]["data"]["totalExpenses"]);
          setUserPeriodDate(visualizerData[visualizerData.length - 1]["data"]["userPeriod"]);
          setUserPeriodVisualizerData(visualizerData[visualizerData.length - 1]["data"]["dataGroup"]);
          setVisualizerDataLoaded(true);
        }
      }
    } else {
      dispatch(getVisualizerData(""));
    }
  });

  const userSystemPeriodUpdate = (value) => {
    setVisualizerDataLoaded(false);
    setUserPeriodIncome("0.00");
    setUserPeriodDate("");
    setUserPeriodVisualizerData([]);
    dispatch(getVisualizerData(value));
  };

  const data = [
    {
      key: 1,
      amount: 50,
      svg: { fill: "#9900cc" },
    },
    {
      key: 2,
      amount: 50,
      svg: { fill: "rgba(38, 109, 220, 0.6)" },
    },
    {
      key: 3,
      amount: 40,
      svg: { fill: "#F2C94C" },
    },
    {
      key: 4,
      amount: 85,
      svg: { fill: "#219653" },
    },
    {
      key: 5,
      amount: 35,
      svg: { fill: "#ecb3ff" },
    },
    {
      key: 6,
      amount: 25,
      svg: { fill: "#266DDC" },
    },
    {
      key: 7,
      amount: 25,
      svg: { fill: "rgba(255,0,0,0.6)" },
    },
    {
      key: 8,
      amount: 25,
      svg: { fill: "rgba(0,255,255,0.5)" },
    },
    {
      key: 9,
      amount: 25,
      svg: { fill: "rgba(255,128,0,0.7)" },
    },
  ];

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <Text key={index} x={pieCentroid[0]} y={pieCentroid[1]} fill={"white"} textAnchor={"middle"} alignmentBaseline={"middle"} fontSize={12} stroke={"black"} strokeWidth={0.2}>
          {data.percentage}%
        </Text>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.windowBox}>
        {/** User-Periods */}
        <View style={{ flexDirection: "row" }}>
          <Picker
            mode="dropdown"
            style={{ height: 30, width: 130, backgroundColor: "#FFFFFF", marginTop: 8, borderRadius: 2, elevation: 5 }}
            onValueChange={(itemValue, itemIndex) => {
              setUserSelectSystemPeriod(itemValue);
              userSystemPeriodUpdate(itemValue);
            }}
            selectedValue={userSelectSystemPeriod}
          >
            {systemPeriod.length > 0
              ? systemPeriod.map((data, index) => {
                  return <Picker.Item key={index} label={`${data.readable_date}`.toUpperCase()} value={data.raw_date} />;
                })
              : () => {
                  return <Picker.Item label="Loading..." value="" />;
                }}
          </Picker>
          <MaterialIcons name="arrow-drop-down" size={25} style={{ paddingVertical: 10 }} />
        </View>
      </View>
      {/** End User-Periods */}

      {visualizerDataLoaded ? (
        <View>
          {/** Pie Chart */}
          <View style={{ marginTop: 40 }}>
            <PieChart style={{ height: 200 }} valueAccessor={({ item }) => item.percentage} data={userPeriodVisualizerData} spacing={0} outerRadius={"95%"}>
              <Labels />
            </PieChart>
          </View>
          {/** End Pie Chart */}

          <View style={styles.windowBox}>
            <AppText bold="true" styles={{ marginTop: 40, fontSize: 16 }}>
              Breakdown {userPeriodDate.toUpperCase()}
            </AppText>

            {/** Currency */}
            <View style={{ flexDirection: "row", marginTop: 16, justifyContent: "space-between" }}>
              <AppText styles={{ fontSize: 16 }}></AppText>

              <AppText bold="true" styles={{ fontSize: 16 }}>
                {currency}
              </AppText>
            </View>
            {/** End Currency */}

            <ScrollView style={{ height: 350 }}>
              {/**Income */}
              <View style={{ flexDirection: "row", marginTop: 0, justifyContent: "space-between" }}>
                <AppText styles={{ fontSize: 16 }}>
                  <RNtext style={{ fontWeight: "700" }}> Income/Wage/Salary:</RNtext>
                </AppText>

                <AppText bold="true" styles={{ fontSize: 16, color: "green" }}>
                  {userPeriodIncome}
                </AppText>
              </View>
              {/** End Income  */}

              {/** Other Categories */}
              <View style={{ marginTop: 8 }}>
                {userPeriodVisualizerData.map((data) => {
                  return (
                    <View key={data.key} style={{ flexDirection: "row", marginTop: 8, justifyContent: "space-between" }}>
                      <AppText styles={{ fontSize: 16 }}>
                        <View style={{ width: 14, height: 14, backgroundColor: `${data.svg.fill}` }}></View>
                        <RNtext style={{ fontWeight: "700" }}> {data.name}:</RNtext>
                      </AppText>

                      <AppText bold="true" styles={{ fontSize: 16 }}>
                        {data.amount}
                      </AppText>
                    </View>
                  );
                })}

                <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between" }}>
                  <AppText bold styles={{ fontSize: 16 }}>
                    <RNtext style={{ fontWeight: "700" }}> Total Expenses:</RNtext>
                  </AppText>

                  <AppText bold="true" styles={{ fontSize: 16, color: "red" }}>
                    {userPeriodExpenses}
                  </AppText>
                </View>
              </View>
              {/** End Other Categories */}
            </ScrollView>
          </View>
        </View>
      ) : (
        <View>
          <View style={{ marginTop: 100 }}>
            <Spinner color="blue.700" size="lg" />
          </View>
          <AppText styles={{ textAlign: "center", marginTop: 50 }}>Retreiving data...</AppText>
          <View style={{ marginTop: 50 }}>
            <Spinner color="#ffaf40" />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

FinanceVisualizer.propTypes = {
  getSysPeriod: PropTypes.func,
  getVisualizerData: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: "#F0F0F8",
  },
  windowBox: {
    paddingHorizontal: 10,
  },
});
