import django_filters

from goods.models import Good


class GoodFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(
        field_name='category__name',
        lookup_expr='iexact',
        label='Категория',
    )
    manufacturer = django_filters.CharFilter(
        field_name='manufacturer__name',
        lookup_expr='iexact',
        label='Производитель',
    )

    class Meta:
        model = Good
        fields = ['category', 'manufacturer']
