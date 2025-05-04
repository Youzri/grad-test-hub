
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Load exam data
    // In a real app, this would be fetched from the server
    const examData = [
      { 
        id: 1, 
        title: "Mathematics Exam", 
        duration: 60, 
        questions: [
          {
            id: 1,
            question: "What is 5 + 7?",
            options: ["10", "12", "15", "17"],
            correctAnswer: "12"
          },
          {
            id: 2,
            question: "Solve for x: 3x - 6 = 15",
            options: ["5", "7", "8", "9"],
            correctAnswer: "7"
          },
          {
            id: 3,
            question: "What is the area of a circle with radius 4 units?",
            options: ["16π square units", "8π square units", "4π square units", "12π square units"],
            correctAnswer: "16π square units"
          },
          {
            id: 4,
            question: "What is 12 × 8?",
            options: ["88", "92", "96", "102"],
            correctAnswer: "96"
          },
          {
            id: 5,
            question: "Simplify: (2³)²",
            options: ["32", "64", "16", "36"],
            correctAnswer: "64"
          }
        ]
      },
      { 
        id: 2, 
        title: "Science Quiz", 
        duration: 45,
        questions: [
          {
            id: 1,
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correctAnswer: "Au"
          },
          {
            id: 2,
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: "Mars"
          },
          {
            id: 3,
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Platinum"],
            correctAnswer: "Diamond"
          }
        ]
      },
      { 
        id: 3, 
        title: "History Test", 
        duration: 90,
        questions: [
          {
            id: 1,
            question: "In which year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            correctAnswer: "1945"
          },
          {
            id: 2,
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
            correctAnswer: "George Washington"
          },
          {
            id: 3,
            question: "In which year did the Berlin Wall fall?",
            options: ["1987", "1989", "1991", "1993"],
            correctAnswer: "1989"
          }
        ]
      }
    ];
    
    const selectedExam = examData.find(e => e.id.toString() === examId);
    
    if (!selectedExam) {
      navigate('/dashboard');
      return;
    }
    
    setExam(selectedExam);
    
    // Randomize questions
    const shuffledQuestions = [...selectedExam.questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    
    // Set exam timer
    setTimeLeft(selectedExam.duration * 60); // convert to seconds
    
    // Prevent copy/paste
    document.addEventListener('copy', disableCopyPaste);
    document.addEventListener('paste', disableCopyPaste);
    document.addEventListener('cut', disableCopyPaste);
    
    // Disable right click
    document.addEventListener('contextmenu', disableContextMenu);
    
    return () => {
      document.removeEventListener('copy', disableCopyPaste);
      document.removeEventListener('paste', disableCopyPaste);
      document.removeEventListener('cut', disableCopyPaste);
      document.removeEventListener('contextmenu', disableContextMenu);
    };
  }, [examId, navigate]);
  
  // Timer
  useEffect(() => {
    if (!examSubmitted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (!examSubmitted && timeLeft === 0) {
      handleSubmitExam();
    }
  }, [timeLeft, examSubmitted]);
  
  const disableCopyPaste = (e: Event) => {
    e.preventDefault();
    return false;
  };
  
  const disableContextMenu = (e: Event) => {
    e.preventDefault();
    return false;
  };
  
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleSubmitExam = () => {
    // Calculate score
    let correctAnswers = 0;
    
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
    
    // Save result
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      const result = {
        examId: exam.id,
        examTitle: exam.title,
        score: scorePercentage,
        totalQuestions: questions.length,
        correctAnswers,
        date: Date.now(),
        timeTaken: Math.round((exam.duration * 60 - timeLeft) / 60)
      };
      
      if (!users[userIndex].results) {
        users[userIndex].results = [];
      }
      
      users[userIndex].results.unshift(result);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user
      currentUser.results = users[userIndex].results;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    setExamSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!exam || questions.length === 0) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (examSubmitted) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card text-center p-5">
          <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
          <h3>Exam Submitted Successfully!</h3>
          <p>Redirecting to dashboard...</p>
          <div className="spinner-border text-primary mx-auto mt-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container-fluid p-0">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">{exam.title}</span>
          <div className="ms-auto timer">
            <i className="fas fa-clock me-2"></i> {formatTime(timeLeft)}
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="card">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Question {currentQuestionIndex + 1} of {questions.length}</h5>
            <div className="progress" style={{ width: '150px' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                aria-valuenow={((currentQuestionIndex + 1) / questions.length) * 100}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
          <div className="card-body">
            <div className="question-wrapper">
              <h5 className="mb-4">{currentQuestion.question}</h5>
              
              <div className="options-list">
                {currentQuestion.options.map((option: string, index: number) => (
                  <div className="form-check mb-3" key={index}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={currentQuestion.id}
                      id={`option${index}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={handleAnswerChange}
                    />
                    <label className="form-check-label" htmlFor={`option${index}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="d-flex justify-content-between mt-4">
              <button 
                className="btn btn-outline-primary" 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <button 
                  className="btn btn-primary" 
                  onClick={handleNextQuestion}
                >
                  Next
                </button>
              ) : (
                <button 
                  className="btn btn-success" 
                  onClick={handleSubmitExam}
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
