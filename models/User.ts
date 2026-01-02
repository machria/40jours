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
    lastReadJuzId?: number;
    completedJuzs: number[];
    quizScores: Map<string, number>;
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
        lastReadJuzId: { type: Number },
        completedJuzs: { type: [Number], default: [] },
        quizScores: { type: Map, of: Number, default: {} },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
