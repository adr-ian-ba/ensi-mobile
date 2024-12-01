import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';

const ProductItem = ({ item }) => {
    const {view} = useContext(UserContext)
    const navigation = useNavigation();

    const handleProductPress = () => {     
        if (item) {
          navigation.navigate('productPage', { item });
        } else {
          console.log('Item is undefined');
        }
      };

  return (
    <TouchableOpacity onPress={handleProductPress} style={view === 'list' ? styles.productItem : styles.productItemGrid}>
      <Image style={styles.productImage} source={{ uri: item.image }} />
      <View style={view === 'list' ? styles.productDetails : styles.productDetailsGrid}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>{`$${item.price}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    productItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
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
      productItemGrid: {
        backgroundColor: '#fff',
        padding: 16,
        margin: 8,
        flex: 1 / 2,
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
        width: 100,
        height: 100,
        borderRadius: 10,
      },
      productDetails: {
        flex: 1,
        justifyContent: 'space-around',
        paddingLeft: 16,
      },
      productDetailsGrid: {
        flex: 1,
        justifyContent: 'space-around',
        paddingLeft: 0,
        paddingTop:10,
      },
      productTitle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      productPrice: {
        fontSize: 14,
        color: '#555',
      },
});

export default ProductItem;
