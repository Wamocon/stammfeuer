'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Utensils, Star, Lightbulb, MapPin, Camera } from 'lucide-react'

const slides = [
  {
    type: 'feature',
    icon: BookOpen,
    color: 'text-amber-400',
    title: 'Geschichten bewahren',
    text: 'Halte die Erlebnisse und Erinnerungen deiner Familie für immer fest - damit sie nie verloren gehen.',
  },
  {
    type: 'quote',
    icon: null,
    color: '',
    title: '',
    text: '"Omas Apfelkuchen-Rezept war fast verloren. Jetzt liegt es sicher im Archiv - für unsere Kinder und Kindeskinder."',
    author: 'Familie Brenner',
  },
  {
    type: 'feature',
    icon: Utensils,
    color: 'text-orange-400',
    title: 'Rezepte weitergeben',
    text: 'Generationen von Familienrezepten - mit Zutaten, Schritten und der Geschichte dahinter.',
  },
  {
    type: 'motivation',
    icon: null,
    color: '',
    title: 'Fange heute an.',
    text: 'Jede Familie hat Geschichten, die es wert sind, erzählt zu werden. Starte jetzt - bevor sie verloren gehen.',
  },
  {
    type: 'feature',
    icon: Star,
    color: 'text-yellow-400',
    title: 'Traditionen lebendig halten',
    text: 'Vom Weihnachtsessen bis zum Familienurlaub - dokumentiere was eure Familie einzigartig macht.',
  },
  {
    type: 'quote',
    icon: null,
    color: '',
    text: '"Endlich wissen meine Kinder, woher unsere Familie kommt. Ahnenecho hat das möglich gemacht."',
    author: 'Familie Moritz',
    title: '',
  },
  {
    type: 'feature',
    icon: Lightbulb,
    color: 'text-lime-400',
    title: 'Weisheiten der Vorfahren',
    text: 'Lebensratschläge, Sprichwörter und Erkenntnisse - das gesammelte Wissen deiner Familie.',
  },
  {
    type: 'motivation',
    icon: null,
    color: '',
    title: 'Dein Erbe wartet.',
    text: 'In 20 Jahren werden deine Kinder froh sein, dass du heute angefangen hast.',
  },
  {
    type: 'feature',
    icon: MapPin,
    color: 'text-emerald-400',
    title: 'Orte der Geschichte',
    text: 'Das alte Haus, der Heimatort, die erste Wohnung - orte eure Familiengeschichte auf der Karte.',
  },
  {
    type: 'feature',
    icon: Camera,
    color: 'text-blue-400',
    title: 'Fotos mit Bedeutung',
    text: 'Jedes Foto erzählt eine Geschichte. Füge Kontext hinzu, damit die nächste Generation versteht.',
  },
]

export function AuthSlideshow() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
        setVisible(true)
      }, 400)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const slide = slides[current]
  const Icon = slide.icon

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-white text-center">
      {/* Logo + Brand */}
      <div className="mb-10">
        <svg viewBox="0 0 40 48" className="w-14 h-14 mx-auto mb-3" fill="none" aria-hidden="true">
          <path d="M20 4C20 4 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 4 20 4Z" fill="white" opacity="0.9" />
          <path d="M20 16C20 16 14 22 14 28C14 31.9 16.7 35 20 35C23.3 35 26 31.9 26 28C26 22 20 16 20 16Z" fill="white" opacity="0.6" />
          <path d="M20 24C20 24 17 27 17 30C17 31.7 18.3 33 20 33C21.7 33 23 31.7 23 30C23 27 20 24 20 24Z" fill="white" opacity="0.3" />
        </svg>
        <p className="text-2xl font-bold tracking-wide">Ahnenecho</p>
        <p className="text-white/70 text-sm mt-1">Das Echo deiner Ahnen, fuer immer lebendig.</p>
      </div>

      {/* Slide content */}
      <div
        className="max-w-sm space-y-4 transition-all duration-400"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
      >
        {slide.type === 'feature' && Icon && (
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
              <Icon size={28} className={slide.color} strokeWidth={1.5} />
            </div>
          </div>
        )}

        {(slide.type === 'quote' || slide.type === 'motivation') && (
          <div className="flex justify-center">
            <div className="w-10 h-1 bg-white/40 rounded-full" />
          </div>
        )}

        {slide.title && (
          <h2 className="text-2xl font-bold text-white">{slide.title}</h2>
        )}

        <p className={`text-lg leading-relaxed ${slide.type === 'quote' ? 'italic text-white/90' : 'text-white/80'}`}>
          {slide.text}
        </p>

        {'author' in slide && slide.author && (
          <p className="text-sm text-white/60 font-medium">- {slide.author}</p>
        )}
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6' : 'bg-white/40'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
