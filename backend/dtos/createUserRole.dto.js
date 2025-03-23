// dtos/createUserRole.dto.js

class CreateUserRoleDto {
  constructor({ user_id, role_id }) {
    this.user_id = user_id;
    this.role_id = role_id;
  }

  validate() {
    // Both user_id and role_id are required
    if (!this.user_id || !this.role_id) {
      throw new Error('Missing required fields (user_id, role_id)');
    }
  }
}

module.exports = CreateUserRoleDto;
