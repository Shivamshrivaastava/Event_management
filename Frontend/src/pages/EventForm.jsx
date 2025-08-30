import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EventForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    capacity: 10,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      api.get(`/events/${id}`).then((res) =>
        setForm({
          title: res.data.title,
          description: res.data.description,
          dateTime: res.data.dateTime.slice(0, 16),
          location: res.data.location,
          capacity: res.data.capacity,
        })
      );
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) await api.put(`/events/${id}`, form);
      else await api.post("/events", form);
      nav("/my-events");
    } catch (err) {
      setError(err.response?.data?.message || "Error saving event");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Event" : "Create Event"}
      </h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows="4"
        />
        <input
          type="datetime-local"
          name="dateTime"
          value={form.dateTime}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          min="1"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
