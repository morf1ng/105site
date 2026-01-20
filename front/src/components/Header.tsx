import BurgerMenu from "./listeners/BurgerMenu"
import HeaderHide from "./listeners/HeaderHide"

const Header = () => {


    return (
        <>
            <HeaderHide />
            <BurgerMenu />
            <header>
                <div className="herder__container container">
                    <div className="logo">
                        <img src="/assets/icons/ss-icon-text.svg" alt="СОФТ СТУДИЯ - LOGO"/>
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
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#about">О нас</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#doing">Услуги</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#portfolio">Кейсы</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#team">Команда</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#faq">FAQ</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#contacts">Контакты</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                    </div>
                    <div className="burger__menu-social">
                        <a href="">8 (800) 101 43 25</a>
                        <div className="footer__top-right-cosial">
                            <a href=""><img src="/assets/icons/vk-icon.svg" alt=""/></a>
                            <a href=""><img src="/assets/icons/yt-icon.svg" alt=""/></a>
                            <a href=""><img src="/assets/icons/tg-icon.svg" alt=""/></a>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header