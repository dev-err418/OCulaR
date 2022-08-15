import {View, Text, TouchableOpacity, Image, Dimensions} from "react-native";
import {useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {StatusBar} from "expo-status-bar";
import callGoogleVision from "./helperFunctions.js";
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Spinner from 'react-native-loading-spinner-overlay';

const {width, height} = Dimensions.get("window");

// function that will draw green boxes arround each word.
const BoundingBox = ({t, l, b, r, coef}) => {
// adding or removing few pixels to have bigger boxes
   t = Number(parseInt(t*coef)) - 2
   l = Number(parseInt(l*coef)) - 2
   b = Number(parseInt(b*coef)) + 3
   r = Number(parseInt(r*coef)) + 3
   if (t >= 0 && l >= 0 && b >= 0 && r >= 0) { 
      return (
          <View style={{position: "absolute", top: t, left: l, height: b-t, width: r-l, borderWidth: 1, borderColor: "green"}} />
       )
    } else {
       console.log("err2", t, l, b, r)
       return null;
    }
}

const CustomImagePicker = ({onSubmit}) => {
   const [image, setImage] = useState(null);
   const [text, setText] = useState<string>("Add an image");
// the coef is the ratio between the actual image size and the size of the displayed image in the app
   const [coef, setCoef] = useState<number | undefined>(undefined)
   const [positions, setPositions] = useState([])
   const [loading, setLoading] = useState<boolean>(false)
   const navigation = useNavigation()

   const pickImage = async () => {
      var result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
	 base64: true,
      });
      if (!result.cancelled) {
         setImage(result.uri)
	 Image.getSize(result.uri, (w, h) => {
	    if (w > h) {
               // width will be the main parametter => resize mode = contain
	       setCoef((width - 20) / w)
	    } else {
	       const picHeightOnDisplay = (width - 20) * (4/3) 
               setCoef(picHeightOnDisplay/h)
	    }
	 })
	 setText("...")
	 setLoading(true)
	 const googleText = await onSubmit(result.base64);
	 setText(googleText.text)
	 setLoading(false)
         console.log(googleText.boundingBoxes.length)
	 setPositions(googleText.boundingBoxes)
      }
   };

   return (
      <View style={{height: 0.9*height, width: width -20}} >
      <Spinner visible={loading} textStyle={{color: "white"}} overlayColor={"rgba(0, 0, 0, 0.5)"} textContent={"Loading..."} />
	 {image ? (
	    <View style={{height: "100%", width: "100%", justifyContent: "flex-start"}} >
	       <Image
	          source={{uri: image}}
	          style={{backgroundColor: "orange", borderRadius: 10, height: (width-20) * (4/3), width: "100%", resizeMode: "contain"}}
	       />

	   <TouchableOpacity onPress={() => {
	      navigation.navigate("Modal", {text: text})}
	   } style={{bottom: 20, right: 20, height: 50, width: 50, borderRadius: 50, backgroundColor: "black", justifyContent: "center", alignItems: "center", position: "absolute"}}>
              <Text style={{fontSize: 30, fontWeight: "600", color: "white"}} >+</Text>
	   </TouchableOpacity>
	    {positions.map((i, j) => {
               //console.log(i.boundingPoly.vertices)
	       const vertices = i.boundingPoly.vertices;
	       var t, l, r, b;
	       try {
	          t = vertices[0].y;
	          l = vertices[0].x;
	          r = vertices[2].x;
	          b = vertices[2].y;
		 // console.log(t, l, r, b)
	       } catch { return console.log("err") }
	       console.log(t, l, r, b)
	       return (
	          <BoundingBox key={j} coef={coef} t={t} l={l} b={b} r={r} />
	       )
	    })}
	    <TouchableOpacity style={{bottom: 20, backgroundColor: "black", position: "absolute", right: 80, borderRadius: 50, height: 50, justifyContent: "center", alignItems: "center", paddingHorizontal: 20}} onPress={() => {
	       setText("Add an image")
	       setImage(null)
	       setPositions([])
	    }}>
	       <Text style={{color: "white"}}>New photo</Text>
	    </TouchableOpacity>
	 </View>
	 ) : (
            <View style={{height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
	       <TouchableOpacity onPress={() => pickImage()}>
	          <Text>Pick an image</Text>
               </TouchableOpacity>
	    </View>
	 )}
      </View>
   )
}

const App = () => {
   return (
      <View style={{flex:1, justifyContent: "center", alignItems: "center"}} >
         <CustomImagePicker onSubmit={callGoogleVision} />
	 <StatusBar style="dark" />
      </View>
   )
}

const Modal = () => {
   const route = useRoute()
   const text = route.params.text
   const navigation = useNavigation()
   return (
      <View style={{padding: 20}}>
         <View style={{width: width - 40, flexDirection: "row", justifyContent: "space-between"}} >
            <Text style={{fontSize: 20, fontWeight: "600", marginBottom: 20}} >All text found :</Text>
	    <TouchableOpacity onPress={() => navigation.goBack()}>
	       <Text style={{color:"blue"}}>back</Text>
	    </TouchableOpacity>
	 </View>
	 <Text>{text}</Text>
      </View>
   )
}

const Stack = createStackNavigator();

const StackNavigator = () => {
   return (
      <NavigationContainer>
         <Stack.Navigator>
            <Stack.Group>
               <Stack.Screen name="Home" component={App} options={{ headerShown: false }} />
	    </Stack.Group>
	    <Stack.Group screenOptions={{presentation: "modal"}}>
	        <Stack.Screen name="Modal" component={Modal} options={{headerShown: false}} />	
	    </Stack.Group>
         </Stack.Navigator>
      </NavigationContainer>
   )
}

export default StackNavigator;
