// dtos/createRolePermission.dto.js

class CreateRolePermissionDto {
    constructor({ role_id, permission_id }) {
      this.role_id = role_id;
      this.permission_id = permission_id;
    }
  
    validate() {
      if (!this.role_id || !this.permission_id) {
        throw new Error('Missing required fields (role_id, permission_id)');
      }
    }
  }
  
  module.exports = CreateRolePermissionDto;
  