import "./Game.css";
import React from "react";

function Square(props) {
  return (
    <span
      className="square border-black"
      style={{
        top: props.y * 25 + "px",
        left: props.x * 25 + "px",
        backgroundColor: props.color,
      }}
      id={props.id}
    ></span>
  );
}

function ObstacleSquare(props) {
  return (
    <span
      className="square"
      style={{ top: props.y * 25 + "px", left: props.x * 25 + "px" }}
      id={props.id}
    ></span>
  );
}

function Display(props) {
  return (
    <h2 className={props.class}>
      {props.name} : {props.value}
    </h2>
  );
}

function GameOver(props) {
  return (
    <h3 className={props.class}>
      The Game is Over. Your Score is : {props.score}
      <br />
      Your Highest Score is : {props.highscore}
    </h3>
  );
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
      size: 4,
      food: [Math.floor(Math.random() * 40), Math.floor(Math.random() * 20)],
      direction: "left",
      over: false,
      level: 1,
      init: true, // For Reseting snake on level update and change to intial settings
      move: true, // Working on it
      snakebody: [
        // Initial Body
        [30, 5],
        [31, 5],
        [32, 5],
        [33, 5],
      ],
      badpool: [],
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", (event) => {
      setTimeout(() => {
        this.handlePress(event);
        if (this.state.init) {
          global.loop = setInterval(() => this.moveSnake(), 80);
          this.setState({ init: false });
        }
      }, 75);
    });
  }

  genFood() {
    const { badpool } = this.state;

    let x = Math.floor(Math.random() * 40);
    let y = Math.floor(Math.random() * 20);

    for (let i = 0; i < badpool.length; i++) {
      if (badpool[i][0] === x && badpool[i][1] === y) {
        x = Math.floor(Math.random() * 40);
        y = Math.floor(Math.random() * 20);
        i = 0;
      }
    }

    this.setState({ food: [x, y] });
  }

  touched_food() {
    const first = this.state.snakebody[0];
    const { food } = this.state;

    if (first[0] === food[0] && first[1] === food[1]) {
      this.props.updateScore();
      this.genFood();
      return true;
    } else {
      return false;
    }
  }

  over() {
    let snake = this.state.snakebody;
    let check = snake[0];
    const { level } = this.state;

    // Checking Body Touch
    for (let i = 1; i < snake.length; i++) {
      if (snake[i][0] === check[0] && snake[i][1] === check[1]) {
        return true;
      }
    }

    // Checking Field Touch for Level 2
    if (level === 2 || level === 4) {
      if (
        check[0] === 0 ||
        check[1] === 0 ||
        check[0] === 39 ||
        check[1] === 19
      ) {
        return true;
      }
    }

    // Checking Field Touch for Level 3
    if (level === 3 || level === 4) {
      for (let y = 4; y < 15; y++) {
        if (check[0] === 19 && check[1] === y) {
          return true;
        }
      }
      for (let x = 4; x < 35; x++) {
        if (check[0] === x && check[1] === 9) {
          return true;
        }
      }
    }

    return false;
  }

  moveSnake() {
    const touched = this.touched_food();
    let over = this.over();
    let { direction, size, init } = this.state;
    let loc = this.state.snakebody;

    if (!over) {
      if (touched && !init) {
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
      document.removeEventListener("keydown", (event) =>
        this.handlePress(event)
      );
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
      this.setState({ direction: "left", move: false });

      // this.moveSnake();
    } else if (
      e.key === "ArrowRight" &&
      direction !== "right" &&
      direction !== "left"
    ) {
      this.setState({ direction: "right" });

      // this.moveSnake();
    } else if (
      e.key === "ArrowUp" &&
      direction !== "up" &&
      direction !== "down"
    ) {
      this.setState({ direction: "up" });

      // this.moveSnake();
    } else if (
      e.key === "ArrowDown" &&
      direction !== "down" &&
      direction !== "up"
    ) {
      this.setState({ direction: "down" });
    }
  }

  updateLevel(level) {
    let badpool = [];

    if (level === 2 || level === 4) {
      for (let x = 0; x < 40; x++) {
        for (let y = 0; y < 20; y++) {
          if (x === 0) {
            badpool.push([x, y]);
          } else if (y === 0) {
            badpool.push([x, y]);
          } else if (x === 39) {
            badpool.push([x, y]);
          } else if (y === 19) {
            badpool.push([x, y]);
          }
        }
      }
    }

    if (level === 3 || level === 4) {
      for (let y = 4; y < 15; y++) {
        badpool.push([19, y]);
      }
      for (let x = 4; x < 35; x++) {
        badpool.push([x, 9]);
      }
    }

    clearInterval(global.loop);
    this.setState({
      level: level,
      snakebody: [
        [30, 5],
        [31, 5],
        [32, 5],
        [33, 5],
      ],
      size: 4,
      badpool: badpool,
      direction: "left",
      init: true,
    });
  }

  renderSnake() {
    let squares = [];
    let { size } = this.state;
    let loc = this.state.snakebody;
    let toggle = true;

    for (let i = 0; i < size; i++) {
      if (toggle === true) {
        squares.push(
          <Square
            x={loc[i][0]}
            y={loc[i][1]}
            id={this.props.id}
            color="white"
          />
        );
        toggle = false;
      } else {
        squares.push(
          <Square x={loc[i][0]} y={loc[i][1]} id={this.props.id} color="gray" />
        );
        toggle = true;
      }
    }

    return squares;
  }

  obstacles() {
    const { level } = this.state;
    let blocks = [];

    if (level === 2 || level === 4) {
      for (let x = 0; x < 40; x++) {
        for (let y = 0; y < 20; y++) {
          if (x === 0) {
            blocks.push(<ObstacleSquare x={0} y={y} />);
          } else if (y === 0) {
            blocks.push(<ObstacleSquare x={x} y={0} />);
          } else if (x === 39) {
            blocks.push(<ObstacleSquare x={39} y={y} />);
          } else if (y === 19) {
            blocks.push(<ObstacleSquare x={x} y={19} />);
          }
        }
      }
    }

    if (level === 3 || level === 4) {
      for (let y = 4; y < 15; y++) {
        blocks.push(<ObstacleSquare x={19} y={y} />);
      }
      for (let x = 4; x < 35; x++) {
        blocks.push(<ObstacleSquare x={x} y={9} />);
      }
    }

    return blocks;
  }

  food() {
    let { food } = this.state;
    return <Square x={food[0]} y={food[1]} class="food" />;
  }

  render() {
    return (
      <div>
        {this.renderSnake()}
        {this.obstacles()}
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
      level: 1,
      highscore: 0,
    };
    this.levelUpdate = React.createRef();
  }

  reset = () => {
    this.setState({ over: false, score: 0, level: 1 });
  };

  updateScore = () => {
    let { score, level, highscore } = this.state;

    score = score + 1;

    if (score > highscore) {
      highscore = highscore + 1;
    }

    this.setState({ score: score, highscore: highscore });

    if (score > 10 && level === 1) {
      level = 2;
      this.levelUpdate.current.updateLevel(level);
      this.setState({ level: level });
    } else if (score > 15 && level === 2) {
      level = 3;
      this.levelUpdate.current.updateLevel(level);
      this.setState({ level: level });
    } else if (score > 20 && level === 3) {
      level = 4;
      this.levelUpdate.current.updateLevel(level);
      this.setState({ level: level });
    }
  };

  scoreCallback = () => {
    this.setState({ over: true });
  };

  render() {
    const { score, over, level, highscore } = this.state;

    if (!over) {
      return (
        <div>
          <h1 id="info">
            Simple Snake Game. Use Arrow keys to control the Snake.
          </h1>
          <div id="details">
            {/* <div className="row"> */}
            <Display name="Score" value={score} class="data" />
            <Display name="Level" value={level} class="data" />
            <Display name="Highscore" value={highscore} class="data" />
            {/* </div> */}
          </div>

          <div className="surface border-white">
            <Snake
              parentCallback={this.scoreCallback}
              updateScore={this.updateScore}
              ref={this.levelUpdate}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <GameOver score={score} class="over" highscore={highscore} />
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
        <div className="App-header ">
          <GameField />
        </div>
      </div>
    );
  }
}

export default Game;
