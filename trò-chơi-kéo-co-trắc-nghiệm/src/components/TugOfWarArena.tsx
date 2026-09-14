import React from 'react';
import { motion } from 'motion/react';
import { TeamConfig, Character } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { Sparkles, Trophy, Flag, Flame } from 'lucide-react';

interface Props {
  teamA: TeamConfig;
  teamB: TeamConfig;
  characterA: Character;
  characterB: Character;
  ropePosition: number; // -5 to +5 (0 is center, -5 is Team A victory, +5 is Team B victory)
  maxPosition?: number;
  isPulling: boolean;
  pullDirection: 'teamA' | 'teamB' | null;
  lastActionState: 'correct' | 'wrong' | 'idle';
  lastActiveTeam: 'teamA' | 'teamB' | null;
}

export const TugOfWarArena: React.FC<Props> = ({
  teamA,
  teamB,
  characterA,
  characterB,
  ropePosition,
  maxPosition = 5,
  isPulling,
  pullDirection,
  lastActionState,
  lastActiveTeam,
}) => {
  // Clamp rope position between -maxPosition and maxPosition
  const clampedPosition = Math.max(-maxPosition, Math.min(maxPosition, ropePosition));
  // Convert to percentage offset: -5 -> -35%, +5 -> +35%
  const offsetPercent = (clampedPosition / maxPosition) * 32;

  const isTeamAPulling = isPulling && pullDirection === 'teamA';
  const isTeamBPulling = isPulling && pullDirection === 'teamB';
  const isTeamAStunned = lastActionState === 'wrong' && lastActiveTeam === 'teamA';
  const isTeamBStunned = lastActionState === 'wrong' && lastActiveTeam === 'teamB';

  // Distance markers from -5 to 5
  const markers = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/30 bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-600 select-none">
      {/* Stadium / Sky & Crowd backdrop */}
      <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-gradient-to-b from-sky-500/80 to-sky-300/40 px-4 pt-3 flex flex-col justify-between">
        {/* Clouds */}
        <div className="absolute top-2 left-6 text-white/50 text-3xl pointer-events-none animate-pulse">☁️</div>
        <div className="absolute top-6 right-12 text-white/40 text-4xl pointer-events-none">☁️</div>
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-white/30 text-2xl pointer-events-none">☁️</div>

        {/* Top Header: Score & Team Badges */}
        <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full gap-2">
          {/* Team A Badge */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-lg border-2 border-red-400">
            <CharacterAvatar character={characterA} size="sm" isPulling={isTeamAPulling} isStunned={isTeamAStunned} />
            <div className="text-left">
              <div className="text-xs sm:text-sm font-black text-red-600 truncate max-w-[110px] sm:max-w-[160px]">
                {teamA.name}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <span>Đúng:</span>
                <span className="font-extrabold text-red-700 bg-red-100 px-1.5 py-0.2 rounded-md">
                  {teamA.score}
                </span>
              </div>
            </div>
          </div>

          {/* Center Tug Advantage Status */}
          <div className="text-center px-2 py-1 bg-amber-500/90 backdrop-blur-md rounded-2xl shadow-md border-2 border-amber-300 text-slate-900 hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-950 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-600 animate-bounce" />
              <span>SÂN ĐẤU KÉO CO</span>
              <Flame className="w-3.5 h-3.5 text-red-600 animate-bounce" />
            </div>
            <div className="text-xs font-black">
              {clampedPosition === 0 ? (
                <span className="text-slate-800">Dây ở vị trí cân bằng (0)</span>
              ) : clampedPosition < 0 ? (
                <span className="text-red-700 font-black">
                  {teamA.name} đang dẫn +{Math.abs(clampedPosition)} điểm!
                </span>
              ) : (
                <span className="text-blue-700 font-black">
                  {teamB.name} đang dẫn +{clampedPosition} điểm!
                </span>
              )}
            </div>
          </div>

          {/* Team B Badge */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-lg border-2 border-blue-400">
            <div className="text-right">
              <div className="text-xs sm:text-sm font-black text-blue-600 truncate max-w-[110px] sm:max-w-[160px]">
                {teamB.name}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-end gap-1">
                <span>Đúng:</span>
                <span className="font-extrabold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-md">
                  {teamB.score}
                </span>
              </div>
            </div>
            <CharacterAvatar character={characterB} size="sm" isPulling={isTeamBPulling} isStunned={isTeamBStunned} teamSide="right" />
          </div>
        </div>

        {/* Audience / Stadium silouettes */}
        <div className="relative w-full flex justify-around text-xl opacity-80 pointer-events-none pb-1">
          <span>🎈</span>
          <span>👏</span>
          <span>🚩</span>
          <span>🎉</span>
          <span>🎺</span>
          <span>🙌</span>
          <span>🚩</span>
          <span>🎊</span>
          <span>👏</span>
          <span>🎈</span>
        </div>
      </div>

      {/* Main Ground / Field */}
      <div className="relative h-64 sm:h-72 w-full bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 border-t-4 border-amber-800/40 overflow-hidden flex flex-col justify-end">
        {/* Dirt and grass texture lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Victory zone highlights */}
        {/* Team A Win Line (Left) */}
        <div className="absolute left-6 sm:left-12 top-0 bottom-0 w-12 sm:w-16 border-r-4 border-dashed border-red-600/60 bg-red-500/10 flex flex-col items-center justify-center pointer-events-none">
          <Trophy className="w-6 h-6 text-red-600/70 mb-1" />
          <span className="text-[10px] font-black text-red-700 uppercase tracking-widest text-center writing-mode-vertical rotate-180">
            ĐÍCH ĐỘI 1
          </span>
        </div>

        {/* Team B Win Line (Right) */}
        <div className="absolute right-6 sm:right-12 top-0 bottom-0 w-12 sm:w-16 border-l-4 border-dashed border-blue-600/60 bg-blue-500/10 flex flex-col items-center justify-center pointer-events-none">
          <Trophy className="w-6 h-6 text-blue-600/70 mb-1" />
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest text-center writing-mode-vertical rotate-180">
            ĐÍCH ĐỘI 2
          </span>
        </div>

        {/* Center line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-12 w-1 bg-amber-800/30">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-800 text-amber-50 text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow">
            TÂM SÂN (0)
          </div>
        </div>

        {/* Feedback Alert Toast in Arena */}
        {lastActionState === 'correct' && lastActiveTeam && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full shadow-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 ${
              lastActiveTeam === 'teamA'
                ? 'bg-red-600 text-white border-red-300'
                : 'bg-blue-600 text-white border-blue-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>
              {lastActiveTeam === 'teamA' ? teamA.name : teamB.name} TRẢ LỜI ĐÚNG! KÉO DÂY +1! 🎯
            </span>
          </motion.div>
        )}

        {lastActionState === 'wrong' && lastActiveTeam && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full shadow-2xl font-black text-xs sm:text-sm flex items-center gap-2 bg-slate-800 text-white border-2 border-slate-600"
          >
            <span>❌</span>
            <span>
              {lastActiveTeam === 'teamA' ? teamA.name : teamB.name} TRẢ LỜI CHƯA ĐÚNG! DÂY ĐỨNG IM!
            </span>
          </motion.div>
        )}

        {/* Interactive Rope and Squad Container with Spring Animation */}
        <div className="relative w-full h-44 flex items-center justify-center">
          <motion.div
            className="relative w-full flex items-center justify-center"
            animate={{
              x: `${offsetPercent}%`,
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 14,
              mass: 1.2,
            }}
          >
            {/* The Rope */}
            <div className="absolute w-[140%] left-[-20%] h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full shadow-md border-y border-amber-900/60 overflow-hidden flex items-center">
              {/* Rope fiber spirals */}
              <div className="w-full h-full opacity-35 bg-[repeating-linear-gradient(45deg,#451a03,#451a03_6px,#b45309_6px,#b45309_12px)]"></div>
            </div>

            {/* Red Center Ribbon with Flag */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center z-20 pointer-events-none">
              <div className="bg-red-600 text-white p-1 rounded-md shadow-lg animate-bounce border border-red-300">
                <Flag className="w-4 h-4 fill-white" />
              </div>
              {/* Red Ribbon Tied to Rope */}
              <div className="w-4 h-9 bg-red-600 rounded-sm shadow-md border-x border-red-800 flex items-center justify-center">
                <div className="w-1 h-full bg-red-400"></div>
              </div>
              {/* Pointing down marker tip */}
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-600"></div>
            </div>

            {/* TEAM A LINEUP (LEFT) */}
            <div className="absolute right-1/2 mr-10 sm:mr-16 flex items-center gap-1 sm:gap-2 z-10">
              {/* Teammate 3 (Back) */}
              <div
                className={`transition-transform duration-300 ${
                  isTeamAPulling ? '-rotate-12 translate-x-[-12px]' : ''
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500 border-2 border-red-700 shadow-md flex items-center justify-center text-xl">
                  💪
                </div>
                <div className="w-2 h-4 bg-red-700 mx-auto rounded-b"></div>
              </div>

              {/* Teammate 2 (Middle) */}
              <div
                className={`transition-transform duration-300 ${
                  isTeamAPulling ? '-rotate-14 translate-x-[-8px]' : ''
                }`}
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-red-600 border-2 border-red-800 shadow-md flex items-center justify-center text-2xl">
                  🎽
                </div>
                <div className="w-2.5 h-4 bg-red-800 mx-auto rounded-b"></div>
              </div>

              {/* Team Captain (Front Mascot) */}
              <div
                className={`relative flex flex-col items-center transition-all duration-300 ${
                  isTeamAPulling ? '-rotate-16 scale-110' : isTeamAStunned ? 'rotate-6 scale-95' : ''
                }`}
              >
                {/* Pull shout bubble */}
                {isTeamAPulling && (
                  <div className="absolute -top-10 -left-6 bg-red-600 text-white font-black text-[11px] px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap animate-bounce border border-yellow-300">
                    KÉO DÂY! 💥
                  </div>
                )}
                <CharacterAvatar
                  character={characterA}
                  size="md"
                  isPulling={isTeamAPulling}
                  isStunned={isTeamAStunned}
                  teamSide="left"
                  className="shadow-xl ring-4 ring-red-400/50"
                />
                <span className="text-[10px] font-black text-red-800 bg-white/90 px-2 py-0.5 rounded-full mt-1 border border-red-300 shadow">
                  Đội Trưởng
                </span>
              </div>
            </div>

            {/* TEAM B LINEUP (RIGHT) */}
            <div className="absolute left-1/2 ml-10 sm:ml-16 flex items-center gap-1 sm:gap-2 z-10">
              {/* Team Captain (Front Mascot) */}
              <div
                className={`relative flex flex-col items-center transition-all duration-300 ${
                  isTeamBPulling ? 'rotate-16 scale-110' : isTeamBStunned ? '-rotate-6 scale-95' : ''
                }`}
              >
                {/* Pull shout bubble */}
                {isTeamBPulling && (
                  <div className="absolute -top-10 -right-6 bg-blue-600 text-white font-black text-[11px] px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap animate-bounce border border-yellow-300">
                    KÉO MẠNH! 💥
                  </div>
                )}
                <CharacterAvatar
                  character={characterB}
                  size="md"
                  isPulling={isTeamBPulling}
                  isStunned={isTeamBStunned}
                  teamSide="right"
                  className="shadow-xl ring-4 ring-blue-400/50"
                />
                <span className="text-[10px] font-black text-blue-800 bg-white/90 px-2 py-0.5 rounded-full mt-1 border border-blue-300 shadow">
                  Đội Trưởng
                </span>
              </div>

              {/* Teammate 2 (Middle) */}
              <div
                className={`transition-transform duration-300 ${
                  isTeamBPulling ? 'rotate-14 translate-x-[8px]' : ''
                }`}
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-blue-600 border-2 border-blue-800 shadow-md flex items-center justify-center text-2xl">
                  🎽
                </div>
                <div className="w-2.5 h-4 bg-blue-800 mx-auto rounded-b"></div>
              </div>

              {/* Teammate 3 (Back) */}
              <div
                className={`transition-transform duration-300 ${
                  isTeamBPulling ? 'rotate-12 translate-x-[12px]' : ''
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 border-2 border-blue-700 shadow-md flex items-center justify-center text-xl">
                  💪
                </div>
                <div className="w-2 h-4 bg-blue-700 mx-auto rounded-b"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Yard Markers on the Ground */}
        <div className="w-full bg-amber-900/30 border-t border-amber-900/50 py-2 px-6 sm:px-12">
          <div className="relative w-full flex justify-between items-center max-w-4xl mx-auto">
            {markers.map((val) => {
              const isCenter = val === 0;
              const isWinA = val === -maxPosition;
              const isWinB = val === maxPosition;
              const isRopeHere = Math.round(clampedPosition) === val;

              return (
                <div key={val} className="flex flex-col items-center relative">
                  {/* Marker indicator point */}
                  <div
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      isRopeHere
                        ? 'bg-red-500 ring-4 ring-yellow-400 scale-125'
                        : isCenter
                        ? 'bg-amber-900 ring-2 ring-white'
                        : isWinA
                        ? 'bg-red-600'
                        : isWinB
                        ? 'bg-blue-600'
                        : 'bg-amber-800/70'
                    }`}
                  ></div>
                  <span
                    className={`text-[10px] sm:text-xs font-black mt-1 ${
                      isRopeHere
                        ? 'text-red-700 font-extrabold scale-110'
                        : isCenter
                        ? 'text-amber-950 font-bold'
                        : val < 0
                        ? 'text-red-700'
                        : 'text-blue-700'
                    }`}
                  >
                    {val === 0 ? '0' : val < 0 ? `${val}` : `+${val}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
