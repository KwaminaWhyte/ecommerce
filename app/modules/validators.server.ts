export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
export const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
export const nameRegex = /^[a-zA-Z]{2,}$/;
export const phoneRegex = /^[0-9]{10,}$/;
export const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;

export const validateEmail = (email: string) => {
  //   return emailRegex.test(email);
  if (!emailRegex.test(email)) {
    return "Invalid email address";
  }
};

export const validatePassword = (password: string) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  //   return passwordRegex.test(password);
};

export const validateUsername = (username: string) => {
  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }
  //   return usernameRegex.test(username);
};

export const validateName = (name: string) => {
  if (name.length < 3) {
    return "Invalid name";
  }
  // return regex.name.test(name);
};

export const validatePhone = (phone: string) => {
  return regex.phone.test(phone);
};

export const validateAddress = (address: string) => {
  return addressRegex.test(address);
};

export const validatePrice = (price: number) => {
  if (!price) {
    return "price must be at least 3 characters long";
  }
};
