import React, { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";

export default function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((e) => (
        <EventCard key={e._id} event={e} />
      ))}
      {events.length === 0 && <p>No events found.</p>}
    </div>
  );
}
