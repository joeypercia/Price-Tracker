from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
            return Item.objects.create(**validated_data)

    class Meta:
        model = Item 
        fields = ('pk', 'name', 'price', 'link', 'date', 'imagelink')

