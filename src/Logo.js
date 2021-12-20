import "./Game.css";
import React from "react";

class Logo extends React.Component {
  handleMouseOver(id) {
    const logo = document.getElementById(id);
    logo.className = "App-logo2";
    console.log("mouseover");
  }

  handleMouseLeave(id) {
    const logo = document.getElementById(id);
    logo.className = "App-logo";
    console.log("mouseleave");
  }

  componentDidMount() {
    const id = this.props.id;
    const logo = document.getElementById(id);

    logo.addEventListener("mouseenter", () => this.handleMouseOver(id));
    logo.addEventListener("mouseleave", () => this.handleMouseLeave(id));
  }

  render() {
    const id = this.props.id;
    const location = this.props.location;

    return (
      <span>
        <img src={location} className="App-logo" alt="React" id={id} />
      </span>
    );
  }
}

export default Logo;
