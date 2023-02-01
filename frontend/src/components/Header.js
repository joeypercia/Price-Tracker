import React, { Component } from "react";
import logo from '../logo.svg';

class Header extends Component {
  render() {
    return (
      <div className="text-center">
        <img
          src={logo}
          width="300"
          className="img-thumbnail"
          style={{ marginTop: "20px" }}
        />
        <hr />
        <h5>
          <i>PriceCheck</i>
        </h5>
      </div>
    );
  }
}

export default Header;