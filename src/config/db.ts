import mongoose from "mongoose";

import config from "./config";

const connectToDB = async () => {
    await mongoose.connect(config.mongodb || '').then(() =>
        console.log('MongoDB Connected')
    ).catch(err => console.log(err));
};

export default connectToDB;