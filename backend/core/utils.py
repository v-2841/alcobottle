import os

import requests


def send_telegram_message(text):
    token = os.getenv('TELEGRAM_TOKEN')
    chat_ids = [
        i.strip() for i in os.getenv('CHAT_IDS', '').split(',') if i.strip()
    ]
    if not token or not chat_ids:
        return False

    url = f'https://api.telegram.org/bot{token}/sendMessage'
    success = True
    for chat_id in chat_ids:
        try:
            response = requests.get(
                url,
                params={'chat_id': chat_id, 'text': text},
                timeout=10,
            )
            response.raise_for_status()
        except requests.RequestException:
            success = False
    return success
