// dtos/createUserDetails.dto.js

class CreateUserDetailsDto {
    constructor({ user_id, specialty, availability, date_of_birth, contact_info }) {
      this.user_id = user_id;
      this.specialty = specialty;
      this.availability = availability;
      this.date_of_birth = date_of_birth;
      this.contact_info = contact_info;
    }
  
    validate() {
      // Basic validation: user_id is mandatory
      if (!this.user_id) {
        throw new Error('Missing user_id (primary key)');
      }
    }
  }
  
  module.exports = CreateUserDetailsDto;
  