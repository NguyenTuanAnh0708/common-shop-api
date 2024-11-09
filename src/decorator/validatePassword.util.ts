export function validatePassword(password: string): any[] {
  const errors = [];

  if (!password) {
    errors.push({ field: 'Password', message: ['Password is required.'] });
    return errors; // Dừng kiểm tra nếu mật khẩu chưa nhập
  }

  if (password.length < 8 || password.length > 20) {
    errors.push({
      field: 'Password',
      message: ['Password must be between 8 and 20 characters.'],
    });
  }

  if (!/[a-z]/.test(password)) {
    errors.push({
      field: 'Password',
      message: ['Password must include at least one lowercase letter.'],
    });
  }

  if (!/\d/.test(password)) {
    errors.push({
      field: 'Password',
      message: ['Password must include at least one number.'],
    });
  }

  if (!/\W/.test(password)) {
    errors.push({
      field: 'Password',
      message: ['Password must include at least one special character.'],
    });
  }

  return errors;
}
