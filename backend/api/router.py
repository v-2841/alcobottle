from rest_framework.routers import DefaultRouter

from api.views import CategoryViewSet, GoodViewSet, ManufacturerViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('manufacturers', ManufacturerViewSet, basename='manufacturer')
router.register('goods', GoodViewSet, basename='good')
