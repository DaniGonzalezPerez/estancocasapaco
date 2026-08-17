import { useEffect, useMemo, useState } from 'react'
import {
  Coffee,
  MapPin,
  Wine,
  ShoppingBasket,
  Umbrella,
  Snowflake,
  Users,
  SquareParking,
  CreditCard,
  Star,
  Menu as MenuIcon,
  X as CloseIcon,
  MessageCircle,
  Clock,
} from 'lucide-react'
import './App.css'

const PHONE_DISPLAY = '690 84 45 52'
const WHATSAPP_NUMBER = '34690844552'
const WHATSAPP_MESSAGE = 'Hola, me gustaría consultar información sobre Casa Paco.'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
const ADDRESS = 'Ctra. General-Tablado, s/n, 33812 Cerredo, Asturias'
const MAPS_URL =
  'https://www.google.com/maps/place/Cafeter%C3%ADa+%22Casa+Paco%22+%2F+Estanco/@42.9459602,-6.4905959,17z'

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#sobre-nosotros', label: 'Sobre nosotros' },
  { href: '#horarios', label: 'Horarios' },
  { href: '#ubicacion', label: 'Ubicación' },
]

const HOURS = [
  { day: 'Lunes', short: 'Lun', ranges: [['7:45', '21:30']] },
  { day: 'Martes', short: 'Mar', ranges: [['7:45', '21:30']] },
  { day: 'Miércoles', short: 'Mié', ranges: [['7:45', '21:30']] },
  { day: 'Jueves', short: 'Jue', ranges: [['7:45', '21:30']] },
  { day: 'Viernes', short: 'Vie', ranges: [['7:45', '21:30']] },
  { day: 'Sábado', short: 'Sáb', ranges: [['8:30', '14:00']] },
  { day: 'Domingo', short: 'Dom', ranges: [['7:45', '14:00'], ['17:00', '21:30']] },
]

const HIGHLIGHTS = [
  { icon: Coffee, title: 'Buen café', text: 'El desayuno más recomendado de Cerredo, con trato cercano.' },
  { icon: Wine, title: 'Bar y estanco', text: 'Alcohol, cerveza, vino y también servicio de estanco.' },
  { icon: ShoppingBasket, title: 'Variedad de productos', text: 'Material escolar, carteras, navajas artesanales y otros artículos de estanco.' },
  { icon: Users, title: 'Ambiente familiar', text: 'Ideal para ir con niños, ambiente agradable y relajado.' },
  { icon: SquareParking, title: 'Aparcamiento gratuito', text: 'Aparcamiento gratuito en la calle junto al local.' },
  { icon: CreditCard, title: 'Pago con tarjeta', text: 'Aceptamos tarjeta, débito y pagos móviles NFC.' },
  { icon: Umbrella, title: 'Terraza en verano', text: 'Disfruta del buen tiempo tomando algo en nuestra terraza.' },
  { icon: Snowflake, title: 'Chocolate caliente en invierno', text: 'En los meses fríos, no falta un buen chocolate caliente.' },
]

const REVIEWS = [
  {
    text: '“Lugar muy recomendable para desayunos y disfrutar de un ambiente muy acogedor. Trato impecable y camareras muy agradables.”',
    author: 'Mercedes',
  },
  {
    text: '“Muy buena atención por parte de las dueñas, siempre atentas y dispuestas a informar, incluso nos acompañaron al inicio de la ruta a la laguna.”',
    author: 'Luisa Álvarez',
  },
  {
    text: '“El café decente y el sándwich muy bueno. Precio más que razonable. Las dos hermanas que atienden son un amor, muy cordiales.”',
    author: 'Eduardo Girón',
  },
]

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

const parseTime = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function useOpenStatus(hours) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    const jsDay = now.getDay()
    const todayIndex = jsDay === 0 ? 6 : jsDay - 1
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const todayRanges = hours[todayIndex].ranges

    let closesAt = null
    for (const [start, end] of todayRanges) {
      if (nowMinutes >= parseTime(start) && nowMinutes < parseTime(end)) {
        closesAt = end
        break
      }
    }

    let nextOpen = null
    if (!closesAt) {
      const upcomingToday = todayRanges.find(([start]) => parseTime(start) > nowMinutes)
      if (upcomingToday) {
        nextOpen = { when: 'hoy', time: upcomingToday[0] }
      } else {
        for (let i = 1; i <= 7; i++) {
          const idx = (todayIndex + i) % 7
          const dayHours = hours[idx]
          if (dayHours.ranges.length) {
            nextOpen = {
              when: i === 1 ? 'mañana' : `el ${dayHours.day.toLowerCase()}`,
              time: dayHours.ranges[0][0],
            }
            break
          }
        }
      }
    }

    return { todayIndex, isOpen: Boolean(closesAt), closesAt, nextOpen }
  }, [now, hours])
}

