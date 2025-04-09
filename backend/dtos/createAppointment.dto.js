// dtos/createAppointment.dto.js

class CreateAppointmentDto {
    constructor({ date_time, status, doctor_id, patient_id }) {
      this.date_time = date_time;
      this.status = status;
      this.doctor_id = doctor_id;
      this.patient_id = patient_id;
    }
  
    validate() {
      if (!this.date_time) {
        throw new Error('Missing date_time field');
      }
      if (!this.status) {
        throw new Error('Missing status field');
      }
      
    }
  }
  
  module.exports = CreateAppointmentDto;
  