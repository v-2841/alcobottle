from django.contrib import admin

from goods.models import Category, Good, Manufacturer


@admin.action(description='Сделать неактивным')
def set_active_to_false(modeladmin, request, queryset):
    queryset.update(active=False)


@admin.action(description='Сделать активным')
def set_active_to_true(modeladmin, request, queryset):
    queryset.update(active=True)


class GoodAdmin(admin.ModelAdmin):
    list_filter = ['active', 'category', 'manufacturer']
    search_fields = ['name', 'slug']
    actions = [set_active_to_false, set_active_to_true]
    list_display = [
        'name',
        'normalize_volume',
        'price',
        'category',
        'manufacturer',
        'stock',
        'active',
    ]
    ordering = ['-active', 'name']

    @admin.display(description='Объем, л')
    def normalize_volume(self, obj):
        return obj.volume.normalize()

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('category', 'manufacturer')


admin.site.register(Good, GoodAdmin)
admin.site.register(Category)
admin.site.register(Manufacturer)
