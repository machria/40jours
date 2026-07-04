import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavedHadith {
    key: string;
    text: string;
    bookName: string;
    hadithnumber: number;
    collectionId: string;
    savedAt: Date;
}

export interface ISavedArticle {
    slug: string;
    title: string;
    category: string;
    excerpt: string;
    savedAt: Date;
}

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
    groups: any[]; // Using any[] to avoid circular dependency issues in type definition for now, or just ObjectId[]
    completedJuzs: number[];
    quizScores: Map<string, number>;
    vocabularyQuizBestScore?: number;
    hisnQuizBestScore?: number;
    arabicQuizBestScore?: number;
    names99QuizBestScore?: number;
    siraQuizBestScore?: number;
    badges: { id: string; unlockedAt: Date }[];
    activityHistory: Map<string, number>;
    bookmarks: { surah: number; ayah: number; addedAt: Date }[];
    likedHadiths: string[];
    savedHadiths: ISavedHadith[];
    savedArticles: ISavedArticle[];
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
        groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
        completedJuzs: { type: [Number], default: [] },
        quizScores: { type: Map, of: Number, default: {} },
        vocabularyQuizBestScore: { type: Number, default: 0 },
        hisnQuizBestScore: { type: Number, default: 0 },
        arabicQuizBestScore: { type: Number, default: 0 },
        names99QuizBestScore: { type: Number, default: 0 },
        siraQuizBestScore: { type: Number, default: 0 },
        badges: [{
            id: { type: String, required: true },
            unlockedAt: { type: Date, default: Date.now }
        }],
        activityHistory: { type: Map, of: Number, default: {} }, // Key: "YYYY-MM-DD", Value: count
        bookmarks: [{
            surah: { type: Number, required: true },
            ayah: { type: Number, required: true },
            addedAt: { type: Date, default: Date.now }
        }],
        savedArticles: {
            type: [{
                _id: false,
                slug:     { type: String, required: true },
                title:    { type: String, default: '' },
                category: { type: String, default: '' },
                excerpt:  { type: String, default: '' },
                savedAt:  { type: Date,   default: Date.now },
            }],
            default: [],
        },
        likedHadiths: { type: [String], default: [] },
        savedHadiths: {
            type: [{
                _id: false,
                key:          { type: String, required: true },
                text:         { type: String, default: '' },
                bookName:     { type: String, default: '' },
                hadithnumber: { type: Number, default: 0 },
                collectionId: { type: String, default: '' },
                savedAt:      { type: Date,   default: Date.now },
            }],
            default: [],
        },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
