import React, { useEffect, useState } from "react";
import { View, Text,TouchableOpacity,Dimensions, ScrollView,Image,FlatList,StyleSheet, 
  TextInput, ToastAndroid  } from "react-native";
import { API } from "../API/API";
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoPlayer from "expo-video-player";
import axios from "axios";
const StartVideo = ({ route,navigation }) => {
  const { episodeName, videoLink,episodes,directed,countMovie,movieId,_id, image} = route.params;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const screenHeght = Dimensions.get('window').height;
  const [dataComment, setdataComment] = useState([])
  const [contentComment, setcontentComment] = useState('')

  const handleEpisodePress = async (episodeName, videoLink, countMovie) => {
    // Chuyển màn hình và truyền dữ liệu

    try {
      await AsyncStorage.setItem('namemovie', namemovie)
      await AsyncStorage.setItem('directed', directed)
      console.log('Name saved successfully!:'+ namemovie);
    } catch (error) {
      console.log(error.message);
    }

    navigation.navigate('NextFilm', { episodeName, videoLink, episodes, countMovie });
  };


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

  const [namemovie, setnamemovie] = useState('')
  const [directedUser, setdirectedUser] = useState('')
  const [imageMovie, setimageMovie] = useState('')

  useEffect(() => {
    const getName = async () =>{
        try {
            const name = await AsyncStorage.getItem('namemovie');
            if(name !== null){
                setnamemovie(name);
            }
            const nameUser = await AsyncStorage.getItem('directed');
            if(nameUser !== null){
                setdirectedUser(nameUser);
            }
            const imageMovie = await AsyncStorage.getItem('image');
            if(imageMovie !== null){
                setimageMovie(imageMovie);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    
    getName();
    fetchComments();
  },[])
  const fetchComments = async () =>{

    try {
      const response = await axios.get(API.getComment + movieId);
    setdataComment(response.data);
    }
     catch (error) {
      console.log(error);
    }
  }
  const postComment = async () =>{
    try {
      const response = await axios.post(API.postComment + movieId, {
        user_id: "65fe68d35d0a342f3945fc33",
        content: contentComment,
      });

      console.log(response.data);
      fetchComments();
      setcontentComment("");
      return response.data;
      
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const renderComment = ({item}) =>{
    
    return(
      <View style={styles.itemcomment}>
        <Text style={{color:'black',fontWeight:'bold',fontSize:17}}>
            {item.user_id.name}
        </Text>
        <Text style={{color:'#666666'}}>
            {item.content}
        </Text>
      </View>
    )
  }
  const getIdUser = async () => {
    try {
      const iduser = await AsyncStorage.getItem('idUser');
      console.log('====================================');
      console.log("id:", iduser);
      console.log('====================================');
      return iduser;
    } catch (error) {
      console.log(error);
    }
  }

  const postWatchLate = async () =>{
    try {
      const idUser = await getIdUser();
      const responseLate = await axios.post(API.postWatchLate + idUser, {
        idmovie: _id,
        image: imageMovie,
        name: namemovie,
        directed: directedUser,
        countView: countMovie,
      });
      alert("Đã lưu vào xem sau.")
      return responseLate.data;
    } catch (error) {
      if(error.response && error.response.status === 400){
        alert("Phim đã lưu vào danh sách xem sau.")
      }else{
        console.log("Lỗi không xác định:",error);
      }
      throw error;
    }
  }

  return (
    <View style={{backgroundColor:'white',height:'100%'}}>
      <VideoPlayer
        videoProps={{
          shouldPlay: true,
          resizeMode: isFullscreen ? 'cover' : 'contain', 
          source: {
            uri: API.getVideo + videoLink,
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

      <Text style={{fontSize:20,fontWeight:'bold',color:'black'}}
      >{namemovie}
      
      </Text>
      <Text style={{fontSize:20,fontWeight:'bold',color:'black'}}
      >Tập {episodeName}</Text>
      </View>
      <View style={{flexDirection:'row',padding:8,}}>
        <Image style={{width:30,height:30,borderRadius:50}}
         source={require('../assets/kimbo1.jpg')} />
         <Text style={{fontWeight:'bold', fontSize:18,marginLeft:8}}>{directedUser}</Text>
      </View>

 {/* like, xem sau , luu */}
        
        <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center',
          margin:8,
      }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection:'row',backgroundColor:'#f2f2f2',borderRadius:15,
        paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginRight:8}}>
        <Image style={{width:16,height:16,marginRight:8,alignSelf:'center'}}
         source={require('../assets/like.png')} />
         <Text>62,5N</Text>
        </View>
        <View style={{flexDirection:'row',backgroundColor:'#f2f2f2',borderRadius:15,
        paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginRight:8}}>
        <Image style={{width:16,height:16,marginRight:8,alignSelf:'center'}}
         source={require('../assets/view.png')} />
         <Text>
          {countMovie} lượt xem
         </Text>
        </View>
        <TouchableOpacity onPress={postWatchLate}>
        <View style={{flexDirection:'row',backgroundColor:'#f2f2f2',borderRadius:15,
        paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginRight:8}}>
        <Image style={{width:16,height:16,marginRight:8,alignSelf:'center'}}
         source={require('../assets/view.png')} />
         <Text>Xem sau</Text>
        
        </View>
        </TouchableOpacity>
        <View style={{flexDirection:'row',backgroundColor:'#f2f2f2',borderRadius:15,
        paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginRight:8}}>
        <Image style={{width:16,height:16,marginRight:8,alignItems:'center',alignSelf:'center'}}
         source={require('../assets/save.png')} />
         <Text>Lưu</Text>
        </View>
        <View style={{flexDirection:'row',backgroundColor:'#f2f2f2',borderRadius:15,
        paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginRight:8}}>
        <Image style={{width:16,height:16,marginRight:8,alignItems:'center',alignSelf:'center'}}
         source={require('../assets/follow.png')} />
         <Text>Theo dõi</Text>
        </View>
        </ScrollView>
        </View>
        
<ScrollView>
{/* danh sach cac tap */}
<Text style={{fontSize:16,fontWeight:'bold',marginLeft:5}}>OKAMI OTAKU:</Text>
<ScrollView style={{maxHeight: Math.min(140, episodes.length * 32 + 10)}} showsVerticalScrollIndicator={false}>
  <View style={{ flexDirection: "row", backgroundColor:'#1f282d',margin:5,padding:8 }}>
  {episodes.map((episode, index) => (
  <View 
    key={index} 
    style={{
      marginRight: 5, 
      backgroundColor: episode.idEpisodes.statusEpisode === 0 ? '#4c4c4c' : 'red', // Màu nền là '#4c4c4c' nếu statusEpisode là 0, ngược lại là màu đỏ
      borderRadius: 4,
      width: 20,
      paddingLeft: 3,
    }}
  >
    <TouchableOpacity
      onPress={() => {
        console.log("Button pressed!");
        if(episode.idEpisodes.statusEpisode === 1){
          ToastAndroid.show("Phim này đã bị khóa!", ToastAndroid.SHORT);

        }else{
          handleEpisodePress(episode.idEpisodes.episodeName, episode.idEpisodes.video, episode.idEpisodes.countMovie)
        }
      }}
      disabled={episode.idEpisodes.statusEpisode === 1} // Ngăn chặn chuyển trang nếu statusEpisode là 1

    >
      <Text style={{ color: "white" }}>
        {episode.idEpisodes.episodeName}
      </Text>
    </TouchableOpacity>
  </View>
))}

  </View>
</ScrollView>

{/* binh luan */}

      <View style={{height:320,backgroundColor:'#f2f2f2',borderRadius:15,margin:10}}>
        <View style={{flexDirection:'row',marginLeft:8,marginRight:8,marginTop:8}}>
        <Text style={{fontWeight:'bold'}}>Bình luận</Text>
        <Text style={{color:'gray'}}> 132</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <TextInput placeholder="Content ..." onChangeText={(txt) => setcontentComment(txt)}
          style={styles.inputComment}
          />
          <TouchableOpacity onPress={postComment}
          style={{backgroundColor:'#3399FF',width:'21%',height:40,margin:8}}>
            <Text style={{color:'white',fontSize:17,textAlign:'center',marginTop:7}}>Send</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',margin:8}}>
        <FlatList 
        data={dataComment}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderComment}
        />
        </View>

      </View>
</ScrollView>
    </View>
  );
};

export default StartVideo;

const styles = StyleSheet.create({
  itemcomment:{
    backgroundColor:'#FFFFFF',
    padding:10,
    marginBottom:8,
    marginLeft:8,marginRight:8,
    borderTopRightRadius:10,
  },
  inputComment:{
    backgroundColor:'#FFFFFF',
    height:40,width:'70%',
    padding:8,margin:8
  }
})
