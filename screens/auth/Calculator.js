import { View, Text, TouchableOpacity,StyleSheet,Image, TextInput } from 'react-native'
import React,{useState} from 'react'
import back from "../../assets/back.png";

export default function Calculator({navigation}) {
  
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (value) => {
    if (value === '=') {
      calculateResult();
    } else if (value === 'AC') {
      setInput('');
      setResult('');
    } else {
      setInput(input + value);
    }
  };

  const calculateResult = () => {
    try {
      const formattedInput = input.replace(/X/g, '*').replace(/÷/g, '/');
      setResult(eval(formattedInput).toString());
    } catch (error) {
      setResult('Error');
    }
  };

  const renderButton = (value, imageSource = null) => {
    // Define imageStyle inside the renderButton function
    const imageStyle = imageSource === require("../../assets/equalssign.png")
      ? styles.equalsSignImage
      : imageSource === require("../../assets/subtraction.png")
      ? styles.subtractionButtonImage
      : imageSource === require("../../assets/multiplication.png")
      ? styles.multplicationImage
      : imageSource === require("../../assets/modulus.png")
      ? styles.modulusImage
      : imageSource === require("../../assets/ac.png")
      ? styles.ACImage
      : styles.buttonImage;

    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress(value)}
      >
        {imageSource ? (
          <Image source={imageSource} style={imageStyle} />
        ) : (
          <Text style={styles.buttonText}>{value}</Text>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View  >
      

      <TouchableOpacity style={styles.backButton}  onPress={() => navigation.goBack()}>
        <Image
          source={back}
          style={{ height: 24, width: 24, resizeMode: "contain" }}
         
        />
      </TouchableOpacity>

      
      <TextInput value={input} placeholder='100 x 10 x 10' style={styles.input}placeholderTextColor={"#266DDC"}/>
       
 <Text style={styles.resultText}>{result}</Text>
      <View style={{borderColor:"#D9D9D9",width:"90%",borderWidth:1,marginTop:14,marginLeft:20}}></View>
      <View style={styles.keypadContainer}>
      <View style={styles.row}>
          {renderButton('AC', require("../../assets/ac.png"))}
          {renderButton('AC', require("../../assets/Vector.png"))} 
          {renderButton('%', require("../../assets/modulus.png"))}
          {renderButton('/', require("../../assets/divisionsign.png"))}
        </View> 

        <View style={styles.row}>
          {renderButton('7')}
          {renderButton('8')} 
          {renderButton('9')}
          {renderButton('*', require("../../assets/multiplication.png"))}
        </View> 
        <View style={styles.row}>
          {renderButton('4')}
          {renderButton('5')} 
          {renderButton('6')}
          {renderButton('-', require("../../assets/subtraction.png"))}
        </View>
        <View style={styles.row}>
          {renderButton('1')}
          {renderButton('2')} 
          {renderButton('3')}
          {renderButton('+', require("../../assets/Addition.png"))}
        </View>
        <View style={styles.row}>
        {renderButton('AC', require("../../assets/ac.png"))}
         {renderButton('0')} 
          {renderButton('.')}
          {renderButton('=', require("../../assets/equalssign.png"))}
        </View>
         
      
    </View>
         </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    resultText: {
      marginLeft: 230,
      color: "#000000",
      fontWeight: "500",
      marginTop: 8,
      fontSize: 50,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      fontSize:90,
      fontWeight:"500",
      marginVertical: 10,   
     
    },
    keypadContainer: {
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
     
    },
  input: {
    marginTop:88,
    fontSize:16,
    color:"#266DDC",
    marginLeft:287,
    justifyContent:"center",
    alignItems:"center"
  },
    button:{
    width:81,
    height:64,
   justifyContent:"center",
   alignItems:"center",
    margin:8,
   

   
    
}
,
buttonImage: {
  width: 30,
  height: 22,
  
},
buttonText:{
  color:"#000000",
  fontWeight:"500",
  fontSize:24
},
equalsSignImage: {
  width: 56, 
  height: 56, 
  borderRadius:15
 
},
modulusImage:{
  height:26,
  width:26
},
multplicationImage:{
  height:28,
  width:26
},
subtractionButtonImage:{
  height:6,
  width:26
},

ACImage:{
  height:16,
  width:26
},
backButton:{
  marginLeft:20,
  marginTop:20

}

})