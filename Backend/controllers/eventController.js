const { validationResult } = require("express-validator");
const Event = require("../models/Event");

// Helpers
const isOrganizer = (req) => req.user?.role === "organizer";
const isAttendee = (req) => req.user?.role === "attendee";

const ensureOwnership = (event, userId) => {
    return String(event.organizer) === String(userId);
};

exports.createEvent = async (req, res) => {
    try {
        if (!isOrganizer(req))
            return res.status(403).json({ message: "Organizer role required" });

        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { title, description, dateTime, location, capacity } = req.body;

        const newEvent = await Event.create({
            title,
            description,
            dateTime,
            location,
            capacity,
            organizer: req.user.id
        });

        res.status(201).json(newEvent);
    } catch (err) {
        // handle unique title duplication
        if (err.code === 11000) {
            return res.status(409).json({ message: "Title must be unique" });
        }
        res.status(500).json({ message: err.message || "Failed to create event" });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const { title, location, from, to } = req.query;

        const query = { dateTime: { $gt: new Date() } }; // upcoming by default

        if (title) query.title = { $regex: title, $options: "i" };
        if (location) query.location = { $regex: location, $options: "i" };
        if (from || to) {
            query.dateTime = {};
            if (from) query.dateTime.$gte = new Date(from);
            if (to) query.dateTime.$lte = new Date(to);
        }

        const events = await Event.find(query)
            .populate("organizer", "name email role")
            .populate("attendees", "name email")
            .sort({ dateTime: 1 });

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch events" });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("organizer", "name email role")
            .populate("attendees", "name email");

        if (!event) return res.status(404).json({ message: "Event not found" });

        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch event" });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        if (!isOrganizer(req))
            return res.status(403).json({ message: "Organizer role required" });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (!ensureOwnership(event, req.user.id))
            return res.status(403).json({ message: "Not your event" });

        const { title, description, dateTime, location, capacity } = req.body;

        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (dateTime !== undefined) event.dateTime = dateTime;
        if (location !== undefined) event.location = location;
        if (capacity !== undefined) {
            if (event.attendees.length > capacity) {
                return res
                    .status(400)
                    .json({ message: "New capacity is less than current attendees" });
            }
            event.capacity = capacity;
        }

        await event.save();
        const populated = await Event.findById(event._id)
            .populate("organizer", "name email role")
            .populate("attendees", "name email");

        res.json(populated);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Title must be unique" });
        }
        res.status(500).json({ message: err.message || "Failed to update event" });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        if (!isOrganizer(req))
            return res.status(403).json({ message: "Organizer role required" });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (!ensureOwnership(event, req.user.id))
            return res.status(403).json({ message: "Not your event" });

        await event.deleteOne();
        res.json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to delete event" });
    }
};

exports.registerForEvent = async (req, res) => {
    try {
        if (!isAttendee(req))
            return res.status(403).json({ message: "Attendee role required" });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Cannot register for past events
        if (event.dateTime.getTime() <= Date.now())
            return res.status(400).json({ message: "Event already started/ended" });

        // Cannot exceed capacity
        if (event.attendees.length >= event.capacity)
            return res.status(400).json({ message: "Event is full" });

        // Cannot register twice
        if (event.attendees.some((u) => String(u) === String(req.user.id)))
            return res.status(400).json({ message: "Already registered" });

        event.attendees.push(req.user.id);
        await event.save();

        const populated = await Event.findById(event._id)
            .populate("organizer", "name email role")
            .populate("attendees", "name email");

        res.json({ message: "Registered successfully", event: populated });
    } catch (err) {
        res.status(500).json({ message: err.message || "Registration failed" });
    }
};

exports.cancelRegistration = async (req, res) => {
    try {
        if (!isAttendee(req))
            return res.status(403).json({ message: "Attendee role required" });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const before = event.attendees.length;
        event.attendees = event.attendees.filter(
            (u) => String(u) !== String(req.user.id)
        );

        if (event.attendees.length === before) {
            return res.status(400).json({ message: "Not registered for this event" });
        }

        await event.save();

        const populated = await Event.findById(event._id)
            .populate("organizer", "name email role")
            .populate("attendees", "name email");

        res.json({ message: "Registration canceled", event: populated });
    } catch (err) {
        res.status(500).json({ message: err.message || "Cancel failed" });
    }
};

exports.getAttendeesForEvent = async (req, res) => {
    try {
        // organizer only, and must own the event
        const event = await Event.findById(req.params.id).populate("attendees", "name email");
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (String(event.organizer) !== String(req.user.id))
            return res.status(403).json({ message: "Not your event" });

        res.json({ attendees: event.attendees });
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to get attendees" });
    }
};
