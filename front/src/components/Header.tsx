'use client'

import { useState } from "react"
import BurgerMenu from "./listeners/BurgerMenu"
import HeaderHide from "./listeners/HeaderHide"

const Header = () => {
    const [isApplyOpen, setIsApplyOpen] = useState(false)

    const openApply = () => {
        setIsApplyOpen(true)
    }

    const closeApply = () => {
        setIsApplyOpen(false)
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
                                onClick={closeApply}
                                aria-label="Закрыть"
                            >
                                ×
                            </button>
                        </div>
                        <form className="modal__form">
                            <label className="modal__label">
                                ФИО
                                <input
                                    className="modal__input"
                                    type="text"
                                    name="fullname"
                                    placeholder="Иванов Иван Иванович"
                                />
                            </label>
                            <label className="modal__label">
                                Номер телефона
                                <input
                                    className="modal__input"
                                    type="tel"
                                    name="phone"
                                    placeholder="+7 (999) 999-99-99"
                                />
                            </label>
                            <label className="modal__label">
                                E-mail
                                <input
                                    className="modal__input"
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                />
                            </label>
                            <label className="modal__label">
                                Направление обучения
                                <select className="modal__select-input" name="course">
                                    <option value="">Выберите курс</option>
                                    <option value="frontend">Frontend-разработка</option>
                                    <option value="backend">Backend-разработка</option>
                                    <option value="fullstack">Fullstack-проект за 3 месяца</option>
                                    <option value="pet">Проект под портфолио</option>
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
                                            defaultChecked
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
                                            value="support"
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
                                    <input type="checkbox" name="policy" />
                                    <span>
                                        Я согласен с{' '}
                                        <a href="/docs/privacy" target="_blank" rel="noopener noreferrer">
                                            Политикой обработки персональных данных
                                        </a>
                                    </span>
                                </label>
                                <label className="modal__checkbox">
                                    <input type="checkbox" name="offer" />
                                    <span>
                                        Я принимаю условия{' '}
                                        <a href="/docs/offer" target="_blank" rel="noopener noreferrer">
                                            Публичной оферты
                                        </a>
                                    </span>
                                </label>
                                <label className="modal__checkbox">
                                    <input type="checkbox" name="contract" />
                                    <span>
                                        Ознакомлен с{' '}
                                        <a href="/docs/contract" target="_blank" rel="noopener noreferrer">
                                            Договором об оказании услуг
                                        </a>
                                    </span>
                                </label>
                            </div>

                            <div className="modal__actions">
                                <button
                                    type="button"
                                    className="modal__button modal__button--secondary"
                                    onClick={closeApply}
                                >
                                    Отменить
                                </button>
                                <button
                                    type="submit"
                                    className="modal__button modal__button--primary"
                                >
                                    Получить доступ и оплатить
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