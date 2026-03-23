'use client'

import { useEffect, useMemo, useState } from "react"
import BurgerMenu from "./listeners/BurgerMenu"
import HeaderHide from "./listeners/HeaderHide"
import { fetchCoursesFromApi, registerCourseOnApi, type ApiCourse, type CourseSupportType } from '@/lib/api'

const Header = () => {
    const [isApplyOpen, setIsApplyOpen] = useState(false)

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

    const openApply = () => {
        setIsApplyOpen(true)
    }

    const closeApply = () => {
        setIsApplyOpen(false)
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

    useEffect(() => {
        if (!isApplyOpen) return

        // prevent body scroll while modal is open
        document.body.classList.add('no-scroll')

        // reset status and load courses if needed
        setSubmitError(null)
        setSubmitSuccess(null)

        const needsLoad = courses.length === 0 && !coursesLoading
        if (needsLoad) {
            ;(async () => {
                try {
                    setCoursesLoading(true)
                    setCoursesError(null)
                    const list = await fetchCoursesFromApi()
                    setCourses(list)
                } catch (e: any) {
                    console.error('Failed to load courses', e)
                    setCoursesError('Не удалось загрузить курсы. Попробуйте позже.')
                } finally {
                    setCoursesLoading(false)
                }
            })()
        }

        return () => {
            document.body.classList.remove('no-scroll')
        }
    }, [courses.length, coursesLoading, isApplyOpen])

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

    const handleClose = () => {
        closeApply()
        resetForm()
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
                        <a href="#!" className="call-btn">Заказать звонок</a>
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
                                <input
                                    className="modal__input"
                                    type="text"
                                    name="fullname"
                                    value={fullName}
                                    onChange={(ev) => setFullName(ev.target.value)}
                                    placeholder="Иванов Иван Иванович"
                                />
                            </label>
                            <label className="modal__label">
                                Номер телефона
                                <input
                                    className="modal__input"
                                    type="tel"
                                    name="phone"
                                    value={phone}
                                    onChange={(ev) => setPhone(ev.target.value)}
                                    placeholder="+7 (999) 999-99-99"
                                />
                            </label>
                            <label className="modal__label">
                                E-mail
                                <input
                                    className="modal__input"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(ev) => setEmail(ev.target.value)}
                                    placeholder="example@gmail.com"
                                />
                            </label>
                            <label className="modal__label">
                                Направление обучения
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
                                    {submitLoading ? 'Отправляем...' : 'Получить доступ и оплатить'}
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