import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QuizOption {
  option_id: number;
  option: string;
}

interface QuizQuestion {
  question_id: number;
  question: string;
  options: QuizOption[];
  correct_option_id: number;
}

interface QuizData {
  quiz_title: string;
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!fileId) return;
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:5001/api/file-info/${fileId}`)
      .then(res => {
        if (!res.data.has_quiz) {
          setError('No quiz available for this file.');
          setLoading(false);
          return;
        }
        axios.post(`http://localhost:5001/api/generate-quiz/${fileId}`)
          .then(res2 => {
            setQuiz(res2.data.quiz);
            setLoading(false);
          })
          .catch(() => {
            setError('Failed to load quiz.');
            setLoading(false);
          });
      })
      .catch(() => {
        setError('Failed to load file info.');
        setLoading(false);
      });
  }, [fileId]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        <span className="text-slate-600 dark:text-slate-400 text-lg">Loading quiz...</span>
      </div>
    </div>
  );
  if (error) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-red-500 text-lg">{error}</div>
    </div>
  );
  if (!quiz) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 p-4">
      <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600 shadow-2xl overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Progress Bar */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{currentQuestion + 1} / {quiz.questions.length}</span>
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                  {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%
                </div>
              </div>
            </div>
            <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
              {Array.from({ length: quiz.questions.length - 1 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full w-0.5 bg-slate-300 dark:bg-slate-600"
                  style={{ left: `${((i + 1) / quiz.questions.length) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Quiz Ended */}
          {gameOver ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-12 space-y-8 max-w-md mx-auto">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-bounce">
                    <span className="text-5xl">🎉</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-4 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">Quiz Complete!</h3>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                    <div className="text-lg text-slate-600 dark:text-slate-400 mb-2">Your Score</div>
                    <div className="text-5xl font-bold">
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{score}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-3xl mx-2">/</span>
                      <span className="text-slate-600 dark:text-slate-400 text-3xl">{quiz.questions.length}</span>
                    </div>
                    <div className="mt-3 text-xl font-semibold">
                      {score === quiz.questions.length ? (
                        <span className="text-yellow-600 dark:text-yellow-400">Perfect Score! 🌟</span>
                      ) : score >= quiz.questions.length * 0.8 ? (
                        <span className="text-green-600 dark:text-green-400">Excellent! 👏</span>
                      ) : score >= quiz.questions.length * 0.6 ? (
                        <span className="text-blue-600 dark:text-blue-400">Good effort! 👍</span>
                      ) : (
                        <span className="text-purple-600 dark:text-purple-400">Keep practicing! 💪</span>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                      {Math.round((score / quiz.questions.length) * 100)}% accuracy
                    </div>
                  </div>
                </div>
                <Button 
                  type="button" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setScore(0);
                    setSelectedOption(null);
                    setShowFeedback(false);
                    setGameOver(false);
                  }}
                >
                  Play Again
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate(-1)}
                >
                  Back to File
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-6 overflow-y-auto">
              <div className="bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl p-8 border-2 border-blue-100 dark:border-slate-600 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                    {currentQuestion + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      Question {currentQuestion + 1} of {quiz.questions.length}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Choose the best answer</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {quiz.questions[currentQuestion].question}
                </h3>
              </div>
              <div className="space-y-4">
                {quiz.questions[currentQuestion].options.map((opt, index) => {
                  const isSelected = selectedOption === opt.option_id;
                  const isCorrect = opt.option_id === quiz.questions[currentQuestion].correct_option_id;
                  const optionLetter = String.fromCharCode(65 + index);
                  return (
                    <button
                      key={opt.option_id}
                      type="button"
                      className={`group w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected && showFeedback
                          ? isCorrect
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400 dark:border-green-600 ring-4 ring-green-200/50 dark:ring-green-800/50 shadow-lg'
                            : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-400 dark:border-red-600 ring-4 ring-red-200/50 dark:ring-red-800/50 shadow-lg'
                          : isSelected
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-400 dark:border-blue-600 ring-4 ring-blue-200/50 dark:ring-blue-800/50 shadow-lg'
                            : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 hover:shadow-md'
                      }`}
                      onClick={() => {
                        if (showFeedback) return;
                        setSelectedOption(opt.option_id);
                        setShowFeedback(true);
                        if (opt.option_id === quiz.questions[currentQuestion].correct_option_id) {
                          setScore(s => s + 1);
                        }
                      }}
                      disabled={showFeedback}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          isSelected && showFeedback
                            ? isCorrect
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-110'
                              : 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg scale-110'
                            : isSelected
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-110'
                              : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 text-slate-600 dark:text-slate-300 group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-800 dark:group-hover:to-indigo-800 group-hover:text-blue-600 dark:group-hover:text-blue-300'
                        }`}>
                          {showFeedback && isCorrect && isSelected ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          ) : showFeedback && isSelected && !isCorrect ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                          ) : (
                            optionLetter
                          )}
                        </div>
                        <span className={`text-lg flex-1 transition-all duration-300 ${
                          isSelected && showFeedback
                            ? isCorrect
                              ? 'text-green-800 dark:text-green-200 font-semibold'
                              : 'text-red-800 dark:text-red-200 font-medium'
                            : isSelected
                              ? 'text-blue-800 dark:text-blue-200 font-semibold'
                              : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300'
                        }`}>
                          {opt.option}
                        </span>
                        {showFeedback && !isSelected && isCorrect && (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {showFeedback && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className={`relative overflow-hidden text-center p-8 rounded-2xl border-2 ${
                    selectedOption === quiz.questions[currentQuestion].correct_option_id
                      ? 'bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-gradient-to-r from-red-50 via-pink-50 to-red-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-red-900/20 border-red-300 dark:border-red-700'
                  }`}>
                    <div className="absolute inset-0 opacity-10">
                      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${
                        selectedOption === quiz.questions[currentQuestion].correct_option_id
                          ? 'bg-green-400'
                          : 'bg-red-400'
                      }`}></div>
                      <div className={`absolute -bottom-20 -left-20 w-32 h-32 rounded-full ${
                        selectedOption === quiz.questions[currentQuestion].correct_option_id
                          ? 'bg-emerald-400'
                          : 'bg-pink-400'
                      }`}></div>
                    </div>
                    {selectedOption === quiz.questions[currentQuestion].correct_option_id ? (
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          </div>
                          <span className="text-2xl font-bold text-green-700 dark:text-green-300">Correct! Well done! 🎉</span>
                        </div>
                        <p className="text-green-600 dark:text-green-400 text-lg">You nailed it! Keep up the excellent work.</p>
                      </div>
                    ) : (
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                          </div>
                          <span className="text-2xl font-bold text-red-700 dark:text-red-300">Not quite right 🤔</span>
                        </div>
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-red-200 dark:border-red-800">
                          <p className="text-red-600 dark:text-red-400 font-medium mb-2">The correct answer was:</p>
                          <p className="text-red-800 dark:text-red-200 font-bold text-lg">
                            {quiz.questions[currentQuestion].options.find(opt => opt.option_id === quiz.questions[currentQuestion].correct_option_id)?.option}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <Button
                      type="button"
                      className="min-w-48 bg-gradient-to-r text-black from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                      onClick={() => {
                        if (currentQuestion + 1 < quiz.questions.length) {
                          setCurrentQuestion(q => q + 1);
                          setSelectedOption(null);
                          setShowFeedback(false);
                        } else {
                          setGameOver(true);
                        }
                      }}
                    >
                      {currentQuestion + 1 < quiz.questions.length ? (
                        <>Next Question</>
                      ) : (
                        <>See Results</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
