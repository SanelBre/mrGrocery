import mongoose from "mongoose";

export const startDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to db");
  } catch (e) {
    console.error(e);
  }
};
