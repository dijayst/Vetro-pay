import { Text, View, StyleSheet, Image, TextInput,TouchableOpacity,Modal } from "react-native";
import React, {useState} from "react";
import VETROPAY_LOGO from "../../assets/logomark_full_horizontal.png";
import chip_extraction from "../../assets/chip_extraction.png";
import sim_card from "../../assets/sim_card.png";
import currency_exchange from "../../assets/currency_exchange.png";
import calculate from "../../assets/calculate.png";
import fingerprint from "../../assets/fingerprint.png";
import GLO from "../../assets/GLO.png";
import MTN from "../../assets/MTN.png";
import AppText from "../../resources/AppText";
import { AntDesign } from '@expo/vector-icons';


export default function Login({navigation}) {
  const [userinput, setuserinput] = useState({
      password:"",
      isPasswordSecure:true,
    });
    const handlelogin=()=>{
      navigation.navigate("Welcome")
    }

    const handlesignup=()=>{
      navigation.navigate("Register")
    }
    
    const handlesignout=()=>{
      navigation.navigate("AuthHome")
    }

    
  const [showModal, setshowmodal] = useState(false)
  const handleshowmodal=()=>{
    setshowmodal(!showModal)
  }
  
  const [calculator, setcalculator] = useState(true)
 
  const [exchange, setexchange] = useState(true)

  const [showModalforextras, setshowmodalforextras] = useState(false)
  const handleshowmodalforextra=()=>{
    setshowmodalforextras(!showModalforextras)
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
    Welcome back, Leonard
    </AppText>
    <AppText bold styles={{ marginTop: 4, fontSize: 10, color: "grey", }}>
    Create a 4 digit code for your transactions
    </AppText>
   
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
<AntDesign style={{ justifyContent: "center", marginTop: 18, }} name={userinput.isPasswordSecure ? "eye" : "eyeo"} size={24} color="#808080" onPress={() => {  userinput.isPasswordSecure ? setuserinput({...userinput,isPasswordSecure:false}) : setuserinput({...userinput,isPasswordSecure:true}) }} />

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

    <View style={{ height: 56, marginTop: 80,flexDirection:"row",gap:4, }}>

<TouchableOpacity style={{ backgroundColor: "#266DDC", borderRadius: 8, height: 56, alignItems: "center", paddingTop: 10,width:252 }}  onPress={handlelogin} >
<Text style={styles.buttonText}>Log In</Text>
</TouchableOpacity>
<TouchableOpacity style={{ backgroundColor: "#266DDC", borderRadius: 8,  height: 56, alignItems: "center",width:63,paddingTop:10 }}>
  <Image
        source={fingerprint}
        style={{ height: 32, width: 32, resizeMode: "contain", }}
      />
      </TouchableOpacity>
</View>
<Text style={{marginTop:16,fontSize:12,fontWeight:"500",marginLeft:99,color:"#266DDC"}}>Forgot Password</Text>

<View style={{ height: 56, marginTop: 150,flexDirection:"row",gap:4, }}>

<TouchableOpacity style={{ backgroundColor: "#D4E2F8", borderRadius: 8, height: 56, alignItems: "center",width:158,flexDirection:"row",paddingLeft:25, }}  onPress={handleshowmodal} >
<Image source={sim_card} style={{ height: 22, width: 22, resizeMode: "contain" }} />
        <Text style={styles.telcotext}>Telco Balance</Text>
</TouchableOpacity>
<TouchableOpacity style={{ backgroundColor: "#D4E2F8", borderRadius: 8,  height: 56, alignItems: "center",width:158,paddingTop:6,flexDirection:"row",paddingLeft:25 }} onPress={handleshowmodalforextra}>
<Image source={chip_extraction} style={{ height: 22, width: 22, resizeMode: "contain" }}  />
<Text style={{fontSize:12,fontWeight:"500",marginLeft:4,color:"#266DDC"}}>Extras</Text>
      </TouchableOpacity>
</View>

<View style={{ display: "flex", flexDirection: "row",marginTop:16,marginLeft:75}}>
            <Text style={styles.buttonText1}>Not you? </Text>
            <TouchableOpacity  onPress={handlesignup}>
              <Text style={{ color: "#FF3B30", fontSize: 14, lineHeight: 19.2, fontWeight: "600" }} onPress={handlesignout}>Sign Out</Text>
            </TouchableOpacity>
          </View>

   
          <Modal animationType="slide"
 visible={showModalforextras} transparent={true} 
 onRequestClose={() => {
  setshowmodalforextras(!showModalforextras);
}}>
 <View style={{flex:1,backgroundColor:"rgba(51, 51, 51, 0.5)",}}>
 <View style={{flex:1,backgroundColor:"#F9FAFA",marginTop:490,borderTopLeftRadius:16,borderTopRightRadius:16,paddingLeft:20,paddingRight:20,paddingBottom:24,paddingTop:16}}>
 
  <TouchableOpacity style={{backgroundColor:"#C0C0C0",width:37,height:5,borderRadius:4,marginLeft:150,}} onPress={() => {
  setshowmodalforextras(!showModalforextras);
}}>
  </TouchableOpacity>
  
  <Text style={{fontSize:20,fontWeight:"500",marginTop:24}}>Extras</Text>
  <View style={{flexDirection:"row",gap:8,marginTop:8,}}>
<TouchableOpacity style={{backgroundColor:"#F4F4F4",height:100,width:156,borderRadius:4,flexDirection:"column",paddingTop:17,paddingLeft:38,paddingRight:42,paddingBottom:17,borderColor:"#266DDC",borderWidth:1}}   onPress={()=>navigation.navigate("Calculator")} >
<Image source={calculate} style={{ height: 40, width: 40, resizeMode: "contain",marginLeft:12 }}  />
  
  <Text style={{fontSize:10,padding:9,color:"#266DDC",fontWeight:"500"}} numberOfLines={1}>Calculator</Text></TouchableOpacity>
<TouchableOpacity style={{backgroundColor:"#F4F4F4",height:100,width:156,borderRadius:4,flexDirection:"column",paddingTop:17,paddingLeft:42,paddingRight:42,paddingBottom:17}}    onPress={()=>navigation.navigate("FXrate")} >
<Image source={currency_exchange} style={{ height: 40, width: 40, resizeMode: "contain",marginLeft:12 }}  />
<Text style={{fontSize:11,padding:9,color:"#266DDC",fontWeight:"500"}} numberOfLines={1}>FX Rates</Text></TouchableOpacity>
    </View>

  </View>
  </View>
  
</Modal>





<Modal animationType="slide"
 visible={showModal} transparent={true} 
 onRequestClose={() => {
  setshowmodal(!showModal);
}}>
 <View style={{flex:1,backgroundColor:" rgba(0, 0, 0, 0.5)",}}>
 <View style={{flex:1,backgroundColor:"#F9FAFA",marginTop:380,borderTopLeftRadius:16,borderTopRightRadius:16,paddingLeft:20,paddingRight:20,paddingBottom:24,paddingTop:16}}>
 
  <TouchableOpacity style={{backgroundColor:"#C0C0C0",width:37,height:5,borderRadius:4,marginLeft:150,}} onPress={() => {
  setshowmodal(!showModal);
}}>
  </TouchableOpacity>
  
  <Text style={{fontSize:20,fontWeight:"500",marginTop:24}}>Telco Balance</Text>
  <View style={{flexDirection:"column",gap:8}}>
    
    <View style={{height:110,backgroundColor:"#F4F4F4",marginTop:8,padding:20,gap:6,borderRadius:8}}>
<View style={{flexDirection:"column",gap:8}}>


  <View style={{flexDirection:"row",gap:62}}>
    <View style={{flexDirection:"row",gap:8}}>
    <Image source={MTN} style={{ height: 22, width: 22, resizeMode: "contain" }}  />
    <Text style={{fontSize:14,marginTop:-1,color:"#121212",fontWeight:"600"}}>0801 000 0000</Text>
    </View>

    <View style={{flexDirection:"row",gap:4}}><Image source={sim_card} style={{ height: 22, width: 22, resizeMode: "contain" }}  />
     <Text style={{fontSize:10,marginTop:3,color:"#266DDC",fontWeight:"500"}}>SIM 1</Text>
     </View>
    </View>
    
    <View style={{flexDirection:"row",gap:8}}>
<View style={{backgroundColor:"#266DDC",height:40,width:136,borderRadius:4}}><Text style={{fontSize:10,padding:9,color:"#FFFFFF",fontWeight:"500"}} numberOfLines={1}>Check Airtime Balance</Text></View>
<View style={{backgroundColor:"#FFFFFF",height:40,width:136,borderRadius:4}}><Text style={{fontSize:11,padding:9,color:"#266DDC",fontWeight:"500",borderColor:"#266DDC",borderWidth:1.5,borderRadius:4}} numberOfLines={1}>Check Data Balance</Text></View>
    </View>
  </View>
</View>

<View style={{height:110,backgroundColor:"#F4F4F4",marginTop:8,padding:20,gap:6,borderRadius:8}}>
<View style={{flexDirection:"column",gap:8}}>


  <View style={{flexDirection:"row",gap:62}}>
    <View style={{flexDirection:"row",gap:8}}>
    <Image source={GLO} style={{ height: 22, width: 22, resizeMode: "contain" }}  />
    <Text style={{fontSize:14,marginTop:-1,color:"#121212",fontWeight:"600"}}>0801 000 0000</Text>
    </View>

    <View style={{flexDirection:"row",gap:4}}><Image source={sim_card} style={{ height: 22, width: 22, resizeMode: "contain" }}  />
     <Text style={{fontSize:10,marginTop:3,color:"#266DDC",fontWeight:"500"}}>SIM 2</Text>
     </View>
    </View>
    
    <View style={{flexDirection:"row",gap:8}}>
<View style={{backgroundColor:"#266DDC",height:40,width:136,borderRadius:4}}><Text style={{fontSize:10,padding:9,color:"#FFFFFF",fontWeight:"500"}} numberOfLines={1}>Check Airtime Balance</Text></View>
<View style={{backgroundColor:"#FFFFFF",height:40,width:136,borderRadius:4}}><Text style={{fontSize:11,padding:9,color:"#266DDC",fontWeight:"500",borderColor:"#266DDC",borderWidth:1.5,borderRadius:4}} numberOfLines={1}>Check Data Balance</Text></View>
    </View>
  </View>
</View>

    </View>

  </View>
  </View>
  
</Modal>

{/*
<Modal animationType="slide"
 visible={showModalforextras} transparent={true}>
 <View><Text>tytuyuiyiyo</Text></View>
</Modal>*/ }
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
  textInput: {
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: "#266ddc",
    borderRadius: 8,
    borderBottomColor: "#266DDC",
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
  
  telcotext: { 
    color:"#266DDC",
    lineHeight:26,
    fontWeight:"600",
    fontSize: 12,
    marginLeft:4
   
  },
  Modal:{
    backgroundColor:"#000000"
  }
});
