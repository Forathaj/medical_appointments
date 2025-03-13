/** @format */

export const Appointment = {
  collection: "appointments",

  createAppointment: async (db, appointmentData) => {
    return db.collection(Appointment.collection).insertOne(appointmentData);
  },

  getAppointmentsByUserId: async (db, userId) => {
    return db.collection(Appointment.collection).find({ userId }).toArray();
  },

  deleteAppointment: async (db, appointmentId) => {
    return db
      .collection(Appointment.collection)
      .deleteOne({ _id: appointmentId });
  },
};
