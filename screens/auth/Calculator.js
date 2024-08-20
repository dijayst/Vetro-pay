
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import React, { useState, } from "react";
import back from "../../assets/back.png";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import AppText from "../../resources/AppText";
import { useNavigation } from "@react-navigation/native";
//import * as SQLite from 'expo-sqlite';

//const db = SQLite.openDatabase('calculatorHistory.db');

export default function Calculator() {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isResultCalculated, setIsResultCalculated] = useState(false); // New state variable






 

  const HistoryVisibility = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };
  

  const handlePress = (value) => {
    if (value === "=") {
      calculateResult();
      setIsResultCalculated(true);
    } else if (value === "AC") {
      setInput("");
      setResult("");
      setIsResultCalculated(false);
    } else if (value === "backspace") {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };
  


  const calculateResult = () => {
    try {
      const formattedInput = input.replace(/X/g, "*").replace(/÷/g, "/");
      const calculatedResult = eval(formattedInput).toString();

       // Check if the result has a decimal point
    //if (calculatedResult.includes('.')) {    calculatedResult = parseFloat(calculatedResult).toFixed(4); }
   
    setResult(calculatedResult);
  
      setHistory([...history, { input, result: calculatedResult }]);
    } catch (error) {
      setResult("Error");
    }
  };
  



  const clearHistory = () => {
         setHistory([]);
       
  };
  




  const renderButton = (value, imageSource = null) => {
    // Define imageStyle inside the renderButton function
    const imageStyle = styles.buttonImage;

    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress(value)}
      >
        {imageSource ? (
          <Image source={imageSource} style={styles.buttonImage} />
        ) : (
          <AppText styles={styles.buttonText}>{value}</AppText>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingHorizontal: 20, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          style={styles.backButton}
          
          onPress={() => {
            if (isHistoryVisible) {
              setIsHistoryVisible(false);
            } else {
              navigation.goBack(); 
            }
          }}>
          <Image
            source={back}
            style={{ height: 24, width: 24, resizeMode: "contain" }}
          />
        </TouchableOpacity>

        <FontAwesome
          name="history"
          size={24}
          color="#0d0d0d"
          onPress={HistoryVisibility}
        />
      </View>
      {isHistoryVisible ? (
        <View
          style={{
            marginTop: 16,
            borderWidth: 1,
            borderColor: "#D9D9D9",
            borderRadius: 5,
            padding: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <AppText bold styles={{ fontSize: 20 }}>
              History
            </AppText>
            <TouchableOpacity onPress={clearHistory}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
          {history.map((item, index) => (
            <AppText
              key={index}
              styles={{
                color: "gray",
                fontSize: 17,
                lineHeight: 20,
                marginBottom: 4,
              }}
            >
              {item.input} = {item.result}
            </AppText>
          ))}
        </View>
      ) : (
        <View>
          <View
            style={[
              styles.inputContainer,
              isResultCalculated && styles.inputContainerResultCalculated, // Conditional style
            ]}
          >
            <TextInput
              value={input}
              style={styles.input}
              placeholderTextColor={"#266DDC"}
            />

            <Text style={styles.resultText}>{result}</Text>
          </View>

          <View
            style={{
              borderColor: "#D9D9D9",
              width: "97%",
              borderWidth: 0.7,
              marginTop: 14,
            }}
          ></View>

          <View style={styles.keypadContainer}>
            <View style={styles.row}>
              {renderButton("AC", require("../../assets/ac.png"))}
              {renderButton("backspace", require("../../assets/Backspace.png"))}
              {renderButton("%", require("../../assets/modulus.png"))}
              {renderButton("/", require("../../assets/divisionsign.png"))}
            </View>

            <View style={styles.row}>
              {renderButton("7")}
              {renderButton("8")}
              {renderButton("9")}
              {renderButton("*", require("../../assets/multiplication.png"))}
            </View>
            <View style={styles.row}>
              {renderButton("4")}
              {renderButton("5")}
              {renderButton("6")}
              {renderButton("-", require("../../assets/subtraction.png"))}
            </View>
            <View style={styles.row}>
              {renderButton("1")}
              {renderButton("2")}
              {renderButton("3")}
              {renderButton("+", require("../../assets/Addition.png"))}
            </View>
            <View style={styles.row}>
              {renderButton("AC", require("../../assets/ac.png"))}
              {renderButton("0")}
              {renderButton(".")}
              {renderButton("=", require("../../assets/equalssign.png"))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 88,
  },
  inputContainerResultCalculated: {
    marginTop: 20, // Adjust this value to move the input field up
  },
  resultText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 50,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    fontSize: 90,
    fontWeight: "500",
    marginVertical: 10,
  },
  keypadContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    fontSize: 16,
    color: "#266DDC",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 81,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  buttonImage: {
    width: 26,
    height: 24,
    resizeMode: "contain",
  },
  buttonText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 24,
  },
});
