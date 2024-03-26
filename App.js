import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/Login";
import Resgister from "./src/Resgister";
import Bottomnaviga from "./src/Bottomnaviga";
import InfoMovie from "./src/InfoMovie";
import StartVideo from "./src/StartVideo";
import NextFilm from "./src/NextFilm";
import ListComment from "./src/ListComment";
import VideoWatchLate from "./src/VideoWatchLate";
import ClickVideoLate from "./src/ClickVideoLate";
import InfoMe from "./src/InfoMe";

const StackDemo = createNativeStackNavigator();

export default function App() {
  return (

<NavigationContainer>
    <StackDemo.Navigator  initialRouteName='Login' screenOptions={{ headerShown: false }} >
      <StackDemo.Screen name='Bottomnaviga' component={Bottomnaviga} options={ {title:'Thư mục',tabBarBadge: false}} />
      <StackDemo.Screen name='Login' component={Login} options={ {title:'Login'}} />
      <StackDemo.Screen name='Resgister' component={Resgister} options={ {title:'Resgister'}} />
      <StackDemo.Screen name='InfoMovie' component={InfoMovie} options={ {title:'Resgister'}} />
      <StackDemo.Screen name='StartVideo' component={StartVideo} options={ {title:'Resgister'}} />
      <StackDemo.Screen name='NextFilm' component={NextFilm} options={ {title:'Resgister'}} />
      <StackDemo.Screen name='ListComment' component={ListComment} options={ {title:'Resgister'}} />
      <StackDemo.Screen name='VideoWatchLate' component={VideoWatchLate} options={ {title:'Resgister'}} />
      <StackDemo.Screen name='ClickVideoLate' component={ClickVideoLate} options={ {title:'Resgister'}} />
      <StackDemo.Screen name='InfoMe' component={InfoMe} options={ {title:'Resgister'}} />


{/* viết tiếp các màn hình khác vào đây */}
    </StackDemo.Navigator>
</NavigationContainer>

  );
}