function Header() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()

  const closeMenu = () => setOpen(false)

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a href="#inicio" className="header__brand" onClick={closeMenu}>
          <span className="header__brand-icon" aria-hidden="true">
            <Coffee size={22} strokeWidth={1.75} />
          </span>
          <span>
            Casa Paco
            <small>Cafetería &amp; Estanco</small>
          </span>
        </a>

        <nav className={`nav ${open ? 'nav--open' : ''}`}>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary nav__cta"
            onClick={closeMenu}
          >
            <MessageCircle size={16} strokeWidth={1.75} />
            WhatsApp
          </a>
        </nav>

        <button
          className={`burger ${open ? 'burger--open' : ''}`}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon size={24} strokeWidth={1.75} /> : <MenuIcon size={24} strokeWidth={1.75} />}
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__overlay" />
      <div className="container hero__content">
        <span className="eyebrow eyebrow--light">Cerredo · Degaña · Asturias</span>
        <h1>Cafetería "Casa Paco" / Estanco</h1>
        <p className="hero__lead">
          Desayunos, café de siempre, bocadillos y buen ambiente en el corazón de Cerredo.
          Bar, cafetería y estanco en un mismo local, con trato familiar desde siempre.
        </p>
        <div className="hero__rating">
          <span className="hero__stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} strokeWidth={0} fill="currentColor" />
            ))}
          </span>
          <span>4.9 sobre 5 · 30 opiniones en Google</span>
        </div>
        <div className="hero__actions">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <MessageCircle size={18} strokeWidth={1.75} />
            WhatsApp: {PHONE_DISPLAY}
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <MapPin size={18} strokeWidth={1.75} />
            Cómo llegar
          </a>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="sobre-nosotros" className="section">
      <div className="container">
        <span className="eyebrow">Quiénes somos</span>
        <h2 className="section-title">Un rincón acogedor en Cerredo</h2>
        <p className="section-subtitle">
          Regentado con cariño por dos hermanas, Casa Paco es el sitio de referencia del pueblo
          para desayunar, tomar el aperitivo o hacer una parada en ruta hacia la laguna.
          Populares por sus desayunos y su trato cercano con cada cliente.
        </p>

        <div className="highlights">
          {HIGHLIGHTS.map((item) => (
            <div className="highlight-card" key={item.title}>
              <div className="highlight-card__icon" aria-hidden="true">
                <item.icon size={26} strokeWidth={1.6} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Hours() {
  const { todayIndex, isOpen, closesAt, nextOpen } = useOpenStatus(HOURS)

  return (
    <section id="horarios" className="section section-alt">
      <div className="container">
        <span className="eyebrow">Horario de atención</span>
        <h2 className="section-title">¿Cuándo estamos abiertos?</h2>
        <p className="section-subtitle">
          El horario puede variar en festivos locales; te recomendamos escribirnos por WhatsApp
          antes si vienes de lejos.
        </p>

        <div className={`hours-status ${isOpen ? 'hours-status--open' : 'hours-status--closed'}`}>
          <span className="hours-status__dot" aria-hidden="true" />
          {isOpen ? (
            <span>
              <strong>Abierto ahora</strong> · cierra a las {closesAt}
            </span>
          ) : (
            <span>
              <strong>Cerrado ahora</strong>
              {nextOpen ? ` · abre ${nextOpen.when} a las ${nextOpen.time}` : ''}
            </span>
          )}
        </div>

        <div className="hours-grid">
          {HOURS.map((row, index) => (
            <div
              key={row.day}
              className={`hours-day-card ${index === todayIndex ? 'hours-day-card--today' : ''}`}
            >
              {index === todayIndex && <span className="hours-day-card__badge">Hoy</span>}
              <div className="hours-day-card__icon" aria-hidden="true">
                <Clock size={18} strokeWidth={1.75} />
              </div>
              <div className="hours-day-card__day">{row.day}</div>
              <div className="hours-day-card__ranges">
                {row.ranges.map(([start, end]) => (
                  <span className="hours-day-card__range" key={start}>
                    {start} – {end}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="section section-alt">
      <div className="container">
        <span className="eyebrow">Opiniones</span>
        <h2 className="section-title">Lo que dicen nuestros clientes</h2>

        <div className="reviews-grid">
          {REVIEWS.map((review) => (
            <blockquote className="review-card" key={review.author}>
              <p>{review.text}</p>
              <footer>— {review.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

function LocationContact() {
  return (
    <section id="ubicacion" className="section location">
      <div className="container location__grid">
        <div className="location__info">
          <span className="eyebrow">Visítanos</span>
          <h2 className="section-title section-title--left">Ubicación y contacto</h2>

          <ul className="contact-list">
            <li>
              <span className="contact-list__icon" aria-hidden="true">
                <MapPin size={22} strokeWidth={1.75} />
              </span>
              <div>
                <strong>Dirección</strong>
                <p>{ADDRESS}</p>
              </div>
            </li>
            <li>
              <span className="contact-list__icon" aria-hidden="true">
                <MessageCircle size={22} strokeWidth={1.75} />
              </span>
              <div>
                <strong>WhatsApp</strong>
                <p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    {PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </li>
            <li>
              <span className="contact-list__icon" aria-hidden="true">
                <SquareParking size={22} strokeWidth={1.75} />
              </span>
              <div>
                <strong>Aparcamiento</strong>
                <p>Gratuito, en la calle, junto al local.</p>
              </div>
            </li>
          </ul>

          <div className="location__actions">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MessageCircle size={18} strokeWidth={1.75} />
              Escríbenos por WhatsApp
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark">
              <MapPin size={18} strokeWidth={1.75} />
              Ver en Google Maps
            </a>
          </div>
        </div>

        <div className="location__map">
          <iframe
            title="Mapa - Cafetería Casa Paco / Estanco, Cerredo"
            src="https://www.google.com/maps?q=Cafeter%C3%ADa+Casa+Paco+Estanco+Cerredo+Asturias&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <strong>Cafetería "Casa Paco" / Estanco</strong>
          <p>{ADDRESS}</p>
        </div>
        <p className="footer__copy">
          © {new Date().getFullYear()} Casa Paco. Página informativa no oficial.
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Hours />
        <Reviews />
        <LocationContact />
      </main>
      <Footer />
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="fab" aria-label="Escríbenos por WhatsApp">
        <MessageCircle size={24} strokeWidth={1.75} />
      </a>
    </>
  )
}
