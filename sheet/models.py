from __future__ import unicode_literals
from django.contrib.auth.models import Permission, User
from django.core.urlresolvers import reverse
from django.db import models
from datetime import datetime


class Workbook(models.Model):
    book = models.CharField( max_length=255,)
    tab = models.CharField( max_length=255, )
    functions = models.CharField(max_length=255, )
    data = models.TextField(max_length=255, )
    updatedBy = models.CharField(max_length=255, )
    permissions = models.CharField(max_length=255, )
    updatedAt = models.DateTimeField('date created', default=datetime.now)
    
    def __str__(self):
        return self.book 
        
