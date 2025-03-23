class UserResponseDto {
    constructor(userEntity) {
      this.id = userEntity.user_id;
      this.name = userEntity.name;
      this.email = userEntity.email;
      // We do NOT expose the password
    }
  }
  
  module.exports = UserResponseDto;
  