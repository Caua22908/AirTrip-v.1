import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,    
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
  },

  // Botão Adicionar
  addButton: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  addButtonLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },

  // Campo de Pesquisa
  searchInput: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // Título
  titleContainer: {
    backgroundColor: '#A67B5B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },

  // Container dos Cards
  cardsContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },

  // Cards
  card: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#E8D6C9',
    overflow: 'hidden',
  },
  cardEven: {
    borderLeftWidth: 4,
    borderLeftColor: '#A67B5B',
  },
  cardOdd: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B4513',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  userTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2D2D2D',
    fontWeight: '400',
  },
  cardActions: {
    padding: 16,
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  buttonContent: {
    height: 40,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#A67B5B',
    borderRadius: 8,
    borderWidth: 0,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#E74C3C',
    borderRadius: 8,
  },
  deleteButtonLabel: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
  },

  // Estado Vazio
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  // Footer
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8D6C9',
  },
  counterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A67B5B',
    textAlign: 'center',
  },

  // Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D6C9',
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#A67B5B',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    padding: 24,
  },
  inputGrid: {
    gap: 16,
  },
  inputField: {
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    marginTop: 8,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: 8,
  },
  pickerWrapper: {
    height: 56,
    borderWidth: 1,
    borderColor: '#A67B5B',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: '100%',
    width: '100%',
  },

  // Seção de Foto
  photoSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  photoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageTouchable: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#A67B5B',
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8D6C9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#A67B5B',
  },
  placeholderImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    tintColor: '#A67B5B',
  },
  removePhotoButton: {
    marginTop: 12,
    borderColor: '#A67B5B',
  },

  // Confirmação de Exclusão
  deleteConfirmation: {
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteUserName: {
    fontWeight: 'bold',
    color: '#A67B5B',
  },
  deleteSubtext: {
    fontSize: 14,
    color: '#E74C3C',
    textAlign: 'center',
  },

  // Footer dos Modais
  modalFooter: {
    padding: 24,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    backgroundColor: '#A67B5B',
    borderRadius: 12,
    elevation: 3,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#A67B5B',
    borderRadius: 12,
  },
  cancelButtonLabel: {
    color: '#A67B5B',
    fontWeight: '600',
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    elevation: 3,
  },
  modalButtonContent: {
    height: 50,
  },
  modalButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});