export const generatePassword = (): string => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const specialChars = '!@#$%^&*';
  let password = Array(7)
    .fill(chars)
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join('');
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join(''); // Shuffle
};
