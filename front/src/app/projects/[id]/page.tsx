import './page.css'
import Header from '@/components/Header';
import { getProjectById, type Project } from '@/lib/mockData';
import { fetchProjectFromApi, getImageUrl } from '@/lib/api';
import { apiProjectToProject } from '@/lib/projectAdapter';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';

const ProjectsPage = async ({params}: { params: { id: string } })  => {
    const { id } = await params;
    let project: Project | null = null;

    try {
        const apiProject = await fetchProjectFromApi(Number(id));
        project = apiProjectToProject(apiProject);
    } catch (e) {
        console.error('Не удалось загрузить проект из API', e);
        project = getProjectById("1");
    }
    
    if (!project) {
        notFound();
    }

    // Default services list - can be customized per project later
    const defaultServices = [
        'Аналитика и исследование ниши',
        'Проектирование',
        'визуальное исследование',
        'дизайн',
        'Айдентика',
        'вёрстка'
    ];

    return (
        <>
            <img src="/assets/icons/f-e-1.svg" alt="" className="f-e-1"/>
            <img src="/assets/icons/f-e-1-mob.svg" alt="" className="f-e-1-mob"/>
            <Header />



            <section className="p-hero">
                <div className="p-hero__container container">
                    <div className="p-hero__container-top">
                        <a href="/" className="breadcrumb glass-border"><img src="/assets/icons/arrow.svg" alt=""/>Вернуться
                            назад</a>
                    </div>
                    <div className="p-hero__container-bottom">
                        <div className="p-hero__container__left">
                            <img src={getImageUrl(project.notebook_img || project.preview_img) || ""} alt={project.title}/>
                        </div>
                        <div className="p-hero__container__right">
                            <div className="p-hero__container__right-title">{project.title.toUpperCase()}</div>
                            <div className="p-hero__container__right-line"></div>
                            <div className="p-hero__container__right-list">
                                <div>
                                    {defaultServices.slice(0, 3).map((service, index) => (
                                        <div key={index} className="p-hero__container__right-list-elem">{service}</div>
                                    ))}
                                </div>
                                <div>
                                    {defaultServices.slice(3, 6).map((service, index) => (
                                        <div key={index + 3} className="p-hero__container__right-list-elem">{service}</div>
                                    ))}
                                </div>
                            </div>
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="p-hero__container__right-link">
                                <img src="/assets/icons/link_chain.svg" alt=""/>
                                {project.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                            </a>
                        </div>
                    </div>
                    </div>
            </section>

            <section className="p-about">
                <div className="p-about__container container glass-border">
                    <div className="p-about__container-left">
                        <span>О компании</span>
                        <div className="p-about__container-left-title text">{project.about_company?.title || ''}</div>
                        <div className="text">{project.about_company?.description || ''}</div>
                    </div>
                    <div className="p-about__container-right">
                        <span>ЦЕЛЬ</span>
                        <div className="text">{project.target || ''}</div>
                        <span>ЗАДАЧА</span>
                        <div className="text">{project.task || ''}</div>
                    </div>
                </div>
            </section>

            <section className="p-after-about">
                <div className="p-after-about__container container">
                    <img src={getImageUrl(project.main_img) || "/assets/images/after-about.png"} alt={project.title}/>
                </div>
            </section>

            <section className="p-work-stages">
                <div className="p-work-stages__container container">
                    {(project.stages || []).map((stage, index) => {
                        return (
                            <div key={index} className="p-work-stages-elem">
                                <div className="p-work-stages-elem-left">
                                    <div className="p-work-stages-elem-title">{stage.title?.toUpperCase() || ''}</div>
                                    <div className="p-work-stages-elem-subtitle">{stage.description || ''}</div>
                                </div>
                                <div className="p-work-stages-elem-right">
                                    <img src={stage.img || "/assets/images/ANALYTICS.png"} alt={stage.title || ''}/>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="p-result">
                <div className="p-result__container container">
                    <div className="p-result__container-title">РЕЗУЛЬТАТ</div>
                    <div className="p-result__container-subtitle">
                        {project.result?.description || ''}
                    </div>
                </div>
            </section>

            <section className="p-gallery">
                <div className="p-gallery__container container">
                    {project.result?.images && project.result.images.length > 0 && (
                        <>
                            {project.result.images.find(img => img.type === 'tablet' || img.type === 'dashboard') && (
                                <img 
                                    className="tab" 
                                    src={project.result.images.find(img => img.type === 'tablet' || img.type === 'dashboard')?.img || "/assets/images/tab.png"} 
                                    alt={project.title}
                                />
                            )}
                            <div className="p-gallery__container-mobs">
                                {project.result.images
                                    .filter(img => img.type === 'mobile' || img.type === 'phone' || img.type === 'smartphone')
                                    .slice(0, 3)
                                    .map((img, index) => (
                                        <img key={index} src={img.img || "/assets/images/mob-1.png"} alt={`${project.title} - ${index + 1}`}/>
                                    ))}
                                {project.result.images.filter(img => img.type === 'mobile' || img.type === 'phone' || img.type === 'smartphone').length === 0 && (
                                    <>
                                        <img src="/assets/images/mob-1.png" alt=""/>
                                        <img src="/assets/images/mob-2.png" alt=""/>
                                        <img src="/assets/images/mob-3.png" alt=""/>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                    {(!project.result?.images || project.result.images.length === 0) && (
                        <>
                            <img className="tab" src="/assets/images/tab.png" alt=""/>
                            <div className="p-gallery__container-mobs">
                                <img src="/assets/images/mob-1.png" alt=""/>
                                <img src="/assets/images/mob-2.png" alt=""/>
                                <img src="/assets/images/mob-3.png" alt=""/>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section className="p-result-cards">
                <div className="p-result-cards__container container">
                    {project.progess.map((stat, index) => (
                        <div key={index} className="p-result-cards__elem glass-border">
                            <div className="p-result-cards__elem-subtitle">{stat.text.toUpperCase()}</div>
                            <div className="p-result-cards__elem-title">{stat.stat}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section id="contacts" className="contacts">
                <div className="contacts__container container">
                    <div className="contacts__left">
                        <div className="contacts__title">Остались вопросы?</div>
                        <div className="contacts__subtitle">Отправьте заявку и мы свяжемся с Вами</div>

                        <form action="" className="contacts__form" id="contactsForm">
                            <input type="text" name="name" id="contactName" placeholder="Имя*" className="contacts__input" required/>
                            <input type="tel" name="phone" id="contactPhone" placeholder="Телефон*" className="contacts__input"
                                required/>
                            <button type="submit" className="hero__left-link">Обсудить проект</button>
                        </form>
                        <div className="contacts__info">Нажимая на кнопку «Отправить», вы соглашаетесь с <a href=""> условиями
                                обработки
                                персональных данных</a></div>
                    </div>
                    <div className="contacts__right">
                        <div className="contacts__title">Контакты</div>
                        <div className="contacts__right-contacts">
                            <div>
                                <img className='contacts__icons' src="/assets/icons/tel-icon.svg" alt=""/>
                                <a href="tel:+78888888888">8 (888) 888 88 88</a>
                            </div>
                            <div>
                                <img className='contacts__icons' src="/assets/icons/gmail-icon.svg" alt=""/>
                                <a href="mailto:">soft@studio.ru</a>
                            </div>
                            <div>
                                <img className='contacts__icons' src="/assets/icons/tg-icon.svg" alt=""/>
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
                            <img src="/assets/icons/logo.svg" alt="" className="logo"/>
                            <div className="footer__text">Нужно написать какой-то текст, который никто не прочтет? Пишите сюда.</div>
                        </div>
                        <div className="footer__top-right">
                            <a className="footer__top-right-tel" href="tel:">8 (888) 888 88 88</a>
                            <div className="adress">
                                Улица Дзержинского 21 <br/>© ДГУ
                            </div>
                            <div className="footer__top-right-cosial">
                                <a href=""><img src="/assets/icons/tg.svg" alt=""/></a>
                                <a href=""><img src="/assets/icons/tg.svg" alt=""/></a>
                                <a href=""><img src="/assets/icons/tg.svg" alt=""/></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer> */}

            <Footer />

            <img className="f-b one" src="/assets/icons/f-b-l.svg" alt=""/>
            <img className="f-b two" src="/assets/icons/f-b-r.svg" alt=""/>
        </>
    )
}


export default ProjectsPage