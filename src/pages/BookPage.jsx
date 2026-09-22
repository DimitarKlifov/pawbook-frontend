import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getServices } from '../lib/api/services'
import { getMyPets } from '../lib/api/pets'
import { getAvailability, createBooking } from '../lib/api/bookings'
import DatePicker from '../components/booking/DatePicker'

function BookPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isMk = i18n.language === 'mk'
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

  const serviceName = (service) => (isMk ? service.nameMk : service.nameEn)
  const selectedServiceName = selectedService ? serviceName(selectedService) : ''
  const bookingSuccessServiceName = bookingSuccess
    ? (isMk ? bookingSuccess.serviceNameMk : bookingSuccess.serviceNameEn)
    : ''

  if (bookingSuccess) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-text">{t('booking.confirmed')}</h1>
        <div className="bg-surface border border-border rounded-2xl p-6 text-left space-y-2 mt-6">
          <p className="font-body text-text"><strong>{t('booking.pet')}:</strong> {bookingSuccess.petName}</p>
          <p className="font-body text-text"><strong>{t('booking.service')}:</strong> {bookingSuccessServiceName}</p>
          <p className="font-body text-text">
            <strong>{t('booking.when')}:</strong> {new Date(bookingSuccess.startTime).toLocaleString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
        >
          {t('booking.backToHome')}
        </button>
      </div>
    )
  }

  if (loadingOptions) {
    return <p className="text-center py-16 font-body text-text-muted">{t('booking.loading')}</p>
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-text mb-8 text-center">
        {t('booking.title')}
      </h1>

      {step === 1 && (
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-text text-lg">{t('booking.chooseService')}</h2>
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => selectService(service)}
              className="w-full text-left bg-surface border border-border rounded-2xl p-4 hover:border-primary transition-colors duration-200"
            >
              <p className="font-display font-semibold text-text">{serviceName(service)}</p>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-text text-lg">{t('booking.choosePet')}</h2>
          {pets.length === 0 && (
            <p className="font-body text-text-muted">
              {t('booking.noPets')}
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
            ← {t('booking.back')}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-text text-lg">{t('booking.chooseDate')}</h2>
          <DatePicker
            selectedDate={selectedDate}
            onSelectDate={(date) => handleDateChange({ target: { value: date } })}
        />

          {loadingSlots && <p className="font-body text-text-muted">{t('booking.checkingAvailability')}</p>}

          {!loadingSlots && selectedDate && !dayOpen && (
            <p className="font-body text-text-muted">
              {t('booking.closedThisDay')}
            </p>
          )}

          {!loadingSlots && selectedDate && dayOpen && availableSlots.length === 0 && (
            <p className="font-body text-text-muted">
              {t('booking.noSlotsAvailable')}
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
            ← {t('booking.back')}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-text text-lg">{t('booking.reviewBooking')}</h2>
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-2">
            <p className="font-body text-text"><strong>{t('booking.pet')}:</strong> {selectedPet.name}</p>
            <p className="font-body text-text"><strong>{t('booking.service')}:</strong> {selectedServiceName}</p>
            <p className="font-body text-text">
                <strong>{t('booking.date')}:</strong> {new Date(selectedDate).toLocaleDateString('en-GB')}
            </p>
            <p className="font-body text-text"><strong>{t('booking.time')}:</strong> {selectedTime.slice(0, 5)}</p>
          </div>

          {bookingError && <p className="font-body text-sm text-error">{bookingError}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="font-body text-sm text-text-muted hover:text-primary"
            >
              ← {t('booking.back')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors duration-200"
            >
              {confirming ? t('booking.booking') : t('booking.confirmBooking')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookPage