const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        dateTime: {
            type: Date,
            required: [true, "Date & Time is Required"],
            validate: {
                validator: function (val) {
                    return val && val.getTime() > Date.now();
                },
                message: "Event date & time  must be in future"
            }
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        capacity: {
            type: Number,
            required: [true, "Capacity is required"],
            min: [1, "capacity must be atleast 1"]
        },
        attendees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    { timestamps: true }
);

EventSchema.pre("save", function (next) {
    if (this.attendees && this.capacity && this.attendees.length > this.capacity) {
        return next(new Error("Attendees exceed the event capacity"));
    }
    next();
});
module.exports = mongoose.model("Event", EventSchema);