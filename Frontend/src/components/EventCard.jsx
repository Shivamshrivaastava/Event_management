import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";

export default function EventCard({ event }) {
  return (
    <div className="border rounded p-4 bg-white">
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-sm text-gray-600">
        {formatDate(event.dateTime)} • {event.location}
      </p>
      <p className="mt-2 text-sm text-gray-800">
        {event.description?.slice(0, 120)}
        {event.description?.length > 120 ? "..." : ""}
      </p>
      <div className="mt-3 flex justify-between items-center">
        <Link to={`/events/${event._id}`} className="text-blue-600 text-sm">
          View
        </Link>
        <span className="text-sm">
          {event.attendees?.length || 0}/{event.capacity}
        </span>
      </div>
    </div>
  );
}
