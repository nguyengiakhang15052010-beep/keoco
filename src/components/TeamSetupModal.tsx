import React, { useState } from 'react';
import { TeamConfig, GameSettings } from '../types';
import { CHARACTERS } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { X, Users, Check, Sparkles, Settings2, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teamA: TeamConfig;
  teamB: TeamConfig;
  settings: GameSettings;
  onSave: (teamA: TeamConfig, teamB: TeamConfig, settings: GameSettings) => void;
}

export const TeamSetupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  teamA,
  teamB,
  settings,
  onSave,
}) => {
  const [nameA, setNameA] = useState(teamA.name);
  const [charIdA, setCharIdA] = useState(teamA.characterId);

  const [nameB, setNameB] = useState(teamB.name);
  const [charIdB, setCharIdB] = useState(teamB.characterId);

  const [timeLimit, setTimeLimit] = useState(settings.timeLimitPerQuestion);
  const [turnMode, setTurnMode] = useState(settings.turnMode);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(
      { ...teamA, name: nameA.trim() || 'Đội 1', characterId: charIdA },
      { ...teamB, name: nameB.trim() || 'Đội 2', characterId: charIdB },
      { ...settings, timeLimitPerQuestion: timeLimit, turnMode, soundEnabled }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-600 via-amber-600 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">Đặt Tên & Chọn Nhân Vật Đại Diện</h2>
              <p className="text-xs text-white/80">
                Tùy chỉnh thông tin 2 đội kéo co và cài đặt chế độ chơi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TEAM 1 (RED) CONFIG */}
            <div className="bg-white p-5 rounded-2xl border-2 border-red-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-red-700 bg-red-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>ĐỘI 1 (BÊN TRÁI)</span>
                </span>
                <span className="text-xs text-slate-400 font-bold">Màu Đỏ</span>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Đội 1:
                </label>
                <input
                  type="text"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                  placeholder="Ví dụ: Đội Rồng Lửa, Lớp 5A..."
                  className="w-full px-3.5 py-2 font-black text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Character Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Chọn Nhân Vật Đại Diện:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {CHARACTERS.map((char) => {
                    const isSelected = charIdA === char.id;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => setCharIdA(char.id)}
                        className={`p-1.5 rounded-xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                          isSelected
                            ? 'border-red-600 bg-red-50 shadow-md ring-2 ring-red-400'
                            : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                        }`}
                        title={`${char.name} - ${char.title}`}
                      >
                        <span className="text-2xl">{char.emoji}</span>
                        <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center mt-1">
                          {char.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Character preview description */}
                {(() => {
                  const selectedChar = CHARACTERS.find((c) => c.id === charIdA) || CHARACTERS[0];
                  return (
                    <div className="mt-3 p-2.5 rounded-xl bg-red-50/70 border border-red-200 flex items-center gap-2.5">
                      <CharacterAvatar character={selectedChar} size="sm" />
                      <div>
                        <div className="font-extrabold text-xs text-red-900">{selectedChar.name}</div>
                        <div className="text-[11px] text-slate-600 leading-tight">{selectedChar.description}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* TEAM 2 (BLUE) CONFIG */}
            <div className="bg-white p-5 rounded-2xl border-2 border-blue-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-700 bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>ĐỘI 2 (BÊN PHẢI)</span>
                </span>
                <span className="text-xs text-slate-400 font-bold">Màu Xanh</span>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Đội 2:
                </label>
                <input
                  type="text"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                  placeholder="Ví dụ: Đội Hổ Bách Chiến, Lớp 5B..."
                  className="w-full px-3.5 py-2 font-black text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Character Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Chọn Nhân Vật Đại Diện:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {CHARACTERS.map((char) => {
                    const isSelected = charIdB === char.id;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => setCharIdB(char.id)}
                        className={`p-1.5 rounded-xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-400'
                            : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                        }`}
                        title={`${char.name} - ${char.title}`}
                      >
                        <span className="text-2xl">{char.emoji}</span>
                        <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center mt-1">
                          {char.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Character preview description */}
                {(() => {
                  const selectedChar = CHARACTERS.find((c) => c.id === charIdB) || CHARACTERS[1];
                  return (
                    <div className="mt-3 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center gap-2.5">
                      <CharacterAvatar character={selectedChar} size="sm" teamSide="right" />
                      <div>
                        <div className="font-extrabold text-xs text-blue-900">{selectedChar.name}</div>
                        <div className="text-[11px] text-slate-600 leading-tight">{selectedChar.description}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Gameplay Settings */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-black text-sm text-slate-800">
              <Settings2 className="w-4 h-4 text-amber-600" />
              <span>Tùy Chọn Luật Chơi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Turn Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Thứ tự lượt chơi:
                </label>
                <select
                  value={turnMode}
                  onChange={(e) => setTurnMode(e.target.value as 'alternating' | 'hostSelect')}
                  className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="alternating">Luân phiên (Đội 1 rồi Đội 2)</option>
                  <option value="hostSelect">Quản trò / Thầy cô chọn lượt</option>
                </select>
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Thời gian trả lời mỗi câu:
                </label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value={0}>Không giới hạn (Phù hợp trên lớp)</option>
                  <option value={15}>15 giây (Thử thách nhanh)</option>
                  <option value={30}>30 giây (Tiêu chuẩn)</option>
                  <option value={45}>45 giây</option>
                  <option value={60}>60 giây</option>
                </select>
              </div>

              {/* Sound */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Âm thanh hiệu ứng:
                </label>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-full px-3 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 border-slate-300 text-slate-600'
                  }`}
                >
                  <span>{soundEnabled ? '🔊 Đang BẬT' : '🔇 Đang TẮT'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm transition cursor-pointer"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-200 transition cursor-pointer hover:scale-105 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Áp Dụng Cài Đặt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
