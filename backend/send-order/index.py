"""
Приём заказа из корзины и отправка на email менеджера.
"""

import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def format_cart(cart: list) -> str:
    lines = []
    total = 0
    for item in cart:
        line = f"• {item.get('brand','')} {item.get('model','')} {item.get('width','')}/{item.get('height','')} R{item.get('radius','')} — {item.get('price','')} × {item.get('qty', 1)} шт."
        lines.append(line)
        total += item.get("priceNum", 0) * item.get("qty", 1)
    if total > 0:
        lines.append(f"\nИтого: {total:,} ₽".replace(",", " "))
    return "\n".join(lines)


def send_email(to_email: str, subject: str, body: str):
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASS", "")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = to_email

    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"ok": False, "error": "bad json"})}

    name = body.get("name", "—")
    phone = body.get("phone", "—")
    email = body.get("email", "—")
    comment = body.get("comment", "")
    cart = body.get("cart", [])

    manager_email = os.environ.get("MANAGER_EMAIL", "")
    if not manager_email:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"ok": False, "error": "MANAGER_EMAIL not configured"}),
        }

    cart_text = format_cart(cart)
    subject = f"Новый заказ шин от {name}"
    message = f"""Новый заказ с сайта ШинПоиск

Клиент: {name}
Телефон: {phone}
Email: {email}
Комментарий: {comment or 'нет'}

Позиции:
{cart_text}
"""

    send_email(manager_email, subject, message)

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"ok": True}, ensure_ascii=False),
    }
