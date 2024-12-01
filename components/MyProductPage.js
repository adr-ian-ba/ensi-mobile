import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, FlatList, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const MyProductPage = () => {
  const { myProducts, coins, setCoins, setMyProducts } = useContext(UserContext);
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  const handleSell = (item) => {
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
  };

  const goBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image style={styles.productImage} source={{ uri: item.image }} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>{`$${item.price}`}</Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <TouchableOpacity
        style={[styles.sellButton, { backgroundColor: theme.primary }]}
        onPress={() => handleSell(item)}
      >
        <Text style={styles.sellButtonText}>Sell</Text>
      </TouchableOpacity>
    </View>
  );

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
      {myProducts.length === 0 ? (
        <Text style={styles.noProductsText}>You Have No Products</Text>
      ) : (
        <FlatList
          data={myProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-around',
    paddingLeft: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
  },
  productQuantity: {
    fontSize: 14,
    color: '#555',
  },
  noProductsText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  sellButton: {
    backgroundColor: 'purple',
    borderRadius: 5,
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight:"bold" 
  },
});

export default MyProductPage;
