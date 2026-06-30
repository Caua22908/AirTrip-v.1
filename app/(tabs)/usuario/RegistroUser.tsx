import React, { useState } from 'react';
import {
  View,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
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
    handleRegister,
    irParaLogin,
  } = useRegistroUser();

  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    Alert.alert(
      'Foto de Perfil',
      'Escolha uma opção',
      [
        {
          text: 'Tirar Foto',
          onPress: async () => {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            if (!cameraPermission.granted) {
              alert('Permissão da câmera é necessária!');
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
          text: 'Escolher da Galeria',
          onPress: async () => {
            const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!galleryPermission.granted) {
              alert('Permissão de acesso à galeria é necessária!');
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
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient
      colors={['#1a0d8d', '#2d1a9f', '#3d25b0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <LinearGradient
                colors={['rgba(0, 212, 255, 0.2)', 'rgba(0, 212, 255, 0.05)']}
                style={styles.logoBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image
                  source={require('../../../assets/images/AirTrip.png')}
                  style={styles.logo}
                />
              </LinearGradient>
            </View>
            <Text style={styles.brandText}>AirTrip</Text>
            <View style={styles.headerDivider} />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>
              Preencha seus dados para iniciar sua jornada com a AirTrip.
            </Text>
          </View>

          <Surface style={styles.formContainer} elevation={2}>
            <TextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="account" color="#00d4ff" />}
              outlineColor="rgba(0, 212, 255, 0.3)"
              activeOutlineColor="#00d4ff"
              theme={{
                colors: {
                  text: '#fff',
                  placeholder: '#9ab8d9',
                  primary: '#00d4ff',
                  background: 'transparent',
                },
              }}
            />

            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="email" color="#00d4ff" />}
              outlineColor="rgba(0, 212, 255, 0.3)"
              activeOutlineColor="#00d4ff"
              theme={{
                colors: {
                  text: '#fff',
                  placeholder: '#9ab8d9',
                  primary: '#00d4ff',
                  background: 'transparent',
                },
              }}
            />

            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="lock" color="#00d4ff" />}
              outlineColor="rgba(0, 212, 255, 0.3)"
              activeOutlineColor="#00d4ff"
              theme={{
                colors: {
                  text: '#fff',
                  placeholder: '#9ab8d9',
                  primary: '#00d4ff',
                  background: 'transparent',
                },
              }}
            />

            <Text style={styles.photoLabel}>Foto de perfil (opcional)</Text>
            <Text style={styles.photoHelpText}>
              Toque na imagem para escolher ou tirar uma foto.
            </Text>

            <View style={styles.photoContainer}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <Image
                  source={photo ? { uri: photo } : require('../../../assets/images/user-placeholder.png')}
                  style={styles.photo}
                />
              </TouchableOpacity>

              {photo && (
                <Button
                  mode="outlined"
                  onPress={() => setPhoto(null)}
                  style={styles.removePhotoButton}
                  textColor="#00d4ff"
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
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </Button>
          </Surface>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={irParaLogin}>
              <Text style={styles.registerLink}> Faça login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
