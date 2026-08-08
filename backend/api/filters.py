import django_filters
from rest_framework.filters import OrderingFilter

from goods.models import Good


class StableOrderingFilter(OrderingFilter):
    """Добавляет id последним ключом сортировки.

    Без него товары с одинаковой ценой возвращаются в произвольном порядке,
    и при постраничной загрузке один и тот же товар может прийти дважды
    или не прийти вовсе.
    """

    def get_ordering(self, request, queryset, view):
        ordering = super().get_ordering(request, queryset, view)
        if not ordering:
            return ordering
        fields = [field.lstrip('-') for field in ordering]
        if 'id' in fields:
            return ordering
        return list(ordering) + ['id']


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
