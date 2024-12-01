import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserContextProvider } from './context/UserContext';
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import { MyProductPage } from './components';
import EggApp from './EggApp/EggApp';
import { ThemeProvider } from './context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BackHandler, Alert } from 'react-native';
import ExitAppModal from './components/ExitAppModal';

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

const App = () => {
  const [modalVisible, setModalVisible] = useState(false)
  useEffect(() => {
    const backAction = () => {
      setModalVisible(true);
      return true;  
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  
    return () => backHandler.remove();
  }, []);

  const handleConfirmExit = () => {
    setModalVisible(false);
    BackHandler.exitApp(); 
  };
  
  const handleCancelExit = () => {
    setModalVisible(false); 
  };

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomePage} />
              <Stack.Screen name="productPage" component={ProductPage} />
              <Stack.Screen name="myProductPage" component={MyProductPage} />
              <Stack.Screen name="EggApp" component={EggApp} />
            </Stack.Navigator>
          </NavigationContainer>

          <ExitAppModal
          isVisible={modalVisible}
          onConfirmExit={handleConfirmExit}
          onCancelExit={handleCancelExit}
        />
        </ThemeProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
};

export default App;
