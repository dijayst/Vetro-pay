import React,{useState,useRef} from "react";
import { Text, View,FlatList,TouchableOpacity,StyleSheet,Image,Dimensions} from "react-native";
import Carousel from "pinar";
import {Slide} from "./Data";
import {useNavigation} from "@react-navigation/native";


const SCEEN_wIDTH=Dimensions.get('window').width
export default function Slider() {
  const carouselRef = useRef(null);
  
  const [slideindex, setslideindex] = useState(0)
  const [nextdisabled, setnextdisabled] = useState(false)
   


  const handleclick = (index) => {
  
 
       if (index === Slide.length-1 )
         {navigation.navigate("signup") 
        console.log("yeppp")} 
      else{
 
    
   if(carouselRef.current)
   {carouselRef.current.scrollToIndex({index:index+1})
   setslideindex(index+1);
 
 }
   console.log(slideindex)
  
 
     };
     console.log(slideindex)
   }
 
  return(

  <View style={styles.container}>
    <View style={styles.header}>
    <Image source={require("../assets/logo.png")} style={styles.userimage} />
              <Text style={styles.text}>Skip</Text>
    </View>
 

    <FlatList
    ref={carouselRef}
    
    style={{  height:238, marginTop:50, marginLeft:4, gap: 32 }} 
    pagingEnabled
    horizontal
    snapToInterval={SCEEN_wIDTH}
    snapToAlignment='center'
    decelerationRate={'fast'}
    showsHorizontalScrollIndicator={false}
    data={Slide}
    onScroll={Slide=>{
      const offset=Slide.nativeEvent.contentOffset.x/SCEEN_wIDTH;
      const hasDecimal=offset-Math.floor(offset) !==1;
      if(!hasDecimal){
        const newSlide=offset+1
        if(newSlide>=1||newSlide<=Slide.length);
        setnextdisabled(newSlide===Slide.length)

        setslideindex(offset);
      
      }
      console.log("offset",offset);
  }
}
  scrollEventThrottle={0}

      renderItem={({ item, index }) => (
        <View key={item.id}  style={styles.slide1} >
        <View style={{ marginLeft: 21, padding: -2 }}>
        <Image source={item.image} alt="img" style={styles.image}/>
        <View style={styles.dotContainer}>
   {Slide.map((_,index) => (
     <TouchableOpacity
       key={index}
       style={[styles.dot, index === slideindex?styles.activeDot:{}]}  />
   ))}
 </View>   
          <View style={{ marginBottom: 10, height: 40, width: 320 }}>
            <Text  style={styles.text}>{item.title}</Text>
          </View>
  
          <View style={{ width: 349, height: 52 }}>
            <Text style={{ lineHeight: 26, fontSize: 16, fontWeight: 600, }}>{item.description}</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: "Orange", height: 56, width: 350, borderRadius: 8, padding: 10, alignItems: "center", marginTop: 40, gap: 10 }} onPress={() => handleclick(index)}>
            <Text style={{ fontSize: 16, fontWeight: 700, lineHeight: 26,  }}>{item.click}</Text>
          </TouchableOpacity>
        </View>
      </View>
         )}
      
     
    />
 

  
  </View>
)}





const styles = StyleSheet.create({
  header:{
flexDirection:"row",
gap:235,
marginRight:20 , 
marginLeft:20 ,
marginBottom:28,
  },
  text:{
    fontFamily:"inter",
    fontWeight:"700",
    fontSize:16,
    marginTop:20,
    color:"#266DDC"
  },
  
userimage:{
  width:50.17,
  height:64,
},

image:{
width:300,
height:300,
},
  
  dotContainer: {
    flexDirection: 'row',
    gap:8,
    width:112,
    height:8,
    marginTop:80,
    marginLeft:119
   
   
  },
  dot: {
    width:10,
    height:10,
    borderRadius: 8,
    backgroundColor:"#B7CEF3",
   
  },
  activeDot: {
    backgroundColor:"#266DDC",
    width:32, 
    height:8,
    borderRadius: 8,
  },
  Safecontainer:{
    flex:1,
   // backgroundColor:colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
    container: {
     flex: 1,
     paddingTop:16 ,
   backgroundColor:"#FFFFFF",
      alignItems: 'center',
      justifyContent: 'center',
    },
    dotStyle:{
      marginBottom:300,
      width:10,
      height:10,
      borderRadius:8,
     // backgroundColor:colors.GREen,
      

    },


    container1:{
      flex:1,
      alignItems:"center",
      marginRight:5,
      marginLeft:10,
      //height:50,
      //backgroundColor:"red",
      //padding:5,
      //borderRadius:15
          },
          iconcontainer:{
             backgroundColor:"#8E3FFF",
              padding:17,
              borderRadius:99,
              
            },
  })