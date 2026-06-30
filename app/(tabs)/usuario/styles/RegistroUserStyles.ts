import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center',
  },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5D4037',
    fontFamily: 'serif',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    marginTop: 10,
    elevation: 3,
  },
  link: {
    marginTop: 25,
    textAlign: 'center',
    color: '#8B4513',
    fontWeight: '600',
    fontSize: 16,
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 0.5,
  },
   // Adicionando os estilos
  uploadButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#8B4513',
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },  
  photoContainer: {
  alignItems: 'center',
  marginVertical: 16,
},

photo: {
  width: 120,
  height: 120,
  borderRadius: 60, // Deixe 0 para quadrado ou 60 para redondo
  borderWidth: 2,
  borderColor: '#A67B5B',
  backgroundColor: '#eee',
  resizeMode: 'cover',
},
scrollContent: {
  paddingBottom: 40,
  flexGrow: 1,
  justifyContent: 'center',
},
});
