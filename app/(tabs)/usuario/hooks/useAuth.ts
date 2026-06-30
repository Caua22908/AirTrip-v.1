import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import API_URL from '../../../../conf/api'; // ajuste o caminho conforme a pasta

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  const handleLogin = async (email: string, senha: string, navigation: any) => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, {
        email,
        senha,
      });

      const usuario = response?.data?.usuario;

      if (!usuario) {
        throw new Error('Resposta da API está vazia ou mal formatada.');
      }

      const {
        id,
        email: userEmail,
        nome,
        tipoUsuario,
        foto,
      } = usuario;

      console.log('Usuário recebido:', usuario);

      // Validação mínima dos dados antes de salvar
      if (!id || !userEmail || !nome || tipoUsuario === undefined) {
        throw new Error('Dados do usuário incompletos na resposta da API.');
      }

      // Armazenar no AsyncStorage
      await AsyncStorage.multiSet([
        ['userId', id.toString()],
        ['nome', nome],
        ['userEmail', userEmail],
        ['userType', tipoUsuario.toString()],
        ['userPhoto', foto || ''],
      ]);
      // Verificar os valores salvos
      const chaves = ['userId', 'nome', 'userEmail', 'userType', 'userPhoto'];
      const valores = await AsyncStorage.multiGet(chaves);

      console.log('✅ Verificação pós-salvamento das variáveis de ambiente:');
      valores.forEach(([chave, valor]) => {
        console.log(`${chave}: ${valor}`);
      });
      const fotoSalva = await AsyncStorage.getItem('userPhoto');
      console.log('Foto salva no AsyncStorage:', fotoSalva);

      setVisibleSnackbar(true);

      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }, 1000);

    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Erro', error.response.data.error || 'E-mail ou senha inválidos!');
      } else if (error.request) {
        Alert.alert('Erro', 'Falha ao conectar ao servidor. Verifique sua conexão.');
      } else {
        Alert.alert('Erro', error.message || 'Erro inesperado ao fazer login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    visibleSnackbar,
    setVisibleSnackbar,
    handleLogin,
  };
};
