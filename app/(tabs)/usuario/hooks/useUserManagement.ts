import { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import API_URL from '../../../../conf/api'; // ajuste o caminho conforme a pasta

interface User {
  id?: string;
  nome: string;
  senha: string;
  tipoUsuario: number;
  email: string;
  foto?: string;
}

const useUserManagement = () => {
  const [visible, setVisible] = useState({
    addUser: false,
    editUser: false,
    deleteUser: false,
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    nome: '',
    senha: '',
    tipoUsuario: 0,
    email: '',
    foto: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  // Filter users based on the search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.nome.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.senha.toLowerCase().includes(query) ||
      user.tipoUsuario.toString().includes(query)
    );
  });

  const pickUserImage = async () => {
    Alert.alert(
      "Foto de Perfil",
      "Escolha uma opção",
      [
        {
          text: "Tirar Foto",
          onPress: async () => {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            if (!cameraPermission.granted) {
              Alert.alert("Permissão necessária", "Permissão da câmera é necessária!");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              setUserPhoto(uri);
            }
          },
        },
        {
          text: "Escolher da Galeria",
          onPress: async () => {
            const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!galleryPermission.granted) {
              Alert.alert("Permissão necessária", "Permissão de acesso à galeria é necessária!");
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });

            if (!result.canceled) {
              const uri = result.assets[0].uri;
              setUserPhoto(uri);
            }
          },
        },
        { text: "Cancelar", style: "cancel" }
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', (error as Error).message);
    }
  };

  const addUser = async () => {
    // Validações
    if (!newUser.nome || !newUser.senha || (newUser.tipoUsuario !== 0 && newUser.tipoUsuario !== 1) || !newUser.email) {
      Alert.alert("Campos Obrigatórios", "Por favor, preencha todos os campos obrigatórios: nome, senha, email e tipo usuario.", [{ text: "OK" }]);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(newUser.email)) {
      Alert.alert("E-mail inválido", "Por favor, preencha um e-mail válido.", [{ text: "OK" }]);
      return;
    }

    await fetchUsers(); // Verifica se o e-mail já existe
    const emailExists = users.some(user => user.email === newUser.email);
    if (emailExists) {
      Alert.alert("E-mail já cadastrado", "Por favor, preencha um e-mail que não exista conosco.", [{ text: "OK" }]);
      return;
    }

    try {
      const formData = new FormData();

      formData.append('nome', newUser.nome);
      formData.append('senha', newUser.senha);
      formData.append('email', newUser.email);
      formData.append('tipoUsuario', String(newUser.tipoUsuario));

      if (userPhoto) {
        const fileName = userPhoto.split('/').pop()!;
        const fileType = userPhoto.endsWith('.png') ? 'image/png' : 'image/jpeg';

        formData.append('foto', {
          uri: userPhoto,
          name: fileName,
          type: fileType
        } as any);
      }

      await axios.post(`${API_URL}/usuario/inserir`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setNewUser({ nome: '', senha: '', tipoUsuario: 0, email: '', foto: '' });
      setUserPhoto(null);
      hideModal('addUser');
      fetchUsers();
      Alert.alert("Usuário Adicionado", "O usuário foi cadastrado com sucesso.", [{ text: "OK" }]);
    } catch (error) {
      console.error('Erro ao adicionar usuário:', (error as Error).message);
      Alert.alert("Erro", "Erro ao cadastrar usuário.");
    }
  };

 const updateUser = async () => {
  // Validações (iguais ao addUser)
  if (!currentUser?.nome || !currentUser?.senha || (currentUser?.tipoUsuario !== 0 && currentUser?.tipoUsuario !== 1) || !currentUser?.email) {
    Alert.alert("Campos Obrigatórios", "Por favor, preencha todos os campos obrigatórios: nome, senha, email e tipo usuario.", [{ text: "OK" }]);
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(currentUser.email)) {
    Alert.alert("E-mail inválido", "Por favor, preencha um e-mail válido.", [{ text: "OK" }]);
    return;
  }

  // Verifica se o email já existe (excluindo o próprio usuário)
  await fetchUsers();
  const emailExists = users.some(user => user.email === currentUser.email && user.id !== currentUser.id);
  if (emailExists) {
    Alert.alert("E-mail já cadastrado", "Este e-mail já está sendo usado por outro usuário.", [{ text: "OK" }]);
    return;
  }

  if (currentUser?.id) {
    try {
      const formData = new FormData();

      formData.append('nome', currentUser.nome);
      formData.append('senha', currentUser.senha);
      formData.append('email', currentUser.email);
      formData.append('tipoUsuario', String(currentUser.tipoUsuario));

      if (userPhoto && userPhoto.startsWith('file://')) {
        const fileName = userPhoto.split('/').pop()!;
        const fileType = userPhoto.endsWith('.png') ? 'image/png' : 'image/jpeg';

        formData.append('foto', {
          uri: userPhoto,
          name: fileName,
          type: fileType
        } as any);
      }

      // URL corrigida
      const url = `${API_URL}/usuarios/atualizar/${currentUser.id}`;
      console.log('URL da requisição:', url);

      await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Limpa os estados e fecha o modal (igual ao addUser)
      setCurrentUser({ nome: '', senha: '', tipoUsuario: 0, email: '', foto: '' });
      setUserPhoto(null);
      hideModal('editUser'); // ou o nome do seu modal de edição
      
      // Atualiza a lista de usuários
      fetchUsers();
      
      // Alerta de sucesso
      Alert.alert("Usuário Atualizado", "O usuário foi atualizado com sucesso.", [{ text: "OK" }]);
      
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('URL tentada:', `${API_URL}/usuarios/atualizar/${currentUser.id}`);
      Alert.alert("Erro", "Erro ao atualizar usuário.");
    }
  } else {
    Alert.alert("Erro", "ID do usuário não encontrado.");
  }
};

  const deleteUser = async () => {
    if (currentUser?.id) {
      try {
        await axios.delete(`${API_URL}/usuario/deletar/${currentUser.id}`);
        setCurrentUser(null);
        hideModal('deleteUser');
        fetchUsers();
        Alert.alert("Usuário Excluído", "O usuário foi excluído com sucesso.", [{ text: "OK" }]);
      } catch (error) {
        console.error('Error deleting user:', (error as Error).message);
      }
    }
  };

  const showModal = (type: 'addUser' | 'editUser' | 'deleteUser') => {
    setVisible({ ...visible, [type]: true });
  };

  const hideModal = (type: 'addUser' | 'editUser' | 'deleteUser') => {
    setVisible(prevVisible => ({
      ...prevVisible,
      [type]: false,
    }));
  };

  return {
    visible,
    users,
    filteredUsers,
    newUser,
    currentUser,
    searchQuery,
    userPhoto,
    setNewUser,
    setSearchQuery,
    showModal,
    hideModal,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    pickUserImage,
    setUserPhoto,
  };
};

export default useUserManagement;