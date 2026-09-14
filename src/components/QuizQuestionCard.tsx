import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, TeamConfig, Character } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { CheckCircle2, XCircle, Clock, Lightbulb, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  currentTeam: TeamConfig;
  character: Character;
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  timeLimit: number; // in seconds, 0 = unlimited
  onAnswer: (selectedIndex: number) => void;
  onNextQuestion: () => void;
  isAnswered: boolean;
  selectedOptionIndex: number | null;
  onSwitchTeam?: () => void;
  isHostSelectMode?: boolean;
}

export const QuizQuestionCard: React.FC<Props> = ({
  currentTeam,
  character,
  question,
  questionIndex,
  totalQuestions,
  timeLimit,
  onAnswer,
  onNextQuestion,
  isAnswered,
  selectedOptionIndex,
  onSwitchTeam,
  isHostSelectMode = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  const optionLetters = ['A', 'B', 'C', 'D'];

  // Reset timer on new question
  useEffect(() => {
    setTimeLeft(timeLimit);
    setIsTimerPaused(false);
  }, [question.id, timeLimit]);

  // Countdown timer logic
  useEffect(() => {
    if (timeLimit <= 0 || isAnswered || isTimerPaused) return;

    if (timeLeft <= 0) {
      // Time up counts as wrong answer (-1 as timeout)
      onAnswer(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timeLimit, isAnswered, isTimerPaused, onAnswer]);

  // Keyboard shortcut listener
  useEffect(() => {
    if (isAnswered) {
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNextQuestion();
        }
      };
      window.addEventListener('keydown', handleEnter);
      return () => window.removeEventListener('keydown', handleEnter);
    }

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') onAnswer(0);
      else if (key === 'B' || key === '2') onAnswer(1);
      else if (key === 'C' || key === '3') onAnswer(2);
      else if (key === 'D' || key === '4') onAnswer(3);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isAnswered, onAnswer, onNextQuestion]);

  const isTeamA = currentTeam.id === 'teamA';
  const teamThemeBorder = isTeamA ? 'border-red-400' : 'border-blue-400';
  const teamThemeText = isTeamA ? 'text-red-700' : 'text-blue-700';
  const teamThemeBg = isTeamA ? 'bg-red-50' : 'bg-blue-50';

  const isTimeout = isAnswered && selectedOptionIndex === -1;
  const isSelectedCorrect = selectedOptionIndex === question.correctIndex;

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto rounded-3xl p-5 sm:p-7 shadow-xl border-3 ${teamThemeBorder} bg-white transition-all duration-300`}
    >
      {/* Turn Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <CharacterAvatar character={character} size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                  isTeamA ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                Lượt của {isTeamA ? 'Đội 1' : 'Đội 2'}
              </span>
              {question.category && (
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Chủ đề: {question.category}
                </span>
              )}
            </div>
            <h3 className={`text-lg sm:text-xl font-extrabold ${teamThemeText} mt-0.5`}>
              {currentTeam.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Question Index Badge */}
          <div className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5">
            <span>Câu hỏi:</span>
            <span className="text-amber-700 font-extrabold text-base">
              {questionIndex + 1}
            </span>
            <span className="text-slate-400 font-semibold">/ {totalQuestions}</span>
          </div>

          {/* Optional Host Switch Team */}
          {isHostSelectMode && onSwitchTeam && !isAnswered && (
            <button
              onClick={onSwitchTeam}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-300 flex items-center gap-1 transition"
              title="Đổi lượt sang đội khác"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đổi đội</span>
            </button>
          )}

          {/* Countdown Timer (if enabled) */}
          {timeLimit > 0 && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-black border transition-colors ${
                timeLeft <= 5
                  ? 'bg-red-100 text-red-700 border-red-300 animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="py-5 sm:py-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* Options Grid (4 options) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isThisCorrect = idx === question.correctIndex;

          let btnStyle = 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400 hover:shadow-md';
          let letterStyle = 'bg-slate-100 text-slate-700 border-slate-300';

          if (isAnswered) {
            if (isThisCorrect) {
              // Highlight correct answer in green
              btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500 shadow-md';
              letterStyle = 'bg-emerald-600 text-white border-emerald-600';
            } else if (isSelected && !isThisCorrect) {
              // Highlight user's wrong answer in red
              btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through opacity-90 ring-1 ring-rose-400';
              letterStyle = 'bg-rose-600 text-white border-rose-600';
            } else {
              // Other unselected options
              btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              letterStyle = 'bg-slate-200 text-slate-500 border-slate-300';
            }
          }

          return (
            <motion.button
              key={idx}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              onClick={() => !isAnswered && onAnswer(idx)}
              disabled={isAnswered}
              className={`relative flex items-center text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer disabled:cursor-default ${btnStyle}`}
            >
              {/* Option Letter (A, B, C, D) */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-extrabold text-sm sm:text-base border shadow-sm shrink-0 mr-3.5 ${letterStyle}`}
              >
                {optionLetters[idx]}
              </div>

              {/* Option Text */}
              <span className="text-base sm:text-lg font-semibold flex-1 leading-normal">
                {opt}
              </span>

              {/* Status Icon */}
              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 ml-2" />
              )}
              {isAnswered && isSelected && !isThisCorrect && (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 ml-2" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback Banner after answering */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 pt-5 border-t border-slate-200 space-y-4"
          >
            {/* Outcome message */}
            <div
              className={`p-4 rounded-2xl flex items-start gap-3 border-2 ${
                isSelectedCorrect
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              {isSelectedCorrect ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-extrabold text-base sm:text-lg">
                  {isSelectedCorrect
                    ? `🎉 CHÍNH XÁC! ${currentTeam.name} TRẢ LỜI ĐÚNG!`
                    : isTimeout
                    ? `⏰ HẾT THỜI GIAN! ${currentTeam.name} KHÔNG KỊP TRẢ LỜI!`
                    : `❌ CHƯA CHÍNH XÁC! ${currentTeam.name} TRẢ LỜI SAI!`}
                </div>
                <div className="text-xs sm:text-sm font-medium mt-0.5 text-slate-700">
                  {isSelectedCorrect
                    ? `Lực kéo +1 điểm! Dải ruy băng tâm dây đã được giật mạnh về phía ${currentTeam.name}!`
                    : 'Theo quy định, trả lời sai thì tâm dây kéo co ĐỨNG IM, vị trí giữ nguyên!'}
                </div>
              </div>
            </div>

            {/* Explanation card if present */}
            {question.explanation && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-slate-800 text-xs sm:text-sm">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950">Mở rộng kiến thức: </span>
                  <span>{question.explanation}</span>
                </div>
              </div>
            )}

            {/* Next Question / Continue Action */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onNextQuestion}
                className={`px-6 py-3 rounded-2xl font-black text-white text-base sm:text-lg flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                  isTeamA ? 'bg-red-600 hover:bg-red-700 shadow-red-300' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-300'
                }`}
              >
                <span>{questionIndex + 1 < totalQuestions ? 'Câu hỏi tiếp theo' : 'Xem kết quả chung cuộc'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
