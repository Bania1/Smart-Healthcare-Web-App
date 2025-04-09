// dtos/createPermission.dto.js

class CreatePermissionDto {
    constructor({ permission_name }) {
      this.permission_name = permission_name;
    }
  
    validate() {
      if (!this.permission_name) {
        throw new Error('Missing permission_name field');
      }
    }
  }
  
  module.exports = CreatePermissionDto;
  