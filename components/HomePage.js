import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image } from 'react-native';
import { UserContext } from '../context/UserContext'; 
import { Svg, Path } from 'react-native-svg';
import ProductItem from './ProductItem';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

const HomePage = () => {
  const navigation = useNavigation();

  const [query, setQuery] = useState('');
  // const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const { view, setView, coins, setProducts, products } = useContext(UserContext);
  const [isFocused, setIsFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [toggle, setToggle] = useState(false)

  const handleToggleTheme = () => {
    toggleTheme(); 
    setToggle(!toggle)
  };

  const showIcon = !isFocused && query.length === 0;

  const fetchProducts = async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { isLoading, error, data } = useQuery({ 
    queryKey: ['products'], 
    queryFn: fetchProducts 
  });


  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data, setProducts]);

  const handleViewToggle = () => {
    setView(view === 'list' ? 'grid' : 'list');
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully.');
    } catch (error) {
      console.error('Error clearing AsyncStorage: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <ProductItem 
      item={item} 
      viewStyle={view} 
    />
  );

  const lightIcon = (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" width="24" height="24">
      <Path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </Svg>
  );
  
  const darkIcon = (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" width="24" height="24">
      <Path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </Svg>
  );


  const handleButtonClick = () => {
    navigation.navigate('myProductPage');
  };

  function openEggApp(){
    navigation.navigate('EggApp');
  }

  if (isLoading) {
    return <View style={styles.centered}>
        <Image style={styles.logo} source={require('../assets/logo-storegg.png')}/>
      </View>;
  }

  if (error) {
    return <View style={styles.centered}><Text>Error: {error}</Text></View>;
  }


  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
    <View style={styles.myCoins}>
      <Text style={[styles.myCoinsCoin, { color: theme.primary }]}>{coins.toFixed(2)}</Text>
      <Text style={styles.myCoinsText}>My Coins</Text>
    </View>
    <TouchableOpacity style={[styles.myEggs, { backgroundColor: theme.background }]} onPress={openEggApp}>
      <Image style={styles.eggImage} source={require('../assets/egg-full.png')} />
    </TouchableOpacity>
    <View style={styles.top}>
      <View style={styles.inputContainer}>
        {showIcon && (
          <Svg
            style={styles.iconStyle}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            width={24}
            height={24}
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </Svg>
        )}
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(query.length > 0)}
        />

      </View >

      <View style={styles.buttonBundle}>
        <TouchableOpacity style={styles.cart} onPress={handleButtonClick}>
          <Text style={styles.buttonText}>My Products</Text>
          <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" width={20} height={20}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleTheme}>
          <View>
            {toggle ? lightIcon : darkIcon}
          </View>
        </TouchableOpacity>
      </View>

    </View>



    <View style={[styles.products, { backgroundColor: theme.background }]} >
      <View style={styles.separator}></View>
      <View style={styles.topbundle}>
        <Text style={[styles.header, { color: theme.text }]}>Available Products</Text>

        <TouchableOpacity onPress={handleViewToggle}>
          {view ? (
            <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke={theme.text}>
              <Path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
            </Svg>

          ) : (
          <Svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width="24" height="24"  stroke={theme.text}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </Svg>
          )}
        </TouchableOpacity>

      </View>

      <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      numColumns={view === 'grid' ? 2 : 1}
      key={view} 
    />

    </View>

    <StatusBar style="auto" />
  </View>
  );
};

const styles = StyleSheet.create({
  logo:{
    width:100,
    height:100  
  },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    myCoins: {
      backgroundColor: "white",
      position: "absolute",
      top: 95,
      left: "55%",
      paddingVertical: 10,
      paddingHorizontal: 25,
      zIndex: 1,
      borderRadius: 8, 
    
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    
      elevation: 5,
    },
    myCoinsCoin:{
      textAlign: 'right',
      fontSize:30,
      fontWeight:"bold",
      color:"#ae00ff",
      marginBottom:3,
    },
    myCoinsText:{
      textAlign: 'right'
    },
    myEggs: {
        backgroundColor: "white", 
        position: "absolute",
        bottom: "5%",
        right: "10%",
        height: 65,
        width: 65,
        zIndex: 1,
        borderRadius: 32.5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8, 
        shadowRadius: 12, 
        elevation: 4,
    },
    eggImage: {
        width: 40,
        height: 40,
    },
    container: {
      flex: 1,
      backgroundColor: "#a688c2",
    },
    top: {
      padding: 20,
    },
    input: {
      backgroundColor: "white",
      color: "gray",
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
      height:40
    },
    buttonBundle:{
      flexDirection:"row",
      alignItems:"center",
      gap:15
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
    },
    iconStyle: {
      position: 'absolute',
      left: 10,
      top:8,
      zIndex: 1,
    },
    input: {
      flex: 1,
      paddingLeft: 35, 
      backgroundColor: "white",
      color: "gray",
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
      height:40
    },
    cart: {
      display:"flex",
      flexDirection:"row",
      alignSelf: 'flex-start',
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      minWidth: 100,
    },
    buttonText: {
      color: 'black',
    },
    products: {
      flex: 1,
      backgroundColor: "white",
      paddingLeft: 20,
      paddingRight:20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    topbundle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom:10,
    },
    separator:{
      height:40,
    },
    header: {
      fontWeight: 'bold',
      fontSize: 27,
    },
    placeholder: {
      backgroundColor: "orange",
    },
  });

export default HomePage;
