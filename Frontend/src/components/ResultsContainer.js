import React, { useEffect, useState } from "react";

const ResultsContainer = ({ quizState, currentUser, handleLogout }) => {
  const [userScores, setUserScores] = useState([]);

  // useEffect(() => {
  //   // Log currentUser to debug
   

  //   const fetchScores = async () => {
  //     if (!currentUser || !currentUser.email) {
  //       console.error("Invalid currentUser or missing email");
  //       return;
  //     }

  //     try {
  //       const response = await fetch(
  //         `http://localhost:8000/user-scores?email=${currentUser.email}`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch scores");
  //       }
  //       const data = await response.json();
  //       setUserScores(data.scores);
  //     } catch (error) {
  //       console.error("Error fetching user scores:", error);
  //     }
  //   };

  //   fetchScores();
  // }, [currentUser]);

  return (
    <div className="results">
      <h2>Quiz Complete!</h2>
      <p>
        Your Score: {quizState.score}/{quizState.userAnswers.length}
      </p>

      <h3>Previous Scores:</h3>
      {userScores.length > 0 ? (
        <ul>
          {userScores.map((score, index) => (
            <li key={index}>
              Quiz: {score.quiz_name}, Score: {score.score}
            </li>
          ))}
        </ul>
      ) : (
        <p>No previous scores available.</p>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ResultsContainer;
