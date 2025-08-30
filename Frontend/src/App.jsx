import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventsList from "./pages/EventsList";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyEvents from "./pages/MyEvents";
import MyRegistrations from "./pages/MyRegistrations";
import EventForm from "./pages/EventForm";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/my-events"
          element={
            <ProtectedRoute role={"organizer"}>
              <MyEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute role={"attendee"}>
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/new"
          element={
            <ProtectedRoute role={"organizer"}>
              <EventForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute role={"organizer"}>
              <EventForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
