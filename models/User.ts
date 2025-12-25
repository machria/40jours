import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    name?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    dailyProgress: Map<string, boolean>; // Changed to Map
    streak: number;
    lastReadDate: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        name: { type: String },
        image: { type: String },
        dailyProgress: { type: Map, of: Boolean, default: {} },
        streak: { type: Number, default: 0 },
        lastReadDate: { type: Date },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
