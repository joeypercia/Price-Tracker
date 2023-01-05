from genericpath import exists
from urllib import response
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, viewsets, permissions
from django.shortcuts import render
from .models import Item
from .serializers import *
from bs4 import BeautifulSoup
import requests

#def searchRequest(request):
    #if request.method == 'POST':
     #   action = request.POST.get('action')
      #  if action == 'scrape':
            #Item(data)
       #     search = request.POST.get('search')
        #    Item.objects.create(
         #       search=search
          #  )
           # return JsonResponse({"status": "Success"})

#@api_view(['PATCH'])
#def scrape_view(request, data):
  #  if request.method == 'PATCH':
       # userInput = data
        #userInput.replace(" ", "+")
        #website = "https://www.amazon.com/s?k=" + userInput
        #r = requests.get(website)
        #bs = BeautifulSoup(r.content, 'html.parser')
        #prices = bs.find_all('div', {"class":"price"})
        #listings_list = []

        #for now code only stores item price data, update it later to store name + website + link + date(?)
        #for items in prices:
        #    listings_list.append(Item(price=items))

        #serializer = ItemSerializer(listings_list, context={'request': request}, many=True)

        #return Response(serializer.data)
        #return Response("Hello from scrape_view!")

@api_view(['GET', 'POST'])
def items_list(request):
    if request.method == 'GET':
        

        data = Item.objects.all()
        
        if request.GET.get('action') == 'home_search':
            search=request.GET.get('name', True)
            data = data.filter(name__icontains=search)
    
        serializer = ItemSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        action = request.POST.get('type')
        if action == 'scrape':
            name = request.POST.get('name')

            Item.objects.create(
                date="n/a",
                link="n/a",
                price="n/a",
                name=name
            )
            return JsonResponse({"status": "Success"})
       
        else:
            serializer = ItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def items_detail(request, pk):
    try:
        item = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = ItemSerializer(item, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)