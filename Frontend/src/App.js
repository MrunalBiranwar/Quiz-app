import React, { useState } from "react";
import AuthContainer from "./components/AuthContainer";
import QuizContainer from "./components/QuizContainer";
import ResultsContainer from "./components/ResultsContainer";
import "./App.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [quizState, setQuizState] = useState({ currentQuestion: 0, score: 0, userAnswers: [] });
  const [quizData] = useState([
    {
      question: "Which of the following is not a principle of Object-Oriented Programming?",
      options: ["Encapsulation", "Abstraction", "Compilation", "Polymorphism"],
      correct: 2,
    },
    {
      question: "What is the main advantage of Encapsulation in Java?",
      options: ["Code reusability", "Security by hiding data implementation", "Method overloading", "Faster execution"],
      correct: 1,
    },
    {
      question: "Which HTML element is used for creating a line break?",
      options: ["<break>", "<br>", "<lb>", "<line>"],
      correct: 1,
    },
    {
      question: "Which property is used to change the background color of an element in CSS?",
      options: ["color", "background-color", "bg-color", "background"],
      correct: 1,
    },
    {
      question: "Which of the following methods is used to select an HTML element by its ID in JavaScript?",
      options: ["getElementByTagName()", "getElementByClassName()", "getElementById()", "querySelectorAll()"],
      correct: 2,
    },
  ]);

  const handleLogout = () => {
    setCurrentUser(null);
    setQuizState({ currentQuestion: 0, score: 0, userAnswers: [] });
  };

  return (
    <div className="container">
      {!currentUser && <AuthContainer setCurrentUser={setCurrentUser} />}
      {currentUser && quizState.currentQuestion < quizData.length && (
        <QuizContainer
          currentUser={currentUser}
          quizData={quizData}
          quizState={quizState}
          setQuizState={setQuizState}
        />
      )}
      {currentUser && quizState.currentQuestion >= quizData.length && (
        <ResultsContainer quizState={quizState} handleLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
