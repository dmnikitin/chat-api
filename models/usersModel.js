const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registrationDate: { type: String, required: true },
});

const saltRounds = 10;

userSchema.pre('save', next => {
    if (this.isNew || this.isModified('password')) {
        const document = this;
        bcrypt.hash(document.password, saltRounds,
            function(err, hashedPassword) {
                if (err) {
                    next(err);
                } else {
                    document.password = hashedPassword;
                    next();
                }
            });
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema);
