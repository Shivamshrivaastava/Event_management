const express = require("express");
const jwt = require("jsonwebtoken");
const { body, param } = require("express-validator");
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    getAttendeesForEvent
} = require("../controllers/eventController");

const router = express.Router();
const protect = (req, res, next) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid/expired token" });
    }
};

// --- Routes ---

// Public: list + detail
router.get("/", getAllEvents);
router.get(
    "/:id",
    [param("id").isMongoId().withMessage("Invalid event id")],
    getEventById
);

// Organizer-only CRUD
router.post(
    "/",
    protect,
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("dateTime").notEmpty().withMessage("DateTime is required"),
        body("location").notEmpty().withMessage("Location is required"),
        body("capacity").isInt({ min: 1 }).withMessage("Capacity must be >=1")
    ],
    createEvent
);

router.put(
    "/:id",
    protect,
    [param("id").isMongoId().withMessage("Invalid event id")],
    updateEvent
);

router.delete(
    "/:id",
    protect,
    [param("id").isMongoId().withMessage("Invalid event id")],
    deleteEvent
);

// Attendee actions
router.post(
    "/:id/register",
    protect,
    [param("id").isMongoId().withMessage("Invalid event id")],
    registerForEvent
);

router.post(
    "/:id/cancel",
    protect,
    [param("id").isMongoId().withMessage("Invalid event id")],
    cancelRegistration
);

// Organizer: get attendees for their event
router.get(
    "/:id/attendees",
    protect,
    [param("id").isMongoId().withMessage("Invalid event id")],
    getAttendeesForEvent
);

module.exports = router;
