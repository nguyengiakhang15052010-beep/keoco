/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Question,
  TeamConfig,
  Character,
  GameSettings,
  RoundHistoryItem,
} from './types';
import { CHARACTERS, getCharacterById } from './data/characters';
import {
  DEFAULT_QUESTIONS_TEAM_A,
  DEFAULT_QUESTIONS_TEAM_B,
} from './data/defaultQuestions';
import { soundManager } from './utils/audio';
import { TugOfWarArena } from './components/TugOfWarArena';
import { QuizQuestionCard } from './components/QuizQuestionCard';
import { QuestionEditorModal } from './components/QuestionEditorModal';
import { TeamSetupModal } from './components/TeamSetupModal';
import { VictoryModal } from './components/VictoryModal';
import { RulesModal } from './components/RulesModal';
import {
  Trophy,
  Users,
  Edit3,
  HelpCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Play,
} from 'lucide-react';

const STORAGE_KEY_QA = 'keoco_questions_team_a_v1';
const STORAGE_KEY_QB = 'keoco_questions_team_b_v1';
const STORAGE_KEY_TA = 'keoco_team_a_config_v1';
const STORAGE_KEY_TB = 'keoco_team_b_config_v1';
const STORAGE_KEY_SETTINGS = 'keoco_game_settings_v1';

