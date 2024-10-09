import { CameraView, cameraType, useCameraPermissions } from "expo-camera";
import React, { useState, useRef } from "react";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";

export default function App() {
  const cameraRef = useRef();
  const [permissions, requestPermissions] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState(undefined);

  if (!permissions) {
    return <Text>Requesting permissions...</Text>;
  }

  if (!permissions.granted) {
    return (
      <View>
        <Text>Camera permissions are needed</Text>
        <Button title="Grand permissions" onPress={requestPermissions} />
      </View>
    );
  }

  const toggleCamera = () => {
    setFacing((current) => (current == "back" ? "front" : "back"));
  };

  const takePic = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    const savePic = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    const sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />

        <Button title="Save" onPress={savePic} />
        <Button title="Share" onPress={sharePic} />
        <Button
          title="Discard"
          onPress={() => {
            setPhoto(undefined);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <CameraView style={styles.container} facing={facing} ref={cameraRef}>
      <TouchableOpacity style={styles.touchable} onPress={toggleCamera}>
        <Text style={styles.touchableText}>Cambiar de camara</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchable} onPress={takePic}>
        <Text style={styles.touchableText}>Take pic</Text>
      </TouchableOpacity>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchable: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  touchableText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
