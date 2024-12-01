import React, { useContext, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';



const eggImage = require('../assets/egg-full.png');
const brokenEggImage = require('../assets/egg-broken.png');
const goldCoinImage = require("../assets/gold-coin.png");
const silverCoinImage = require("../assets/silver-coin.png");
const bronzeCoinImage = require("../assets/bronze-coin.png");

const EggApp = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { coins, setCoins } = useContext(UserContext);
  const [isEggBroken, setIsEggBroken] = useState(false);
  const [prize, setPrize] = useState(0);
  const shakeAnimation = useRef(new Animated.Value(0)).current; 

  const prizes = {
    gold: { image: goldCoinImage, value: 100, type: 'Gold' },
    silver: { image: silverCoinImage, value: 50, type: 'Silver' }, 
    bronze: { image: bronzeCoinImage, value: 20, type: 'Bronze' }, 
  };

  const generatePrize = () => {
    const prizePool = [
      ...Array(3).fill(prizes.bronze), 
      ...Array(2).fill(prizes.silver), 
      ...Array(1).fill(prizes.gold), 
    ];
  
    const randomIndex = Math.floor(Math.random() * prizePool.length);
    return prizePool[randomIndex];
  };

  const handleEggPress = () => {
    if (!isEggBroken) {
      const newPrize = generatePrize();
      setPrize(newPrize);
      setCoins(coins + newPrize.value);
      setIsEggBroken(true);
  
      setTimeout(() => {
        setIsEggBroken(false);
        setPrize(0);
      }, 3000); 
    }
  };

  const jiggleEgg = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 20,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -20,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => handleEggPress()); 
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={goBack}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.text } strokeWidth={1.5}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </Svg>
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>My Products</Text>
      </View>
      <View style={styles.coinHeader}>
        <View style={styles.coinItem}>
          <Image source={goldCoinImage} style={styles.coinImage} />
          <Text style={[styles.coinText, { color: theme.text }]}>100</Text>
        </View>
        <View style={styles.coinItem}>
          <Image source={silverCoinImage} style={styles.coinImage} />
          <Text style={[styles.coinText, { color: theme.text }]}>50</Text>
        </View>
        <View style={styles.coinItem}>
          <Image source={bronzeCoinImage} style={styles.coinImage} />
          <Text style={[styles.coinText, { color: theme.text }]}>20</Text>
        </View>
      </View>
      {isEggBroken && prize ? (
        <>
          <Text style={[styles.congrats, { color: theme.text }]}>
            Congratulations!
          </Text>
          <Text style={[styles.coinType, { color: theme.text }]}>
            You got a {prize.type} coin!
          </Text>
        </>
      ) : (
        <Text style={[styles.instructions, { color: theme.text }]}>
          Tap on the egg to get your prize!
        </Text>
      )}

      <TouchableOpacity onPress={jiggleEgg}>
      <Animated.Image
  source={isEggBroken ? brokenEggImage : eggImage}
  style={[
    styles.egg,
    {
      transform: [
        {
          translateX: shakeAnimation
        }
      ]
    }
  ]}
/>
      </TouchableOpacity>
      {isEggBroken && prize && (
        <View style={styles.prizeContainer}>
          <Image source={prize.image} style={styles.coinImage} />

        </View>
      )}
      {isEggBroken && prize && 
        <Text style={[styles.congratsText, { color: theme.text }]}>
          {prize.value} Coins! Have Been Added To Your Balance
        </Text>
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent', 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  instructions: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  egg: {
    width: 150,
    height: 200,
    marginBottom: 30,
  },
  prizeContainer: {
    position: 'absolute', 
    alignItems: 'center',
    justifyContent: 'center', 
    left: 0, 
    right: 0,
    top: "30%", 
    marginTop: -50, 
  },
  coinImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  congratsText: {
    fontSize: 18,
    marginTop: 10,
  },
  coinType: {
    position: 'absolute',
    top: '16%',
    textAlign: 'center',
    width: '100%', 
    fontSize:20,
  },
  congrats: {
    position: 'absolute',
    top: '10%',
    textAlign: 'center',
    width: '100%',
    fontSize:30,
    fontWeight:"bold"
  },
  congratsText:{
    fontWeight:"bold",
    fontSize:20,
    width:300,
    textAlign:"center"
  },
  coinHeader: {
    position:"absolute",
    top:30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap:20,
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  coinImage: {
    width: 30,
    height: 30, 
    resizeMode: 'contain',
  },
  coinText: {
    marginLeft: 4, 
    fontSize: 16, 
  },
});

export default EggApp;
