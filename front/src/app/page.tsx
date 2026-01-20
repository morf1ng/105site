import Image from "next/image";
import './page.css'
import Typewriter from "@/components/Typewriter";
import Parallax from "@/components/listeners/Parallax";
import FaqAccordion from "@/components/listeners/FaqAccordion";
import HeaderHide from "@/components/listeners/HeaderHide";
import PortfolioDragSlider from "@/components/listeners/PortfolioDragSlider";
import ContactForm from "@/components/ContactForm";
import BurgerMenu from "@/components/listeners/BurgerMenu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";

export default function Home() {
  return (
    <>
		<Parallax />
		<FaqAccordion />
		<PortfolioDragSlider />
		<img src="/assets/icons/f-e-1.svg" alt="" className="f-e-1"/>
		<img src="/assets/icons/f-e-1-mob.svg" alt="" className="f-e-1-mob"/>
		<Header />

		<section id="hero" className="hero">
			<div className="hero__container container">
				<div className="hero__left">
					<div className="hero__left-title">Код. Дизайн. Результат.</div>
					<div className="hero__left-subtitle">Создаём сайты, мобильные приложения, Telegram-ботов и UI/UX-дизайн,
						которые приносят результат.
					</div>
					<a href="#!" className="hero__left-link">Обсудить проект</a>
				</div>
				<div className="hero__right">
          <Typewriter />
				</div>
			</div>
		</section>

		<section id="about" className="about">
			<div className="about__container container">
				<div className="about__top">
					<div className="about__top-left">
						<div className="about__top-title">
							<span>СОФТ</span>
							<span>СТУДИЯ</span>
						</div>
						<div className="about__top-subtitle">Это команда специалистов, создающих эффективные digital-решения для
							бизнеса любого масштаба.
						</div>
						<div className="about__top-subtitle">Мы помогаем компаниям цифровизироваться, автоматизировать процессы и
							увеличивать прибыль.
						</div>
					</div>
					<div className="about__top-right">
						<img className="parallax-element" src="assets/icons/cursor.svg" alt=""/>
					</div>
				</div>
				<div className="about__bottom">
					<div className="about__bottom-card">
						<div className="about__bottom-card-subtitle">ЗАПУСКАЕМ ПРОЕКТЫ ЗА</div>
						<div className="about__bottom-card-title">5 ДНЕЙ</div>
					</div>
					<div className="about__bottom-card">
						<div className="about__bottom-card-subtitle">СОКРАЩАЕМ РУТИНУ ДО</div>
						<div className="about__bottom-card-title">70%</div>
					</div>
					<div className="about__bottom-card">
						<div className="about__bottom-card-subtitle">ПОВЫШАЕМ ПРОДАЖИ НА</div>
						<div className="about__bottom-card-title">40%</div>
					</div>
				</div>
			</div>
		</section>

		<section className="doing" id="doing">
			<div className="doing__container container">
				<div className="doing__top">
					<div className="doing__title block__title">ЧТО МЫ ДЕЛАЕМ</div>
					<div className="doing__subtitle block__subtitle">Комплексные решения под любые задачи</div>
				</div>
				<div className="doing__bottom">
					<div className="doing__bottom-card glass-border">
						<div className="doing__bottom-card-title">Веб-разработка</div>
						<div className="doing__bottom-card-image"><img src="assets/icons/web.svg" alt=""/></div>
						<div className="line"></div>
						<div className="doing__bottom-card-subtitle">Корпоративные сайты, лендинги, CRM-панели, интеграции.</div>
					</div>
					<div className="doing__bottom-card glass-border">
						<div className="doing__bottom-card-title">Мобильные приложения</div>
						<div className="doing__bottom-card-image"><img src="assets/icons/mob.svg" alt=""/></div>
						<div className="line"></div>
						<div className="doing__bottom-card-subtitle">Под iOS и Android, с адаптацией под ваши бизнес-процессы.
						</div>
					</div>
					<div className="doing__bottom-card glass-border">
						<div className="doing__bottom-card-title">UI-UX дизайн</div>
						<div className="doing__bottom-card-image"><img src="assets/icons/ux-ui.svg" alt=""/></div>
						<div className="line"></div>
						<div className="doing__bottom-card-subtitle">Создаём удобные интерфейсы и визуальные решения, которые
							повышают конверсию.</div>
					</div>
					<div className="doing__bottom-card glass-border">
						<div className="doing__bottom-card-title">Telegram-боты</div>
						<div className="doing__bottom-card-image"><img src="assets/icons/tg-bots.svg" alt=""/></div>
						<div className="line"></div>
						<div className="doing__bottom-card-subtitle">Автоматизация продаж, CRM-интеграции, чат-боты под любые
							задачи.</div>
					</div>
				</div>
			</div>
			<img className="f-e-2" src="assets/icons/f-e-2.svg" loading="lazy" decoding="async"/>
		</section>

		<Portfolio />

		<section id="work-process" className="work-process">
			<img className="f-e-3" src="assets/icons/f-e-3.svg" loading="lazy" decoding="async"/>
			<img className="f-e-3-tab" src="assets/icons/f-e-3-tab.svg" loading="lazy" decoding="async"/>

			<div className="fon__element-3 "><img src="assets/icons/fon__element-2.svg" alt=""/></div>
			<div className="fon__element-3 "><img src="assets/icons/fon__element-1.svg" alt=""/></div>
			<div className="work-process__container container">
				<div className="work-process__title block__title">ПРОЦЕСС РАБОТЫ</div>
				<div className="work-process__body">
					<div className="work-process__left">
						Мы не просто пишем код — мы решаем бизнес-задачи.
					</div>
					<div className="work-process__right">
						<div className="work-process__right-text">Мы — digital-агентство <span>полного цикла</span>, которое
							глубоко погружается в бизнес клиента и работает как <span>партнер</span>, а не просто как
							подрядчик.</div>
						<div className="work-process__right-cards">
							<div className="work-process__right-card glass-border">
								<div className="work-process__right-card-title">01</div>
								<div className="work-process__right-card-subtitle">Анализ и стратегия</div>
								<div className="work-process__right-card-subtitle-2">Изучаем задачу, цели и аудиторию.</div>
							</div>
							<div className="work-process__right-card glass-border">
								<div className="work-process__right-card-title">02</div>
								<div className="work-process__right-card-subtitle">Прототип и дизайн</div>
								<div className="work-process__right-card-subtitle-2">Создаём структуру и визуальную концепцию.</div>
							</div>
							<div className="work-process__right-card glass-border">
								<div className="work-process__right-card-title">03</div>
								<div className="work-process__right-card-subtitle">Разработка и тестирование</div>
								<div className="work-process__right-card-subtitle-2">Реализуем, проверяем, дорабатываем.</div>
							</div>
							<div className="work-process__right-card glass-border">
								<div className="work-process__right-card-title">04</div>
								<div className="work-process__right-card-subtitle">Запуск и поддержка</div>
								<div className="work-process__right-card-subtitle-2">Подключаем аналитику, следим за результатом и помогаем развиваться.</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section id="team" className="team">
			<div className="team__container container">
				<div className="team__title block__title">НАША КОМАНДА</div>
				<div className="team__subtitle block__subtitle"><span>СОФТ СТУДИЯ</span> — это люди, которые любят своё дело
					иделают всё на высшем уровне.</div>
				<div className="team__cards">
					<div className="team__card glass-border">
						<div className="team__card-img"><img src="assets/images/avatar.svg" alt=""/></div>
						<div className="line"></div>
						<div className="team__card-title">Магомедов Магомед</div>
						<div className="team__card-subtitle">Корпоративные сайты, лендинги, CRM-панели, интеграции.</div>
					</div>
					<div className="team__card glass-border">
						<div className="team__card-img"><img src="assets/images/avatar.svg" alt=""/></div>
						<div className="line"></div>
						<div className="team__card-title">Магомедов Магомед</div>
						<div className="team__card-subtitle">Корпоративные сайты, лендинги, CRM-панели, интеграции.</div>
					</div>
					<div className="team__card glass-border">
						<div className="team__card-img"><img src="assets/images/avatar.svg" alt=""/></div>
						<div className="line"></div>
						<div className="team__card-title">Магомедов Магомед</div>
						<div className="team__card-subtitle">Корпоративные сайты, лендинги, CRM-панели, интеграции.</div>
					</div>
					<div className="team__card glass-border">
						<div className="team__card-img"><img src="assets/images/avatar.svg" alt=""/></div>
						<div className="line"></div>
						<div className="team__card-title">Магомедов Магомед</div>
						<div className="team__card-subtitle">Корпоративные сайты, лендинги, CRM-панели, интеграции.</div>
					</div>
				</div>
			</div>
		</section>

		<section id="why-dc" className="why-dc">
			<div className="why-dc__contaiener container">
				<div className="why-dc__title block__title">
					Почему СОФТ СТУДИЯ
				</div>


				<div className="why-dc__bg-text two">СОФТ<br/>СТУДИЯ</div>
				<div className="why-dc__bg-text one">DIGITAL<br/>AGENCY</div>
				<div className="why-dc__grid">
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">01</div>
						<div className="why-dc__grid-elem-subtitle">Комплексный подход</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">02</div>
						<div className="why-dc__grid-elem-subtitle">Продуктивные технологии</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">03</div>
						<div className="why-dc__grid-elem-subtitle">Опытная команда</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">04</div>
						<div className="why-dc__grid-elem-subtitle">Реальные результаты</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">05</div>
						<div className="why-dc__grid-elem-subtitle">Гарантии</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">06</div>
						<div className="why-dc__grid-elem-subtitle">Короткие сроки</div>
					</div>
				</div>
			</div>
		</section>

		<section id="faq" className="faq">
			<img className="f-e-faq-mob" src="assets/icons/f-e-faq-mob.svg" loading="lazy" decoding="async"/>

			<div className="faq__container container">
				<div className="faq__title block__title">ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ</div>
				<div className="faq__questions">
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">Как связаться с командой Soft Studio?</div>
							<div className="faq__questions-element-subtitle">Вы можете написать нам на почту.</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">Как связаться с командой Soft Studio?</div>
							<div className="faq__questions-element-subtitle">Вы можете написать нам на почту.</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">Как связаться с командой Soft Studio?</div>
							<div className="faq__questions-element-subtitle">Вы можете написать нам на почту.</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">Как связаться с командой Soft Studio?</div>
							<div className="faq__questions-element-subtitle">Вы можете написать нам на почту.</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">Как связаться с командой Soft Studio?</div>
							<div className="faq__questions-element-subtitle">Вы можете написать нам на почту.</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">Как связаться с командой Soft Studio?</div>
							<div className="faq__questions-element-subtitle">Вы можете написать нам на почту.</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section id="contacts" className="contacts">
			<div className="contacts__container container">
				<div className="contacts__left">
					<div className="contacts__title">Остались вопросы?</div>
					<div className="contacts__subtitle">Отправьте заявку и мы свяжемся с Вами</div>
					<ContactForm />
					<div className="contacts__info">Нажимая на кнопку «Отправить», вы соглашаетесь с <a href=""> условиями
							обработки
							персональных данных</a></div>
        </div>
				<div className="contacts__right">
					<div className="contacts__title">Контакты</div>
					<div className="contacts__right-contacts">
						<div>
							<img src="assets/icons/tel-icon.svg" alt="" />
							<a href="tel:+78888888888">8 (888) 888 88 88</a>
						</div>
						<div>
							<img src="assets/icons/gmail-icon.svg" alt="" />
							<a href="mailto:">softstudio@softstudio.ru</a>
						</div>
						<div>
							<img src="assets/icons/tg-icon.svg" alt="" />
							<a href="https://t.me/durov">@softstudiotg</a>
						</div>
					</div>
				</div>
			</div>
		</section>

		{/* <footer className="footer">
			<div className="footer__container container">

				<div className="footer__top">
					<div className="footer__top-left">
						<img src="assets/icons/ss-icon-text.svg" alt="" className="logo" />
						<div className="footer__text">ООО "105 СОФТ-СТУДИЯ"<br/>ИНН: 0500044302<br/>ОГРН: 1250500019087<br/>Юр. адрес: 367000, Республика Дагестан, г Махачкала, ул Дзержинского, д. 21</div>
						<div className="footer__text"><img src="assets/icons/bloated-heart-icon.svg"/> 2025 105 СОФТ-СТУДИЯ Права защищены</div>
						
					</div>
					<div className="footer__top-right">
						<a className="footer__top-right-tel" href="tel:">8 (888) 888 88 88</a>
						<div className="adress">
							Улица Дзержинского 21 <br/>© ДГУ
						</div>
						<div className="footer__top-right-cosial">
							<a href=""><img src="assets/icons/vk-icon.svg" alt=""/></a>
							<a href=""><img src="assets/icons/yt-icon.svg" alt=""/></a>
							<a href=""><img src="assets/icons/tg-icon.svg" alt=""/></a>
						</div>
					</div>
				</div>
				{/* <div className="footer__bottom">
					<img src="assets/icons/heart.svg" alt="">crescendo
				</div>
			</div>
		// </footer>
		*/}
		<Footer />

		<img className="f-b one" src="assets/icons/f-b-l.svg" alt=""/>
		<img className="f-b two" src="assets/icons/f-b-r.svg" alt=""/>
    </>
  )
}
