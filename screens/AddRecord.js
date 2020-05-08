import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Formik } from "formik";

export default function AddRecord() {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View style={styles.container}>
      <View>
        <Formik initalValues={{ date: "", class: "", paymentMethod: "", amount: "", type: "", note: "" }} onSubmit={values => {}}>
          {props => (
            <View>
              <TextInput style={styles.input} placeholder="Name" />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6
  }
});
