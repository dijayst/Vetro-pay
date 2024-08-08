import { Text, View, StyleSheet, Image, TextInput,TouchableOpacity } from "react-native";
import React, {useState } from "react";
import VETROPAY_LOGO from "../../assets/logomark_full_horizontal.png";
import AppText from "../../resources/AppText";
import { AntDesign } from '@expo/vector-icons';



export default function Login({navigation}) {
    const [userinput, setuserinput] = useState({
        phonenumber: "",
        password:"",
        isPasswordSecure:true,
      });
      const handlelogin=()=>{
        navigation.navigate("Welcome")
      }

      const handlesignup=()=>{
        navigation.navigate("Register")
      }
  
  return (
    <View style={styles.container}>
    <View style={styles.innerScreenContainer}>
      <View
        style={{
          marginTop: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={VETROPAY_LOGO}
          style={{ height: 50, width: 150, resizeMode: "contain" }}
        />
      </View>
      <AppText bold styles={{ marginTop: 10, fontSize: 20,color:"#000000",fontWeight:"500" }}>
      Log in to your account
      </AppText>
      <AppText bold styles={{ marginTop: 4, fontSize: 10, color: "grey", }}>
      Sign in to your account to continue enjoying Vetropay
      </AppText>
      <View style={{ marginTop: 32,}}>
        <View>
      <Text style={{color:"#121212",fontSize:14,fontWeight:"500"}}>Phone Number</Text>
        <TextInput
              style={styles.input}
              placeholder="Enter Phone Number"
              value={userinput.phonenumber}
              placeholderTextColor={"#A0A0A0"}
              onChangeText={(val)=>handlename(val)}
              onEndEditing={(val)=>handlevalidname(val)}
                         />
        </View>
        <View style={{ marginTop: 32,}}>
      <Text style={{color:"#121212",fontSize:14,fontWeight:"500"}}>Password</Text>
      <View style={{ display: "flex", flexDirection: "row" }}>

<TextInput
  style={styles.password}
  placeholder="Enter Password"
  value={userinput.password}
  maxLength={8}
  placeholderTextColor={"#A0A0A0"}
  onChangeText={(password) => setuserinput({ ...userinput,password })}
  secureTextEntry={userinput.isPasswordSecure}
/>
<View style={{ borderWidth: 1, borderColor: "#D9D9D9", height: 56, width: 40, borderTopRightRadius: 8, borderBottomRightRadius: 8,borderLeftWidth:0, marginTop:8 }}>
  <AntDesign style={{ justifyContent: "center", marginTop: 18, }} name={userinput.isPasswordSecure ? "eye" : "eye"} size={24} color="#808080" onPress={() => {  userinput.isPasswordSecure ? setuserinput({...userinput,isPasswordSecure:false}) : setuserinput({...userinput,isPasswordSecure:true}) }} />

</View>

</View>
       
        </View>
       
      </View>

      {/** TEXT INPUT CONTAINER */}
      <View>
        {/* <TextInput
          style={{ ...styles.textInput, marginTop: 20 }}
          placeholder="Enter Password"
          placeholderTextColor="gray"
          textContentType="telephoneNumber"
          keyboardType="numeric"
          autoComplete="off"
        /> */}
      </View>

      <View style={{ height: 56, marginTop: 200, }}>

<TouchableOpacity style={{ backgroundColor: "#266DDC", borderRadius: 8, marginTop: 10, height: 56, alignItems: "center", padding: 10 }}  onPress={handlelogin} >
  <Text style={styles.buttonText}>Log In</Text>
</TouchableOpacity>
<Text></Text>
<View style={{ display: "flex", flexDirection: "row",marginBottom:16,marginLeft:45}}>
            <Text style={styles.buttonText1}>Don’t Have An Account? </Text>
            <TouchableOpacity  onPress={handlesignup}>
              <Text style={{ color: "#266DDC", fontSize: 14, lineHeight: 19.2, fontWeight: "600" }}>Sign Up</Text>
            </TouchableOpacity>
          </View>


</View>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  innerScreenContainer: {
    flex: 1,
    paddingHorizontal: 20,
    
  },
  input: {
    padding: 20,
    borderWidth: 1,
    height:56,
    marginTop:8,
    fontSize:12,
   // marginVertical: 20,
    borderRadius:8,
    borderColor:"#D9D9D9",
  },
  password: {
    padding: 20,
    borderWidth: 1,
    borderRightWidth:0,
    width:279,
    height:56,
    marginTop:8,
    fontSize:12,
   // marginVertical: 20,
   borderTopLeftRadius:8,
   borderBottomLeftRadius:8,
    borderColor:"#D9D9D9",
  },
  
  buttonText: { 
    color:"#FFFFFF",
    lineHeight:26,
    fontWeight:"600",
    fontSize: 16,
   
  },
  buttonText1: { 
    color:"#000000", 
    lineHeight:19.2,
    fontWeight:"600",
    fontSize: 14,
   
},
});





