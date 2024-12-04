import React, { useState, useEffect } from "react";

const QuizContainer = ({ currentUser, quizData, quizState, setQuizState }) => {
  const { currentQuestion, score, userAnswers } = quizState;
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option for feedback
  const [isAnswered, setIsAnswered] = useState(false); // Prevent multiple clicks

  useEffect(() => {
    console.log("Current Question:", currentQuestion, "Quiz Length:", quizData.length);
  if (currentQuestion === quizData.length-1) {
    setTimeout(submitScore, 500); // Delay to ensure state updates complete
  }
  }, [currentQuestion]);

  const handleOptionClick = (index) => {
    if (isAnswered) return; // Prevent clicking multiple times
    setIsAnswered(true); // Lock answering until feedback is shown
    setSelectedOption(index); // Update selected option for feedback

    const isCorrect = quizData[currentQuestion].correct === index;

    setTimeout(() => {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestion] = index;

      setQuizState({
        currentQuestion: currentQuestion + 1,
        score: isCorrect ? (score === 0 ? 1 : score + 1) : score,
        userAnswers: updatedAnswers,
      });
      console.log(score)

      setSelectedOption(null); // Reset selected option
      setIsAnswered(false); // Allow next question to be answered
    }, 1000); // Wait 1 second for feedback before moving to the next question
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setQuizState({ ...quizState, currentQuestion: currentQuestion + 1 });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setQuizState({ ...quizState, currentQuestion: currentQuestion - 1 });
    }
  };

  // Calculate progress percentage
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  // Function to submit score to the API using fetch
  const submitScore = async () => {
    try {
      // Prepare the payload for the API request
      const scoreData = {
        score: score+1,
        quiz_name: "Sample Quiz", // Adjust the quiz name if needed
      };

      console.log(currentUser)
      // Use fetch to send the score to the backend API
      const response = await fetch(`http://localhost:8000/submit-score?user_email=${currentUser.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scoreData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Score submitted successfully", data);
      } else {
        throw new Error("Failed to submit score");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <span>{currentUser.name}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question">{quizData[currentQuestion].question}</div>
      <div className="options">
        {quizData[currentQuestion].options.map((option, index) => {
          let optionClass = "option";
          if (selectedOption !== null) {
            if (index === selectedOption) {
              optionClass +=
                index === quizData[currentQuestion].correct
                  ? " correct"
                  : " wrong";
            } else if (index === quizData[currentQuestion].correct) {
              optionClass += " correct"; // Highlight the correct answer
            }
          }
          return (
            <div
              key={index}
              className={optionClass}
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </div>
          );
        })}
      </div>
      <div className="quiz-footer">
        {currentQuestion > 0 && (
          <button className="prev-btn" onClick={handlePrevious}>
            Previous
          </button>
        )}
        {currentQuestion < quizData.length - 1 && (
          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizContainer;
