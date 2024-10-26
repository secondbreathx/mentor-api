const CategoryDefinitionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fields: [
    {
      name: { type: String, required: true }, // e.g., Title, Page Read
      type: { type: String, enum: ["Number", "Text", "Date"], required: true }, // Field type definition
      required: { type: Boolean, default: false }
    }
  ],
  assigned_roles: [
    {
      type: String,
      enum: ["student", "mentor", "supervisor", "region_manager", "super_admin"]
    }
  ]
});

// Export the model
const CategoryDefinitionModel = mongoose.model(
  "CategoryDefinition",
  CategoryDefinitionSchema
);
export default CategoryDefinitionModel;
