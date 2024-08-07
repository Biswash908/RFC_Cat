import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CalculatorScreen = ({ totalWeight = 100, initialMeatRatio = 80, initialBoneRatio = 10, initialOrganRatio = 10 }) => {
  const [meatRatio, setMeatRatio] = useState(initialMeatRatio);
  const [boneRatio, setBoneRatio] = useState(initialBoneRatio);
  const [organRatio, setOrganRatio] = useState(initialOrganRatio);
  const [lastEdited, setLastEdited] = useState('organ');
  const [activeBar, setActiveBar] = useState(null);

  useEffect(() => {
    setMeatRatio(initialMeatRatio);
    setBoneRatio(initialBoneRatio);
    setOrganRatio(initialOrganRatio);
  }, [initialMeatRatio, initialBoneRatio, initialOrganRatio]);

  const adjustRatios = (newMeat, newBone, newOrgan, changed) => {
    let total = newMeat + newBone + newOrgan;

    if (total === 100) {
      setMeatRatio(newMeat);
      setBoneRatio(newBone);
      setOrganRatio(newOrgan);
      return;
    }

    let excess = total - 100;

    if (total > 100) {
      switch (changed) {
        case 'meat':
          if (lastEdited === 'bone') {
            newOrgan = Math.max(0, newOrgan - excess);
            if (newOrgan === 0) newBone = Math.max(0, newBone - (excess - newOrgan));
          } else {
            newBone = Math.max(0, newBone - excess);
            if (newBone === 0) newOrgan = Math.max(0, newOrgan - (excess - newBone));
          }
          break;
        case 'bone':
          if (lastEdited === 'meat') {
            newOrgan = Math.max(0, newOrgan - excess);
            if (newOrgan === 0) newMeat = Math.max(0, newMeat - (excess - newOrgan));
          } else {
            newMeat = Math.max(0, newMeat - excess);
            if (newMeat === 0) newOrgan = Math.max(0, newOrgan - (excess - newMeat));
          }
          break;
        case 'organ':
          if (lastEdited === 'meat') {
            newBone = Math.max(0, newBone - excess);
            if (newBone === 0) newMeat = Math.max(0, newMeat - (excess - newBone));
          } else {
            newMeat = Math.max(0, newMeat - excess);
            if (newMeat === 0) newBone = Math.max(0, newBone - (excess - newMeat));
          }
          break;
        default:
          break;
      }
    } else if (total < 100) {
      const shortage = 100 - total;

      switch (changed) {
        case 'meat':
          if (lastEdited === 'bone') {
            newOrgan = Math.min(100, newOrgan + shortage);
          } else {
            newBone = Math.min(100, newBone + shortage);
          }
          break;
        case 'bone':
          if (lastEdited === 'meat') {
            newOrgan = Math.min(100, newOrgan + shortage);
          } else {
            newMeat = Math.min(100, newMeat + shortage);
          }
          break;
        case 'organ':
          if (lastEdited === 'meat') {
            newBone = Math.min(100, newBone + shortage);
          } else {
            newMeat = Math.min(100, newMeat + shortage);
          }
          break;
        default:
          break;
      }
    }

    setMeatRatio(newMeat);
    setBoneRatio(newBone);
    setOrganRatio(newOrgan);
  };

  const handleMeatChange = (value) => {
    const newMeatRatio = Math.min(100, Math.max(0, parseInt(value) || 0));
    setLastEdited('meat');
    adjustRatios(newMeatRatio, boneRatio, organRatio, 'meat');
  };

  const handleBoneChange = (value) => {
    const newBoneRatio = Math.min(100, Math.max(0, parseInt(value) || 0));
    setLastEdited('bone');
    adjustRatios(meatRatio, newBoneRatio, organRatio, 'bone');
  };

  const handleOrganChange = (value) => {
    const newOrganRatio = Math.min(100, Math.max(0, parseInt(value) || 0));
    setLastEdited('organ');
    adjustRatios(meatRatio, boneRatio, newOrganRatio, 'organ');
  };

  const handleInfoPress = () => {
    Alert.alert('Corrector Information', 'Add your explanation here...');
  };

  const calculateCorrection = (correctMeat, correctBone, correctOrgan) => {
    // Calculate actual weights
    const currentMeatWeight = (totalWeight * meatRatio) / 100;
    const currentBoneWeight = (totalWeight * boneRatio) / 100;
    const currentOrganWeight = (totalWeight * organRatio) / 100;

    const desiredMeatWeight = (totalWeight * correctMeat) / 100;
    const desiredBoneWeight = (totalWeight * correctBone) / 100;
    const desiredOrganWeight = (totalWeight * correctOrgan) / 100;

    return {
      meatCorrection: desiredMeatWeight - currentMeatWeight,
      boneCorrection: desiredBoneWeight - currentBoneWeight,
      organCorrection: desiredOrganWeight - currentOrganWeight,
    };
  };

  // Calculate corrections based on each ratio being the correct one
  const meatCorrect = calculateCorrection(80, 10, 10); // Assume meat is correct
  const boneCorrect = calculateCorrection(80, 10, 10); // Assume bone is correct
  const organCorrect = calculateCorrection(80, 10, 10); // Assume organ is correct

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set your meat: bone: organ ratio:</Text>

      <View style={styles.ratioBarContainer}>
        <TouchableOpacity
          style={[styles.ratioBar, { backgroundColor: '#FF6347', flex: meatRatio / 100 }]}
          onPressIn={() => setActiveBar('meat')}
          onPressOut={() => setActiveBar(null)}
        />
        <TouchableOpacity
          style={[styles.ratioBar, { backgroundColor: '#FFD700', flex: boneRatio / 100 }]}
          onPressIn={() => setActiveBar('bone')}
          onPressOut={() => setActiveBar(null)}
        />
        <TouchableOpacity
          style={[styles.ratioBar, { backgroundColor: '#6A5ACD', flex: organRatio / 100 }]}
          onPressIn={() => setActiveBar('organ')}
          onPressOut={() => setActiveBar(null)}
        />
      </View>

      {activeBar && (
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Text>{activeBar.charAt(0).toUpperCase() + activeBar.slice(1)}</Text>
            <View style={styles.pointer} />
          </View>
        </View>
      )}

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Meat</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={meatRatio.toString()}
            onChangeText={handleMeatChange}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Bone</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={boneRatio.toString()}
            onChangeText={handleBoneChange}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Organ</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={organRatio.toString()}
            onChangeText={handleOrganChange}
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Use the corrector to achieve the intended ratio.</Text>
        <TouchableOpacity onPress={handleInfoPress}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>i</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.correctorContainer}>
        <Text style={styles.correctorTitle}>Meat Correct</Text>
        <Text>Bone: {meatCorrect.boneCorrection.toFixed(2)} g</Text>
        <Text>Organ: {meatCorrect.organCorrection.toFixed(2)} g</Text>
      </View>

      <View style={styles.correctorContainer}>
        <Text style={styles.correctorTitle}>Bone Correct</Text>
        <Text>Meat: {boneCorrect.meatCorrection.toFixed(2)} g</Text>
        <Text>Organ: {boneCorrect.organCorrection.toFixed(2)} g</Text>
      </View>

      <View style={styles.correctorContainer}>
        <Text style={styles.correctorTitle}>Organ Correct</Text>
        <Text>Meat: {organCorrect.meatCorrection.toFixed(2)} g</Text>
        <Text>Bone: {organCorrect.boneCorrection.toFixed(2)} g</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  ratioBarContainer: {
    flexDirection: 'row',
    height: 60,
    marginVertical: 15,
    backgroundColor: '#F0F0F0',
  },
  ratioBar: {
    height: '100%',
  },
  popupContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 1,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 0,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    width: '60%',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
  infoIconContainer: {
    marginLeft: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#84DD06',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    color: '#84DD06',
    fontSize: 14,
    fontWeight: 'bold',
  },
  correctorContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#84DD06',
    borderRadius: 5,
  },
  correctorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default CalculatorScreen;
