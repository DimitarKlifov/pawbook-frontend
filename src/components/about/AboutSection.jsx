import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getSiteImages } from '../../lib/api/siteImages'
import RevealOnScroll from '../ui/RevealOnScroll'

function AboutSection() {
  const [about, setAbout] = useState(null)
  const { t, i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  useEffect(() => {
    getSiteImages()
      .then((images) => setAbout(images.about))
      .catch(() => {})
  }, [])

  const heading = (isMk ? about?.headingMk : about?.headingEn) || t('about.headingDefault')
  const text = (isMk ? about?.textMk : about?.textEn) || t('about.textDefault')

  const highlights = [
    { title: t('about.highlight1Title'), description: t('about.highlight1Desc') },
    { title: t('about.highlight2Title'), description: t('about.highlight2Desc') },
    { title: t('about.highlight3Title'), description: t('about.highlight3Desc') },
  ]

  return (
    <RevealOnScroll>
    <section id="about" className="bg-surface py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute inset-0 bg-primary-light/30 rounded-[3rem] rotate-2 scale-95"></div>
            {about?.imageUrl ? (
              <img
                src={about.imageUrl}
                alt="About PawBook"
                className="relative w-full aspect-4/3 rounded-[3rem] object-cover"
              />
            ) : (
              <div className="relative w-full aspect-4/3 rounded-[3rem] bg-background border border-border flex flex-col items-center justify-center gap-3 p-8 text-center">
                <svg className="w-14 h-14 text-secondary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-display font-semibold text-text-muted">
                  {t('about.photoPlaceholderTitle')}
                </p>
                <p className="font-body text-sm text-text-muted/70">
                  {t('about.photoPlaceholderSubtitle')}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <p className="font-display text-primary font-semibold tracking-wide uppercase text-sm">
              {t('about.eyebrow')}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text">
              {heading}
            </h2>
            <p className="font-body text-text-muted text-lg">
              {text}
            </p>

            <div className="space-y-5 pt-2">
              {highlights.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-text">
                      {item.title}
                    </h3>
                    <p className="font-body text-text-muted text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    </RevealOnScroll>
  )
}

export default AboutSection