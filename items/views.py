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
from datetime import date
import requests
import lxml 
import re


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

            #do bs4 magic here for amazon
            userInput = re.sub('\s+', '+', name)
            website = "https://www.amazon.com/s?k=" + userInput

            headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
            'referer': 'https://google.com',
            }

            r = requests.get(website, headers=headers)
            r.raise_for_status

            if r.status_code == requests.codes.ok:
    
                bs = BeautifulSoup(r.text, 'lxml')

            else:
                return Response("you dun goofed", status)
        
            bs = BeautifulSoup(r.text, 'lxml')
            list_all_items = bs.findAll('div', class_="sg-col-20-of-24 s-result-item s-asin sg-col-0-of-12 sg-col-16-of-20 sg-col s-widget-spacing-small sg-col-12-of-16")
            #print("now printing len list all items")
            #print(list_all_items)
            #print(len(list_all_items))

            #itemArray = []

            for items in list_all_items:
                
                item_name = items.find('span', class_="a-size-medium a-color-base a-text-normal")
                if item_name is not None:
                    itemname=item_name.text
                item_price = items.find('span', class_="a-offscreen")
                if item_price is not None:
                    itemprice=item_price.text
                else:
                    itemprice = "n/a"
                itemlink = items.find('a', class_="a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal")['href']
                itemlink = "https://amazon.com" + itemlink[:itemlink.index('/ref') + 4]
                itemdate = date.today().strftime("%m-%d-%y")
                item_imagelink = items.find('img', class_="s-image")
                if item_imagelink is not None:
                    itemimagelink = item_imagelink['src']
                    
                #itemimagelink = "TEST"

                if None not in (itemname, itemprice, itemlink, itemimagelink):
                    if name.lower() in itemname.lower():

                        #todo: delete/update duplicate items in database
                        if itemlink not in Item.objects.all().values_list('link', flat=True):

                            Item.objects.create(
                            date=itemdate,
                            link=itemlink,
                            price=itemprice,
                            name=itemname,
                            imagelink=itemimagelink
                        )


                        #else:
                        #    return Response("Item already exists", status=status.HTTP_200_OK)


                else:
                    return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)
            
            #repeat bs4 magic but for a different website




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