import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {isEmailValid} from '../util/utils';
import API_URL from '../../../../conf/api'; // ajuste o caminho conforme a pasta

type RootStackParamList = {
  Login: undefined;
  RegistroSuccess: undefined;
};

export const useRegistroUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

const handleRegister = async (photo: string | null) => {
  if (!name || !email || !password) {
    Alert.alert('Erro', 'Todos os campos são obrigatórios.');
    return;
  }

  if (!isEmailValid(email)) {
    Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
    return;
  }

  setLoading(true);

  try {
    // A API valida unicidade do e-mail e retorna 409 quando necessário.
    const formData = new FormData();
    const filename = photo ? photo.split('/').pop() || 'foto.jpg' : 'foto.jpg';
    const fileType = filename.split('.').pop() || 'jpg';

    formData.append('nome', name);
    formData.append('email', email);
    formData.append('senha', password);
    formData.append('tipoUsuario', '1'); // Cliente
    if (photo) {
      if (Platform.OS === 'web') {
        const imageResponse = await fetch(photo);
        const imageBlob = await imageResponse.blob();
        const blobExtension = imageBlob.type.split('/')[1] || fileType;
        formData.append('foto', imageBlob, `foto-${Date.now()}.${blobExtension === 'jpeg' ? 'jpg' : blobExtension}`);
      } else {
        formData.append('foto', {
          uri: photo,
          name: filename,
          type: `image/${fileType}`,
        } as any);
      }
    }

    // 4. Enviar os dados para o backend
    const response = await axios.post(`${API_URL}/usuario/inserir`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10000,
    });

    if (response.status >= 200 && response.status < 300) {
      navigation.reset({ index: 0, routes: [{ name: 'RegistroSuccess' }] });
    } else {
      Alert.alert('Erro', response.data?.error || 'Não foi possível criar a conta.');
    }
  } catch (error: any) {
    console.error('Erro ao cadastrar usuário:', error);
    const message = error.code === 'ECONNABORTED'
      ? 'O servidor demorou para responder. Verifique se o back-end está rodando.'
      : error.response?.data?.erro || 'Falha ao conectar ao servidor.';
    Alert.alert('Erro', message);
  } finally {
    setLoading(false);
  }
};


  const irParaLogin = () => {
    navigation.navigate('Login');
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    photo,
    setPhoto,
    loading,
    visibleSnackbar,
    setVisibleSnackbar,
    handleRegister,
    irParaLogin,
  };
};
