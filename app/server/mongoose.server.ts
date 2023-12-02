import mongoose from "mongoose";

// Connect to your MongoDB instance
mongoose.connect(process.env.DATABASE_URL as string);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

export default mongoose;
