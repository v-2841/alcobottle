from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from goods.models import Category, Good, Manufacturer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
        ]


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = [
            'id',
            'name',
        ]


class GoodSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    manufacturer = ManufacturerSerializer(read_only=True)
    volume = serializers.SerializerMethodField(help_text='Объем, л')

    @extend_schema_field(
        serializers.DecimalField(max_digits=6, decimal_places=3)
    )
    def get_volume(self, obj):
        return obj.volume.normalize()

    class Meta:
        model = Good
        fields = [
            'id',
            'name',
            'slug',
            'seo_description',
            'description',
            'tasting',
            'volume',
            'price',
            'stock',
            'image',
            'category',
            'manufacturer',
        ]
