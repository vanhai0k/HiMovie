import { StyleSheet, Text, View,Alert,Button,TextInput } from 'react-native'
import React, {useState,useEffect} from 'react'
import axios from 'axios';
import {API} from '../API/API'
import AsyncStorage from '@react-native-async-storage/async-storage';


const InfoMe = ({navigation}) => {

  const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');



    const getIdUser = async () => {
      try {
        const iduser = await AsyncStorage.getItem('idUser');
        return iduser;
      } catch (error) {
        console.log(error);
      }
    }
    const getuserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if(userData != null){
          const parsedUser = JSON.parse(userData);
          setName(parsedUser.name || '');
          setEmail(parsedUser.email || '');
          setPhone(parsedUser.phone || '');
        }
      } catch (error) {
        console.log(error);
      }
    }

    const updateUser = async () => {
      try {
        const iduser = await getIdUser();
          const response = await axios.put(API.updateUser + iduser, { name, email, phone });
          Alert.alert('Thông báo', response.data.message);
      } catch (error) {
          Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi cập nhật thông tin người dùng');
          console.error(error);
      }
  };
  const logout = () =>{
    navigation.navigate('Login')
  }

  useEffect(()=>{
    getuserData();
  },[]);

  return (
    <View style={styles.container}>
      <TextInput
                placeholder="Tên"
                value={name}
                onChangeText={(txt) => setName(txt)}
                style={{width:200,borderRadius:6,height:40,borderWidth:1,paddingLeft:8,marginBottom:15}}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(txt) => setEmail(txt)}
                style={{width:200,borderRadius:6,height:40,borderWidth:1,paddingLeft:8,marginBottom:15}}
            />
            <TextInput
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={(txt) => setPhone(txt)}
                style={{width:200,borderRadius:6,height:40,borderWidth:1,paddingLeft:8,marginBottom:15}}
            />
            <Button title="Cập nhật người dùng" onPress={updateUser} />
            <View style={{marginTop:50}}>
            <Button  title="Dang xuat" onPress={logout} />
            </View>
            
    </View>
  )
}

export default InfoMe

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});