from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.viewsets import GenericViewSet, ReadOnlyModelViewSet

from api.filters import GoodFilter
from api.serializers import (CategorySerializer, GoodSerializer,
                             ManufacturerSerializer)
from goods.models import Category, Good, Manufacturer


class CategoryViewSet(mixins.ListModelMixin, GenericViewSet):
    queryset = Category.objects.filter(goods__active=True).distinct()
    serializer_class = CategorySerializer
    pagination_class = None


class ManufacturerViewSet(mixins.ListModelMixin, GenericViewSet):
    queryset = Manufacturer.objects.filter(goods__active=True).distinct()
    serializer_class = ManufacturerSerializer
    pagination_class = None


class GoodViewSet(ReadOnlyModelViewSet):
    queryset = Good.objects.filter(active=True).select_related(
        'category',
        'manufacturer',
    )
    serializer_class = GoodSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = GoodFilter
    search_fields = ['name']
    ordering_fields = ['price', 'name']
    ordering = ['price']
