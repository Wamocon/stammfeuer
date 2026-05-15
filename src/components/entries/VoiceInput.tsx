'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Mic, MicOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'

interface SpeechRecognitionResult {
  readonly length: number
  [index: number]: { readonly transcript: string; readonly confidence: number }
}
interface SpeechRecognitionResultList {
  readonly length: number
  [index: number]: SpeechRecognitionResult
}
interface SpeechRecognitionEventData {
  readonly results: SpeechRecognitionResultList
}
interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEventData) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance
type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionCtor
  webkitSpeechRecognition?: SpeechRecognitionCtor
}

interface VoiceInputProps {
  onTranscript: (text: string) => void
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const t = useTranslations('entries')
  const { showToast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    const w = window as WindowWithSpeech
    if (!w.SpeechRecognition && !w.webkitSpeechRecognition) {
      setSupported(false)
    }
  }, [])

  const startRecording = () => {
    const w = window as WindowWithSpeech
    const SpeechRecognitionAPI = w.SpeechRecognition ?? w.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      showToast(t('voiceUnsupported'), 'error')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'de-DE'

    recognition.onresult = (event: SpeechRecognitionEventData) => {
      let text = ''
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      setTranscript(text)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      showToast(t('voiceUnsupported'), 'error')
    }

    recognition.onend = () => setIsRecording(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  const confirmTranscript = () => {
    onTranscript(transcript)
    setTranscript('')
  }

  if (!supported) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-stone-400">
        <AlertCircle size={16} strokeWidth={1.5} />
        {t('voiceUnsupported')}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {isRecording ? (
          <Button variant="danger" size="sm" onClick={stopRecording}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            {t('voiceStop')}
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={startRecording}>
            <Mic size={16} strokeWidth={1.5} />
            {t('voiceStart')}
          </Button>
        )}
        {isRecording && (
          <span className="text-sm text-gray-500 dark:text-stone-400 animate-pulse">
            {t('voiceTranscribing')}
          </span>
        )}
      </div>

      {transcript && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-stone-400">{t('voiceEditBefore')}</p>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={confirmTranscript}>
              Übernehmen
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setTranscript('')}>
              Verwerfen
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
