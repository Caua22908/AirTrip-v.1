import React from 'react';
import { 
  View, 
  Image, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet,  // ← IMPORTANTE: adicionar StyleSheet
  TouchableOpacity 
} from 'react-native';
import { TextInput, Button, Text, Snackbar, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlterarSenha } from './hooks/useAlterarSenha';

export default function AlterarSenhaScreen() {
  const {
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
  } = useAlterarSenha();

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
            <MaterialIcons name="lock-outline" size={32} color="#00d4ff" />
            <Text style={styles.title}>Alterar Senha</Text>
            <Text style={styles.subtitle}>
              Digite sua senha atual e crie uma nova senha
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
              label="Senha Atual"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
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

            <TextInput
              label="Nova Senha"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="lock-plus" color="#00d4ff" />}
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
              label="Confirmar Nova Senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="lock-check" color="#00d4ff" />}
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

            <View style={styles.passwordRules}>
              <Text style={styles.rulesTitle}>Sua nova senha deve conter:</Text>
              <View style={styles.ruleItem}>
                <MaterialIcons name="check-circle" size={16} color="#4caf50" />
                <Text style={styles.ruleText}>Pelo menos 8 caracteres</Text>
              </View>
              <View style={styles.ruleItem}>
                <MaterialIcons name="check-circle" size={16} color="#4caf50" />
                <Text style={styles.ruleText}>Uma letra maiúscula e uma minúscula</Text>
              </View>
              <View style={styles.ruleItem}>
                <MaterialIcons name="check-circle" size={16} color="#4caf50" />
                <Text style={styles.ruleText}>Um número</Text>
              </View>
              <View style={styles.ruleItem}>
                <MaterialIcons name="check-circle" size={16} color="#4caf50" />
                <Text style={styles.ruleText}>Um caractere especial</Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleAlterarSenha}
              style={styles.button}
              loading={loading}
              disabled={loading}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </Surface>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Precisa de ajuda? Entre em contato com o suporte
            </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Suporte AirTrip</Text>
            </TouchableOpacity>
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
                Senha alterada com sucesso!
              </Text>
            </View>
          </Snackbar>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// Styles definidos diretamente no arquivo
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    marginBottom: 8,
  },
  logoBorder: {
    padding: 4,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 212, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
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
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
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
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
    borderRadius: 8,
  },
  passwordRules: {
    marginTop: 8,
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.1)',
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ab8d9',
    marginBottom: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  ruleText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
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
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#9ab8d9',
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 14,
    color: '#00d4ff',
    fontWeight: '600',
    marginTop: 4,
    textDecorationLine: 'underline',
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