export default function App() {
  // Questions state
  const [questionsA, setQuestionsA] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QA);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_QUESTIONS_TEAM_A;
  });

  const [questionsB, setQuestionsB] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QB);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_QUESTIONS_TEAM_B;
  });

  // Team configurations
  const [teamA, setTeamA] = useState<TeamConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TA);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      id: 'teamA',
      name: 'Đội Rồng Lửa',
      characterId: 'dragon',
      colorTheme: 'red',
      score: 0,
      currentQuestionIndex: 0,
    };
  });

  const [teamB, setTeamB] = useState<TeamConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TB);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      id: 'teamB',
      name: 'Đội Hổ Vàng',
      characterId: 'tiger',
      colorTheme: 'blue',
      score: 0,
      currentQuestionIndex: 0,
    };
  });

  // Game Settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      maxQuestionsPerTeam: 10,
      timeLimitPerQuestion: 0,
      soundEnabled: true,
      pullStepSize: 1,
      winThreshold: 5,
      turnMode: 'alternating',
    };
  });

  // Game Play State
  const [ropePosition, setRopePosition] = useState<number>(0); // -5 to +5
  const [currentTurn, setCurrentTurn] = useState<'teamA' | 'teamB'>('teamA');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  // Animation & Visual Feedback state
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pullDirection, setPullDirection] = useState<'teamA' | 'teamB' | null>(null);
  const [lastActionState, setLastActionState] = useState<'correct' | 'wrong' | 'idle'>('idle');
  const [lastActiveTeam, setLastActiveTeam] = useState<'teamA' | 'teamB' | null>(null);
  const [history, setHistory] = useState<RoundHistoryItem[]>([]);

  // Modals state
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState<boolean>(false);
  const [isTeamSetupOpen, setIsTeamSetupOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync sound setting
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Reset / New Match
  const handleResetMatch = useCallback(() => {
    soundManager.playWhistle();
    setRopePosition(0);
    setCurrentTurn('teamA');
    setRoundNumber(1);
    setIsAnswered(false);
    setSelectedOptionIndex(null);
    setIsPulling(false);
    setPullDirection(null);
    setLastActionState('idle');
    setLastActiveTeam(null);
    setHistory([]);
    setIsVictoryOpen(false);

    setTeamA((prev) => ({ ...prev, score: 0, currentQuestionIndex: 0 }));
    setTeamB((prev) => ({ ...prev, score: 0, currentQuestionIndex: 0 }));
  }, []);

  // Save questions handler
  const handleSaveQuestions = (newA: Question[], newB: Question[]) => {
    setQuestionsA(newA);
    setQuestionsB(newB);
    try {
      localStorage.setItem(STORAGE_KEY_QA, JSON.stringify(newA));
      localStorage.setItem(STORAGE_KEY_QB, JSON.stringify(newB));
    } catch {
      // storage error fallback
    }
  };

  // Reset to default questions
  const handleResetToDefaultQuestions = () => {
    setQuestionsA(DEFAULT_QUESTIONS_TEAM_A);
    setQuestionsB(DEFAULT_QUESTIONS_TEAM_B);
    try {
      localStorage.removeItem(STORAGE_KEY_QA);
      localStorage.removeItem(STORAGE_KEY_QB);
    } catch {
      // ignore
    }
  };

  // Save teams & settings handler
  const handleSaveTeamSetup = (newTeamA: TeamConfig, newTeamB: TeamConfig, newSettings: GameSettings) => {
    setTeamA((prev) => ({ ...prev, name: newTeamA.name, characterId: newTeamA.characterId }));
    setTeamB((prev) => ({ ...prev, name: newTeamB.name, characterId: newTeamB.characterId }));
    setSettings(newSettings);

    try {
      localStorage.setItem(STORAGE_KEY_TA, JSON.stringify(newTeamA));
      localStorage.setItem(STORAGE_KEY_TB, JSON.stringify(newTeamB));
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
    } catch {
      // ignore
    }
  };

  // Current active questions list and question index
  const activeQuestions = currentTurn === 'teamA' ? questionsA : questionsB;
  const activeTeam = currentTurn === 'teamA' ? teamA : teamB;
  const currentQuestionIdx = activeTeam.currentQuestionIndex;
  const currentQuestion = activeQuestions[currentQuestionIdx] || activeQuestions[0];
  const totalQuestions = activeQuestions.length;

  // Handle user's answer choice
  const handleAnswer = (selectedIdx: number) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOptionIndex(selectedIdx);
    setLastActiveTeam(currentTurn);

    const isCorrect = selectedIdx === currentQuestion.correctIndex;
    const ropeBefore = ropePosition;
    let ropeAfter = ropePosition;

    if (isCorrect) {
      // Trả lời đúng: Kéo tâm dây về phía đội đó
      setLastActionState('correct');
      soundManager.playCorrect();

      setTimeout(() => {
        soundManager.playPullRope();
      }, 150);

      setIsPulling(true);
      setPullDirection(currentTurn);

      if (currentTurn === 'teamA') {
        // Team A pulls left (negative)
        ropeAfter = Math.max(-settings.winThreshold, ropePosition - settings.pullStepSize);
        setRopePosition(ropeAfter);
        setTeamA((prev) => ({ ...prev, score: prev.score + 1 }));
      } else {
        // Team B pulls right (positive)
        ropeAfter = Math.min(settings.winThreshold, ropePosition + settings.pullStepSize);
        setRopePosition(ropeAfter);
        setTeamB((prev) => ({ ...prev, score: prev.score + 1 }));
      }

      // Reset pulling animation after 1.2s
      setTimeout(() => {
        setIsPulling(false);
      }, 1300);
    } else {
      // Trả lời sai: Đứng im!
      setLastActionState('wrong');
      soundManager.playWrong();
      setIsPulling(false);
      // Dây giữ nguyên vị trí
    }

    // Record round history
    const historyItem: RoundHistoryItem = {
      round: roundNumber,
      teamId: currentTurn,
      teamName: activeTeam.name,
      questionIndex: currentQuestionIdx,
      questionText: currentQuestion.question,
      selectedOptionIndex: selectedIdx,
      isCorrect,
      correctOptionIndex: currentQuestion.correctIndex,
      ropePositionBefore: ropeBefore,
      ropePositionAfter: ropeAfter,
      timestamp: Date.now(),
    };
    setHistory((prev) => [...prev, historyItem]);

    // Check early knockout win condition (if rope reached boundary threshold)
    if (isCorrect && Math.abs(ropeAfter) >= settings.winThreshold) {
      setTimeout(() => {
        soundManager.playVictory();
        setIsVictoryOpen(true);
      }, 1500);
    }
  };

  // Next Question click
  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedOptionIndex(null);
    setLastActionState('idle');
    setLastActiveTeam(null);
    setIsPulling(false);
    setPullDirection(null);

    // Check if match already reached win threshold
    if (Math.abs(ropePosition) >= settings.winThreshold) {
      soundManager.playVictory();
      setIsVictoryOpen(true);
      return;
    }

    if (settings.turnMode === 'alternating') {
      if (currentTurn === 'teamA') {
        // Team A just finished their question in round X -> Now Team B's turn for their question in round X
        setTeamA((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        }));
        setCurrentTurn('teamB');
      } else {
        // Team B just finished -> Advance to round X+1 and back to Team A
        const nextIdxB = teamB.currentQuestionIndex + 1;
        setTeamB((prev) => ({
          ...prev,
          currentQuestionIndex: nextIdxB,
        }));

        // Check if both teams completed all 10 questions
        if (nextIdxB >= totalQuestions) {
          soundManager.playVictory();
          setIsVictoryOpen(true);
          return;
        }

        setRoundNumber((prev) => prev + 1);
        setCurrentTurn('teamA');
      }
    } else {
      // Host select mode: advance active team index
      if (currentTurn === 'teamA') {
        const nextIdxA = teamA.currentQuestionIndex + 1;
        setTeamA((prev) => ({ ...prev, currentQuestionIndex: nextIdxA }));
        if (nextIdxA >= questionsA.length && teamB.currentQuestionIndex >= questionsB.length) {
          soundManager.playVictory();
          setIsVictoryOpen(true);
        }
      } else {
        const nextIdxB = teamB.currentQuestionIndex + 1;
        setTeamB((prev) => ({ ...prev, currentQuestionIndex: nextIdxB }));
        if (nextIdxB >= questionsB.length && teamA.currentQuestionIndex >= questionsA.length) {
          soundManager.playVictory();
          setIsVictoryOpen(true);
        }
      }
    }
  };

  const characterA = getCharacterById(teamA.characterId);
  const characterB = getCharacterById(teamB.characterId);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & App Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-blue-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl">
                🪢
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                <span>KÉO CO TRẮC NGHIỆM</span>
                <span className="hidden sm:inline text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  2 Đội
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                Mỗi đội 10 câu hỏi • Trả lời đúng kéo dây • Trả lời sai đứng im
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Question Editor Button */}
            <button
              onClick={() => setIsQuestionEditorOpen(true)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
              title="Chỉnh sửa câu hỏi & 4 đáp án"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Sửa Câu Hỏi</span>
            </button>

            {/* Team Setup Button */}
            <button
              onClick={() => setIsTeamSetupOpen(true)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
              title="Đặt tên đội & chọn nhân vật đại diện"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Cài Đặt Đội</span>
            </button>

            {/* Rules Button */}
            <button
              onClick={() => setIsRulesOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Xem luật chơi"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Reset Match */}
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn bắt đầu lại ván chơi mới từ đầu?')) {
                  handleResetMatch();
                }
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Chơi lại ván mới"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                setSettings((prev) => ({ ...prev, soundEnabled: next }));
                soundManager.setEnabled(next);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer hidden sm:block"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình (F11)'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-indigo-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-indigo-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Playing Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-6">
        {/* Arena Component */}
        <TugOfWarArena
          teamA={teamA}
          teamB={teamB}
          characterA={characterA}
          characterB={characterB}
          ropePosition={ropePosition}
          maxPosition={settings.winThreshold}
          isPulling={isPulling}
          pullDirection={pullDirection}
          lastActionState={lastActionState}
          lastActiveTeam={lastActiveTeam}
        />

        {/* Current Round Banner */}
        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>
              Hiệp đấu số: <b className="text-white font-extrabold">{roundNumber}</b> /{' '}
              {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">
              Vạch thắng mục tiêu: <b className="text-amber-400">±{settings.winThreshold} điểm</b>
            </span>
            <button
              onClick={() => setIsVictoryOpen(true)}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Xem bảng tỉ số</span>
            </button>
          </div>
        </div>

        {/* Active Quiz Question Card */}
        {currentQuestion && (
          <QuizQuestionCard
            currentTeam={activeTeam}
            character={activeTeam.id === 'teamA' ? characterA : characterB}
            question={currentQuestion}
            questionIndex={currentQuestionIdx}
            totalQuestions={totalQuestions}
            timeLimit={settings.timeLimitPerQuestion}
            onAnswer={handleAnswer}
            onNextQuestion={handleNextQuestion}
            isAnswered={isAnswered}
            selectedOptionIndex={selectedOptionIndex}
            onSwitchTeam={() =>
              setCurrentTurn((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'))
            }
            isHostSelectMode={settings.turnMode === 'hostSelect'}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="py-3 px-4 text-center text-xs text-slate-500 border-t border-slate-800">
        <span>
          💡 Phím tắt nhanh: Nhấn phím <b>A</b>, <b>B</b>, <b>C</b>, <b>D</b> hoặc <b>1</b>, <b>2</b>,{' '}
          <b>3</b>, <b>4</b> trên bàn phím để chọn đáp án. Nhấn <b>Enter</b> để sang câu tiếp theo.
        </span>
      </footer>

      {/* Modals */}
      <QuestionEditorModal
        isOpen={isQuestionEditorOpen}
        onClose={() => setIsQuestionEditorOpen(false)}
        questionsTeamA={questionsA}
        questionsTeamB={questionsB}
        onSave={handleSaveQuestions}
        onResetToDefault={handleResetToDefaultQuestions}
        teamAName={teamA.name}
        teamBName={teamB.name}
      />

      <TeamSetupModal
        isOpen={isTeamSetupOpen}
        onClose={() => setIsTeamSetupOpen(false)}
        teamA={teamA}
        teamB={teamB}
        settings={settings}
        onSave={handleSaveTeamSetup}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        teamA={teamA}
        teamB={teamB}
        characterA={characterA}
        characterB={characterB}
        ropePosition={ropePosition}
        history={history}
        onPlayAgain={handleResetMatch}
        onOpenQuestions={() => {
          setIsVictoryOpen(false);
          setIsQuestionEditorOpen(true);
        }}
        onOpenTeamSetup={() => {
          setIsVictoryOpen(false);
          setIsTeamSetupOpen(true);
        }}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
