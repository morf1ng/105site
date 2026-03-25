import Link from 'next/link'

const Footer = () => {
    return <footer className="footer">
    <div className="footer__container container">

        <div className="footer__top">
            <div className="footer__top-left">
                <div className="logo">
                    <img src="assets/images/ss-logo.svg" alt="" />
                    <span>СОФТ СТУДИЯ</span>
                </div>
                <div className="footer__text">ООО "105 СОФТ-СТУДИЯ"<br/>ИНН: 0500044302<br/>ОГРН: 1250500019087<br/>Юр. адрес: 367000, Республика Дагестан, г Махачкала, ул Астемирова, д. 4</div>
                <div className="footer__text"><img src="assets/icons/bloated-heart-icon.svg"/> 2025 105 СОФТ-СТУДИЯ Права защищены</div>
                
            </div>
            <div className="footer__top-right">
                <nav className="footer__legal-links" aria-label="Юридические документы">
                    <Link href="/docs/privacy">Политика обработки персональных данных</Link>
                    <Link href="/docs/offer">Публичная оферта</Link>
                    <Link href="/docs/contract">Договор об оказании услуг</Link>
                </nav>
                <a className="footer__top-right-tel" href="tel:">8 (888) 888 88 88</a>
                <div className="adress">
                    367000, Республика Дагестан, г Махачкала, ул Астемирова, д. 4
                </div>
                <div className="footer__top-right-cosial">
                    <a href=""><img src="/assets/icons/vk-icon.svg" alt=""/></a>
                    <a href=""><img src="/assets/icons/yt-icon.svg" alt=""/></a>
                    <a href=""><img src="/assets/icons/tg-icon.svg" alt=""/></a>
                </div>
            </div>
        </div>
        {/* <div className="footer__bottom">
            <img src="assets/icons/heart.svg" alt="">crescendo
        </div> */}
    </div>
</footer>
}


export default Footer