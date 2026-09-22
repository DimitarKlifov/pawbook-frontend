import { useState, useEffect } from 'react'
import { Upload, Check } from 'lucide-react'
import { getSiteImages, uploadSiteImage, updateSiteText } from '../../lib/api/siteImages'

const DEFAULTS = {
  hero: {
    headingMk: 'Кучиња кои си заминуваат среќни и убави',
    headingEn: 'Where happy dogs leave looking their best',
    textMk: 'Нежна нега во мирна и пријатна атмосфера, со внимание за секој детаљ. Удобноста на вашето куче секогаш е на прво место.',
    textEn: "Gentle, experienced grooming in a calm and caring environment. Your dog's comfort is our top priority.",
  },
  about: {
    headingMk: 'Грижа и мир при секоја посета',
    headingEn: 'A calm, caring approach to every appointment',
    textMk: 'Веруваме дека негата треба да биде пријатно искуство, а не стрес. Секое куче добива индивидуално внимание, нежен пристап и толку време колку што му е потребно за да се опушти.',
    textEn: 'We believe grooming should be a positive experience, not a stressful one. Every dog gets individual attention, gentle handling, and the time they need to feel comfortable.',
  },
}

function ImageUploadCard({ slot, label, imageUrl, onUploaded }) {
  const [preview, setPreview] = useState(imageUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState(null)

  useEffect(() => setPreview(imageUrl), [imageUrl])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setError(null)
    try {
      const result = await uploadSiteImage(slot, file)
      onUploaded(slot, result.imageUrl)
    } catch (err) {
      setError('Upload failed, try again')
      setPreview(imageUrl)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-surface">
      <h3 className="font-display text-text mb-2">{label} Photo</h3>
      {preview ? (
        <img src={preview} alt={label} className="w-full h-40 object-cover rounded" />
      ) : (
        <div className="w-full h-40 rounded bg-background flex items-center justify-center text-text-muted text-sm">
          No image uploaded yet
        </div>
      )}

      <label
        htmlFor={`file-${slot}`}
        className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors
          ${uploading
            ? 'bg-background text-text-muted cursor-not-allowed'
            : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
      >
        <Upload size={16} strokeWidth={2} />
        {uploading ? 'Uploading...' : 'Choose Photo'}
      </label>
      <input
        id={`file-${slot}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />
      {fileName && !uploading && !error && (
        <p className="text-xs text-text-muted mt-1 truncate">{fileName}</p>
      )}
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  )
}

function TextEditCard({ slot, label, headingMk, headingEn, textMk, textEn, onSaved }) {
  const [mkHeading, setMkHeading] = useState(headingMk)
  const [enHeading, setEnHeading] = useState(headingEn)
  const [mkText, setMkText] = useState(textMk)
  const [enText, setEnText] = useState(textEn)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setMkHeading(headingMk)
    setEnHeading(headingEn)
    setMkText(textMk)
    setEnText(textEn)
  }, [headingMk, headingEn, textMk, textEn])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await updateSiteText(slot, mkHeading, enHeading, mkText, enText)
      onSaved(slot, mkHeading, enHeading, mkText, enText)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-surface space-y-4">
      <h3 className="font-display text-text">{label} Text</h3>

      <div>
        <p className="text-xs font-semibold text-text-muted mb-1">Macedonian</p>
        <input
          type="text"
          value={mkHeading}
          onChange={(e) => setMkHeading(e.target.value)}
          placeholder="Наслов"
          className="w-full border border-border rounded px-3 py-2 mb-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <textarea
          value={mkText}
          onChange={(e) => setMkText(e.target.value)}
          placeholder="Текст"
          rows={4}
          className="w-full border border-border rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-xs font-semibold text-text-muted mb-1">English</p>
        <input
          type="text"
          value={enHeading}
          onChange={(e) => setEnHeading(e.target.value)}
          placeholder="Headline"
          className="w-full border border-border rounded px-3 py-2 mb-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <textarea
          value={enText}
          onChange={(e) => setEnText(e.target.value)}
          placeholder="Paragraph text"
          rows={4}
          className="w-full border border-border rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
      >
        {saved ? <Check size={16} /> : null}
        {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
      </button>
    </div>
  )
}

export default function SiteControlPanel() {
  const [images, setImages] = useState({ hero: {}, about: {} })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSiteImages()
      .then((data) => {
        setImages({
          hero: {
            imageUrl: data.hero?.imageUrl,
            headingMk: data.hero?.headingMk ?? DEFAULTS.hero.headingMk,
            headingEn: data.hero?.headingEn ?? DEFAULTS.hero.headingEn,
            textMk: data.hero?.textMk ?? DEFAULTS.hero.textMk,
            textEn: data.hero?.textEn ?? DEFAULTS.hero.textEn,
          },
          about: {
            imageUrl: data.about?.imageUrl,
            headingMk: data.about?.headingMk ?? DEFAULTS.about.headingMk,
            headingEn: data.about?.headingEn ?? DEFAULTS.about.headingEn,
            textMk: data.about?.textMk ?? DEFAULTS.about.textMk,
            textEn: data.about?.textEn ?? DEFAULTS.about.textEn,
          },
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleImageUploaded = (slot, imageUrl) => {
    setImages((prev) => ({ ...prev, [slot]: { ...prev[slot], imageUrl } }))
  }

  const handleTextSaved = (slot, headingMk, headingEn, textMk, textEn) => {
    setImages((prev) => ({ ...prev, [slot]: { ...prev[slot], headingMk, headingEn, textMk, textEn } }))
  }

  if (loading) return <p className="text-text-muted">Loading site content...</p>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display text-text mb-3">Hero Section</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUploadCard slot="hero" label="Hero" imageUrl={images.hero.imageUrl} onUploaded={handleImageUploaded} />
          <TextEditCard
            slot="hero"
            label="Hero"
            headingMk={images.hero.headingMk}
            headingEn={images.hero.headingEn}
            textMk={images.hero.textMk}
            textEn={images.hero.textEn}
            onSaved={handleTextSaved}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-display text-text mb-3">About Section</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUploadCard slot="about" label="About" imageUrl={images.about.imageUrl} onUploaded={handleImageUploaded} />
          <TextEditCard
            slot="about"
            label="About"
            headingMk={images.about.headingMk}
            headingEn={images.about.headingEn}
            textMk={images.about.textMk}
            textEn={images.about.textEn}
            onSaved={handleTextSaved}
          />
        </div>
      </div>
    </div>
  )
}