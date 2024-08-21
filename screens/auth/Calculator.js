import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Octicons from "@expo/vector-icons/Octicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AppText from "../../resources/AppText";
import { useNavigation } from "@react-navigation/native";
import { normalizeFontSize } from "../../resources/utils";

export default function Calculator() {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [sessionAns, setSessionAns] = useState(null);

  const HistoryVisibility = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };

  useEffect(() => {
    if (sessionAns != null) {
      setInput(sessionAns);
      setResult("");
    }
  }, [sessionAns]);

  const handlePress = (value) => {
    if (value === "=") {
      let result = calculateResult();
      if (result != null) {
        setSessionAns(result);
      }
    } else if (value === "AC") {
      setInput("");
      setResult("");
    } else if (value === "backspace") {
      let updatedEntry = input.slice(0, -1);
      setInput(updatedEntry);
      calculateResult(updatedEntry);
    } else {
      let updatedEntry = input + value;
      setInput(updatedEntry);
      calculateResult(updatedEntry);
    }
  };

  const updateCalculatorHistory = (calculatableInput, lastCharIsNumber) => {
    /**
     * This Function is necessary because we calculate expressions in real time
     * without waiting for users to click on the 'equals to' symbol. Going along
     * this route without a filtering techning to what is saved in the History would
     * mean every continue expression while being type is going to be recorded.
     *
     * E.g
     * 5 + 2
     * 5 + 20
     * 5 + 205
     * 5 + 2057
     * Would all be recorded even though the user intends to reach 5 + 2057 which is the
     * final expression.
     *
     * Thus;
     * 1. This Function focuses on complete expressions: Only expressions containing an operator and ending with a number are considered for history.
     * 2. Overwrite continuations: Intelligently handles scenarios where the user is progressively building a number by appending digits.
     *
     * In the context of the  history management, you'd notice the use calculatableInput.slice(0, -1) to compare the current expression with the last
     * history entry, excluding the last character. This is important for two main reasons:
     *
     * A. Handling continuations:
     *    - When a user is progressively building a number by appending digits (e.g., "5 + 2", "5 + 20", "5 + 205"),
     *    we want to recognize these as continuations of the same expression and overwrite the previous history entry
     *    rather than creating a new one for each intermediate step. By comparing the current expression
     *    (excluding the last character) with the start of the previous entry, we can identify if they represent the same underlying calculation.
     * B. Focusing on complete values:
     *    - We only want to store expressions in the history that represent complete calculations, meaning they contain an operator and end
     *    with a numerical value.If the last character is an operator, it might indicate an incomplete expression, so we exclude it from the
     *    comparison to avoid potential false positives when checking for continuations.
     */

    if (/[+\-*/%]/.test(calculatableInput) && lastCharIsNumber) {
      if (
        history.length > 0 &&
        history[history.length - 1].input.startsWith(
          calculatableInput.slice(0, -1)
        )
      ) {
        // Overwrite the last history entry if it's a continuation
        history[history.length - 1] = { input: calculatableInput, result };
      } else {
        // Add a new history entry
        setHistory([...history, { input: calculatableInput, result }]);
      }
    }
  };

  const calculateResult = (hotInput) => {
    try {
      let formattedInput;
      let lastCharIsNumber;
      let calculatableInput;
      // Replace symbols for JavaScript evaluation
      if (hotInput) {
        lastCharIsNumber = /\d$/.test(hotInput);
        formattedInput = hotInput.replace(/X/g, "*").replace(/÷/g, "/");
      } else {
        lastCharIsNumber = /\d$/.test(input);
        formattedInput = input.replace(/X/g, "*").replace(/÷/g, "/");
      }

      // Replace '%' with '*0.01'
      formattedInput = formattedInput.replace(/%/g, "*0.01");

      // Dismiss the last arithmetic sign if the expression doesn't end with a value
      if (/[+\-*/]$/.test(formattedInput)) {
        formattedInput = formattedInput.slice(0, -1);
      }

      calculatableInput = formattedInput;

      // Evaluate the expression
      const calculatedResult = eval(formattedInput);

      // Format the result
      let result = calculatedResult;
      if (typeof result === "number") {
        // Convert to integer if result is whole
        if (result % 1 === 0) {
          result = `${result.toFixed(0)}`; // No decimal places for integers
        } else {
          result = `${parseFloat(result.toFixed(8))}`; // Limit to 4 decimal places
        }
      }

      // Update state with the formatted result
      setResult(result);
      updateCalculatorHistory(calculatableInput, lastCharIsNumber);
      return result;
    } catch (error) {
      setResult("Error");
      return null;
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
    <View style={styles.calculatorContainer}>
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
          }}
        >
          <MaterialIcons name="keyboard-backspace" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={HistoryVisibility}>
          <Octicons name="history" size={24} color="#0d0d0d" />
        </TouchableOpacity>
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
        <View style={{ flex: 1 }}>
          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              style={styles.input}
              placeholderTextColor={"#266DDC"}
              showSoftInputOnFocus={false}
            />

            <Text style={styles.resultText}>{result}</Text>
          </View>

          <View style={styles.keypadContainer}>
            {/** HR */}
            <View
              style={{
                borderColor: "#D9D9D9",
                width: "97%",
                borderWidth: 0.7,
              }}
            ></View>
            {/** HR */}

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
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Unlock Advanced Calculations",
                    "Scientific mode is on its way! You'll be notified once its avaialble."
                  );
                }}
                style={styles.button}
              >
                <SimpleLineIcons
                  name="size-fullscreen"
                  size={24}
                  color="#266ddc"
                />
              </TouchableOpacity>
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
  calculatorContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexBasis: "40%",
  },
  resultText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 50,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    fontSize: 90,
    fontWeight: "500",
    marginBottom: 5,
  },
  keypadContainer: {
    marginBottom: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
    height: "auto",
    maxHeight: "50%",
  },
  input: {
    fontSize: 25,
    fontWeight: "400",
    color: "#36454F",
  },
  button: {
    minWidth: normalizeFontSize(70),
    height: normalizeFontSize(70),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImage: {
    maxWidth: normalizeFontSize(27),
    height: normalizeFontSize(50),
    resizeMode: "contain",
  },
  buttonText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 24,
  },
});
