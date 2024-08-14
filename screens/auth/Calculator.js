import { View, Text, TouchableOpacity,StyleSheet,Image, TextInput } from 'react-native'
import React from 'react'
import division from "../../assets/division.png";
import modulus from "../../assets/modulus.png";
import multiplication from "../../assets/multiplication.png";
import Addition from "../../assets/Addition.png";
import subtraction from "../../assets/subtraction.png";
import Vector from "../../assets/Vector.png";
import back from "../../assets/back.png";
import equalsign from "../../assets/equalssign.png";

export default function Calculator({navigation}) {
  return (
    <View style={{paddingLeft:20,paddingTop:20,}} >
      

      <TouchableOpacity style={styles.backButton}  onPress={() => navigation.goBack()}>
        <Image
          source={back}
          style={{ height: 24, width: 24, resizeMode: "contain" }}
         
        />
      </TouchableOpacity>

      
      <TextInput placeholder='100 x 10 x 10' style={styles.input}
      
  placeholderTextColor={"#266DDC"}/>
      <Text style={{marginLeft:170,color:"#000000",fontWeight:"500",fontSize:56,marginTop:-28}}> 10000</Text>
      <View style={{borderColor:"#D9D9D9",width:350,borderWidth:1,marginTop:14}}></View>
      <View style={{ flexDirection: "column",gap:4,marginTop:14 }}>
      <View style={{ flexDirection: "row",gap:4 }}>
        <TouchableOpacity style={styles.button}>
          <Text>2nd</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>rad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>sin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>cos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>tan</Text>
        </TouchableOpacity>
      </View>
       <View style={{ flexDirection: "row",gap:4 }}>
        <TouchableOpacity style={styles.button}>
          <Text>AC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Ig</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>(</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>)</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row",gap:4 }}>
        <TouchableOpacity style={styles.button}>
          <Text>AC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>AC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Image
          source={Vector}
          style={{ height: 20, width: 20, resizeMode: "contain" }}
        />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Image
          source={modulus}
          style={{ height: 20, width: 26, resizeMode: "contain" }}
        />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Image
          source={Addition}
          style={{ height: 20, width: 26, resizeMode: "contain" }}
        />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row",gap:4 }}>
        <TouchableOpacity style={styles.button}>
          <Text>x!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>7</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>8</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>9</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Image
          source={multiplication}
          style={{ height: 16, width: 16, resizeMode: "contain" }}
        />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row",gap:4 }}>
        <TouchableOpacity style={styles.button}>
          <Text>AC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>6</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Image
          source={subtraction}
          style={{ height: 26, width: 26, resizeMode: "contain" }}
        />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row",gap:4 }}>
        <TouchableOpacity style={styles.button}>
          <Text>AC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Image
          source={Addition}
          style={{ height: 26, width: 26, resizeMode: "contain" }}
        />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row",gap:4 }}>
        <TouchableOpacity style={styles.button}>
          <Text>AC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>e</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={{color:"#000000"}}>.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Image
          source={equalsign}
          style={{ height: 36, width: 36, resizeMode: "contain" }}
        />
        </TouchableOpacity>
      </View>
      
      
    </View>
         </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    
  input: {
    padding: 20,
    borderWidth: 0,
    height:56,
    marginTop:88,
    fontSize:12,
    borderRadius:8,
    borderColor:"#266DDC",
    marginLeft:247
  },
    button:{
    
    color:"#000000",
    fontWeight:"400",
    fontSize:20,
    width:67,
    height:57,
    padding:18,
    borderRadius:4
}})
//onPress={() => {  calculator ? setcalculator({...calculator,calculator:false}) : setcalculator({...calculator,calculator:true}) }}