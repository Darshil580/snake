import "./Game.css";
import React from "react";

function Square(props) {
  return (
    <span
      className="square border-black"
      style={{ top: props.y * 25 + "px", left: props.x * 25 + "px" }}
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

export { Restart, GameOver, Score, ObstacleSquare, Square };
