import { View, Text, TouchableOpacity,StyleSheet,Image, TextInput } from 'react-native'
import React,{useState} from 'react'
import back from "../../assets/back.png";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Calculator({navigation}) {
  
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]); 
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  
  const HistoryVisibility = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };
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
      const calculatedResult = eval(formattedInput).toString(); // Calculate the result
      setResult(calculatedResult);
      setHistory([...history, { input, result: calculatedResult }]); // Use calculatedResult directly

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
    <View style={{paddingHorizontal: 20,flex:1}}>
      
<View style={{flexDirection:"row",justifyContent:"space-between",marginTop:20}}>
  
<TouchableOpacity style={styles.backButton}  onPress={() => navigation.goBack()}>
        <Image
          source={back}
          style={{ height: 24, width: 24, resizeMode: "contain" }}
         
        />
      </TouchableOpacity>

      
<FontAwesome name="history" size={24} color="black" onPress={HistoryVisibility} />
</View>
{
  isHistoryVisible?
  <View style={{ marginTop:16,borderWidth:1,borderColor:"#D9D9D9",borderRadius:5, }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>History:</Text>
  {history.map((item, index) => (
    <Text key={index} style={{ fontSize: 16 }}>
      {item.input} = {item.result}
    </Text>
  ))}
</View>
:
<View>

<View style={{flexDirection:"column",alignItems:"flex-end",marginTop:88}}>
<TextInput value={input}  style={styles.input}placeholderTextColor={"#266DDC"}/>

<Text style={styles.resultText}>{result}</Text>


</View>


   <View style={{borderColor:"#D9D9D9",width:"97%",borderWidth:0.7,marginTop:14,}}></View>

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
}
         </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    resultText: {
      color: "#000000",
      fontWeight: "500",
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
    fontSize:16,
    color:"#266DDC",
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

})