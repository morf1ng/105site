import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container container">
                <div className="footer__grid">
                    <div className="footer__col footer__col--brand">
                        <div className="logo">
                            <img src="assets/images/ss-logo.svg" alt="" />
                            <span>СОФТ СТУДИЯ</span>
                        </div>
                        <p className="footer__requisites">
                            ООО &quot;105 СОФТ-СТУДИЯ&quot;
                            <br />
                            ИНН: 0500044302
                            <br />
                            ОГРН: 1250500019087
                            <br />
                            Юр. адрес: 367000, Республика Дагестан, г.&nbsp;Махачкала, ул.&nbsp;Астемирова, д.&nbsp;4
                        </p>
                        <div className="footer__copyright">
                            <img src="assets/icons/bloated-heart-icon.svg" alt="" />
                            <span>2025 105 СОФТ-СТУДИЯ. Права защищены</span>
                        </div>
                        <div className="footer__social" aria-label="Соцсети">
                            <a className="footer__social-btn" href="#" aria-label="ВКонтакте">
                                <img src="/assets/icons/vk-icon.svg" alt="" />
                            </a>
                            <a className="footer__social-btn" href="#" aria-label="YouTube">
                                <img src="/assets/icons/yt-icon.svg" alt="" />
                            </a>
                            <a className="footer__social-btn" href="#" aria-label="Telegram">
                                <img src="/assets/icons/tg-icon.svg" alt="" />
                            </a>
                        </div>
                    </div>

                    <nav className="footer__col" aria-label="Разделы для пользователей">
                        <h3 className="footer__col-title">Пользователям</h3>
                        <ul className="footer__col-list">
                            <li>
                                <Link href="/#portfolio">Портфолио</Link>
                            </li>
                            <li>
                                <Link href="/#about">О студии</Link>
                            </li>
                            <li>
                                <Link href="/#team">Команда</Link>
                            </li>
                            <li>
                                <Link href="/#faq">Вопросы и ответы</Link>
                            </li>
                            <li>
                                <Link href="/#contacts">Контакты</Link>
                            </li>
                        </ul>
                    </nav>

                    <nav className="footer__col" aria-label="Юридические документы">
                        <h3 className="footer__col-title">Важная информация</h3>
                        <ul className="footer__col-list">
                            <li>
                                <Link href="/docs/privacy">Политика обработки персональных данных</Link>
                            </li>
                            <li>
                                <Link href="/docs/offer">Публичная оферта</Link>
                            </li>
                            <li>
                                <Link href="/docs/contract">Договор об оказании услуг</Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="footer__col footer__col--contacts">
                        <h3 className="footer__col-title">Контакты</h3>
                        <p className="footer__contacts-note">Свяжитесь с нами в удобное время</p>
                        <a className="footer__phone" href="tel:+78001014325">
                            8 (800) 101 43 25
                        </a>
                        <p className="footer__address">
                            367000, Республика Дагестан, г.&nbsp;Махачкала, ул.&nbsp;Астемирова, д.&nbsp;4
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
