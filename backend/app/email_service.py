"""Отправка email с ссылками на Telegram-каналы после регистрации на курс."""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)

# Ссылки на Telegram-каналы
TG_LINK_BASIC = os.getenv("TG_LINK_BASIC", "https://t.me/example_basic")  # 1 ссылка для базового
TG_LINK_SUPPORT_1 = os.getenv("TG_LINK_SUPPORT_1", "https://t.me/example_support1")  # 1-я для с поддержкой
TG_LINK_SUPPORT_2 = os.getenv("TG_LINK_SUPPORT_2", "https://t.me/example_support2")  # 2-я для с поддержкой


def send_course_links_email(to_email: str, full_name: str, course_name: str, support_type: str) -> bool:
    """Отправляет письмо пользователю со ссылками на TG-каналы."""
    if not SMTP_USER or not SMTP_PASSWORD:
        return False  # SMTP не настроен — не падаем, просто не отправляем
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Доступ к курсу «{course_name}»"
        msg["From"] = SMTP_FROM
        msg["To"] = to_email

        if support_type == "basic":
            links_html = f'<a href="{TG_LINK_BASIC}">{TG_LINK_BASIC}</a>'
            links_text = TG_LINK_BASIC
        else:
            links_html = f'<a href="{TG_LINK_SUPPORT_1}">{TG_LINK_SUPPORT_1}</a><br/><a href="{TG_LINK_SUPPORT_2}">{TG_LINK_SUPPORT_2}</a>'
            links_text = f"{TG_LINK_SUPPORT_1}\n{TG_LINK_SUPPORT_2}"

        text = f"Здравствуйте, {full_name}!\n\nВы зарегистрировались на курс «{course_name}».\n\nВаши ссылки на Telegram-каналы:\n{links_text}"
        html = f"""<html><body>
        <p>Здравствуйте, {full_name}!</p>
        <p>Вы зарегистрировались на курс «{course_name}».</p>
        <p><strong>Ваши ссылки на Telegram-каналы:</strong></p>
        <p>{links_html}</p>
        </body></html>"""

        msg.attach(MIMEText(text, "plain", "utf-8"))
        msg.attach(MIMEText(html, "html", "utf-8"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_FROM, to_email, msg.as_string())
        return True
    except Exception:
        return False
