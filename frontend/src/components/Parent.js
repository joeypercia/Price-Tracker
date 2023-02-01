import React from 'react';
import axios from 'axios';
import { API_URL } from "../constants";
import { useEffect, useState } from 'react';
import ItemTimeline from "./ItemTimeline.js"

export default function Parent() 
{
    const [items, getItems] = useState('')

    useEffect(() => {
        getAllItems();
    }, []);

    const getAllItems = () => {
        axios.get(API_URL)
        .then((response) => {
            const allItems = response.data;
            getItems(allItems);
        })
        .catch(console.error());
    }

    return(
        <ItemTimeline items={items}/>
    )


}

