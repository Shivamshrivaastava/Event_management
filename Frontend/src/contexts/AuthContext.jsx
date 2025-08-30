/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState, useContext } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const signup = async (payload) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/signup', payload)
      const { token, user } = res.data
      localStorage.setItem('token', token)
      setUser(user)
      return res
    } finally { setLoading(false) }
  }

  const login = async (payload) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', payload)
      const { token, user } = res.data
      localStorage.setItem('token', token)
      setUser(user)
      return res
    } finally { setLoading(false) }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
