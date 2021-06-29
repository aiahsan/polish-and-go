import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import MainScreen from './Source/Screens/MainScreen';
import UserContext from './Source/context/context';
import { NavigationContainer } from '@react-navigation/native';
import LoginStack from './Source/Screens/loginNavigation'
import * as Permissions from "expo-permissions";
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants';
import {repository} from './Source/utils/repository'

export default function MyApp() {
  const [user, setUserstate] = useState(null);
  const [promoCode, setPromoCode] = useState(null);


  const getUsetType=()=>{

    if(user && user != null && user.UserRoleId==1)
    {
      return 
    }
  }
  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStaus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStaus = status;
      }

      if(finalStaus!="granted")
      {
        alert("Failed to get Permissions for notifications");
        return
      }

      token=(await Notifications.getExpoPushTokenAsync()).data;
      if(user!=null)
      {
        
        const datas=JSON.parse(user);
        console.log(datas.Id)
        datas.Token=token;
      const {status}=  await repository.updateUser(datas.Id,datas).then(x=>x).then(x=>x).catch(e=>alert(e));
     
    }
      
    }
    else
    {

    }

  }
  useEffect(() => {
    handleSetUser();
    registerForPushNotificationsAsync();
  }, []);
  const handleSetUser = async () => {
    try {
      const userx = await AsyncStorage.getItem('user');
      if (userx || userx != null) {
        setUserstate(JSON.parse(userx));

      }
      else {
      }

    }
    catch
    {

    }


  }
  return (
    <UserContext.Provider value={{ user, setUserstate, promoCode, setPromoCode }}>
      <NavigationContainer>
        {
          (user && user != null ? <MainScreen /> : <LoginStack />)
        }
      </NavigationContainer>

    </UserContext.Provider>

  )
}

