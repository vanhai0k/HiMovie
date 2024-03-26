import { View, Text, StyleSheet, TouchableOpacity,Button,TextInput, } from 'react-native'
import React, {useState,useEffect} from 'react'
import axios from 'axios';
import {API} from '../API/API';

const Resgister = ({navigation}) => {

  const [name, setname] = useState('');
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [phone, setphone] = useState('')

  const isValidPhoneNumber = (phoneNumber) => {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng số điện thoại
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
}

    const resgister = async () => {
      if (!name || !email || !password || !phone) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }
    // Kiểm tra định dạng số điện thoại
    if (!isValidPhoneNumber(phone)) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
      return;
  }
        try {
          const response = await axios.post(API.resgister, {
            name,email,password,phone
          });
          if(response.status === 201) {
            alert("Resgister successfully");
            navigation.navigate('Login');
          }else if(response.status === 409){
            alert("Name da ton tai");
          }else if(response.status === 403){
            alert("Email da ton tai");
          }else if(response.status === 404){
            alert("Phone da tai");
          }else{
            alert("Failed to login.")
          }

        } catch (error) {
          console.log(error);
        }
    }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        onChangeText={ (txt)=> setname(txt)}
        value={name}
        style={{width:200,borderRadius:6,height:40,borderWidth:1,paddingLeft:8,marginBottom:15}}
      />
      <TextInput
        placeholder="Email"
        onChangeText={ (txt)=> setemail(txt)}
        value={email}
        style={{width:200,borderRadius:6,height:40,borderWidth:1,paddingLeft:8,marginBottom:15}}
      />
      <TextInput
        placeholder="phone"
        onChangeText={ (txt)=> setphone(txt)}
        value={phone}
        style={{width:200,borderRadius:6,height:40,borderWidth:1,paddingLeft:8,marginBottom:15}}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(txt)=> setpassword(txt)}
        value={password}
        style={{width:200,borderRadius:6,height:40,borderWidth:1,paddingLeft:8,marginBottom:15}}
      />
      <Button title="Login" onPress={resgister} />
    </View>
  )
}

export default Resgister
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });