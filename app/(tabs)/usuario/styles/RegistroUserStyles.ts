import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#9ab8d9',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.15)',
    marginBottom: 18,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
    borderRadius: 10,
  },
  photoLabel: {
    color: '#9ab8d9',
    fontSize: 14,
    marginBottom: 4,
  },
  photoHelpText: {
    color: '#9ab8d9',
    fontSize: 12,
    marginBottom: 12,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 22,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#00d4ff',
    backgroundColor: '#1f2866',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    marginTop: 12,
    borderColor: '#00d4ff',
    borderRadius: 10,
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
  },
  buttonContent: {
    paddingVertical: 6,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
  snackbar: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  snackbarWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  snackbarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
