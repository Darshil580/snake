// import logo from "./logo.svg";
// import logored from "./logo-red.svg";
// import logogreen from "./logo-green.svg";

// import Logo from "./Logo.js";

import "./Game.css";
import React from "react";

function Square(props) {
  return (
    <span
      className="square border-black"
      style={{ top: props.y * 25 + "px", left: props.x * 25 + "px" }}
      id={props.id}
    >
      {/* <font size="1">{props.id}</font> */}
    </span>
  );
}

function Score(props) {
  return <h2>Score: {props.score}</h2>;
}

function GameOver(props) {
  return <h3>The Game is Over. Your Score is : {props.score}</h3>;
}

function Restart(props) {
  return (
    <button className="btn btn-light" onClick={props.reset}>
      Restart
    </button>
  );
}

class Snake extends React.Component {
  static loop;

  constructor(props) {
    super(props);
    this.state = {
      size: 3,
      food: [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)],
      speed: 100,
      direction: "left",
      over: false,
      snakebody: [
        [8, 8],
        [9, 8],
        [10, 8],
      ],
    };
    this.start = this.start.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", (event) => this.handlePress(event));
    this.start();
  }

  start() {
    global.loop = setInterval(() => {
      this.moveSnake();
    }, this.state.speed);
    window.setInterval = global.loop;
  }

  changeDirection(direction) {
    this.setState({ direction: direction });
  }

  touched_food() {
    const first = this.state.snakebody[0];
    const { food } = this.state;

    if (first[0] === food[0] && first[1] === food[1]) {
      food[0] = Math.floor(Math.random() * 20);
      food[1] = Math.floor(Math.random() * 20);

      this.setState({ food: food });
      this.props.updateScore();
      return true;
    } else {
      return false;
    }
  }

  over() {
    let snake = this.state.snakebody;
    let check = snake[0];

    for (let i = 1; i < snake.length; i++) {
      if (snake[i][0] === check[0] && snake[i][1] === check[1]) {
        return true;
      }
    }
    return false;
  }

  moveSnake() {
    const touched = this.touched_food();
    let over = this.over();
    const { direction } = this.state;

    let loc = this.state.snakebody;
    let { size } = this.state;

    if (!over) {
      if (touched) {
        loc.push([loc[size - 1][0], loc[size - 1][1]]);
        this.setState({ size: size + 1, snakebody: loc });
      }

      for (let i = size - 1; i > 0; i--) {
        loc[i][0] = loc[i - 1][0];
        loc[i][1] = loc[i - 1][1];
      }

      if (direction === "left") {
        if (loc[0][0] === 0) {
          loc[0][0] = 40;
        }
        loc[0][0] = loc[0][0] - 1;
      } else if (direction === "right") {
        if (loc[0][0] === 39) {
          loc[0][0] = -1;
        }
        loc[0][0] = loc[0][0] + 1;
      } else if (direction === "up") {
        if (loc[0][1] === 0) {
          loc[0][1] = 20;
        }
        loc[0][1] = loc[0][1] - 1;
      } else if (direction === "down") {
        if (loc[0][1] === 19) {
          loc[0][1] = -1;
        }
        loc[0][1] = loc[0][1] + 1;
      } else {
      }
      this.setState({ snakebody: loc });
    } else {
      this.props.parentCallback();
      clearInterval(global.loop);
    }
  }

  handlePress(e) {
    let { direction } = this.state;

    if (
      e.key === "ArrowLeft" &&
      direction !== "left" &&
      direction !== "right"
    ) {
      this.changeDirection("left");
    } else if (
      e.key === "ArrowRight" &&
      direction !== "right" &&
      direction !== "left"
    ) {
      this.changeDirection("right");
    } else if (
      e.key === "ArrowUp" &&
      direction !== "up" &&
      direction !== "down"
    ) {
      this.changeDirection("up");
    } else if (
      e.key === "ArrowDown" &&
      direction !== "down" &&
      direction !== "up"
    ) {
      this.changeDirection("down");
    } else {
      console.log("Not Valid");
    }
  }

  food() {
    let { food } = this.state;
    return <Square x={food[0]} y={food[1]} />;
  }

  renderSnake() {
    let squares = [];
    let { size } = this.state;
    let loc = this.state.snakebody;

    for (let i = 0; i < size; i++) {
      squares.push(<Square x={loc[i][0]} y={loc[i][1]} id={this.props.id} />);
    }

    return squares;
  }

  render() {
    return (
      <div>
        {this.renderSnake()}
        {this.food()}
      </div>
    );
  }
}

class GameField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      over: false,
      score: 0,
    };
  }

  reset = () => {
    this.setState({ over: false, score: 0 });
  };

  updateScore = () => {
    let { score } = this.state;
    score = score + 1;
    this.setState({ score: score });
  };

  scoreCallback = () => {
    this.setState({ over: true });
  };

  render() {
    let { score } = this.state;
    let { over } = this.state;

    if (!over) {
      return (
        <div>
          <h1>Simple Snake Game. Use Arrow keys to control the Snake.</h1>
          <Score score={score} />

          <div className="surface">
            <Snake
              parentCallback={this.scoreCallback}
              updateScore={this.updateScore}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Simple Snake Game. Use Arrow keys to control the Snake.</h1>
          <GameOver score={score} />
          <Restart reset={this.reset} />
        </div>
      );
    }
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="App">
        {/* <div className="App-header cell border-white">
          <Logo location={logo} id={1} />
          <Logo location={logored} id={2} />
          <Logo location={logogreen} id={3} />
          <Logo location={logored} id={4} />
          <Logo location={logogreen} id={5} />
          <Logo location={logo} id={6} />
        </div> */}
        <div className="App-header ">
          <GameField />
        </div>
      </div>
    );
  }
}

export default Game;
