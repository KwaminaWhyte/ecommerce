import mongoose from "mongoose";

// Connect to your MongoDB instance
mongoose.connect(process.env.DATABASE_URL as string);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", () => {
  console.log("Connected to Database, App is ready for use.");
});

export default mongoose;
