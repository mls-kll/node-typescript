import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
const uri: string = process.env.MONGO_URI ?? 'default';

const mongoConnect = async () => {
  try {
   const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo DB connected!');
    return db;
  } catch (error) {
    console.log(error);
    console.log('Could not connect to Mongo DB');
  }
};

export default mongoConnect;
