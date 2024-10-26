import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  number: { type: Number, unique: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  region: { type: String, required: true },
  county: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  gender: { type: String },
  role: {
    type: String,
    enum: ["student", "mentor", "supervisor", "region_manager", "super_admin"],
    required: true
  },
  responsibility_level: { type: String }, // Specific to roles like Supervisor, Region Manager, etc.
  categories: [
    {
      category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryDefinition"
      },
      data: { type: Map, of: mongoose.Schema.Types.Mixed }
    }
  ],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  attendance: [
    {
      event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      status: {
        type: String,
        enum: ["present", "absent", "excused"],
        default: "present"
      },
      note: { type: String }
    }
  ]
});

// Export the model
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
