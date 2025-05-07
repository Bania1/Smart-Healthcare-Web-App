// dtos/createUser.dto.js
class CreateUserDto {
  constructor({ name, dni, email, password }) {
    this.name = name;
    this.dni = dni;
    this.email = email;
    this.password = password;
  }

  validate() {
    const missingFields = [];
    if (!this.name) missingFields.push('name');
    if (!this.dni) missingFields.push('dni');
    if (!this.password) missingFields.push('password');
    if (missingFields.length) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    // Optionally validate email format if email is provided
    if (this.email && !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(this.email)) {
      throw new Error('Invalid email format');
    }
  }
}

module.exports = CreateUserDto;
