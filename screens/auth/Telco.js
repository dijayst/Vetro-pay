import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetModalProvider,BottomSheetView } from '@gorhom/bottom-sheet';

// Example image sources (replace these with your actual image imports)
const MTN = require("../../assets/GLO.png");
const GLO = require("../../assets/GLO.png");
const sim_card = require("../../assets/GLO.png");

const Telco = () => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const bottomSheetRef = useRef(null);

  const snapPoints = ['40%',]; // Adjust snap points as needed

  const handleOpen = () => {
    setShowBottomSheet(true);
    bottomSheetRef.current?.present();
  };

  const handleClose = () => {
    setShowBottomSheet(false);
    bottomSheetRef.current?.dismiss();
  };

  const renderContent = () => (
    <View style={styles.contentContainer}>
      <TouchableOpacity style={styles.handle} onPress={handleClose} />
      <Text style={styles.title}>Telco Balance</Text>
      <View style={styles.balanceContainer}>
        <View style={styles.balanceCard}>
          <View style={styles.cardHeader}>
            <Image source={MTN} style={styles.icon} />
            <Text style={styles.phoneNumber}>0801 000 0000</Text>
          </View>
          <View style={styles.simContainer}>
            <Image source={sim_card} style={styles.icon} />
            <Text style={styles.simText}>SIM 1</Text>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonPrimary}>
              <Text style={styles.buttonText}>Check Airtime Balance</Text>
            </View>
            <View style={styles.buttonSecondary}>
              <Text style={styles.buttonTextSecondary}>Check Data Balance</Text>
            </View>
          </View>
        </View>
        <View style={styles.balanceCard}>
          <View style={styles.cardHeader}>
            <Image source={GLO} style={styles.icon} />
            <Text style={styles.phoneNumber}>0801 000 0000</Text>
          </View>
          <View style={styles.simContainer}>
            <Image source={sim_card} style={styles.icon} />
            <Text style={styles.simText}>SIM 2</Text>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonPrimary}>
              <Text style={styles.buttonText}>Check Airtime Balance</Text>
            </View>
            <View style={styles.buttonSecondary}>
              <Text style={styles.buttonTextSecondary}>Check Data Balance</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <BottomSheet
    ref={bottomSheetRef}
          snapPoints={snapPoints}>
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>handleOpen}>
          <Text>Open Bottom Sheet</Text>
        </TouchableOpacity>
        <BottomSheetView
          
          backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
          handleComponent={() => null}
        >
          {renderContent()}
        </BottomSheetView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F9FAFA',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  handle: {
    backgroundColor: '#C0C0C0',
    width: 37,
    height: 5,
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 24,
  },
  balanceContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  balanceCard: {
    height: 110,
    backgroundColor: '#F4F4F4',
    marginTop: 8,
    padding: 20,
    gap: 6,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 62,
  },
  icon: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  phoneNumber: {
    fontSize: 14,
    marginTop: -1,
    color: '#121212',
    fontWeight: '600',
  },
  simContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  simText: {
    fontSize: 10,
    marginTop: 3,
    color: '#266DDC',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: '#266DDC',
    height: 40,
    width: 136,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    height: 40,
    width: 136,
    borderRadius: 4,
    borderColor: '#266DDC',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonTextSecondary: {
    fontSize: 11,
    color: '#266DDC',
    fontWeight: '500',
  },
});

export default Telco;
