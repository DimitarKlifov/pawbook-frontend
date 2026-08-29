import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getServices } from '../lib/api/services'
import { getMyPets } from '../lib/api/pets'
import { getAvailability, createBooking } from '../lib/api/bookings'

function BookPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [services, setServices] = useState([])
  const [pets, setPets] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  const [selectedService, setSelectedService] = useState(null)
  const [selectedPet, setSelectedPet] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [dayOpen, setDayOpen] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedTime, setSelectedTime] = useState(null)

  const [confirming, setConfirming] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(null)

  useEffect(() => {
    Promise.all([getServices(), getMyPets()])
      .then(([servicesData, petsData]) => {
        setServices(servicesData)
        setPets(petsData)
      })
      .finally(() => setLoadingOptions(false))
  }, [])

  function selectService(service) {
    setSelectedService(service)
    setStep(2)
  }

  function selectPet(pet) {
    setSelectedPet(pet)
    setStep(3)
  }

  function handleDateChange(e) {
    const date = e.target.value
    setSelectedDate(date)
    setSelectedTime(null)
    setLoadingSlots(true)

    getAvailability(date, selectedService.id, selectedPet.id)
      .then((data) => {
        setDayOpen(data.dayOpen)
        setAvailableSlots(data.availableSlots)
      })
      .catch(() => {
        setDayOpen(false)
        setAvailableSlots([])
      })
      .finally(() => setLoadingSlots(false))
  }

  function selectTime(time) {
    setSelectedTime(time)
    setStep(4)
  }

  async function handleConfirm() {
    setConfirming(true)
    setBookingError(null)

    try {
      const booking = await createBooking(selectedPet.id, selectedService.id, selectedDate, selectedTime)
      setBookingSuccess(booking)
    } catch (err) {
      setBookingError(err.message)
    } finally {
      setConfirming(false)
    }
  }

  if (bookingSuccess) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-text">Booking Confirmed! 🎉</h1>
        <div className="bg-surface border border-border rounded-2xl p-6 text-left space-y-2 mt-6">
          <p className="font-body text-text"><strong>Pet:</strong> {bookingSuccess.petName}</p>
          <p className="font-body text-text"><strong>Service:</strong> {bookingSuccess.serviceName}</p>
          <p className="font-body text-text">
            <strong>When:</strong> {new Date(bookingSuccess.startTime).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
        >
          Back to Home
        </button>
      </div>
    )
  }

  if (loadingOptions) {
    return <p className="text-center py-16 font-body text-text-muted">Loading...</p>
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-text mb-8 text-center">
        Book an Appointment
      </h1>

      {/* Step 1: Service */}
      {step === 1 && (
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-text text-lg">Choose a service</h2>
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => selectService(service)}
              className="w-full text-left bg-surface border border-border rounded-2xl p-4 hover:border-primary transition-colors duration-200"
            >
              <p className="font-display font-semibold text-text">{service.name}</p>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Pet */}
      {step === 2 && (
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-text text-lg">Choose your pet</h2>
          {pets.length === 0 && (
            <p className="font-body text-text-muted">
              You don't have any pets yet. Add one on your Pets page first.
            </p>
          )}
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => selectPet(pet)}
              className="w-full text-left bg-surface border border-border rounded-2xl p-4 hover:border-primary transition-colors duration-200"
            >
              <p className="font-display font-semibold text-text">{pet.name}</p>
              <p className="font-body text-text-muted text-sm capitalize">{pet.breed} · {pet.size.toLowerCase()}</p>
            </button>
          ))}
          <button onClick={() => setStep(1)} className="font-body text-sm text-text-muted hover:text-primary">
            ← Back
          </button>
        </div>
      )}

      {/* Step 3: Date & time */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-text text-lg">Choose a date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />

          {loadingSlots && <p className="font-body text-text-muted">Checking availability...</p>}

          {!loadingSlots && selectedDate && !dayOpen && (
            <p className="font-body text-text-muted">
              We're closed on this date. Please choose another day.
            </p>
          )}

          {!loadingSlots && selectedDate && dayOpen && availableSlots.length === 0 && (
            <p className="font-body text-text-muted">
              No appointments available for this date. Please choose another day.
            </p>
          )}

          {!loadingSlots && dayOpen && availableSlots.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => selectTime(time)}
                  className="px-3 py-2 rounded-xl border border-border bg-surface font-body text-sm text-text hover:border-primary hover:bg-primary/5 transition-colors duration-200"
                >
                  {time.slice(0, 5)}
                </button>
              ))}
            </div>
          )}

          <button onClick={() => setStep(2)} className="font-body text-sm text-text-muted hover:text-primary">
            ← Back
          </button>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-text text-lg">Review your booking</h2>
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-2">
            <p className="font-body text-text"><strong>Pet:</strong> {selectedPet.name}</p>
            <p className="font-body text-text"><strong>Service:</strong> {selectedService.name}</p>
            <p className="font-body text-text"><strong>Date:</strong> {selectedDate}</p>
            <p className="font-body text-text"><strong>Time:</strong> {selectedTime.slice(0, 5)}</p>
          </div>

          {bookingError && <p className="font-body text-sm text-error">{bookingError}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="font-body text-sm text-text-muted hover:text-primary"
            >
              ← Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors duration-200"
            >
              {confirming ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookPage