import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, ScanLine } from 'lucide-react';
import { gradeHomeworkImage } from './services/geminiService';
import { GradingResult, AppState } from './types';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [result, setResult] = useState<GradingResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAppState(AppState.ANALYZING);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setImageSrc(base64);

      try {
        const gradingData = await gradeHomeworkImage(base64);
        setResult(gradingData);
        setAppState(AppState.RESULT);
      } catch (error) {
        console.error(error);
        setAppState(AppState.ERROR);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setImageSrc(null);
    setResult(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8F9FE] text-gray-900 font-sans selection:bg-blue-100 flex flex-col pb-safe">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment" 
        className="hidden"
      />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-lg">
        
        {/* Header - Only show in IDLE or ANALYZING */}
        {(appState === AppState.IDLE || appState === AppState.ANALYZING || appState === AppState.ERROR) && (
             <header className="mb-8 text-center mt-4">
             <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4 text-blue-600 shadow-sm">
               <Sparkles size={24} />
             </div>
             <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
               AI 作业批改神器
             </h1>
             <p className="text-gray-500 text-base max-w-xs mx-auto leading-relaxed">
               拍照上传，一秒智能诊断<br/>
               家长老师的好帮手
             </p>
           </header>
        )}

        {/* State: IDLE */}
        {appState === AppState.IDLE && (
          <div className="flex-1 flex flex-col justify-center items-center w-full pb-10">
            <div className="w-full grid gap-4">
                <button 
                    onClick={triggerFileInput}
                    className="group relative w-full aspect-[4/3] bg-white rounded-3xl border-2 border-dashed border-blue-200 hover:border-blue-500 transition-all flex flex-col items-center justify-center shadow-sm hover:shadow-md overflow-hidden active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3 group-hover:scale-110 transition-transform">
                            <Camera className="text-white w-7 h-7" />
                        </div>
                        <span className="text-lg font-bold text-gray-700">拍照批改</span>
                        <span className="text-xs text-gray-400 mt-1">支持口算、填空、应用题</span>
                    </div>
                </button>

                <div className="grid grid-cols-2 gap-3">
                     <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-xl font-bold text-gray-800 mb-0.5">⚡️ 极速</div>
                        <div className="text-[10px] text-gray-400">3秒出结果</div>
                     </div>
                     <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-xl font-bold text-gray-800 mb-0.5">🎯 精准</div>
                        <div className="text-[10px] text-gray-400">智能识别笔迹</div>
                     </div>
                </div>
            </div>
          </div>
        )}

        {/* State: ANALYZING */}
        {appState === AppState.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center pb-20">
            <div className="relative w-56 h-56 mb-8">
                 {/* Scanning Effect Overlay */}
                 <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-900">
                    {imageSrc && <img src={imageSrc} className="w-full h-full object-cover opacity-60" alt="Scanning" />}
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,1)] animate-[scan_2s_ease-in-out_infinite]" />
                 </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Loader2 className="animate-spin text-blue-600" />
                正在批改中...
            </h2>
            <p className="text-gray-500 animate-pulse text-sm">AI 老师正在仔细检查每一道题</p>
            
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
          </div>
        )}

        {/* State: RESULT */}
        {appState === AppState.RESULT && result && imageSrc && (
          <ResultCard 
            result={result} 
            imageSrc={imageSrc} 
            onReset={handleReset} 
          />
        )}

        {/* State: ERROR */}
        {appState === AppState.ERROR && (
          <div className="flex-1 flex flex-col items-center justify-center w-full text-center pb-10">
             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <ScanLine className="text-red-500 w-10 h-10" />
             </div>
             <h2 className="text-xl font-bold text-gray-800 mb-2">批改失败</h2>
             <p className="text-gray-500 mb-8 leading-relaxed text-sm px-4">
               抱歉，未能识别图片内容。请确保光线充足，文字清晰，并拍摄完整的作业页面。
             </p>
             <button 
                onClick={handleReset}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
             >
                重新拍摄
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;