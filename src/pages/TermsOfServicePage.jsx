import { useTranslation } from 'react-i18next'

function TermsOfServicePage() {
  const { i18n } = useTranslation()
  const isMk = i18n.language === 'mk'

  if (isMk) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-6 font-body text-text">
        <h1 className="font-display text-3xl font-bold mb-4">Услови за користење</h1>
        <p className="text-text-muted text-sm">Последно ажурирано: {new Date().toLocaleDateString('mk-MK')}</p>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">За веб-страницата</h2>
          <p>PawBook е платформа за закажување термини за нега на кучиња. Веб-страницата служи исклучиво за закажување — не претставува правен договор за извршени услуги.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Сметки</h2>
          <p>За да закажете термин, потребно е да креирате сметка со точни информации. Одговорни сте за чувањето на вашата лозинка во тајност.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Закажување и откажување</h2>
          <p>Термините може да се откажат преку вашата сметка пред закажаниот датум. Ве молиме откажувајте навреме за да овозможите на друг клиент да го земе термин.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Одговорност</h2>
          <p>Ние не сме одговорни за здравствени состојби на вашиот миленик кои не биле пријавени пред терминот. Ве молиме наведете ги сите релевантни информации во делот за забелешки при додавање миленик.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Промени на условите</h2>
          <p>Може да ги ажурираме овие услови повремено. Продолжувањето со користење на веб-страницата по промените значи прифаќање на новите услови.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Контакт</h2>
          <p>За прашања, контактирајте нè на: hello@pawbook.example</p>
        </section>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-6 font-body text-text">
      <h1 className="font-display text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-text-muted text-sm">Last updated: {new Date().toLocaleDateString('en-GB')}</p>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">About the website</h2>
        <p>PawBook is a scheduling platform for dog grooming appointments. The website exists solely for booking purposes — it does not constitute a legal contract for services rendered.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Accounts</h2>
        <p>To book an appointment, you need to create an account with accurate information. You are responsible for keeping your password confidential.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Booking and cancellation</h2>
        <p>Appointments may be cancelled through your account before the scheduled date. Please cancel in a timely manner so another client can take the slot.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Liability</h2>
        <p>We are not responsible for pre-existing health conditions of your pet that were not disclosed before the appointment. Please include all relevant information in the notes field when adding a pet.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Changes to these terms</h2>
        <p>We may update these terms from time to time. Continued use of the website after changes means you accept the new terms.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold">Contact</h2>
        <p>For questions, contact us at: hello@pawbook.example</p>
      </section>
    </div>
  )
}

export default TermsOfServicePage