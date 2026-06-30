import React, { useState, useEffect } from 'react';
import { 
  View, 
  Image, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { TextInput, Button, Text, Snackbar, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
  RegistroUser: undefined;
  Main: undefined; // O Drawer principal
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userType = await AsyncStorage.getItem('userType');
        if (userType) {
          // Redireciona para o Drawer principal
          navigation.replace('Main');
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    };
    checkUser();
  }, []);

  const handleLoginPress = async () => {
    // Validação básica dos campos
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail');
      return;
    }
    if (!senha.trim()) {
      Alert.alert('Erro', 'Por favor, informe sua senha');
      return;
    }

    setLoading(true);

    // Simula um delay de rede
    setTimeout(async () => {
      try {
        // 🔥 ACEITA QUALQUER EMAIL E SENHA 🔥
        // Salva dados mockados do usuário no AsyncStorage
        const userData = {
          email: email,
          nome: email.split('@')[0] || 'Usuário',
          userType: '1', // 1 = Cliente | 0 = Administrador
          foto: null,
        };

        await AsyncStorage.multiSet([
          ['userEmail', email],
          ['userType', '1'],
          ['userId', `user-${Date.now()}`],
          ['nome', userData.nome],
          ['userData', JSON.stringify(userData)],
          ['lastUserDataUpdate', Date.now().toString()],
        ]);

        setLoading(false);
        setVisibleSnackbar(true);

        // Aguarda o snackbar e navega para o Drawer principal
        setTimeout(() => {
          navigation.replace('Main'); // ← Redireciona para o Drawer
        }, 500);

      } catch (error) {
        console.error('Erro ao salvar dados:', error);
        setLoading(false);
        Alert.alert('Erro', 'Falha ao fazer login. Tente novamente.');
      }
    }, 1000);
  };

  return (
    <LinearGradient
      colors={['#1a0d8d', '#2d1a9f', '#3d25b0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header com Logo */}
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

          {/* Título */}
          <View style={styles.titleContainer}>
            <MaterialIcons name="flight-takeoff" size={32} color="#00d4ff" />
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>
              Faça login para continuar sua jornada
            </Text>
          </View>

          {/* Formulário */}
          <Surface style={styles.formContainer} elevation={2}>
            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
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
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="lock" color="#00d4ff" />}
              right={
                <TextInput.Icon 
                  icon={showPassword ? 'eye-off' : 'eye'} 
                  color="#00d4ff"
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
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

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Recuperar Senha', 'Funcionalidade em desenvolvimento')}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLoginPress}
              style={styles.button}
              loading={loading}
              disabled={loading}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('RegistroUser')}>
                <Text style={styles.registerLink}> Criar conta</Text>
              </TouchableOpacity>
            </View>
          </Surface>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <LinearGradient
                  colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.05)']}
                  style={styles.socialButtonGradient}
                >
                  <MaterialIcons name="travel-explore" size={24} color="#00d4ff" />
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <LinearGradient
                  colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.05)']}
                  style={styles.socialButtonGradient}
                >
                  <MaterialIcons name="facebook" size={24} color="#00d4ff" />
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <LinearGradient
                  colors={['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.05)']}
                  style={styles.socialButtonGradient}
                >
                  <MaterialIcons name="apple" size={24} color="#00d4ff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <Snackbar
            visible={visibleSnackbar}
            onDismiss={() => setVisibleSnackbar(false)}
            duration={3000}
            style={styles.snackbar}
            wrapperStyle={styles.snackbarWrapper}
          >
            <View style={styles.snackbarContent}>
              <MaterialIcons name="check-circle" size={24} color="#4caf50" />
              <Text style={styles.snackbarText}>
                Login realizado com sucesso!
              </Text>
            </View>
          </Snackbar>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    marginBottom: 12,
  },
  logoBorder: {
    padding: 4,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  brandText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 212, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  headerDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#00d4ff',
    borderRadius: 2,
    marginTop: 8,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#9ab8d9',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.15)',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
    borderRadius: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#00d4ff',
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    borderRadius: 12,
    backgroundColor: '#00d4ff',
    elevation: 4,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d0620',
    paddingVertical: 4,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  registerText: {
    color: '#9ab8d9',
    fontSize: 14,
  },
  registerLink: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 8,
  },
  footerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#9ab8d9',
    paddingHorizontal: 16,
    fontSize: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  socialButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  snackbar: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  snackbarWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  snackbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  snackbarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});