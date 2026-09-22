import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getServices } from '../../lib/api/services'
import RevealOnScroll from '../ui/RevealOnScroll'

const SIZE_LABELS = {
  mk: { SMALL: 'Мало куче', MEDIUM: 'Средно куче', LARGE: 'Големо куче' },
  en: { SMALL: 'Small dog', MEDIUM: 'Medium dog', LARGE: 'Large dog' },
}

function ServicesSection() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { t, i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  useEffect(() => {
    getServices()
      .then((data) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <RevealOnScroll>
    <section className="bg-surface py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-display text-primary font-semibold tracking-wide uppercase text-sm mb-3">
            {isMk ? 'Нашите услуги' : 'Our Services'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text mb-4">
            {isMk ? 'Нега за секое куче' : 'Grooming for every dog'}
          </h2>
          <p className="font-body text-text-muted text-lg">
            {isMk
              ? 'Цената зависи од големината на кучето — погледнете подолу.'
              : "Pricing depends on your dog's size — see what's included below."}
          </p>
        </div>

        {loading && (
          <p className="text-center font-body text-text-muted">
            {isMk ? 'Се вчитуваат услугите...' : 'Loading services...'}
          </p>
        )}

        {error && (
          <p className="text-center font-body text-error">
            {isMk ? 'Не успеавме да ги вчитаме услугите.' : "Couldn't load services right now."}
          </p>
        )}

        {!loading && !error && services.length === 0 && (
          <p className="text-center font-body text-text-muted">
            {isMk ? 'Наскоро повеќе услуги.' : 'Services coming soon.'}
          </p>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-background rounded-3xl p-6 border border-border"
              >
                <h3 className="font-display text-xl font-bold text-text mb-4">
                  {isMk ? service.nameMk : service.nameEn}
                </h3>
                <div className="space-y-2">
                  {service.pricing.map((tier) => (
                    <div
                      key={tier.dogSize}
                      className="flex items-center justify-between text-sm font-body"
                    >
                      <span className="text-text-muted">
                        {SIZE_LABELS[isMk ? 'mk' : 'en'][tier.dogSize]}
                      </span>
                      <span className="text-text font-semibold">
                        ${tier.price} · {tier.durationMinutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/book"
            className="inline-block bg-primary text-white px-8 py-4 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
          >
            {t('nav.bookAppointment')}
          </Link>
        </div>
      </div>
    </section>
    </RevealOnScroll>
  )
}

export default ServicesSection