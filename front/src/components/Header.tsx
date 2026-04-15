'use client'

import { useEffect, useMemo, useState } from "react"
import BurgerMenu from "./listeners/BurgerMenu"
import HeaderHide from "./listeners/HeaderHide"
import { fetchCoursesFromApi, registerCourseOnApi, type ApiCourse, type CourseSupportType } from '@/lib/api'

const ProfileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
)

const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.09 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.52a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.56-1.09a2 2 0 0 1 2.11-.45c.82.24 1.66.42 2.52.54A2 2 0 0 1 22 16.92Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
        <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const StudyHatIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M22 10 12 5 2 10l10 5 10-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M6 12v5c0 1.66 3.58 3 6 3s6-1.34 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

const WalletIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M16 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 12a1 1 0 1 0 0 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

const Header = () => {
    const [isApplyOpen, setIsApplyOpen] = useState(false)
    const [isCallOpen, setIsCallOpen] = useState(false)

    const [courses, setCourses] = useState<ApiCourse[]>([])
    const [coursesLoading, setCoursesLoading] = useState(false)
    const [coursesError, setCoursesError] = useState<string | null>(null)

    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
    const [supportType, setSupportType] = useState<CourseSupportType>('basic')

    const [policyChecked, setPolicyChecked] = useState(false)
    const [offerChecked, setOfferChecked] = useState(false)
    const [contractChecked, setContractChecked] = useState(false)

    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

    const [callFullName, setCallFullName] = useState('')
    const [callPhone, setCallPhone] = useState('')
    const [callEmail, setCallEmail] = useState('')
    const [callPolicyChecked, setCallPolicyChecked] = useState(false)
    const [callOfferChecked, setCallOfferChecked] = useState(false)
    const [callContractChecked, setCallContractChecked] = useState(false)
    const [callSubmitLoading, setCallSubmitLoading] = useState(false)
    const [callSubmitError, setCallSubmitError] = useState<string | null>(null)
    const [callSubmitSuccess, setCallSubmitSuccess] = useState<string | null>(null)

    const openApply = () => {
        setSubmitError(null)
        setSubmitSuccess(null)
        setIsApplyOpen(true)
    }

    const openCall = () => {
        setCallSubmitError(null)
        setCallSubmitSuccess(null)
        setIsCallOpen(true)
    }

    const closeApply = () => {
        setIsApplyOpen(false)
    }

    const closeCall = () => {
        setIsCallOpen(false)
    }

    const canSubmit = useMemo(() => {
        return (
            fullName.trim().length > 0 &&
            phone.trim().length > 0 &&
            email.trim().length > 0 &&
            selectedCourseId != null &&
            policyChecked &&
            offerChecked &&
            contractChecked &&
            !submitLoading
        )
    }, [contractChecked, email, offerChecked, fullName, phone, policyChecked, selectedCourseId, submitLoading])

    const canCallSubmit = useMemo(() => {
        return (
            callFullName.trim().length > 0 &&
            callPhone.trim().length > 0 &&
            callEmail.trim().length > 0 &&
            callPolicyChecked &&
            callOfferChecked &&
            callContractChecked &&
            !callSubmitLoading
        )
    }, [callContractChecked, callEmail, callFullName, callOfferChecked, callPhone, callPolicyChecked, callSubmitLoading])

    useEffect(() => {
        if (!isApplyOpen && !isCallOpen) {
            document.documentElement.classList.remove('no-scroll')
            document.body.classList.remove('no-scroll')
            document.body.style.paddingRight = ''
            return
        }

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        document.documentElement.classList.add('no-scroll')
        document.body.classList.add('no-scroll')
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`
        }

        return () => {
            document.documentElement.classList.remove('no-scroll')
            document.body.classList.remove('no-scroll')
            document.body.style.paddingRight = ''
        }
    }, [isApplyOpen, isCallOpen])

    useEffect(() => {
        if (!isApplyOpen && !isCallOpen) return
        if (courses.length > 0) return

        let cancelled = false

        ;(async () => {
            try {
                setCoursesLoading(true)
                setCoursesError(null)
                const list = await fetchCoursesFromApi()
                if (!cancelled) setCourses(list)
            } catch (e: any) {
                console.error('Failed to load courses', e)
                if (!cancelled) {
                    setCoursesError('Не удалось загрузить курсы. Попробуйте позже.')
                }
            } finally {
                if (!cancelled) setCoursesLoading(false)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [isApplyOpen, isCallOpen, courses.length])

    const resetForm = () => {
        setFullName('')
        setPhone('')
        setEmail('')
        setSelectedCourseId(null)
        setSupportType('basic')
        setPolicyChecked(false)
        setOfferChecked(false)
        setContractChecked(false)
        setSubmitError(null)
        setSubmitSuccess(null)
    }

    const resetCallForm = () => {
        setCallFullName('')
        setCallPhone('')
        setCallEmail('')
        setCallPolicyChecked(false)
        setCallOfferChecked(false)
        setCallContractChecked(false)
        setCallSubmitError(null)
        setCallSubmitSuccess(null)
    }

    const handleClose = () => {
        closeApply()
        resetForm()
    }

    const handleCloseCall = () => {
        closeCall()
        resetCallForm()
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (!canSubmit) return
        if (selectedCourseId == null) return

        try {
            setSubmitLoading(true)
            setSubmitError(null)
            setSubmitSuccess(null)

            const payload = {
                full_name: fullName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                course_id: selectedCourseId,
                support_type: supportType,
            }

            const res = await registerCourseOnApi(payload)
            setSubmitSuccess(res.detail || 'Заявка принята.')

            // Optionally close modal after success
            setTimeout(() => {
                handleClose()
            }, 1200)
        } catch (err: any) {
            console.error('Course registration failed', err)
            setSubmitError(err?.message || 'Не удалось отправить заявку.')
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleCallSubmit = async (e: any) => {
        e.preventDefault()
        if (!canCallSubmit) return

        // Reuse backend registration endpoint; for call request use the first available course.
        const fallbackCourse = courses[0]
        if (!fallbackCourse) {
            setCallSubmitError('Курсы ещё не загружены. Попробуйте чуть позже.')
            return
        }

        try {
            setCallSubmitLoading(true)
            setCallSubmitError(null)
            setCallSubmitSuccess(null)

            const res = await registerCourseOnApi({
                full_name: callFullName.trim(),
                phone: callPhone.trim(),
                email: callEmail.trim(),
                course_id: fallbackCourse.id,
                support_type: 'basic',
            })

            setCallSubmitSuccess(res.detail || 'Заявка отправлена.')
            setTimeout(() => {
                handleCloseCall()
            }, 1200)
        } catch (err: any) {
            console.error('Call request failed', err)
            setCallSubmitError(err?.message || 'Не удалось отправить заявку.')
        } finally {
            setCallSubmitLoading(false)
        }
    }

    return (
        <>
            <HeaderHide />
            <BurgerMenu />
            <header>
                <div className="herder__container container">
                    <div className="logo">
                        <img src="/assets/images/ss-logo.svg" alt="СОФТ СТУДИЯ - LOGO"/>
                        <span>СОФТ СТУДИЯ</span>
                    </div>
                    <div className="menu">
                        <nav>
                            <a className="header__menu-link active" href="#hero">Главная</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#about">О нас</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#doing">Услуги</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#portfolio">Кейсы</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#team">Команда</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#faq">FAQ</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#contacts">Контакты</a>
                        </nav>
                    </div>
                    <div className="call">
                        <button
                            type="button"
                            className="call-btn"
                            onClick={openCall}
                        >
                            Заказать звонок
                        </button>
                        <button
                            type="button"
                            className="call-btn call-btn--secondary"
                            onClick={openApply}
                        >
                            Подать заявку
                        </button>
                        {/* <!-- <div className="lang">RU</div> --> */}
                        <div className="header__burger">
                            <div className="header__burger-line"></div>
                            <div className="header__burger-line"></div>
                            <div className="header__burger-line"></div>
                        </div>
                    </div>
                </div>

                <div className="burger__menu glass-border">
                    <div className="burger__menu-links">
                        <nav>
                            <a className="header__menu-link active" href="#hero">Главная</a>
                            <img src="assets/icons/link.svg" alt="" />
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#about">О нас</a>
                            <img src="assets/icons/link.svg" alt="" />
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#doing">Услуги</a>
                            <img src="assets/icons/link.svg" alt="" />
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#portfolio">Кейсы</a>
                            <img src="assets/icons/link.svg" alt="" />
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#team">Команда</a>
                            <img src="assets/icons/link.svg" alt="" />
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#faq">FAQ</a>
                            <img src="assets/icons/link.svg" alt="" />
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#contacts">Контакты</a>
                            <img src="assets/icons/link.svg" alt="" />
                        </nav>
                    </div>
                    <div className="burger__menu-social">
                        <a href="">8 (800) 101 43 25</a>
                        <div className="footer__top-right-cosial">
                            <a href=""><img src="/assets/icons/vk-icon.svg" alt="" /></a>
                            <a href=""><img src="/assets/icons/yt-icon.svg" alt="" /></a>
                            <a href=""><img src="/assets/icons/tg-icon.svg" alt="" /></a>
                        </div>
                    </div>
                </div>
            </header>

            {isApplyOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal__header">
                            <h2 className="modal__title">Подать заявку</h2>
                            <button
                                type="button"
                                className="modal__close"
                                onClick={handleClose}
                                aria-label="Закрыть"
                            >
                                ×
                            </button>
                        </div>
                        <form className="modal__form" onSubmit={handleSubmit}>
                            <label className="modal__label">
                                ФИО
                                <div className="modal__control">
                                    <span className="modal__field-icon" aria-hidden="true">
                                        <ProfileIcon />
                                    </span>
                                    <input
                                        className="modal__input"
                                        type="text"
                                        name="fullname"
                                        value={fullName}
                                        onChange={(ev) => setFullName(ev.target.value)}
                                        placeholder="Иванов Иван Иванович"
                                    />
                                </div>
                            </label>
                            <label className="modal__label">
                                Номер телефона
                                <div className="modal__control">
                                    <span className="modal__field-icon" aria-hidden="true">
                                        <PhoneIcon />
                                    </span>
                                    <input
                                        className="modal__input"
                                        type="tel"
                                        name="phone"
                                        value={phone}
                                        onChange={(ev) => setPhone(ev.target.value)}
                                        placeholder="+7 (999) 999-99-99"
                                    />
                                </div>
                            </label>
                            <label className="modal__label">
                                E-mail
                                <div className="modal__control">
                                    <span className="modal__field-icon" aria-hidden="true">
                                        <MailIcon />
                                    </span>
                                    <input
                                        className="modal__input"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(ev) => setEmail(ev.target.value)}
                                        placeholder="example@gmail.com"
                                    />
                                </div>
                            </label>
                            <label className="modal__label">
                                Направление обучения
                                <div className="modal__control modal__control--select">
                                    <span className="modal__field-icon" aria-hidden="true">
                                        <StudyHatIcon />
                                    </span>
                                    <select
                                        className="modal__select-input"
                                        name="course"
                                        value={selectedCourseId ?? ''}
                                        onChange={(ev) => {
                                            const v = ev.target.value
                                            setSelectedCourseId(v ? Number(v) : null)
                                        }}
                                        disabled={coursesLoading || !!coursesError}
                                    >
                                        <option value="">
                                            {coursesLoading ? 'Загрузка курсов...' : 'Выберите курс'}
                                        </option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.title}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="modal__select-arrow" aria-hidden="true">▾</span>
                                </div>
                                <div className="modal__courses-hint" role="status" aria-live="polite">
                                    {coursesError ? <span className="modal__help">{coursesError}</span> : null}
                                </div>
                            </label>

                            <div className="modal__label">
                                Тариф
                                <div className="subscription-options">
                                    <label className="subscription-card">
                                        <input
                                            type="radio"
                                            name="plan"
                                            value="basic"
                                            checked={supportType === 'basic'}
                                            onChange={() => setSupportType('basic')}
                                        />
                                        <div className="subscription-card__content">
                                            <div className="subscription-card__title">
                                                БАЗОВЫЙ
                                            </div>
                                            <div className="subscription-card__price">
                                                5 000 ₽/мес
                                            </div>
                                            <div className="subscription-card__hover">
                                                Доступ к записям уроков и материалам, без личного наставника.
                                            </div>
                                        </div>
                                    </label>

                                    <label className="subscription-card">
                                        <input
                                            type="radio"
                                            name="plan"
                                            value="with_support"
                                            checked={supportType === 'with_support'}
                                            onChange={() => setSupportType('with_support')}
                                        />
                                        <div className="subscription-card__content">
                                            <div className="subscription-card__title">
                                                С ПОДДЕРЖКОЙ
                                            </div>
                                            <div className="subscription-card__price">
                                                9 000 ₽/мес
                                            </div>
                                            <div className="subscription-card__hover">
                                                Персональная проверка заданий, созвоны с ментором и помощь в проекте.
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="modal__checkboxes">
                                <label className="modal__checkbox">
                                    <input
                                        type="checkbox"
                                        name="policy"
                                        checked={policyChecked}
                                        onChange={(ev) => setPolicyChecked(ev.target.checked)}
                                    />
                                    <span>
                                        Я согласен с{' '}
                                        <a href="/docs/privacy" target="_blank" rel="noopener noreferrer">
                                            Политикой обработки персональных данных
                                        </a>
                                    </span>
                                </label>
                                <label className="modal__checkbox">
                                    <input
                                        type="checkbox"
                                        name="offer"
                                        checked={offerChecked}
                                        onChange={(ev) => setOfferChecked(ev.target.checked)}
                                    />
                                    <span>
                                        Я принимаю условия{' '}
                                        <a href="/docs/offer" target="_blank" rel="noopener noreferrer">
                                            Публичной оферты
                                        </a>
                                    </span>
                                </label>
                                <label className="modal__checkbox">
                                    <input
                                        type="checkbox"
                                        name="contract"
                                        checked={contractChecked}
                                        onChange={(ev) => setContractChecked(ev.target.checked)}
                                    />
                                    <span>
                                        Ознакомлен с{' '}
                                        <a href="/docs/contract" target="_blank" rel="noopener noreferrer">
                                            Договором об оказании услуг
                                        </a>
                                    </span>
                                </label>
                            </div>

                            {submitError && (
                                <div style={{ color: 'rgba(255,255,255,.95)', background: 'rgba(255, 0, 0, 0.25)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                    {submitError}
                                </div>
                            )}
                            {submitSuccess && (
                                <div style={{ color: 'rgba(255,255,255,.95)', background: 'rgba(0, 255, 120, 0.15)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                    {submitSuccess}
                                </div>
                            )}

                            <div className="modal__actions">
                                <button
                                    type="button"
                                    className="modal__button modal__button--secondary"
                                    onClick={handleClose}
                                    disabled={submitLoading}
                                >
                                    Отменить
                                </button>
                                <button
                                    type="submit"
                                    className="modal__button modal__button--primary"
                                    disabled={!canSubmit}
                                >
                                    <WalletIcon />
                                    <span>
                                        {submitLoading ? 'Отправляем...' : 'Получить доступ и оплатить'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCallOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal__header">
                            <h2 className="modal__title">Заказать звонок</h2>
                            <button
                                type="button"
                                className="modal__close"
                                onClick={handleCloseCall}
                                aria-label="Закрыть"
                            >
                                ×
                            </button>
                        </div>
                        <form className="modal__form" onSubmit={handleCallSubmit}>
                            <label className="modal__label">
                                ФИО
                                <div className="modal__control">
                                    <span className="modal__field-icon" aria-hidden="true">
                                        <ProfileIcon />
                                    </span>
                                    <input
                                        className="modal__input"
                                        type="text"
                                        value={callFullName}
                                        onChange={(ev) => setCallFullName(ev.target.value)}
                                        placeholder="Иванов Иван Иванович"
                                    />
                                </div>
                            </label>
                            <label className="modal__label">
                                Номер телефона
                                <div className="modal__control">
                                    <span className="modal__field-icon" aria-hidden="true">
                                        <PhoneIcon />
                                    </span>
                                    <input
                                        className="modal__input"
                                        type="tel"
                                        value={callPhone}
                                        onChange={(ev) => setCallPhone(ev.target.value)}
                                        placeholder="+7 (999) 999-99-99"
                                    />
                                </div>
                            </label>
                            <label className="modal__label">
                                E-mail
                                <div className="modal__control">
                                    <span className="modal__field-icon" aria-hidden="true">
                                        <MailIcon />
                                    </span>
                                    <input
                                        className="modal__input"
                                        type="email"
                                        value={callEmail}
                                        onChange={(ev) => setCallEmail(ev.target.value)}
                                        placeholder="example@gmail.com"
                                    />
                                </div>
                            </label>

                            <div className="modal__checkboxes">
                                <label className="modal__checkbox">
                                    <input
                                        type="checkbox"
                                        checked={callPolicyChecked}
                                        onChange={(ev) => setCallPolicyChecked(ev.target.checked)}
                                    />
                                    <span>
                                        Я согласен с{' '}
                                        <a href="/docs/privacy" target="_blank" rel="noopener noreferrer">
                                            Политикой обработки персональных данных
                                        </a>
                                    </span>
                                </label>
                                <label className="modal__checkbox">
                                    <input
                                        type="checkbox"
                                        checked={callOfferChecked}
                                        onChange={(ev) => setCallOfferChecked(ev.target.checked)}
                                    />
                                    <span>
                                        Я принимаю условия{' '}
                                        <a href="/docs/offer" target="_blank" rel="noopener noreferrer">
                                            Публичной оферты
                                        </a>
                                    </span>
                                </label>
                                <label className="modal__checkbox">
                                    <input
                                        type="checkbox"
                                        checked={callContractChecked}
                                        onChange={(ev) => setCallContractChecked(ev.target.checked)}
                                    />
                                    <span>
                                        Ознакомлен с{' '}
                                        <a href="/docs/contract" target="_blank" rel="noopener noreferrer">
                                            Договором об оказании услуг
                                        </a>
                                    </span>
                                </label>
                            </div>

                            {callSubmitError && (
                                <div style={{ color: 'rgba(255,255,255,.95)', background: 'rgba(255, 0, 0, 0.25)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                    {callSubmitError}
                                </div>
                            )}
                            {callSubmitSuccess && (
                                <div style={{ color: 'rgba(255,255,255,.95)', background: 'rgba(0, 255, 120, 0.15)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                    {callSubmitSuccess}
                                </div>
                            )}

                            <div className="modal__actions">
                                <button
                                    type="button"
                                    className="modal__button modal__button--secondary"
                                    onClick={handleCloseCall}
                                    disabled={callSubmitLoading}
                                >
                                    Отменить
                                </button>
                                <button
                                    type="submit"
                                    className="modal__button modal__button--primary"
                                    disabled={!canCallSubmit}
                                >
                                    {callSubmitLoading ? 'Отправляем...' : 'Отправить заявку'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header