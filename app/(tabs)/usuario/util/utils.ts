export const validateLoginFields = (email: string, senha: string): string | boolean => {
    // Verificar se os campos estão preenchidos
    if (!email || !senha) {
      return "Por favor, preencha todos os campos."; // Mensagem para campos vazios
    }
  
    // Validação do formato do email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "O e-mail fornecido não é válido."; // Mensagem de erro se o email for inválido
    }
  
    // Validação da senha (pelo menos 6 caracteres)
    if (senha.length < 1) {
      return "A senha deve ter pelo menos 6 caracteres."; // Mensagem de erro se a senha for muito curta
    }
  
    // Se todos os campos passarem na validação
    return true;
  };
  export const isEmailValid = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
