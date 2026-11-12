import { useEffect, useRef, useState } from 'react'
import { LOGOS } from '../data/achievements'
import { BIRTHDAY_MESSAGE, BIRTHDAY_TITLE } from '../config'
import songUrl from '../assets/best-friend.mp3'
import friendsImageUrl from '../assets/friends-image.jpg'

/* ---------------- Reproductor de música (HTML5 Audio) ---------------- */
const SONG_TITLE = 'Best Friend'

export function MusicButton() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(songUrl)
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    // Los navegadores bloquean el audio hasta que el usuario interactúa con la página.
    // Intentamos reproducir de inmediato; si no se puede, arranca con el primer clic/tecla.
    // `disposed` evita que un efecto ya desmontado (p. ej. el doble montaje de StrictMode)
    // registre listeners o reproduzca después del cleanup: eso hacía sonar la canción dos veces.
    let disposed = false
    const events = ['pointerdown', 'keydown', 'touchstart']
    const unlock = (e) => {
      events.forEach((ev) => window.removeEventListener(ev, unlock))
      if (disposed) return
      // Si el primer clic es sobre el propio reproductor, que lo maneje su botón.
      if (!e.target.closest?.('.player')) audio.play().catch(() => {})
    }
    audio.play().catch(() => {
      if (!disposed) events.forEach((ev) => window.addEventListener(ev, unlock))
    })

    return () => {
      disposed = true
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      events.forEach((ev) => window.removeEventListener(ev, unlock))
    }
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().catch((e) => console.warn('No se pudo reproducir el audio', e))
    else a.pause()
  }

  return (
    <div className={`player ${playing ? 'on' : ''}`}>
      <button className="player-btn" onClick={toggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'} title={playing ? 'Pausar' : 'Reproducir'}>
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
          </svg>
        )}
      </button>
      <div className="player-info">
        <span className="player-kicker">{playing ? 'Sonando' : 'En pausa'}</span>
        <span className="player-title">{SONG_TITLE}</span>
      </div>
      <span className="eq" aria-hidden>
        <i />
        <i />
        <i />
      </span>
    </div>
  )
}

/* ---------------- Popup de logros ---------------- */
export function AchievementPopup({ item, onClose }) {
  if (!item) return null
  const info = item.kind === 'logo' ? LOGOS[item.id] : item
  return (
    <div className="popup" role="dialog" key={item.id}>
      <button className="popup-close" onClick={onClose} aria-label="Cerrar">
        ✕
      </button>
      <div className="popup-icon" style={{ background: item.color || '#ffffff22' }}>
        {info.icon}
      </div>
      <div>
        <div className="popup-kicker">🏅 Logro desbloqueado</div>
        <h3>{info.title}</h3>
        <p>{info.text}</p>
      </div>
    </div>
  )
}

/* ---------------- Confeti ---------------- */
const CONFETTI_COLORS = ['#ffcf4a', '#ff7aa8', '#7ad7ff', '#9cff7a', '#c58cff', '#ff9e57']
const makePieces = () =>
  Array.from({ length: 70 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    animationDelay: `${Math.random() * 1.2}s`,
    animationDuration: `${2.4 + Math.random() * 2}s`,
    transform: `rotate(${Math.random() * 360}deg)`,
  }))

function Confetti() {
  const [pieces] = useState(makePieces)
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((style, i) => (
        <span key={i} style={style} />
      ))}
    </div>
  )
}

/* ---------------- Modal de cumpleaños ---------------- */
export function BirthdayModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <Confetti />
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Panel izquierdo: el diorama 3D se coloca encima de este marco */}
        <div className="modal-scene" aria-hidden />
        {/* Panel derecho: el mensaje */}
        <div className="modal-message">
          <button className="popup-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
          <div className="modal-badge">🎂</div>
          <h2>{BIRTHDAY_TITLE}</h2>
          <div className="modal-body">
            {BIRTHDAY_MESSAGE.map((p, i) => (
              <p key={i} style={{ animationDelay: `${0.35 + i * 0.12}s` }}>
                {p}
              </p>
            ))}
          </div>
          <figure className="modal-photo" style={{ animationDelay: `${0.35 + BIRTHDAY_MESSAGE.length * 0.12}s` }}>
            <img src={friendsImageUrl} alt="Foto de los amigos" />
          </figure>
          <button className="modal-cta" onClick={onClose}>
            🎉 ¡Gracias!
          </button>
        </div>
      </div>
    </div>
  )
}

export function BirthdayButton({ onClick }) {
  return (
    <button className="bday-btn" onClick={onClick}>
      <span className="bday-btn-shadow" aria-hidden />
      <span className="bday-btn-edge" aria-hidden />
      <span className="bday-btn-front">
        <span className="bday-btn-icon">💬</span> ¡Haz click aquí!
      </span>
    </button>
  )
}

export function Header() {
  return (
    <div className="header">
      <h1>Nico's Roadmap!</h1>
      <p>Arrastra para girar · Rueda para acercar · Toca los letreros y logos</p>
    </div>
  )
}

/* ---------------- Capa de UI completa ---------------- */
export default function UI({ selected, onCloseSelected, birthdayOpen, setBirthdayOpen }) {
  return (
    <>
      <Header />
      <MusicButton />
      <AchievementPopup item={selected} onClose={onCloseSelected} />
      <BirthdayButton onClick={() => setBirthdayOpen(true)} />
      <BirthdayModal open={birthdayOpen} onClose={() => setBirthdayOpen(false)} />
    </>
  )
}
