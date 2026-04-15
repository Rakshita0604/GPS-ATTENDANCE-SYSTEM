export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  email = email.trim();

  // must start with letter
  const pattern = /^[a-zA-Z][^\s@]*@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(email);
}

export function isValidName(name) {
  return typeof name === "string" && /^[A-Za-z][A-Za-z\s]*$/.test(name.trim());
}

export function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}