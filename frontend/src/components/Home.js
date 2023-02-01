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

  //TODO: Fix sorting
  sortByColumn = (col) => {
    const { items, sortBy, sortDirection } = this.state;
    let direction = 'asc';

    if (sortBy === col) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    this.setState({
      items: items.sort((a, b) => {
        if (a[col] < b[col]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[col] > b[col]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      }),
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


      <Form onChange={this.handleChange} onSubmit={this.handleSubmit}>
        <Input type="search" name="search" placeholder="Enter an item to search"/>
        <Button style={{ marginTop: "10px" }} color="primary" name="action" type="submit" value="scrape" size="lg" block>Search</Button>
      </Form>

      <Table style={{color: "white"}}>
        
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
          <th>
            <div onClick={() => this.sortByColumn('price')}>
              Price <FontAwesomeIcon icon={faSortDown} style={{marginLeft: "5px"}} />
            </div>
          </th>
          <th>
            <div onClick={() => this.sortByColumn('link')}>
              Link <FontAwesomeIcon icon={faSortDown} style={{marginLeft: "5px"}} />
            </div>
          </th>


          </tr>
        </thead>
      <tbody>
        {items.length ?
          items.map((item, index) => (
            <tr key = {index}>
              <td><img src={item.imagelink} alt={item.name} style={{ width: "100%", height: "auto" }}/></td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td><a href={item.link} target="_blank">{item.link}</a></td>
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