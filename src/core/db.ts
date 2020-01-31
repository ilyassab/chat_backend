import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB || 'mongodb://localhost:27017/chat', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});