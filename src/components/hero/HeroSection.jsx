import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getSiteImages } from '../../lib/api/siteImages'

function HeroSection() {
  const [hero, setHero] = useState(null)
  const { t, i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  useEffect(() => {
    getSiteImages()
      .then((images) => setHero(images.hero))
      .catch(() => {})
  }, [])

  const heading = (isMk ? hero?.headingMk : hero?.headingEn) || t('hero.headingDefault')
  const text = (isMk ? hero?.textMk : hero?.textEn) || t('hero.textDefault')

  return (
    <section id="home" className="bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <p className="font-display text-primary font-semibold tracking-wide uppercase text-sm">
              {t('hero.eyebrow')}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight">
              {heading}
            </h1>
            <p className="font-body text-text-muted text-lg max-w-md mx-auto md:mx-0">
              {text}
            </p>
            <div className="pt-2">
              <Link
                to="/book"
                className="inline-block bg-primary text-white px-8 py-4 rounded-full font-display font-semibold text-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg shadow-primary/20"
              >
                {t('nav.bookAppointment')}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-[3rem] -rotate-3 scale-95"></div>
            {hero?.imageUrl ? (
              <img
                src={hero.imageUrl}
                alt="PawBook"
                className="relative w-full aspect-square rounded-[3rem] shadow-xl object-cover"
              />
            ) : (
              <div className="relative w-full aspect-square rounded-[3rem] shadow-xl bg-surface border border-border flex flex-col items-center justify-center gap-3 p-8 text-center">
                <svg className="w-16 h-16 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-display font-semibold text-text-muted">
                  {t('hero.photoPlaceholderTitle')}
                </p>
                <p className="font-body text-sm text-text-muted/70">
                  {t('hero.photoPlaceholderSubtitle')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection