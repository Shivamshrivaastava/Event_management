import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatDate } from "../utils/format";
import { useAuth } from "../contexts/AuthContext";

export default function EventDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    api
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => setError(err.message));
  };
  useEffect(load, [id]);

  const register = async () => {
    try {
      await api.post(`/events/${id}/register`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };
  const cancel = async () => {
    try {
      await api.post(`/events/${id}/cancel`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  if (!event) return <p className="p-6">{error || "Loading..."}</p>;

  const isRegistered = user && event.attendees.some((a) => a._id === user._id);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold">{event.title}</h2>
      <p className="text-gray-600">
        {formatDate(event.dateTime)} • {event.location}
      </p>
      <p className="mt-4">{event.description}</p>
      <p className="mt-2 text-sm">
        Capacity: {event.attendees.length}/{event.capacity}
      </p>
      {user?.role === "attendee" && (
        <div className="mt-4">
          {!isRegistered ? (
            <button
              onClick={register}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Register
            </button>
          ) : (
            <button
              onClick={cancel}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Cancel Registration
            </button>
          )}
        </div>
      )}
      {user?.role === "organizer" && user._id === event.organizer._id && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => nav(`/events/${event._id}/edit`)}
            className="px-3 py-1 border rounded"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
