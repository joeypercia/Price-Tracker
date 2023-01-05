from django.db import models

class Item(models.Model):
    name = models.CharField("Name", max_length=255)
    price = models.CharField("New Price", max_length=225)
    link = models.CharField("Link to Item", max_length=255, default="n/a")
    date = models.DateField("Date Searched", auto_now_add=True)

    def __str__(self):
        return self.name