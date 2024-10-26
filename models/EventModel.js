const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  participants: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      attended: { type: Boolean, default: false },
      note: { type: String }
    }
  ],
  date_created: { type: Date, default: Date.now },
  date_closed: { type: Date },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  attendance_notes: { type: String } // Reason for cancelation or closure remarks
});

// Export the model
const EventModel = mongoose.model("Event", EventSchema);
export default EventModel;
