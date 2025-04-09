// dtos/createMedicalRecord.dto.js

class CreateMedicalRecordDto {
    constructor({ date, notes, type, patient_id, doctor_id }) {
      this.date = date;
      this.notes = notes;
      this.type = type;
      this.patient_id = patient_id;
      this.doctor_id = doctor_id;
    }
  
    validate() {
      // Example: enforce that patient_id and doctor_id are mandatory
      if (!this.patient_id) {
        throw new Error('Missing patient_id field');
      }
      if (!this.doctor_id) {
        throw new Error('Missing doctor_id field');
      }
  
      // To ensure 'type' is also required:
      if (!this.type) {
         throw new Error('Missing type field');
      }
  
      // (Optional) Validate date format, etc.
      if (this.date && isNaN(Date.parse(this.date))) {
         throw new Error('Invalid date format');
      }
    }
  }
  
  module.exports = CreateMedicalRecordDto;
  