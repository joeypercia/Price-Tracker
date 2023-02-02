import React, { Component, Text, useState, useEffect } from "react";
import { Col, Container, Form, Label, Input, Row, Button, Table} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import logo from '../logo.png';
import axios from "axios";
import { API_URL } from "../constants";
import "./Home.css"


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      search: "",
      items: [],
      sortBy: '',
      sortDirection: 'asc'
    };
  }


  sortByColumn = (col) => {
    const { items, sortBy, sortDirection } = this.state;
    let direction = 'asc';

    if (sortBy === col) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    items.forEach(item => {
      const strippedPrice = item.price.replace(/[^\d.]/g, "");
      item.sortablePrice = strippedPrice ? parseFloat(strippedPrice) : Number.NEGATIVE_INFINITY;
    });
    
    this.setState({
      items: items
        .filter(item => item.price !== 'n/a')
        .sort((a, b) => {
          let aPrice = parseFloat(a.price.replace(/[^\d.-]/g, '')) || 0;
          let bPrice = parseFloat(b.price.replace(/[^\d.-]/g, '')) || 0;
          
          if (aPrice < bPrice) {
            return direction === 'asc' ? -1 : 1;
          }
          if (aPrice > bPrice) {
            return direction === 'asc' ? 1 : -1;
          }
          return 0;
        })
        .concat(items.filter(item => item.price === 'n/a')),
      sortBy: col,
      sortDirection: direction
    });
  }
  
  componentDidMount() {
    
  }

  componentDidUpdate() {

  }

  getItems = () => {
    axios.get(API_URL).then(res => this.setState({ items: res.data }));
  };

  resetState = () => {
    this.getItems();
  }

  handleChange = (event) => {
    this.setState({ search: event.target.value });
  }
  
  handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append('link', 'n/a')
    formData.append('name', this.state.search)
    formData.append('price', 'n/a')
    formData.append('date', 'n/a')
    formData.append('imagelink', 'n/a')
    formData.append('type', 'scrape')
    axios.post(API_URL, formData)
    .then(res => {
      console.log("Request Submitted")
      console.log(res);
      console.log(res.data);
      console.log(this.state.search)
      
      axios
    .get(API_URL, {
      params: {
          name: this.state.search,
          action: "home_search"
      }
  })
      .then(response => {
        this.setState({
          items: response.data
        })
      })
    })
    .catch((err) => {
      //handle error
      console.log(err.response.data);
    })
    
  }

  render() {
    const { items = [], sortBy, sortDirection } = this.state;
    return (



      
      <Container className="Main" style={{color: "white"}}>
        <div className="text-center" style={{marginBottom: "100px"}}>
        <img
          src={logo}
          width="500"
          //className="img-thumbnail"
          //style={{ marginTop: "20px" }}
        />
        </div>


      <Form onChange={this.handleChange} onSubmit={this.handleSubmit} style={{marginBottom:"10px"}}>
        <Input type="search" name="search" placeholder="Enter an item to search"/>
        <Button style={{ marginTop: "10px" }} color="primary" name="action" type="submit" value="scrape" size="lg" block>Search</Button>
      </Form>

      <Table hover borderless striped dark style={{color: "white"}}>
        
        <thead>
          <tr>
          <th>
              Image
          </th>
          <th>
            <div onClick={() => this.sortByColumn('name')}>
              Item Name <FontAwesomeIcon icon={faSortDown} style={{marginLeft: "5px"}} />
            </div>
          </th>
          <th style={{minWidth: "100px"}}>
            <div onClick={() => this.sortByColumn('price')}>
              Price <FontAwesomeIcon icon={faSortDown} style={{marginLeft: "5px"}} />
            </div>
          </th>
          <th>
            <div onClick={() => this.sortByColumn('link')}>
              Retailer <FontAwesomeIcon icon={faSortDown} style={{marginLeft: "5px"}} />
            </div>
          </th>
          </tr>
        </thead>
      <tbody>
        {items.length ?
          items.map((item, index) => (
            <tr key={index} onClick={() => window.open(item.link, "_blank")} style={{ cursor: "pointer", fontSize: "1.2em"}}>
              <td><img src={item.imagelink} alt={item.name} style={{ width: "100%", height: "auto" }}/></td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td><a href={item.link} target="_blank"><img src=
                {item.link.includes("newegg") ? "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/052016/untitled-1_165.png?itok=R-zqzbAC" : 
                "https://cdn.worldvectorlogo.com/logos/amazon-1.svg"}
                alt={item.link.includes("ebay") ? "eBay logo" : "Amazon logo"}
                title={item.link.includes("ebay") ? "Go to eBay" : "Go to Amazon"}
                style={{width: "100px", height:"100px"}} 
                />
              </a>
              </td>
            </tr>
          ))
          :
          (<tr>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>)
  }
      </tbody>
      </Table>
      </Container>
    );
  }
}

export default Home;



/*
<Row style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
<Col className="class-col">
  <NewItemModal create={true} resetState={this.resetState} />
</Col>
<Col className="class-col">
  <ItemList
    items={this.state.items}
    resetState={this.resetState}
  />
</Col>
*/