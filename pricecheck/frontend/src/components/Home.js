import React, { Component, Text, useState, useEffect } from "react";
import { Col, Container, Form, Label, Input, Row, Button, Table} from 'reactstrap';
//import ItemList from "./ItemList";
import axios from "axios";
import { API_URL } from "../constants";
import "./Home.css"

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      search: "",
      items: []
    };
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
    const { items = [] } = this.state;
    return (
      <Container className="Test">
         <Form onChange={this.handleChange} onSubmit={this.handleSubmit}>
          <Input type="search" name="search" placeholder="Enter an item to search"/>
          <Button style={{ marginTop: "10px" }} color="primary" name="action" type="submit" value="scrape" size="lg" block>Search</Button>
        </Form>

      <Table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            <th>Link</th>
            <th>Date</th>
          </tr>
        </thead>
      <tbody>
        {items.length ?
          items.map((item, index) => (
            <tr key = {index}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.link}</td>
              <td>{item.date}</td>
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