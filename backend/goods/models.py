from django.db import models


class Good(models.Model):
    name = models.CharField(
        max_length=128,
        verbose_name='Наименование',
    )
    slug = models.SlugField(
        unique=True,
        verbose_name='Слаг',
    )
    seo_description = models.TextField(
        verbose_name='SEO описание',
    )
    description = models.TextField(
        blank=True,
        verbose_name='Описание',
    )
    tasting = models.TextField(
        blank=True,
        verbose_name='Дегустация',
    )
    volume = models.DecimalField(
        max_digits=6,
        decimal_places=3,
        verbose_name='Объем, л',
    )
    price = models.PositiveIntegerField(
        verbose_name='Цена, ₽',
    )
    stock = models.PositiveIntegerField(
        verbose_name='Наличие на складе, шт.',
    )
    image = models.ImageField(
        upload_to='goods/',
        verbose_name='Изображение',
        blank=True,
        null=True,
    )
    category = models.ForeignKey(
        'Category',
        on_delete=models.RESTRICT,
        related_name='goods',
        verbose_name='Категория',
    )
    manufacturer = models.ForeignKey(
        'Manufacturer',
        on_delete=models.RESTRICT,
        related_name='goods',
        verbose_name='Производитель',
    )
    active = models.BooleanField(
        default=True,
        verbose_name='В продаже',
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(
        max_length=128,
        verbose_name='Наименование',
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name


class Manufacturer(models.Model):
    name = models.CharField(
        max_length=128,
        verbose_name='Наименование',
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Производитель'
        verbose_name_plural = 'Производители'

    def __str__(self):
        return self.name
