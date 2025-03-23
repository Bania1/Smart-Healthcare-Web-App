// dtos/createRole.dto.js

class CreateRoleDto {
    constructor({ role_name }) {
      this.role_name = role_name;
    }
  
    validate() {
      if (!this.role_name) {
        throw new Error('Missing role_name field');
      }
    }
  }
  
  module.exports = CreateRoleDto;
  