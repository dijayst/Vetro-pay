import { View, Text, StyleSheet, Image, TouchableOpacity,Modal,FlatList } from 'react-native'
import React, { useState } from 'react'
import back from "../../assets/back.png";
import AppText from "../../resources/AppText";
import { useNavigation } from '@react-navigation/native';
import expand_more from "../../assets/expand_more.png";

export default function FXrate() {

  const [selectedValue, setSelectedValue] = useState('USD');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const options = ['USD', 'NGN', 'Pounds',];

  const handleSelect = (value) => {
    setSelectedValue(value);
    setDropdownVisible(false);
  };



  
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}  onPress={() => navigation.goBack()}>
        <Image
          source={back}
          style={styles.backIcon}
         
        />
      </TouchableOpacity>

      <AppText bold styles={styles.titleText}>
        FX Rates
      </AppText>
      <Text  styles={{fontSize:14,fontWeight:"400",color: "#414141",marginTop:4}}>
        Check your airtime and data balance for your phone numbers 
      </Text>
      
      
      <View style={styles.extrasContainer}>
        <View style={{flexDirection:"row",gap:8}}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>P2P</Text>
          <TouchableOpacity>
            <Text style={styles.cardSubtitle}>Peer-to-peer</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>NGN 1,200</Text>
            </View>
           

            <View style={styles.container2}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.dropdownText}>{selectedValue}</Text>
        <Image
        source={expand_more}
        style={{ height: 14, width: 14, resizeMode: "contain",marginLeft:28,marginTop:-13 }}
      />
      </TouchableOpacity>

      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
    
           
          </View>
        </View>

        {/* Duplicate card structure for other entries */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>BDC</Text>
          <TouchableOpacity>
            <Text style={styles.cardSubtitle}>Bureau De Change</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>NGN 1,200</Text>
            </View>
           

            <View style={styles.container2}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.dropdownText}>{selectedValue}</Text>
        <Image
        source={expand_more}
        style={{ height: 14, width: 14, resizeMode: "contain",marginLeft:28,marginTop:-13 }}
      />
      </TouchableOpacity>

      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
           
          </View>
        </View>

        </View>
       
        {/* Additional card for third entry */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FMDQ</Text>
          <TouchableOpacity>
            <Text style={styles.cardSubtitle}>fmdq</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>NGN 1,200</Text>
            </View>
           

            <View style={styles.container2}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.dropdownText}>{selectedValue}</Text>
        <Image
        source={expand_more}
        style={{ height: 14, width: 14, resizeMode: "contain",marginLeft:28,marginTop:-13 }}
      />
      </TouchableOpacity>

      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
           
          </View>
        </View>
      </View>
<TouchableOpacity style={{width:350,height:56,backgroundColor:"#266DDC",paddingTop:15,paddingLeft:154,borderRadius:8,marginTop:220}}><Text style={{color:"#FFFFFF",fontWeight:"600",fontSize:16}}>Done</Text></TouchableOpacity>
          
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor:"#FFFFFF",

  },
  backButton: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 325,
  },
  backIcon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  titleText: {
    marginTop: 16,
    fontSize: 28,
    color: "#121212",
    fontWeight: "500",
  },
  subtitleText: {
    marginTop: 4,
    fontSize: 14,
    color: "#414141",
    fontWeight: "400",
  },
  extrasContainer: {
    flexDirection: "column",
    gap: 4,
    marginTop:40
  },
  card: {
    
    backgroundColor: "#F4F4F4",
    width: 171,
    height: 119,
    gap:8,
    borderRadius:8
  },
  cardTitle: {
    marginTop:16,
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
    marginLeft:10
  },
  cardSubtitle: {
    color: "#414141",
    fontWeight: "400",
    fontSize: 12,
    marginLeft:10
  },
  row: {
    flexDirection: "row",
    justifyContent:"center",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
    
  },
  priceTag: {
    backgroundColor: "#FDEBAB",
    borderRadius: 4,
    height: 30,
    width: 84,
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#836B1A",
  },

  container2: {
    
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  dropdown: {
    width: 53,
    height:20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#E9F0FB',
  },
  dropdownText: {
    fontSize: 10,
    fontWeight:"500",
    color: '#266DDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownList: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});
