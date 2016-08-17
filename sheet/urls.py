from django.conf.urls import url
from . import views

#workbook
from django.conf import settings

urlpatterns = [
    url(r'^$', views.home, name = 'home'),
    ]