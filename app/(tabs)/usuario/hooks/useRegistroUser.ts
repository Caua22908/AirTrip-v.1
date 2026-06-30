import { useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {isEmailValid} from '../util/utils';
import API_URL from '../../../../conf/api'; // ajuste o caminho conforme a pasta

type RootStackParamList = {
  Login: undefined;
  CadastroAtendimento: undefined;
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

  if (!photo) {
    Alert.alert('Erro', 'Por favor, selecione uma foto.');
    return;
  }

  setLoading(true);

  try {
    // 1. Buscar todos os usuários
    const usuariosResponse = await axios.get(`${API_URL}/usuarios`);
    const usuarios = usuariosResponse.data;

    // 2. Verificar se já existe um usuário com o mesmo e-mail
    const emailExistente = usuarios.find((u: any) => u.email === email);

    if (emailExistente) {
      Alert.alert('Erro', 'Este e-mail já está cadastrado.');
      setLoading(false);
      return;
    }
// Validação do formato do e-mail
  if (!isEmailValid(email)) {
    Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
    return;
  }
    // 3. Preparar o FormData com a foto e os dados
    const formData = new FormData();
    const filename = photo.split('/').pop() || 'foto.jpg';
    const fileType = filename.split('.').pop();

    formData.append('nome', name);
    formData.append('email', email);
    formData.append('senha', password);
    formData.append('tipoUsuario', '1'); // Cliente
    formData.append('foto', {
      uri: photo,
      name: filename,
      type: `image/${fileType}`,
    } as any);

    // 4. Enviar os dados para o backend
    const response = await axios.post(`${API_URL}/usuario/inserir`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 201) {
      setVisibleSnackbar(true);
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }, 1000);
    } else {
      Alert.alert('Erro', response.data.error || 'Não foi possível criar a conta.');
    }
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    Alert.alert('Erro', 'Falha ao conectar ao servidor.');
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
