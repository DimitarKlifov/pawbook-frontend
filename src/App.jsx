function App() {
  return (
    <div className="min-h-screen p-12 space-y-6">
      <h1 className="font-display text-5xl font-bold text-primary">
        PawBook
      </h1>
      <p className="font-body text-text-muted text-lg">
        This is body text using our design system.
      </p>
      <button className="bg-primary text-white px-6 py-3 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200">
        Book an Appointment
      </button>
    </div>
  )
}

export default App