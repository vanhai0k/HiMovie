import { View, Text, StyleSheet, TouchableOpacity,TextInput,
  Button,Alert, Linking, } from 'react-native'
import React,{useState,useEffect} from 'react'
import { API } from "../API/API";
import axios from "axios";
// import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CheckBox} from 'react-native-elements'
const disableAlert = true;
const Login = ({navigation}) => {

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const fetchSavedCredentials = async () => {
        try {
            const savedUsername = await AsyncStorage.getItem("username");
            const savedPassword = await AsyncStorage.getItem("password");
            if (savedUsername && savedPassword) {
                setName(savedUsername);
                setPassword(savedPassword);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to fetch saved credentials');
        }
    };
    const fetchSavedRememberMe = async () => {
      try {
          const rememberMeValue = await AsyncStorage.getItem("rememberMe");
          if (rememberMeValue === "true") {
              setRememberMe(true);
          } else {
              setRememberMe(false);
          }
      } catch (error) {
          console.log(error);
      }
  };

  fetchSavedRememberMe();

    fetchSavedCredentials();
}, []);

  const dangky = () =>{
    navigation.navigate('Resgister')
  }

  const loginUser = async () => {
    try {
      const response = await axios.post(API.login, {
        name,
        password,
      });
      if (response.status === 201) {
        const userData = response.data;
        if(userData.roles === 'user'){
           alert( 'Login successful');

           try {
            await AsyncStorage.setItem("idUser", userData._id);
            await AsyncStorage.setItem("userData", JSON.stringify(userData))
            if (rememberMe) {
              await AsyncStorage.setItem("username", name);
              await AsyncStorage.setItem("password", password);
          } else {
              // Nếu rememberMe không được chọn, xóa thông tin đã lưu từ AsyncStorage
              await AsyncStorage.removeItem("username");
              await AsyncStorage.removeItem("password");
          }
           } catch (error) {
            console.log(error);
           }

          navigation.navigate('Bottomnaviga');
        } else if(userData.roles === 'admin'){
          alert( 'Bạn không có quyền truy cập vào đây.');
        }
        // Redirect or navigate to another screen
      } else if(response.status === 404){
        alert("Tài khoản không tồn tại");
      } else if(response.status === 403){
        alert("Sai mật khẩu.")
      }
      else {
         alert('Error', 'Failed to login');
      }
  }
  catch (error) {
      console.error('Error:', error);
      if (!disableAlert) {
        alert('Đăng nhập thất bại');
    }
    }
  };
  // Hàm để kiểm tra xem ứng dụng Momo đã được cài đặt hay chưa
const isMomoInstalled = async () => {
  const url = 'momo://';
  return Linking.canOpenURL(url);
};


// Hàm để mở ứng dụng Momo
const openMomoPayment = async (amount, info) => {
  const isInstalled = await isMomoInstalled();
  if (isInstalled) {
    // Thay 'payment-url' bằng deep link cụ thể đến phần thanh toán trong ứng dụng Momo (nếu có)
    const paymentUrl = `momo://payment-url?amount=${amount}&info=${info}`;

    Linking.openURL(paymentUrl);
  } else {
    // Xử lý trường hợp ứng dụng Momo chưa được cài đặt
    alert("Thông báo", "Ứng dụng Momo chưa được cài đặt.");
  }
};



// Số tiền cần thanh toán
const amountToPay = 1000;
const paymentInfo = "Thông tin giao dịch";
// Gọi hàm để mở ứng dụng Momo khi người dùng click vào một nút hoặc sự kiện khác





  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        onChangeText={ (txt)=> setName(txt)}
        value={name}
        style={{width:200,borderRadius:6,height:40,borderWidth:1,paddingLeft:8,marginBottom:15}}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(txt)=> setPassword(txt)}
        value={password}
        style={{width:200,borderRadius:6,height:40,borderWidth:1,paddingLeft:8,marginBottom:15}}
      />


<View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
        title='Remember'
        checked={rememberMe}
        onPress={() => setRememberMe(!rememberMe)}
        />
      </View>


      <Button title="Login" onPress={loginUser} />

      <TouchableOpacity style={{marginTop:30}}
       onPress={dangky}>
        <Text style={{color:'red',fontSize:18}}>Resgister</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{marginTop:30}}
       onPress={()=> openMomoPayment(amountToPay,paymentInfo)}>
        <Text style={{color:'red',fontSize:18}}>Momo</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Login
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });