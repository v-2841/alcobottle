from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet, ReadOnlyModelViewSet

from api.serializers import (CategorySerializer, GoodSerializer,
                             ManufacturerSerializer)
from goods.models import Category, Good, Manufacturer


class CategoryViewSet(mixins.ListModelMixin, GenericViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ManufacturerViewSet(mixins.ListModelMixin, GenericViewSet):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer


class GoodViewSet(ReadOnlyModelViewSet):
    queryset = Good.objects.filter(active=True).select_related(
        'category',
        'manufacturer',
    )
    serializer_class = GoodSerializer
    lookup_field = 'slug'
