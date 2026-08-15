import asyncio
import logging
import os

import django
from dotenv import load_dotenv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alcobottle.settings')
django.setup()

from asgiref.sync import sync_to_async  # noqa: E402
from telegram import ReplyKeyboardMarkup  # noqa: E402
from telegram.error import Conflict  # noqa: E402
from telegram.ext import (  # noqa: E402
    Application,
    CommandHandler,
    ExtBot,
    MessageHandler,
    filters,
)

from goods.models import Good  # noqa: E402

load_dotenv()

BUTTON_GOODS = '🛒 Товары'
logger = logging.getLogger(__name__)


class SerializedPollingBot(ExtBot):
    """Serialize and diagnose all getUpdates calls in this process."""

    __slots__ = (
        '_active_get_updates',
        '_get_updates_calls',
        '_get_updates_lock',
        '_get_updates_overlap_attempts',
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._active_get_updates = 0
        self._get_updates_calls = 0
        self._get_updates_lock = asyncio.Lock()
        self._get_updates_overlap_attempts = 0

    async def get_updates(self, *args, **kwargs):
        self._get_updates_calls += 1
        call_id = self._get_updates_calls
        waited_for_local_call = self._get_updates_lock.locked()

        if waited_for_local_call:
            self._get_updates_overlap_attempts += 1
            logger.warning(
                'Concurrent local getUpdates call queued: call=%s, overlaps=%s',
                call_id,
                self._get_updates_overlap_attempts,
            )

        async with self._get_updates_lock:
            self._active_get_updates += 1
            try:
                return await super().get_updates(*args, **kwargs)
            except Conflict:
                logger.warning(
                    'getUpdates conflict diagnostics: call=%s, '
                    'active=%s, waited_for_local_call=%s, overlaps=%s',
                    call_id,
                    self._active_get_updates,
                    waited_for_local_call,
                    self._get_updates_overlap_attempts,
                )
                raise
            finally:
                self._active_get_updates -= 1


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

    application = Application.builder().bot(
        SerializedPollingBot(token=token)
    ).build()
    application.add_handler(CommandHandler('start', start))
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text)
    )
    application.run_polling()


if __name__ == '__main__':
    main()
