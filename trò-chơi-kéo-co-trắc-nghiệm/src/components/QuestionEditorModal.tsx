import React, { useState } from 'react';
import { Question } from '../types';
import {
  X,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Download,
  Upload,
  HelpCircle,
  Save,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questionsTeamA: Question[];
  questionsTeamB: Question[];
  onSave: (questionsA: Question[], questionsB: Question[]) => void;
  onResetToDefault: () => void;
  teamAName: string;
  teamBName: string;
}

export const QuestionEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  questionsTeamA,
  questionsTeamB,
  onSave,
  onResetToDefault,
  teamAName,
  teamBName,
}) => {
  const [activeTab, setActiveTab] = useState<'teamA' | 'teamB'>('teamA');
  const [listA, setListA] = useState<Question[]>(questionsTeamA);
  const [listB, setListB] = useState<Question[]>(questionsTeamB);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const currentList = activeTab === 'teamA' ? listA : listB;
  const setCurList = (newList: Question[]) => {
    if (activeTab === 'teamA') {
      setListA(newList);
    } else {
      setListB(newList);
    }
  };

  const handleUpdateQuestion = (index: number, updated: Partial<Question>) => {
    const updatedList = [...currentList];
    updatedList[index] = { ...updatedList[index], ...updated };
    setCurList(updatedList);
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    const updatedList = [...currentList];
    const orig = updatedList[qIndex].options;
    const newOptions: [string, string, string, string] = [
      optIndex === 0 ? text : orig[0],
      optIndex === 1 ? text : orig[1],
      optIndex === 2 ? text : orig[2],
      optIndex === 3 ? text : orig[3],
    ];
    updatedList[qIndex] = { ...updatedList[qIndex], options: newOptions };
    setCurList(updatedList);
  };

  const handleAddNewQuestion = () => {
    const newQ: Question = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      question: `Câu hỏi mới số ${currentList.length + 1} của ${activeTab === 'teamA' ? teamAName : teamBName}?`,
      options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
      correctIndex: 0,
      category: 'Tổng hợp',
      explanation: 'Giải thích câu trả lời đúng tại đây.',
    };
    const updated = [...currentList, newQ];
    setCurList(updated);
    setEditingId(newQ.id);
  };

  const handleDeleteQuestion = (index: number) => {
    if (currentList.length <= 1) {
      alert('Mỗi đội cần ít nhất 1 câu hỏi để tiếp tục trò chơi!');
      return;
    }
    const updated = currentList.filter((_, idx) => idx !== index);
    setCurList(updated);
  };

  const handleSaveAll = () => {
    onSave(listA, listB);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      onClose();
    }, 900);
  };

  const handleOpenExportJson = () => {
    const exportData = {
      teamA: {
        name: teamAName,
        questions: listA,
      },
      teamB: {
        name: teamBName,
        questions: listB,
      },
    };
    setJsonText(JSON.stringify(exportData, null, 2));
    setJsonError(null);
    setJsonModalOpen(true);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed.teamA?.questions && Array.isArray(parsed.teamA.questions)) {
        setListA(parsed.teamA.questions);
      } else if (Array.isArray(parsed)) {
        setListA(parsed);
      }

      if (parsed.teamB?.questions && Array.isArray(parsed.teamB.questions)) {
        setListB(parsed.teamB.questions);
      }
      setJsonModalOpen(false);
      setJsonError(null);
      alert('Đã nhập thành công ngân hàng câu hỏi mới!');
    } catch {
      setJsonError('Định dạng JSON không hợp lệ! Vui lòng kiểm tra lại cấu trúc dữ liệu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">Chỉnh Sửa Ngân Hàng Câu Hỏi</h2>
              <p className="text-xs text-slate-300">
                Tùy chỉnh 10 câu hỏi và 4 đáp án cho từng đội thi đấu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: Team 1 vs Team 2 */}
        <div className="flex items-center justify-between px-5 sm:px-7 pt-4 pb-3 border-b border-slate-200 bg-slate-50">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('teamA')}
              className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'teamA'
                  ? 'bg-red-600 text-white shadow-md shadow-red-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>🔴 Đội 1: {teamAName}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white">
                {listA.length} câu
              </span>
            </button>

            <button
              onClick={() => setActiveTab('teamB')}
              className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'teamB'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>🔵 Đội 2: {teamBName}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white">
                {listB.length} câu
              </span>
            </button>
          </div>

          {/* Quick Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenExportJson}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Xuất / Nhập JSON đề thi"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn khôi phục 20 câu hỏi mặc định ban đầu?')) {
                  onResetToDefault();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Khôi phục câu hỏi ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Mặc định</span>
            </button>
          </div>
        </div>

        {/* Question List Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {currentList.map((q, qIdx) => {
            const isEditing = editingId === q.id || editingId === null; // allow expand all by default
            return (
              <div
                key={q.id || qIdx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition"
              >
                {/* Question Row Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 ${
                        activeTab === 'teamA' ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                    >
                      {qIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(qIdx, { question: e.target.value })}
                      placeholder="Nhập nội dung câu hỏi..."
                      className="w-full font-bold text-sm sm:text-base text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none px-2 py-1 transition"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      value={q.category || ''}
                      onChange={(e) => handleUpdateQuestion(qIdx, { category: e.target.value })}
                      placeholder="Chủ đề"
                      className="text-xs bg-slate-100 border border-slate-300 px-2 py-1 rounded-lg text-slate-700 w-24 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                    <button
                      onClick={() => handleDeleteQuestion(qIdx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correctIndex === optIdx;
                    const letters = ['A', 'B', 'C', 'D'];

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {/* Radio select correct answer */}
                        <button
                          type="button"
                          onClick={() => handleUpdateQuestion(qIdx, { correctIndex: optIdx })}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs transition cursor-pointer shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="Bấm để chọn đáp án này là ĐÚNG"
                        >
                          {letters[optIdx]}
                        </button>

                        {/* Option Text Input */}
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                          placeholder={`Đáp án ${letters[optIdx]}`}
                          className="flex-1 text-xs sm:text-sm text-slate-800 bg-transparent focus:outline-none px-1 font-medium"
                        />

                        {isCorrect && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                            Đáp án đúng
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Input */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 shrink-0">Giải thích:</span>
                  <input
                    type="text"
                    value={q.explanation || ''}
                    onChange={(e) => handleUpdateQuestion(qIdx, { explanation: e.target.value })}
                    placeholder="Giải thích thêm kiến thức khi trả lời xong (tùy chọn)..."
                    className="flex-1 text-xs text-slate-600 border-b border-transparent hover:border-slate-200 focus:border-slate-400 focus:outline-none px-1 py-0.5"
                  />
                </div>
              </div>
            );
          })}

          {/* Add Question Button */}
          <button
            onClick={handleAddNewQuestion}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-600 font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm câu hỏi mới cho {activeTab === 'teamA' ? teamAName : teamBName}</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-7 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Mỗi đội có <b className="text-slate-800">{currentList.length}</b> câu hỏi trắc nghiệm
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 transition cursor-pointer hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccessNotice ? 'Đã lưu!' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </div>

        {/* JSON Import/Export Sub-modal */}
        {jsonModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Xuất / Nhập Ngân Hàng Câu Hỏi (JSON)</span>
                </h3>
                <button
                  onClick={() => setJsonModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-2">
                Bạn có thể sao chép đoạn JSON bên dưới để lưu trữ, hoặc dán nội dung bộ câu hỏi mới vào đây rồi nhấn "Áp dụng".
              </p>
              {jsonError && (
                <div className="p-2.5 mb-2 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={12}
                className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800"
              />
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(jsonText);
                    alert('Đã sao chép JSON vào khay nhớ tạm (Clipboard)!');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Sao chép JSON
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setJsonModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-100"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleApplyJson}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md"
                  >
                    Áp dụng dữ liệu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
