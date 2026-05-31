from django.contrib import admin
from django.contrib.auth.models import Group

admin.site.unregister(Group)
admin.site.site_header = 'Административная панель'
admin.site.index_title = 'Управление сайтом'
admin.site.site_title = 'Административная панель'
