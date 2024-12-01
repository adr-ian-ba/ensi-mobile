import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

const UserContextProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [myProducts, setMyProducts] = useState([]);
    const [coins, setCoins] = useState(500);
    const [view, setView] = useState('list');

    const saveData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error("Error saving data", e);
        }
    };

    const loadData = async (key, setState) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? setState(JSON.parse(jsonValue)) : null;
        } catch(e) {
            console.error("Error loading data", e);
        }
    };

    useEffect(() => {
        loadData("coins", setCoins);
        loadData("myProducts", setMyProducts);
    }, []);

    useEffect(() => {
        saveData("coins", coins);
        saveData("myProducts", myProducts);
    }, [coins, myProducts]);

    return(
        <UserContext.Provider value={{myProducts, setMyProducts, products, setProducts, coins, setCoins, view, setView}}>
            {props.children}
        </UserContext.Provider>
    );
};

export { UserContext, UserContextProvider };
