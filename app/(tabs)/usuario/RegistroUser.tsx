import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles/RegistroUserStyles';
import { useRegistroUser } from '././hooks/useRegistroUser';
import * as ImagePicker from 'expo-image-picker';

export default function RegistroUser() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    visibleSnackbar,
    setVisibleSnackbar,
    handleRegister,
    irParaLogin,
  } = useRegistroUser();

  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    Alert.alert(
      "Foto de Perfil",
      "Escolha uma opção",
      [
        {
          text: "Tirar Foto",
          onPress: async () => {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            if (!cameraPermission.granted) {
              alert("Permissão da câmera é necessária!");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              setPhoto(uri);
            }
          },
        },
        {
          text: "Escolher da Galeria",
          onPress: async () => {
            const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!galleryPermission.granted) {
              alert("Permissão de acesso à galeria é necessária!");
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              setPhoto(uri);
            }
          },
        },
        { text: "Cancelar", style: "cancel" }
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient
      colors={['#8B4513', '#D2B48C', '#FFF8E1']}
      style={styles.container}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.imageWrapper}>
              <Image source={require('../../../assets/images/AirTrip.png')} style={styles.image} />
            </View>
            <Text style={styles.brand}>AirTrip</Text>
          </View>

          <Text style={styles.title}>Criar Conta</Text>

          <TextInput
            label="Nome"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            outlineColor="#A67B5B"
            activeOutlineColor="#5D4037"
            theme={{ roundness: 10 }}
          />

          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="email" />}
            outlineColor="#A67B5B"
            activeOutlineColor="#5D4037"
            theme={{ roundness: 10 }}
          />

          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            outlineColor="#A67B5B"
            activeOutlineColor="#5D4037"
            theme={{ roundness: 10 }}
          />

          <Text style={{ textAlign: 'center', marginBottom: 8, color: '#5D4037' }}>
            Clique na imagem para mudar a foto de perfil
          </Text>

          <View style={styles.photoContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={photo ? { uri: photo } : require('../../../assets/images/user-placeholder.png')}
                style={styles.photo}
              />
            </TouchableOpacity>

            {photo && (
              <Button
                mode="outlined"
                onPress={() => setPhoto(null)}
                style={{ marginTop: 10 }}
                textColor="#8B4513"
                icon="close"
              >
                Remover Foto
              </Button>
            )}
          </View>

          <Button
            mode="contained"
            onPress={() => handleRegister(photo)}
            style={styles.button}
            contentStyle={{ paddingVertical: 8 }}
            loading={loading}
            disabled={loading}
          >
            Cadastrar
          </Button>

          <Snackbar
            visible={visibleSnackbar}
            onDismiss={() => setVisibleSnackbar(false)}
            duration={Snackbar.DURATION_SHORT}
          >
            Conta criada com sucesso!
          </Snackbar>

          <Text style={styles.link} onPress={irParaLogin}>
            Já tem uma conta? Faça login
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
