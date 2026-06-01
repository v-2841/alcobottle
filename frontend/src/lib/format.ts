/** Цена в рублях: 7400 → "7 400 ₽" */
export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
}

/** Ниже этого остатка показываем предупреждение о наличии. */
const LOW_STOCK_THRESHOLD = 5;

/** Остаток выводим только когда его мало (< 5 шт.). */
export function isLowStock(stock: number): boolean {
  return stock < LOW_STOCK_THRESHOLD;
}

/** Наличие: 3 → "Осталось 3 шт.", 0 → "Нет в наличии" */
export function formatStock(stock: number): string {
  return stock > 0 ? `Осталось ${stock} шт.` : "Нет в наличии";
}
