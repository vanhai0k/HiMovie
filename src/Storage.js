import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,Image
} from "react-native";
import React, { useEffect,useState } from "react";
import axios from "axios";
import { API } from "../API/API";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Storage = ({ navigation }) => {
  const [data, setdata] = useState([]);

  const [idUser, setidUser] = useState('')
  

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

     const idUser = await getIdUser();
    axios
      .get(API.getWatchMovieLate + idUser)
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getIdUser = async () => {
    try {
      const iduser = await AsyncStorage.getItem('idUser');
      return iduser;
    } catch (error) {
      console.log(error);
    }
  }


  const renderItem = ({ item }) => {

    const StartVideo = () =>{
      navigation.navigate('VideoWatchLate',{
        episodeName : item.idmovie.episodeName,
        video : item.idmovie.video,
        nameMovie: item.name,
      })
    }
    return (
      <View style={{flexDirection:'row',height:'auto'}}>
        <View style={{width:'100%',flexDirection:'row',margin:8}}> 
        <View style={{width:'37%',height:100,}}>
        <TouchableOpacity onPress={StartVideo}>
        <Image
            source={{
              uri: API.getImage + item.image,
            }}
            style={{
              width: "99%",
              height: 200,
              alignSelf: "center",
              marginTop: 3,
              borderRadius: 5,
              position: "absolute",
            }}
          ></Image>
        </TouchableOpacity>
        </View>
        <View style={{padding:10,width:'63%',height:'auto'}}>
        <Text style={{color:'black',fontWeight:'bold',fontSize:17}}> {item.name} </Text>
        <Text style={{color:'black',fontSize:15}}>Tap {item.idmovie.episodeName} </Text>
        <Text style={{fontSize:16}}> {item.directed} </Text>
        <Text style={{color:'red'}}> {item.countView} lượt xem</Text>
        <Text style={{color:'green',fontWeight:'bold',alignSelf:'flex-end'}}>Delete Movie</Text>
        </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{color:'black',fontWeight:'bold',fontSize:20,textAlign:'center',marginTop:34}}
      
      >List Movie Watch Late</Text>
      
      <FlatList
        data={data}
        keyExtractor={(item) => `key-${item.key}`}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Storage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
  },
});
