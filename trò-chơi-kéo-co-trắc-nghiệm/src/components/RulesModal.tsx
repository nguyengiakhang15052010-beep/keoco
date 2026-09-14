import React from 'react';
import { X, HelpCircle, Target, CheckCircle2, XCircle, Users, Edit3, Trophy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black">Luật Chơi Kéo Co Trắc Nghiệm</h2>
              <p className="text-xs text-amber-100">Hướng dẫn chi tiết dành cho giáo viên và người chơi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-slate-700 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
            <Users className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-amber-950 text-sm">2 Đội Đối Kháng</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Mỗi đội được đặt tên riêng và chọn linh vật đại diện (Rồng Lửa, Hổ Vàng, Gấu Kungfu, Ninja...).
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50 border border-sky-200">
            <Target className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sky-950 text-sm">10 Câu Hỏi Trắc Nghiệm Riêng Biệt</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Mỗi đội có 10 câu hỏi khác nhau với 4 phương án lựa chọn (A, B, C, D) kiểm tra kiến thức đa dạng.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300">
              <div className="flex items-center gap-1.5 font-black text-emerald-800 text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>TRẢ LỜI ĐÚNG</span>
              </div>
              <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                Tâm dây kéo co (dải ruy băng đỏ) sẽ <b>kéo giật về phía đội mình +1 nấc</b>!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300">
              <div className="flex items-center gap-1.5 font-black text-rose-800 text-xs mb-1">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>TRẢ LỜI SAI</span>
              </div>
              <p className="text-xs text-rose-950 font-medium leading-relaxed">
                Dây kéo co <b>hoàn toàn đứng im</b>, giữ nguyên vị trí hiện tại trên sân.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50 border border-purple-200">
            <Edit3 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-purple-950 text-sm">Toàn Quyền Chỉnh Sửa Câu Hỏi</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Bấm vào nút <b>"Sửa Câu Hỏi"</b> bất kỳ lúc nào để thay đổi nội dung câu hỏi, 4 đáp án, đáp án đúng, hoặc xuất/nhập bộ đề thi.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-yellow-50 border border-yellow-300">
            <Trophy className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-yellow-950 text-sm">Điều Kiện Chiến Thắng</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Đội nào kéo dải ruy băng qua vạch đích chiến thắng trước, hoặc kéo được tâm dây về sâu phía mình hơn sau khi hoàn thành các câu hỏi sẽ giành cúp vô địch!
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow transition cursor-pointer"
          >
            Đã Hiểu, Bắt Đầu!
          </button>
        </div>
      </div>
    </div>
  );
};
