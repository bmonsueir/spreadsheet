from django.conf.urls import url
from . import views

#workbook
from django.conf import settings

urlpatterns = [
    
    url(r'^$', views.index, name = 'index'),
    ]
    
    #url(r'^$', views.home, name = 'home'),