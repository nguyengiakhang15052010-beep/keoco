import React from 'react';
import { motion } from 'motion/react';
import { TeamConfig, Character, RoundHistoryItem } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { Trophy, RotateCcw, Award, CheckCircle, XCircle, Users, Settings } from 'lucide-react';

interface Props {
  isOpen: boolean;
  teamA: TeamConfig;
  teamB: TeamConfig;
  characterA: Character;
  characterB: Character;
  ropePosition: number;
  history: RoundHistoryItem[];
  onPlayAgain: () => void;
  onOpenQuestions: () => void;
  onOpenTeamSetup: () => void;
}

export const VictoryModal: React.FC<Props> = ({
  isOpen,
  teamA,
  teamB,
  characterA,
  characterB,
  ropePosition,
  history,
  onPlayAgain,
  onOpenQuestions,
  onOpenTeamSetup,
}) => {
  if (!isOpen) return null;

  // Determine winner:
  // Rope position: negative = Team A pulled rope, positive = Team B pulled rope
  let winner: 'teamA' | 'teamB' | 'tie' = 'tie';
  if (ropePosition < 0) winner = 'teamA';
  else if (ropePosition > 0) winner = 'teamB';
  else {
    // If rope is dead center, check scores
    if (teamA.score > teamB.score) winner = 'teamA';
    else if (teamB.score > teamA.score) winner = 'teamB';
    else winner = 'tie';
  }

  const winningTeam = winner === 'teamA' ? teamA : winner === 'teamB' ? teamB : null;
  const winningChar = winner === 'teamA' ? characterA : winner === 'teamB' ? characterB : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Floating Celebration Confetti Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              top: `${(i * 19) % 95}%`,
              left: `${(i * 23) % 98}%`,
              fontSize: `${18 + (i % 4) * 8}px`,
              animationDuration: `${1.2 + (i % 3) * 0.4}s`,
              opacity: 0.85,
            }}
          >
            {['🎉', '🎊', '✨', '⭐', '🎈', '🥇', '🏆', '🔥'][i % 8]}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-400 my-auto"
      >
        {/* Victory Header */}
        <div className="relative px-6 py-8 text-center bg-gradient-to-b from-amber-500 via-amber-400 to-amber-300 text-slate-950 overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/90 border-2 border-amber-600 shadow-xl flex items-center justify-center mb-3">
              <Trophy className="w-9 h-9 text-amber-600 fill-amber-500 animate-pulse" />
            </div>

            <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-amber-950 bg-white/60 px-3.5 py-1 rounded-full shadow-sm mb-2">
              KẾT QUẢ CHUNG CUỘC
            </div>

            {winner === 'tie' ? (
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                  TRẬN ĐẤU HÒA NHAU! 🤝
                </h2>
                <p className="text-sm font-bold text-amber-950 mt-1">
                  Cả 2 đội đều có phong độ xuất sắc ngang tài ngang sức!
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
                  {winningTeam?.name} VÔ ĐỊCH! 🏆
                </h2>
                <p className="text-sm font-bold text-amber-950 mt-1">
                  Đã kéo dải ruy băng tâm dây về phía đội mình và giành chiến thắng vẻ vang!
                </p>
              </div>
            )}

            {/* Mascot on Trophy Podium */}
            {winningChar && (
              <div className="mt-4 flex flex-col items-center">
                <CharacterAvatar character={winningChar} size="lg" isCelebrating={true} />
                <span className="text-xs font-black text-slate-900 bg-white/90 px-3 py-1 rounded-full shadow mt-2">
                  Đại diện: {winningChar.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Score & Rope Summary */}
        <div className="p-6 bg-slate-50 space-y-5">
          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Team A stats */}
            <div
              className={`p-4 rounded-2xl border-2 text-center transition ${
                winner === 'teamA'
                  ? 'bg-red-50 border-red-500 ring-2 ring-red-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-slate-500">ĐỘI 1</div>
              <div className="text-base font-extrabold text-red-600 truncate">{teamA.name}</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{teamA.score}</div>
              <div className="text-[11px] text-slate-500">câu trả lời đúng</div>
            </div>

            {/* Team B stats */}
            <div
              className={`p-4 rounded-2xl border-2 text-center transition ${
                winner === 'teamB'
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-slate-500">ĐỘI 2</div>
              <div className="text-base font-extrabold text-blue-600 truncate">{teamB.name}</div>
              <div className="text-3xl font-black text-slate-900 mt-1">{teamB.score}</div>
              <div className="text-[11px] text-slate-500">câu trả lời đúng</div>
            </div>
          </div>

          {/* Rope displacement note */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center text-xs text-slate-600 font-medium">
            <span>Vị trí tâm dây kết thúc: </span>
            <span className="font-extrabold text-slate-900">
              {ropePosition === 0
                ? '0 (Cân bằng ngay tại tâm)'
                : ropePosition < 0
                ? `Lệch ${Math.abs(ropePosition)} bước về phía ${teamA.name}`
                : `Lệch ${ropePosition} bước về phía ${teamB.name}`}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={onPlayAgain}
              className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-200 transition cursor-pointer hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi Lại Ván Mới</span>
            </button>

            <button
              onClick={onOpenQuestions}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Sửa Câu Hỏi</span>
            </button>

            <button
              onClick={onOpenTeamSetup}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-600" />
              <span>Đổi Đội & Tên</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
