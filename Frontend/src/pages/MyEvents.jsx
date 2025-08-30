import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  const load = () => {
    api.get("/events").then((res) => {
      setEvents(res.data.filter((e) => e.organizer._id === user._id));
    });
  };

  useEffect(load, [user]);

  const del = async (id) => {
    await api.delete(`/events/${id}`);
    load();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">My Events</h2>
        <Link
          to="/events/new"
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Create Event
        </Link>
      </div>
      {events.map((e) => (
        <div
          key={e._id}
          className="p-4 bg-white border rounded mb-3 flex justify-between"
        >
          <div>
            <h3 className="font-semibold">{e.title}</h3>
            <p className="text-sm">{e.location}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/events/${e._id}/edit`}
              className="px-3 py-1 border rounded"
            >
              Edit
            </Link>
            <button
              onClick={() => del(e._id)}
              className="px-3 py-1 border text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
