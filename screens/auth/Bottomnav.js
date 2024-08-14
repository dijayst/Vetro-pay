import { Text, View, StyleSheet, Image, TextInput,TouchableOpacity,StatusBar} from "react-native";
import React, {useState,useRef,useMemo, useCallback,Fragment} from "react";
import chip_extraction from "../../assets/chip_extraction.png";
import sim_card from "../../assets/sim_card.png";
import calculate from "../../assets/calculate.png";
import currency_exchange from "../../assets/currency_exchange.png";
import BottomSheet, { BottomSheetModalProvider, BottomSheetBackdrop, } from '@gorhom/bottom-sheet';
import GLO from "../../assets/GLO.png";
import MTN from "../../assets/MTN.png";
import { useNavigation } from '@react-navigation/native';


export default function Bottomnav({renderBackdrop}) {


  
const SUPPORTED_CURRENCIES = [
  {
    fullname: "Nigerian Naira",
    code: "NGN",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/1280px-Flag_of_Nigeria.svg.png",
  },
  // {
  //   fullname: "United States Dollar",
  //   code: "USD",
  //   icon: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/255px-Flag_of_the_United_States.svg.png",
  // },
  {
    fullname: "Tether",
    code: "USDT",
    icon: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662498409/vetropay/png-transparent-tether-hd-logo-removebg-preview_k0sstw.png",
  },
  {
    fullname: "Tron",
    code: "TRX",
    icon: "https://res.cloudinary.com/ancla8techs4/image/upload/v1662498547/vetropay/62837c68ab0e763d5f77e9a6_z7wfzs.png",
  },
  {
    fullname: "Bitcoin",
    code: "BTC",
    icon: "https://res.cloudinary.com/ancla8techs4/image/upload/v1671729820/vetropay/bitcoin-btc-logo_swmjng.png",
  },
];
    const navigation = useNavigation();
    const OpenmodalRef = useRef(null);
    const OpenmodalRef2 = useRef(null);
   
    
    const snapPoints = useMemo(() => [ '1%','50%','100%',], []);

    const snapPoints2 = useMemo(() => [ '1%','50%','100%',], []);


    const [openModal, setopenmodal] = useState(true)
    const handleopenmodal=()=>{
     
      OpenmodalRef.current?.expand();
      setopenmodal(true)
    }

  const closemodal = () => {
    setopenmodal(!openModal);
    OpenmodalRef.current?.close();
  };
    
  const [openModal2, setopenmodal2] = useState(true)
  const handleopenmodal2=()=>{
    
    OpenmodalRef2.current?.expand();
    setopenmodal2(true)
  }

  const closemodal2 = () => {
    setopenmodal2(!openModal2);
    OpenmodalRef2.current?.close();
  };

  const [selectedCurrency, setSelectedCurrency] = useState(
    SUPPORTED_CURRENCIES[0]
  );


  // const renderBackdrop = (props) => (
  //   <BottomSheetBackdrop {...props} opacity={0.5} />
  // );


  const handlesignup=()=>{
    navigation.navigate("Register")
  }

  
  const handlesignout=()=>{
    navigation.navigate("AuthHome")
  }

  const handleSheetChanges = useCallback((index) => {}, []);


  return (
     <View style={styles.container}>
            
<View style={{ height: 56, marginTop: 150,flexDirection:"row",gap:4,marginLeft:17,flex:1}}>

<TouchableOpacity style={{ backgroundColor: "#D4E2F8", borderRadius: 4, height: 44, alignItems: "center",width:178,flexDirection:"row",paddingLeft:25, }}  onPress={handleopenmodal} >
<Image source={sim_card} style={{ height: 22, width: 22, resizeMode: "contain" }} />
        <Text style={styles.telcotext}>Telco Balance</Text>
</TouchableOpacity>
<TouchableOpacity style={{ backgroundColor: "#D4E2F8", borderRadius: 4,  height: 44, alignItems: "center",width:178,paddingTop:6,flexDirection:"row",paddingLeft:25 }} onPress={handleopenmodal2}>
<Image source={chip_extraction} style={{ height: 22, width: 22, resizeMode: "contain" }}  />
<Text style={{fontSize:14,fontWeight:"500",marginLeft:4,color:"#266DDC"}}>Extras</Text>
      </TouchableOpacity>


     </View>
     
    
       
     <BottomSheet
        backdropComponent={renderBackdrop}
       onChange={handleSheetChanges}
         ref={OpenmodalRef}
         index={0}
         snapPoints={snapPoints}
         onClose={()=>setopenmodal(false)}
         enablePanDownToClose
       handleIndicatorStyle={{backgroundColor:"#C0C0C0",marginTop:16}}
     
     >

           <View style={{ flex: 1, padding: 20, height: "100%",flex:1,borderTopLeftRadius:16,borderTopRightRadius:16,paddingLeft:20,paddingRight:20,paddingTop:16,height:200,backgroundColor:"#F9FAFA"}}>
  
  <Text style={{fontSize:20,fontWeight:"500",marginTop:4}}>Telco Balance</Text>
  <View style={{flexDirection:"column",gap:8}}>
    
    <View style={{height:110,backgroundColor:"#F4F4F4",marginTop:8,padding:20,gap:6,borderRadius:8}}>
<View style={{flexDirection:"column",gap:8}}>


  <View style={{flexDirection:"row",gap:62}}>
    <View style={{flexDirection:"row",gap:8}}>
    <Image source={MTN} style={{ height: 22, width: 22, resizeMode: "contain" }}  />
    <Text style={{fontSize:14,marginTop:-1,color:"#121212",fontWeight:"600"}}>0801 000 0000</Text>
    </View>

    <View style={{flexDirection:"row",gap:4,marginLeft:62}}><Image source={sim_card} style={{ height: 22, width: 22, resizeMode: "contain" }}  />
     <Text style={{fontSize:14,marginTop:3,color:"#266DDC",fontWeight:"500"}}>SIM 1</Text>
     </View>
    </View>
    
    <View style={{flexDirection:"row",gap:8}}>
<TouchableOpacity style={{backgroundColor:"#266DDC",height:40,width:154,borderRadius:4}}><Text style={{fontSize:10,paddingLeft:19,paddingTop:11,color:"#FFFFFF",fontWeight:"500"}} numberOfLines={1}>Check Airtime Balance</Text></TouchableOpacity>
<TouchableOpacity style={{backgroundColor:"#F4F4F4",height:40,width:154,borderRadius:4}}><Text style={{paddingLeft:19,paddingTop:11,fontSize:11,padding:9,color:"#266DDC",fontWeight:"500",borderColor:"#266DDC",borderWidth:1.5,borderRadius:4}} numberOfLines={1}>Check Data Balance</Text></TouchableOpacity>
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

    <View style={{flexDirection:"row",gap:4,marginLeft:62}}><Image source={sim_card} style={{ height: 22, width: 22, resizeMode: "contain" }}  />
     <Text style={{fontSize:14,marginTop:3,color:"#266DDC",fontWeight:"500"}}>SIM 2</Text>
     </View>
    </View>
    
    <View style={{flexDirection:"row",gap:8}}>
<View style={{backgroundColor:"#266DDC",height:40,width:154,borderRadius:4}}><Text style={{fontSize:10,paddingLeft:19,paddingTop:11,color:"#FFFFFF",fontWeight:"500"}} numberOfLines={1}>Check Airtime Balance</Text></View>
<TouchableOpacity style={{backgroundColor:"#F4F4F4",height:40,width:154,borderRadius:4}}><Text style={{paddingLeft:19,paddingTop:11,fontSize:11,color:"#266DDC",fontWeight:"500",borderColor:"#266DDC",borderWidth:1.5,borderRadius:4}} numberOfLines={1}>Check Data Balance</Text></TouchableOpacity>
    </View>
  </View>
</View>

    </View>

  
 </View>
         
        </BottomSheet>

     
      <BottomSheet
         backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}

          ref={OpenmodalRef2}
          index={0}
          snapPoints={snapPoints2}
          onClose={()=>setopenmodal2(false)}
          enablePanDownToClose
        handleIndicatorStyle={{backgroundColor:"#C0C0C0",marginTop:16}}
      
      >

<View style={{ flex: 1, padding: 20, height: "100%" }}>
       
           
          


  <Text style={{fontSize:20,fontWeight:"500",color:"#000000"}}>Extras</Text>
  <View style={{flexDirection:"row",gap:8,marginTop:16,}}>
<TouchableOpacity style={{backgroundColor:"#F4F4F4",height:100,width:156,borderRadius:4,flexDirection:"column",paddingTop:17,paddingLeft:38,paddingRight:42,paddingBottom:17,borderColor:"#266DDC",borderWidth:1}}   onPress={()=>navigation.navigate("Calculator")} >
<Image source={calculate} style={{ height: 40, width: 40, resizeMode: "contain",marginLeft:12 }}  />
  <Text style={{fontSize:10,padding:9,color:"#266DDC",fontWeight:"500"}} numberOfLines={1}>Calculator</Text></TouchableOpacity>
<TouchableOpacity style={{backgroundColor:"#F4F4F4",height:100,width:156,borderRadius:4,flexDirection:"column",paddingTop:17,paddingLeft:42,paddingRight:42,paddingBottom:17}}    onPress={()=>navigation.navigate("FXrate")} >
<Image source={currency_exchange} style={{ height: 40, width: 40, resizeMode: "contain",marginLeft:12 }}  />
<Text style={{fontSize:11,padding:9,color:"#266DDC",fontWeight:"500"}} numberOfLines={1}>FX Rates</Text></TouchableOpacity>
    </View>

 </View>
       
        </BottomSheet>
    
</View>
  )
}


const styles = StyleSheet.create({
  bottomsheet: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
    container:{
flex:1,
  },
   
    button: {
        backgroundColor: 'lightblue',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
      },
  telcotext: { 
    color:"#266DDC",
    lineHeight:26,
    fontWeight:"500",
    fontSize: 14,
    marginLeft:4
   
  },
  
  buttonTex: { 
    color:"#FFFFFF",
    lineHeight:26,
    fontWeight:"500",
    fontSize: 16,
   
  },
})
  