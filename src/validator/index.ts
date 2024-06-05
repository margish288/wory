export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,20}$/;
  return (
    password.length >= 6 &&
    password.length <= 20 &&
    passwordRegex.test(password)
  );
};

export const validateRole = (role: string): boolean => {
  return role === "Client" || role === "Freelancer";
};
