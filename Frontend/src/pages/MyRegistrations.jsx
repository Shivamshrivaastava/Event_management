import  { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import EventCard from '../components/EventCard'

export default function MyRegistrations() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])

  useEffect(() => {
    api.get('/events').then(res => {
      const reg = res.data.filter(e => e.attendees.some(a => a._id === user._id))
      setEvents(reg)
    })
  }, [user])

  return (
    <div className="container mx-auto px-4 py-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map(e => <EventCard key={e._id} event={e} />)}
      {events.length === 0 && <p>No registrations found.</p>}
    </div>
  )
}
