import os

import django
from dotenv import load_dotenv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alcobottle.settings')
django.setup()

from asgiref.sync import sync_to_async  # noqa: E402
from telegram import ReplyKeyboardMarkup  # noqa: E402
from telegram.ext import (  # noqa: E402
    Application,
    CommandHandler,
    MessageHandler,
    filters,
)

from goods.models import Good  # noqa: E402

load_dotenv()

BUTTON_GOODS = '🛒 Товары'


async def start(update, context):
    markup = ReplyKeyboardMarkup([[BUTTON_GOODS]], resize_keyboard=True)
    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text='Добрый день!',
        reply_markup=markup,
    )


@sync_to_async
def goods_text():
    goods = list(Good.objects.filter(active=True))
    if not goods:
        return 'Товаров нет.'
    lines = [
        f'{good.name} — {good.price} ₽ — {good.stock} шт.'
        for good in goods
    ]
    return 'Список всех товаров:\n' + '\n'.join(lines)


async def goods(update, context):
    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text=await goods_text(),
    )


async def handle_text(update, context):
    if update.message.text == BUTTON_GOODS:
        await goods(update, context)


def main():
    token = os.getenv('TELEGRAM_TOKEN')
    if not token:
        raise SystemExit('TELEGRAM_TOKEN не задан')

    application = Application.builder().token(token).build()
    application.add_handler(CommandHandler('start', start))
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text)
    )
    application.run_polling()


if __name__ == '__main__':
    main()
