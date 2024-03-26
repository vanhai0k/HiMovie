import { View, Text,Dimensions,TouchableOpacity, ScrollView,Image,FlatList } from "react-native";
import React, {useState,useEffect} from "react";
import VideoPlayer from "expo-video-player";
import { API } from "../API/API";
import axios from "axios";

const VideoWatchLate = ({ route,navigation }) => {
  const { episodeName, video, nameMovie } = route.params;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const screenHeght = Dimensions.get('window').height;
  const [data, setdata] = useState([]);
  const [idUser, setidUser] = useState('')

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const enterFullscreen = () => {
    setIsFullscreen(true);
  };
  const exitFullscreen = () => {
    setIsFullscreen(false);
  };
  const handleVideoPress = () => {
    if (isFullscreen) {
      exitFullscreen(); // Thoát fullscreen nếu video đang ở chế độ fullscreen
    } else {
      toggleFullscreen(); // Chuyển chế độ fullscreen nếu video không ở chế độ fullscreen
    }
  };

  

  React.useEffect(() => {
    getIdUser();
    fetchData();
  }, []);

  const fetchData = async () => {
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
      setidUser(iduser);
    } catch (error) {
      console.log(error);
    }
  }

  const renderItem = ({ item }) => {

    const StartVideo = () =>{
      navigation.navigate('ClickVideoLate',{
        episodeName : item.idmovie.episodeName,
        video : item.idmovie.video,
        nameMovie: item.name,
      })
    }
    return (
      <View style={{flexDirection:'row',margin:8}}>
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
        <View style={{padding:10,width:'63%'}}>
        <Text style={{color:'black',fontWeight:'bold',fontSize:17}}> {item.name} </Text>
        <Text style={{fontSize:16}}> {item.directed} </Text>
        <Text style={{color:'red'}}> {item.countView} lượt xem</Text>
        <Text style={{color:'green',fontWeight:'bold',alignSelf:'flex-end'}}>Delete Movie</Text>
        </View>
      </View>
    );
  };


  return (
    <View style={{flexDirection:'column'}}>

<VideoPlayer
        videoProps={{
          shouldPlay: true,
          resizeMode: isFullscreen ? 'cover' : 'contain', 
          source: {
            uri: API.getVideo + video,
          },
        }}
        style={{ 
          width: isFullscreen ? screenWidth : 650, // Sử dụng chiều rộng của màn hình hoặc 650
          height: isFullscreen ? screenHeght : 250, 
        }}
        fullscreen={{ enterFullscreen , exitFullscreen }}
        onPress={handleVideoPress}
      />
      {/* Overlay containing back button */}
      <View style={{ position: 'absolute', top: '13%', left: 12 }}>
        <TouchableOpacity onPress={() => {
          if (isFullscreen) {
            exitFullscreen(); // Thoát fullscreen nếu video đang ở chế độ fullscreen
          } else {
            navigation.goBack();
            // Quay lại màn hình trước đó nếu video không ở chế độ fullscreen
            // navigation.navigate("InfoMovie");
          }
        }}>
          <Text style={{ color: 'white' }}>Back</Text>
        </TouchableOpacity>
      </View>
      {!isFullscreen && (
        <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
          <TouchableOpacity onPress={toggleFullscreen}>
            <Text style={{ color: 'white' }}>Fullscreen</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{flexDirection:'row',margin:8}}>
      <Text style={{fontSize:20,fontWeight:'bold'}}>{nameMovie} </Text>
      <Text style={{fontSize:20,fontWeight:'bold'}}>Tập {episodeName} </Text>
      </View>

        <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,marginTop:8,color:'green'}}>Các video đã lưu</Text>
      <ScrollView style={{width:'100%',height:530,}}>
      <FlatList 
      data={data}
      keyExtractor={(item) => `key-${item._id}`}
      renderItem={renderItem}
      
      />
      </ScrollView>
    </View>
  );
};

export default VideoWatchLate;
