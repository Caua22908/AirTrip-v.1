import { useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import API_URL from '../../../../conf/api'; // ajuste o caminho conforme a pasta

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  AlterarSenha: undefined;
};

export const useAlterarSenha = () => {
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleAlterarSenha = async () => {
    if (!email || !senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${API_URL}/usuarios/alterar-senha`, {
        email,
        senhaAtual,
        novaSenha,
        confirmarSenha,
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
              }, 1000);
            }
          }
        ]);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        let errorMessage = 'Ocorreu um erro inesperado.';

        switch (status) {
          case 400:
            errorMessage = 'Todos os campos são obrigatórios.';
            break;
          case 404:
            errorMessage = 'Usuário não encontrado.';
            break;
          default:
            errorMessage = data.error || errorMessage;
            break;
        }

        Alert.alert('Erro', errorMessage);
      } else {
        Alert.alert('Erro', 'Falha ao conectar ao servidor. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    senhaAtual,
    setSenhaAtual,
    novaSenha,
    setNovaSenha,
    confirmarSenha,
    setConfirmarSenha,
    loading,
    handleAlterarSenha,
    visibleSnackbar,
    setVisibleSnackbar
  };
};
