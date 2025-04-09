// dtos/createUser.dto.js
class CreateUserDto {
    constructor({ name, email, password }) {
      this.name = name;
      this.email = email;
      this.password = password;
    }
  
    validate() {
      if (!this.email || !this.password) {
        throw new Error('Missing required fields (email, password)');
      }
    }
  }
  
  module.exports = CreateUserDto;
  