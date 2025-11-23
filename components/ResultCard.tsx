import React from 'react';
import { GradingResult } from '../types';
import { CheckCircle2, XCircle, BookOpen, AlertCircle } from 'lucide-react';

interface ResultCardProps {
  result: GradingResult;
  imageSrc: string;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, imageSrc, onReset }) => {
  const isPassing = result.overallScore >= 60;
  const scoreColor = result.overallScore >= 80 ? 'text-green-600' : result.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = result.overallScore >= 80 ? 'bg-green-50' : result.overallScore >= 60 ? 'bg-yellow-50' : 'bg-red-50';
  const scoreBorder = result.overallScore >= 80 ? 'border-green-200' : result.overallScore >= 60 ? 'border-yellow-200' : 'border-red-200';

  return (
    <div className="w-full mx-auto pb-28 animate-fade-in">
      {/* Header Summary */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
        <div className="relative h-40 bg-gray-100 overflow-hidden group">
            <img 
                src={imageSrc} 
                alt="Submitted Homework" 
                className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                <span className="text-white font-bold text-lg flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                      <BookOpen size={18} className="text-white" />
                    </div>
                    {result.subject}
                </span>
            </div>
        </div>
        
        <div className="p-5">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">本次得分</h2>
                    <div className={`text-5xl font-extrabold ${scoreColor} tracking-tight`}>
                        {result.overallScore}
                        <span className="text-xl text-gray-400 font-semibold ml-1">/100</span>
                    </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border ${scoreBg} ${scoreBorder} ${scoreColor} text-sm font-bold`}>
                    {isPassing ? '合格' : '需努力'}
                </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                {result.summary}
            </p>
        </div>
      </div>

      {/* Details List */}
      <h3 className="text-base font-bold text-gray-800 mb-3 px-1 flex items-center gap-2">
        <span>批改详情</span>
        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{result.corrections.length}题</span>
      </h3>
      
      <div className="space-y-3">
        {result.corrections.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {item.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-700 text-sm">题目 {item.questionIndex}</span>
                {!item.isCorrect && (
                   <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded">
                     正确: {item.correctAnswer}
                   </span>
                )}
              </div>
              
              <div className="text-gray-800 font-medium mb-2 break-words text-sm">
                "{item.studentAnswer}"
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg flex gap-2 items-start leading-relaxed">
                 <AlertCircle size={12} className="mt-0.5 flex-shrink-0 text-blue-500" />
                 <span>{item.explanation}</span>
              </div>
            </div>
          </div>
        ))}

        {result.corrections.length === 0 && (
            <div className="text-center p-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-sm">未检测到具体的题目，请参考总评。</p>
            </div>
        )}
      </div>

      {/* Floating Action Button - Fixed to bottom with safe area support */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-lg mx-auto z-50 pb-safe">
        <button
          onClick={onReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex justify-center items-center gap-2 backdrop-blur-sm"
        >
          批改下一份
        </button>
      </div>
    </div>
  );
};