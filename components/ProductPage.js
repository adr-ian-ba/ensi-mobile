import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { UserContext } from '../context/UserContext';
import { useNavigation} from '@react-navigation/native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const ProductPage = ({ route }) => {
  const { item } = route.params;
  const { coins, setCoins, myProducts, setMyProducts } = useContext(UserContext);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();

  const handleImagePress = () => {
    setModalVisible(true);
  };

  function handlePress() {
    console.log(myProducts);
  }

  function handleBuy() {
    if (coins >= item.price) {
      const newCoins = coins - item.price;
      setCoins(newCoins);
    
      const existingProductIndex = myProducts.findIndex(p => p.id === item.id);
      if (existingProductIndex !== -1) {
        setMyProducts(myProducts.map((p, index) => 
          index === existingProductIndex ? { ...p, quantity: p.quantity + 1 } : p
        ));
      } else {
        const newItem = { id: item.id, title: item.title, image: item.image, price: item.price, quantity: 1 };
        setMyProducts([...myProducts, newItem]);
      }
    
      Alert.alert("Purchase Successful", `You have bought the item! Remaining coins: ${newCoins}`);
    } else {
      Alert.alert("Insufficient Coins", "You do not have enough coins to buy this item.");
    }
  }
  
  
  function handleSell() {
    const existingProductIndex = myProducts.findIndex(p => p.id === item.id);
    if (existingProductIndex !== -1) {
      const newCoins = coins + item.price;
      setCoins(newCoins);
  
      const updatedProducts = [...myProducts];
      if (updatedProducts[existingProductIndex].quantity > 1) {
        updatedProducts[existingProductIndex].quantity -= 1;
      } else {
        updatedProducts.splice(existingProductIndex, 1);
      }
  
      setMyProducts(updatedProducts);
      Alert.alert("Sale Successful", `You have sold the item! New coin balance: ${newCoins}`);
    } else {
      Alert.alert("Item Not Found", "You do not own this item.");
    }
  }
  
  

  const goBack = () => {
    navigation.goBack();
  };

  return (
<View style={styles.page}>
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <TouchableOpacity style={styles.touchable} onPress={goBack}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.text } strokeWidth={1.5}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </Svg>
        </TouchableOpacity>
        <Text
      style={[styles.headerText, { color: theme.text }]}
      numberOfLines={1} 
      ellipsizeMode='tail'
    >{item.title}</Text>
    </View>
    <ScrollView>
      <View style={[styles.content, { backgroundColor: theme.background }]}>
    <TouchableOpacity style={[styles.imageContainer, { borderBottomColor: theme.text }]} onPress={handleImagePress}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>

        <View style={[styles.bundle, { backgroundColor: theme.background }]}>
            <View style={styles.informationBundle}>
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.price, { color: theme.text }]}>Price</Text>
                <Text style={[styles.priceCoins, { color: theme.gray }]}>{item.price} Coins</Text>
                <Text style={[styles.descriptionTitle, { color: theme.text }]}>Description</Text>
                <Text style={[styles.description, { color: theme.gray }]}>{item.description}</Text> 
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.buyButton, { backgroundColor: theme.primary }]} onPress={handleBuy}>
                    <Text style={styles.buyButtonText}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.sellButton, { borderColor: theme.gray }]} onPress={handleSell}>
                    <Text style={[styles.sellButtonText, { color: theme.gray }]}>Sell</Text>
                </TouchableOpacity>
            </View> 
          </View>
    </View>
    </ScrollView>
    

    <Modal
        animationType="slide"
        transparent={true} 
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={1.5}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </Svg>
        </TouchableOpacity>
          <ImageZoom
            cropWidth={windowWidth}
            cropHeight={windowHeight}
            imageWidth={windowWidth}
            imageHeight={windowHeight} 
            enableCenterFocus={false} 
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: windowWidth, height: windowHeight }} 
              resizeMode="contain"
            />
          </ImageZoom>
        </View>
      </Modal>
</View>

  );
};

const styles = StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: '#f2f2f2',
    },
    header: {
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e1e1e1',
    },
    touchable :{
      padding:5
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
      width: '80%',
    },
    content: {
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 16,
    },
    imageContainer: {
      width: '100%', 
      paddingBottom:30,
      borderBottomWidth: 1, 
      borderBottomColor: 'black', 
      alignItems: 'center', 
      marginBottom: 16, 
    },
    image: {
      height: 200, 
      width: '100%',
      resizeMode: 'contain', 
    },
    bundle: {
        flex: 1,
        justifyContent: "space-between",
        alignSelf: 'stretch',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
    },
    informationBundle: {
      alignSelf: 'stretch', 
      marginBottom: 16, 
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    price: {
      fontSize: 20,
      color: '#333',
      fontWeight: 'bold',
      marginBottom: 4,
    },
    priceCoins: {
      fontSize: 18,
      color: '#333',
      marginBottom: 20,
    },
    descriptionTitle: {
      fontSize: 18,
      color: '#333',
      fontWeight: 'bold',
      marginBottom: 4,
    },
    description: {
      fontSize: 16,
      color: '#666',
    },
    buyButton: {
      backgroundColor: '#7e57c2', 
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 32,
      alignSelf: 'stretch', 
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    sellButton: {
        backgroundColor: 'transparent', 
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 32,
        alignSelf: 'stretch', 
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16, 
        borderWidth: 1,
        borderColor: 'gray', 
    },
    buyButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)', 
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 1, 
      padding: 10,
      backgroundColor: 'lightgray', 
      borderRadius: 25,
    },
    closeButtonText: {
      color: 'black',
      fontSize: 18,
    },
  });

export default ProductPage;
