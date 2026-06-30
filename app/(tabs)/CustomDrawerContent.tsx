import React, { useEffect, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDrawerStatus } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import API_URL from './../../conf/api';

interface UserData {
  email: string;
  userType: string;
  photo?: string;
  nome?: string;
}

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeEditado, setNomeEditado] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const isDrawerOpen = useDrawerStatus();
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Função para carregar dados do usuário com timestamp
  const loadUserData = async (forceUpdate: boolean = false) => {
    try {
      console.log('Carregando dados do usuário...', { forceUpdate, photoVersion });
      
      const [email, userType, photo, id, nomeCompleto, userDataString, lastSync] = await Promise.all([
        AsyncStorage.getItem('userEmail'),
        AsyncStorage.getItem('userType'),
        AsyncStorage.getItem('userPhoto'),
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('nome'),
        AsyncStorage.getItem('userData'),
        AsyncStorage.getItem('lastUserDataUpdate'),
      ]);

      const lastUpdateTime = lastSync ? parseInt(lastSync) : 0;
      const currentTime = Date.now();
      const shouldUpdate = forceUpdate || (currentTime - lastUpdateTime > 5000);

      console.log('Dados carregados do AsyncStorage:', {
        email, userType, photo, id, nomeCompleto, lastUpdateTime, currentTime, shouldUpdate
      });

      if (email && userType) {
        setUser({ 
          email, 
          userType, 
          photo: photo || undefined 
        });
      } else {
        setUser(null);
      }

      setUserId(id);
      const nomeValido = nomeCompleto?.trim();
      setNome(nomeValido && nomeValido !== '' ? nomeValido : null);

      if (userDataString && shouldUpdate) {
        try {
          const userData = JSON.parse(userDataString);
          console.log('UserData parseado:', userData);
          
          if (userData.foto) {
            const photoUrl = userData.foto.includes('http') 
              ? userData.foto 
              : `${API_URL}${userData.foto}`;
            
            setUser(prev => prev ? { 
              ...prev, 
              photo: photoUrl,
              nome: userData.nome || prev.nome
            } : null);
            
            await AsyncStorage.setItem('lastUserDataUpdate', currentTime.toString());
            setLastUpdate(currentTime);
          }
        } catch (parseError) {
          console.error('Erro ao fazer parse do userData:', parseError);
        }
      }
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e);
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      // Limpa todos os dados do usuário
      await AsyncStorage.multiRemove([
        'userEmail',
        'userType',
        'userPhoto',
        'userId',
        'nome',
        'userData',
        'lastUserDataUpdate'
      ]);
      
      // Fecha o drawer
      props.navigation.closeDrawer();
      
      // Navega para a tela de login
      props.navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Listener para mudanças no AppState
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('App voltou ao foreground, atualizando dados...');
        loadUserData(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // Atualiza sempre que o drawer abre
  useEffect(() => {
    if (isDrawerOpen === 'open') {
      console.log('Drawer aberto, atualizando dados...');
      loadUserData(true);
    }
  }, [isDrawerOpen]);

  // Atualização periódica a cada 30 segundos
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isDrawerOpen === 'open') {
      interval = setInterval(() => {
        console.log('Atualização periódica do drawer...');
        loadUserData(true);
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDrawerOpen]);

  // Efeito para a animação quando não há usuário
  useEffect(() => {
    if (!user) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [user]);

  // Função para forçar atualização completa
  const forcePhotoUpdate = async () => {
    console.log('Forçando atualização da foto...');
    setLoading(true);
    
    await AsyncStorage.removeItem('lastUserDataUpdate');
    setPhotoVersion(prev => prev + 1);
    await loadUserData(true);
  };

  // Função para obter a URL da foto com cache busting
  const getPhotoUrl = (photo: string) => {
    if (!photo) return null;
    
    const baseUrl = photo.includes('http') ? photo : `${API_URL}${photo}`;
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${photoVersion}&t=${lastUpdate}`;
  };

  // Função para formatar o tipo de usuário
  const getTipoUsuarioFormatado = (userType: string) => {
    switch (userType) {
      case '0':
        return 'Administrador';
      case '1':
        return 'Cliente';
      default:
        return 'Usuário';
    }
  };

  // Função para obter o ícone do tipo de usuário
  const getIconeUsuario = (userType: string) => {
    switch (userType) {
      case '0':
        return <FontAwesome5 name="user-shield" size={16} color="#00d4ff" />;
      case '1':
        return <FontAwesome5 name="user" size={16} color="#4a4fa0" />;
      default:
        return <FontAwesome5 name="user" size={16} color="#9ab8d9" />;
    }
  };

  const handleSalvarEdicao = async () => {
    if (!nomeEditado.trim()) {
      return;
    }
    
    try {
      await AsyncStorage.setItem('nome', nomeEditado);
      setNome(nomeEditado);
      setModalVisible(false);
      setNomeEditado('');
      
      setUser(prev => prev ? { ...prev, nome: nomeEditado } : null);
      forcePhotoUpdate();
    } catch (e) {
      console.error('Erro ao salvar nome:', e);
    }
  };

  // Componente do botão de atualização
  const RefreshButton = () => (
    <TouchableOpacity
      style={[styles.refreshButton, loading && styles.refreshButtonDisabled]}
      onPress={forcePhotoUpdate}
      disabled={loading}
      accessibilityLabel="Atualizar dados"
    >
      {loading ? (
        <ActivityIndicator size="small" color="#00d4ff" />
      ) : (
        <MaterialIcons name="refresh" size={18} color="#00d4ff" />
      )}
    </TouchableOpacity>
  );

  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header com gradiente estilo AirTrip */}
      <LinearGradient
        colors={['#1a0d8d', '#2d1a9f', '#3d25b0']}
        style={styles.header}
        start={[0, 0]}
        end={[1, 1]}
      >
        {user && (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}
              accessibilityLabel="Editar nome"
            >
              <MaterialIcons name="edit" size={18} color="#00d4ff" />
            </TouchableOpacity>
            <RefreshButton />
          </View>
        )}

        {user ? (
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              {loading && (
                <ActivityIndicator
                  size="small"
                  color="#00d4ff"
                  style={styles.loader}
                />
              )}
              <Image
                source={
                  user.photo
                    ? { 
                        uri: getPhotoUrl(user.photo),
                        cache: 'reload'
                      }
                    : require('../../assets/images/user-placeholder.png')
                }
                style={[styles.avatar, loading && { opacity: 0.3 }]}
                resizeMode="cover"
                onLoadStart={() => !loading && setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onError={(e) => {
                  console.log('Erro ao carregar imagem:', e.nativeEvent.error);
                  setLoading(false);
                }}
                key={`photo-${photoVersion}-${lastUpdate}`}
              />
              <View style={styles.userStatus}>
                {getIconeUsuario(user.userType)}
              </View>
            </View>
            
            <Text style={styles.name}>
              {nome || user.nome || 'Nome não disponível'}
            </Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <MaterialIcons name="email" size={14} color="#00d4ff" />
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="person" size={14} color="#00d4ff" />
                <Text style={styles.infoText}>
                  {getTipoUsuarioFormatado(user.userType)}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="access-time" size={12} color="#9ab8d9" />
                <Text style={[styles.infoText, styles.updateText]}>
                  {new Date(lastUpdate).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Animated.View style={[styles.loggedOutContainer, { opacity: fadeAnim }]}>
            <MaterialIcons name="warning" size={32} color="#00d4ff" />
            <Text style={styles.loggedOutText}>Usuário não logado</Text>
            <Text style={styles.loggedOutSubText}>
              Faça login para acessar todas as funcionalidades
            </Text>
          </Animated.View>
        )}
      </LinearGradient>

      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>

      {/* Botão Sair - SEMPRE VISÍVEL */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LinearGradient
          colors={['rgba(255, 0, 0, 0.1)', 'rgba(255, 0, 0, 0.05)']}
          style={styles.logoutButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="logout" size={24} color="#ff4444" />
          <Text style={styles.logoutText}>Sair</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal para editar nome */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          setNomeEditado('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            <TextInput
              value={nomeEditado}
              onChangeText={setNomeEditado}
              placeholder="Digite seu nome"
              placeholderTextColor="#9ab8d9"
              style={styles.input}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNomeEditado('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSalvarEdicao}
              >
                <LinearGradient
                  colors={['#00d4ff', '#4a4fa0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 25,
    paddingTop: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.2)',
    minHeight: 220,
    justifyContent: 'center',
  },
  headerButtons: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderRadius: 15,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  refreshButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderRadius: 15,
    padding: 6,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  userInfoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  userStatus: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1a0d8d',
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#fff',
    marginLeft: 8,
    opacity: 0.9,
  },
  updateText: {
    fontSize: 11,
    color: '#9ab8d9',
    opacity: 0.7,
  },
  loggedOutContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loggedOutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  loggedOutSubText: {
    fontSize: 12,
    color: '#9ab8d9',
    textAlign: 'center',
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    zIndex: 10,
  },
  // Estilos do botão Sair
  logoutButton: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    borderRadius: 10,
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#1a0d8d',
    borderRadius: 15,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    fontSize: 16,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#9ab8d9',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CustomDrawerContent;