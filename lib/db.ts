// This is a mock database service
// In a real application, you would use a real database like PostgreSQL, MongoDB, etc.

import { v4 as uuidv4 } from "uuid"

// Types
export type User = {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  role: "admin" | "member" | "guest"
  createdAt: Date
  updatedAt: Date
}

export type Event = {
  id: string
  title: string
  description: string
  date: Date
  location: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export type Ministry = {
  id: string
  name: string
  description: string
  leader: string
  members: string[]
  createdAt: Date
  updatedAt: Date
}

// Mock data
const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password", // In a real app, this would be hashed
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const events: Event[] = []
const ministries: Ministry[] = []

// User methods
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return users.find((user) => user.email === email) || null
}

export const createUser = async (userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> => {
  const newUser: User = {
    id: uuidv4(),
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  users.push(newUser)
  return newUser
}

export const updateUser = async (
  id: string,
  userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
): Promise<User | null> => {
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return null

  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date(),
  }

  return users[index]
}

export const deleteUser = async (id: string): Promise<boolean> => {
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return false

  users.splice(index, 1)
  return true
}

// Event methods
export const getAllEvents = async (): Promise<Event[]> => {
  return events
}

export const getEventById = async (id: string): Promise<Event | null> => {
  return events.find((event) => event.id === id) || null
}

export const createEvent = async (eventData: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> => {
  const newEvent: Event = {
    id: uuidv4(),
    ...eventData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  events.push(newEvent)
  return newEvent
}

export const updateEvent = async (
  id: string,
  eventData: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>,
): Promise<Event | null> => {
  const index = events.findIndex((event) => event.id === id)
  if (index === -1) return null

  events[index] = {
    ...events[index],
    ...eventData,
    updatedAt: new Date(),
  }

  return events[index]
}

export const deleteEvent = async (id: string): Promise<boolean> => {
  const index = events.findIndex((event) => event.id === id)
  if (index === -1) return false

  events.splice(index, 1)
  return true
}

// Ministry methods
export const getAllMinistries = async (): Promise<Ministry[]> => {
  return ministries
}

export const getMinistryById = async (id: string): Promise<Ministry | null> => {
  return ministries.find((ministry) => ministry.id === id) || null
}

export const createMinistry = async (
  ministryData: Omit<Ministry, "id" | "createdAt" | "updatedAt">,
): Promise<Ministry> => {
  const newMinistry: Ministry = {
    id: uuidv4(),
    ...ministryData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  ministries.push(newMinistry)
  return newMinistry
}

