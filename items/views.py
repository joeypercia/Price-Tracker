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

def get_items(name):
            
    userInput = re.sub('\s+', '+', name)
    websites = ["https://www.amazon.com/s?k=" + userInput, "https://www.newegg.com/p/pl?d=" + userInput]
    bs = []

    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    'referer': 'https://google.com',
    }

    #headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    #           'referer': 'https://google.com',
    #}

    for website in websites:
        
        
        #website = website.replace("&amp;", "&")
        response = requests.get(website, headers=headers)
        response.raise_for_status()

        if response.status_code == requests.codes.ok:
            bs.append(BeautifulSoup(response.text, 'lxml'))
                

    list_all_items = []
    #amazon
    list_all_items.append(bs[0].findAll('div', class_="sg-col-20-of-24 s-result-item s-asin sg-col-0-of-12 sg-col-16-of-20 sg-col s-widget-spacing-small sg-col-12-of-16"))
    #walmart
    list_all_items.append(bs[1].find('div', class_="item-cells-wrap border-cells items-grid-view four-cells expulsion-one-cell"))

    #print(list_all_items[0])
    #print(websites[1])
    #print(list_all_items[1])



    for index, lists in enumerate(list_all_items):
        #amazon
        if index == 0: 
            #print("Entered index 0")    
            for items in lists:       
                item_name = items.find('span', class_="a-size-medium a-color-base a-text-normal")
                if item_name is not None:
                    itemname=item_name.text
                item_price = items.find('span', class_="a-offscreen")
                if item_price is not None:
                    itemprice=item_price.text
                else:
                    itemprice = "n/a"
                item_link = items.find('a', class_="a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal")['href']
                if item_link is not None:
                    itemlink = "https://amazon.com" + item_link[:item_link.index('/ref') + 4]
                else:
                    itemlink = "n/a"
                itemdate = date.today().strftime("%m-%d-%y")
                item_imagelink = items.find('img', class_="s-image")
                if item_imagelink is not None:
                    itemimagelink = item_imagelink['src']
                else:
                    itemimagelink = "n/a"
                #print(itemdate)
                #print(itemlink)
                #print(itemname)
                #print(itemprice)
                #print(itemimagelink)
                #print("============= \n")
                #print("============= \n")    
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

                else:
                    return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)            
                
        #walmart    
        elif index == 1:
            print("Entered index 1")
            for items in lists: 
                item_name = items.find('a', class_="item-title")
                if item_name is not None:
                    itemname=item_name.text
                else:
                    itemname = "n/a"
                #print("printing itemname")
                #print(itemname)
                item_price = items.find('li', class_="price-current")
                if item_price is not None:
                    itemprice=item_price.text
                else:
                    itemprice = "n/a"
                #print("printing itemprice")    
                #print(itemprice)
                item_link = items.find('a', class_="item-img")
                if item_link is not None:
                    itemlink = item_link['href']
                    
                else:
                    itemlink = "n/a"
                #print("printing itemlink")
                #print(itemlink)
                itemdate = date.today().strftime("%m-%d-%y")
                #print("printing itemdate")
                #print(itemdate)
                item_imagelink = items.find('a', class_="item-img")
                if item_imagelink is not None:
                    item_imagelink = item_imagelink.find('img')
                    itemimagelink = item_imagelink['src']

                else:
                    itemimagelink = "n/a"    
                #print("printing itemimagelink")
                #print(itemimagelink)
                
                
                
                
                #print("============= \n")
                #print("============= \n")          
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

                else:
                    return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)    


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
            #do bs4 magic here
            get_items(name)
            return JsonResponse({"status": "Success"}, status=status.HTTP_200_OK)

       
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