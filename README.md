# 🐾 PawBook – Frontend

> Web app for a dog grooming business: clients browse services, manage their pets and book appointments online; the groomer runs everything from a dashboard.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![i18n](https://img.shields.io/badge/Languages-MK%20%7C%20EN-orange?style=flat-square)

Backend: [pawbook-backend](https://github.com/DimitarKlifov/pawbook-backend) (Java, Spring Boot, PostgreSQL, JWT)

---

## 💡 About

I originally built this as a booking website for a local dog groomer. The project was not adopted, so I removed the business branding and published it as a portfolio project.

<!-- Screenshots: add images to a screenshots/ folder and uncomment
![Home page](screenshots/home.png)
![Booking](screenshots/booking.png)
![Groomer dashboard](screenshots/dashboard.png)
-->

---

## ✨ Features

**For clients**
- Register with email verification, log in, reset a forgotten password
- Add and manage pets (breed, size, notes)
- Book an appointment: pick a service, a pet and a free time slot from a date picker
- See and cancel upcoming bookings

**For the groomer** (protected dashboard)
- Bookings panel with status management
- Services and prices per dog size
- Working days and opening hours
- Photo gallery uploads
- Site control: change homepage images and text without touching the code

**General**
- Fully bilingual: **Macedonian and English** (i18next)
- Role-based protected routes, JWT stored in an auth context
- Loading skeletons, error states, toast notifications and confirmation dialogs
- Responsive design with Tailwind CSS and scroll animations (Motion)
- Privacy policy and terms of service pages

---

## 🏗️ Project Structure

```
src/
  pages/        route-level pages (Home, Book, MyPets, MyBookings, GroomerDashboard, auth pages)
  components/   layout, dashboard panels, booking date picker, gallery, reusable UI
  context/      AuthContext (JWT + user role), ToastContext
  lib/api/      small API client per resource (auth, bookings, pets, services, ...)
  locales/      en.json, mk.json translations
```

---

## 🛠️ Running Locally

**Requirements:** Node.js 20+, and the [backend](https://github.com/DimitarKlifov/pawbook-backend) running on `http://localhost:8080`

```bash
npm install
npm run dev
```

The app opens on `http://localhost:5173`.

---

## 🔭 Possible Improvements

- Read the API URL from an environment variable (`VITE_API_URL`) instead of hard-coding it
- Code-split the dashboard to reduce the bundle size
- Component tests with Vitest and React Testing Library
