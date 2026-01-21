
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { join } = require('path');

// Configure dotenv to read from .env file in root
dotenv.config({ path: join(__dirname, '..', '.env') });

const UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    dailyProgress: { type: Map, of: Boolean },
    activityHistory: { type: Map, of: Number },
    streak: Number
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function inspect() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            console.log('------------------------------------------------');
            console.log(`User: ${user.email} (${user.name})`);
            console.log(`Streak: ${user.streak}`);

            const history = user.activityHistory;
            console.log('Activity History Type:', history ? history.constructor.name : 'undefined');

            if (history) {
                if (history instanceof Map) {
                    console.log('Activity History (Map):', Object.fromEntries(history));
                } else {
                    console.log('Activity History (Object/Other):', history);
                }
            } else {
                console.log('Activity History is NULL/UNDEFINED');
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

inspect();
