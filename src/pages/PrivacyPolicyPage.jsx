import { useTranslation } from 'react-i18next'

function PrivacyPolicyPage() {
  const { i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  if (isMk) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-6 font-body text-text">
        <h1 className="font-display text-3xl font-bold mb-4">Политика за приватност</h1>
        <p className="text-text-muted text-sm">Последно ажурирано: {new Date().toLocaleDateString('mk-MK')}</p>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Кои информации ги собираме</h2>
          <p>Кога креирате сметка или закажувате термин, собираме: име, е-маил адреса, телефонски број, и информации за вашите миленици (име, раса, големина, забелешки). Ако сте закажале термин, чуваме и историја на закажувања.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Зошто ги користиме овие информации</h2>
          <p>Ги користиме исклучиво за да управуваме со вашата сметка, да ги закажуваме и потврдуваме термините, да ве контактираме во врска со вашиот термин, и да ви испраќаме е-маил за потврда на сметка или ресетирање лозинка.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Со кого ги споделуваме информациите</h2>
          <p>Не ги продаваме вашите информации. Фотографиите од галеријата се чуваат преку услуга за складирање слики (Cloudinary). Е-маил пораките се испраќаат преку наш давател на е-маил услуги. Овие услуги ги гледаат само технички податоци потребни за нивната функција.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Чување на податоци</h2>
          <p>Вашите податоци се чуваат додека имате активна сметка. Можете да побарате бришење на вашата сметка и податоци во секое време.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Локално складирање</h2>
          <p>Користиме локално складирање во вашиот прелистувач (localStorage) за да ве задржиме најавени и да го запомниме вашиот избран јазик. Ова не се споделува со трети страни.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Вашите права</h2>
          <p>Имате право да побарате увид, исправка или бришење на вашите лични податоци во секое време. Контактирајте нè на е-маил адресата подолу.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Контакт</h2>
          <p>За прашања поврзани со приватноста, контактирајте нè на: hello@pawbook.example</p>
        </section>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-6 font-body text-text">
      <h1 className="font-display text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-text-muted text-sm">Last updated: {new Date().toLocaleDateString('en-GB')}</p>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">What information we collect</h2>
        <p>When you create an account or book an appointment, we collect: your name, email address, phone number, and information about your pets (name, breed, size, notes). If you book an appointment, we also keep a history of your bookings.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Why we use this information</h2>
        <p>We use it solely to manage your account, schedule and confirm appointments, contact you about your bookings, and send you emails for account verification or password resets.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Who we share information with</h2>
        <p>We do not sell your information. Gallery photos are stored through an image hosting service (Cloudinary). Emails are sent through our email provider. These services only see the technical data needed for their function.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Data retention</h2>
        <p>Your data is kept for as long as you have an active account. You may request deletion of your account and data at any time.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Local storage</h2>
        <p>We use local storage in your browser (localStorage) to keep you logged in and remember your language preference. This is not shared with third parties.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Your rights</h2>
        <p>You have the right to request access to, correction of, or deletion of your personal data at any time. Contact us at the email below.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Contact</h2>
        <p>For privacy-related questions, contact us at: hello@pawbook.example</p>
      </section>
    </div>
  )
}

export default PrivacyPolicyPage