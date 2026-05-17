/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  RotateCcw, 
  LogOut, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Home,
  LayoutDashboard,
  Files,
  BarChart3,
  AlertTriangle,
  ClipboardList,
  MessageSquare,
  Search,
  Bell,
  Menu,
  X,
  Upload
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { AnalysisResponse } from './types';

type View = 'home' | 'materials' | 'feedback';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock list of materials
  const [materialList, setMaterialList] = useState([
    { id: 1, author: '김도연', title: '팀 프로젝트 주제 선정 및 시장 조사', content: '팀 프로젝트 주제 선정 및 시장 조사와 관련된 다양한 데이터입니다...', date: '2026-05-15', status: '완료' },
    { id: 2, author: '이수경', title: '경쟁 서비스 분석 및 차별점 도출', content: '경쟁 서비스인 A사, B사의 특징을 비교 분석한 결과입니다...', date: '2026-05-16', status: '검토 중' },
  ]);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('분석에 실패했습니다.');
      }
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitMaterial = () => {
    if (!content.trim()) return;
    const newMaterial = {
      id: materialList.length + 1,
      author: '김도연',
      title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
      content: content,
      date: new Date().toISOString().split('T')[0],
      status: '제출됨'
    };
    setMaterialList([newMaterial, ...materialList]);
    setContent('');
    alert('자료가 성공적으로 제출되었습니다.');
  };

  const handleReset = () => {
    setContent('');
    setAnalysis(null);
    setError(null);
  };

  const Logo = ({ className = "h-8" }: { className?: string }) => (
    <div className={cn("flex items-center gap-2", className)}>
      <svg viewBox="0 0 100 80" className="h-[80%] w-auto fill-blue-600" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 40 C 20 60, 40 75, 60 45 L 85 15 C 90 10, 80 5, 75 10 L 55 35 C 45 45, 35 45, 30 35 C 25 25, 15 25, 20 40 Z" />
        <ellipse cx="65" cy="12" rx="15" ry="5" className="fill-blue-600" transform="rotate(-15, 65, 12)" />
      </svg>
      <span className="text-2xl font-black tracking-tighter text-blue-600">LeaderLess</span>
    </div>
  );

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => {
    const isActive = currentView === id;
    const canNavigate = ['home', 'materials', 'feedback'].includes(id);

    return (
      <button 
        onClick={() => canNavigate ? setCurrentView(id as View) : null}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
          isActive 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600")} />
        {isSidebarOpen && label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentView('home')}>
            <Logo className="h-10" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="검색 또는 명령" className="bg-transparent border-none focus:outline-none text-sm w-32 lg:w-48 font-bold" />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <button className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
            로그아웃
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>


      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className={cn(
          "w-64 bg-white border-r border-gray-200 flex flex-col lg:static absolute inset-y-0 left-0 z-20 transition-transform duration-300 transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}>
          <div className="p-6 flex flex-col items-center border-b border-gray-50">
            <Logo className="h-12 mb-4" />
            {isSidebarOpen && <span className="font-black text-lg text-gray-900">김도연</span>}
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <SidebarItem id="home" icon={Home} label={isSidebarOpen ? "홈" : ""} />
            <SidebarItem id="projects" icon={LayoutDashboard} label={isSidebarOpen ? "프로젝트 관리" : ""} />
            <SidebarItem id="materials" icon={Files} label={isSidebarOpen ? "자료 관리" : ""} />
            <SidebarItem id="progress" icon={BarChart3} label={isSidebarOpen ? "진행 현황" : ""} />
            <SidebarItem id="warnings" icon={AlertTriangle} label={isSidebarOpen ? "경고 현황" : ""} />
            <SidebarItem id="minutes" icon={ClipboardList} label={isSidebarOpen ? "회의록" : ""} />
            <SidebarItem id="feedback" icon={MessageSquare} label={isSidebarOpen ? "피드백" : ""} />
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {currentView === 'home' && (
                <motion.div 
                  key="home"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Dashboard Header */}
                  <div className="flex flex-col items-center justify-center text-center py-10 space-y-2">
                    <p className="text-xl font-bold text-gray-500">아이디어톤 종료까지</p>
                    <h2 className="text-6xl md:text-8xl font-black text-blue-600 tracking-tighter">
                      D - 11시간
                    </h2>
                    <p className="text-2xl font-bold text-gray-700">남았어요!</p>
                  </div>

                  {/* Deadline Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: '전공 발표', time: 'D - 3' },
                      { label: '전공 발표', time: 'D - 12' },
                      { label: '전공 발표', time: 'D - 22' },
                    ].map((card, i) => (
                      <div key={i} className="bg-blue-50 rounded-2xl p-6 flex flex-col items-center justify-center border border-blue-100">
                        <span className="text-3xl font-black text-blue-600 mb-1">{card.time}</span>
                        <span className="text-sm font-bold text-gray-400">{card.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tasks Section */}
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                      <h3 className="text-xl font-bold">팀원별 테스크 진행 상황</h3>
                      <p className="text-sm text-gray-400 font-bold mt-1">아이디어톤</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                      <div className="lg:col-span-2 overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-[#FFF9C4]/50">
                            <tr>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">담당자</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">업무</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">진행률</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">마감 기한</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { name: '김도연', task: '자료조사', progress: 100, date: '5월 11일' },
                              { name: '', task: '발표 대본', progress: 80, date: '5월 20일' },
                              { name: '이수경', task: '피피티', progress: 96, date: '5월 18일' },
                              { name: '나현수', task: '발표', progress: 0, date: '5월 20일' },
                            ].map((row, i) => (
                              <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {row.name && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{row.name}</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">{row.task}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden w-32 border border-gray-200">
                                      <div 
                                        className={cn("h-full rounded-full transition-all duration-1000", row.progress === 100 ? "bg-blue-600" : "bg-blue-500")} 
                                        style={{ width: `${row.progress}%` }} 
                                      />
                                    </div>
                                    <span className="text-sm font-bold text-blue-600">{row.progress}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">{row.date}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-10 flex flex-col items-center justify-center border-l border-gray-100">
                        <div className="relative w-48 h-48">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100" />
                            <circle 
                              cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" 
                              strokeDasharray={2 * Math.PI * 88} 
                              strokeDashoffset={2 * Math.PI * 88 * (1 - 0.91)} 
                              strokeLinecap="round"
                              className="text-emerald-500" 
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-gray-800">91%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentView === 'materials' && (
                <motion.div 
                  key="materials"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black tracking-tight italic flex items-center gap-3">
                      <Files className="w-8 h-8 text-blue-600" />
                      자료 관리
                    </h2>
                    <button 
                      onClick={() => {
                        const element = document.getElementById('submission-form');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      새 자료 제출
                    </button>
                  </div>

                  {/* Materials List */}
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-gray-400" />
                        제출된 자료 목록
                      </h3>
                      <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">전체 {materialList.length}개</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[#FFF9C4]/50">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">담당자</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">자료 제목</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">업로드 날짜</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">작업</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {materialList.map((item) => (
                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{item.author}</span>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.title}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-bold text-gray-400">{item.date}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={cn(
                                  "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                  item.status === '완료' ? "bg-emerald-100 text-emerald-700" : 
                                  item.status === '검토 중' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                )}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button 
                                  onClick={() => {
                                    setContent(item.content);
                                    setCurrentView('feedback');
                                    // Trigger analysis if not already done
                                    if (item.status !== '완료') {
                                      setTimeout(() => {
                                        const btn = document.getElementById('analyze-btn');
                                        btn?.click();
                                      }, 500);
                                    }
                                  }}
                                  className="text-xs font-bold text-blue-600 hover:underline px-3 py-1 bg-blue-50 rounded-lg"
                                >
                                  피드백 보기
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Submission Form Section */}
                  <div id="submission-form" className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-20">
                    <div className="space-y-6">
                      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            자료 제출
                          </span>
                        </div>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="제출할 자료의 텍스트 내용을 입력하거나 붙여넣으세요..."
                          className="flex-1 p-8 resize-none focus:outline-none text-base leading-relaxed placeholder:text-gray-300 border-none scrollbar-hide"
                        />
                        <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
                          <button
                            onClick={handleSubmitMaterial}
                            disabled={!content.trim()}
                            className={cn(
                              "flex-1 py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
                              "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100"
                            )}
                          >
                            <Upload className="w-5 h-5" />
                            자료 제출하기
                          </button>
                          <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !content.trim()}
                            className={cn(
                              "py-4 px-8 rounded-2xl border-2 border-blue-100 font-black text-lg text-blue-600 bg-white hover:bg-blue-50 transition-all flex items-center gap-2 active:scale-[0.98]"
                            )}
                          >
                            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            AI 피드백 받기
                          </button>
                        </div>
                      </div>
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold">
                          <AlertTriangle className="w-5 h-5" />
                          <p>{error}</p>
                        </div>
                      )}
                    </div>

                    {/* Quick AI Preview column */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                      <div className="p-4 bg-blue-600 text-white flex items-center justify-between shadow-md relative z-10">
                         <span className="text-sm font-black flex items-center gap-2">
                           실시간 AI 분석 프리뷰
                           <Sparkles className="w-3 h-3 fill-white animate-pulse" />
                         </span>
                         <button onClick={() => setCurrentView('feedback')} className="text-xs font-bold hover:underline bg-white/20 px-3 py-1 rounded-lg">상세 분석 이동</button>
                      </div>
                      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gray-50/30">
                        {!analysis && !isAnalyzing ? (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20 py-20">
                            <Search className="w-12 h-12 text-blue-300" />
                            <p className="text-sm font-bold text-gray-500 italic">
                              분석 버튼을 누르면 AI가 자료를<br />즉시 분석하여 여기에 보여줍니다.
                            </p>
                          </div>
                        ) : isAnalyzing ? (
                          <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                              <div className="absolute -top-1 -right-1">
                                <Logo className="h-4 w-auto grayscale opacity-50 animate-ping" />
                              </div>
                            </div>
                            <p className="text-sm font-black text-gray-400">자료 피드백 준비 중 ...</p>
                          </div>
                        ) : (
                          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                              <h4 className="text-xs font-black text-blue-600 mb-3 uppercase tracking-wider border-b border-blue-50 pb-1">요약</h4>
                              <div className="text-gray-700 text-sm font-medium leading-relaxed">
                                <ReactMarkdown>{analysis?.summary}</ReactMarkdown>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                잘한 점
                              </h4>
                              <div className="space-y-2">
                                {analysis?.strengths.map((s, i) => (
                                  <div key={i} className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 text-xs font-bold text-gray-700 flex gap-2">
                                    <span className="text-emerald-500">•</span>
                                    {s}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-xs font-black text-amber-600 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                개선 사항 및 출처 분석
                              </h4>
                              <div className="space-y-2">
                                {analysis?.improvements.map((im, i) => (
                                  <div key={i} className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 text-xs font-bold text-amber-900 flex gap-2">
                                    <span className="text-amber-500">!</span>
                                    {im}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentView === 'feedback' && (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 italic">
                      <MessageSquare className="w-8 h-8 text-blue-600" />
                      자료 상세 피드백
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Input */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            분석할 자료
                          </span>
                        </div>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="분석할 자료 내용을 여기에 붙여넣으세요..."
                          className="flex-1 p-8 resize-none focus:outline-none text-base leading-relaxed placeholder:text-gray-300 border-none scrollbar-hide"
                        />
                        <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
                          <button
                            id="analyze-btn"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !content.trim()}
                            className={cn(
                              "flex-1 py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
                              "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100"
                            )}
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                자료 피드백 준비 중 ...
                              </>
                            ) : (
                              <>
                                자료 재분석
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: AI Feedback */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px] max-h-[800px]">
                        <div className="p-4 bg-blue-600 text-white flex items-center justify-between shadow-lg relative z-10">
                          <span className="text-sm font-black flex items-center gap-2 tracking-wider">
                            AI 정밀 분석 결과
                            <Sparkles className="w-4 h-4 fill-white animate-pulse" />
                          </span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar scroll-smooth">
                          {!analysis && !isAnalyzing ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 py-32">
                              <Search className="w-20 h-20 text-blue-300" />
                              <p className="text-gray-500 font-black text-xl leading-relaxed italic">
                                자료를 입력하고 분석 버튼을 눌러주세요.
                              </p>
                            </div>
                          ) : isAnalyzing ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-8 py-32">
                              <div className="relative">
                                <div className="w-16 h-16 bg-blue-50 rounded-3xl animate-pulse flex items-center justify-center">
                                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                </div>
                                <Sparkles className="w-6 h-6 text-blue-400 absolute -top-2 -right-2 animate-bounce" />
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-black text-gray-800">자료 피드백 준비 중 ...</p>
                              </div>
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-12 pb-10"
                            >
                              {/* Summary */}
                              <section className="space-y-4">
                                <h3 className="text-2xl font-black flex items-center gap-2 text-gray-900 border-b-4 border-emerald-100 pb-2 inline-block">
                                  자료 요약
                                </h3>
                                <div className="text-gray-700 leading-relaxed font-medium text-lg">
                                  <ReactMarkdown>{analysis?.summary}</ReactMarkdown>
                                </div>
                              </section>

                              {/* Strengths */}
                              <section className="space-y-6">
                                <h3 className="text-2xl font-black flex items-center gap-2 text-gray-900 border-b-4 border-blue-100 pb-2 inline-block">
                                  잘한 점
                                </h3>
                                <div className="space-y-4">
                                  {analysis?.strengths.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group transition-all hover:bg-blue-50 hover:border-blue-100">
                                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                                        {idx + 1}
                                      </div>
                                      <p className="text-gray-700 font-bold leading-relaxed">{item}</p>
                                    </div>
                                  ))}
                                </div>
                              </section>

                              {/* Improvements */}
                              <section className="space-y-6">
                                <h3 className="text-2xl font-black flex items-center gap-2 text-gray-900 border-b-4 border-amber-100 pb-2 inline-block">
                                  개선 사항 및 출처 분석
                                </h3>
                                <div className="space-y-4">
                                  {analysis?.improvements.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 group transition-all hover:bg-amber-100/50">
                                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-200 flex items-center justify-center text-amber-700 font-black">
                                        !
                                      </div>
                                      <p className="text-amber-900 font-bold leading-relaxed">{item}</p>
                                    </div>
                                  ))}
                                </div>
                              </section>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          
          <footer className="py-6 px-10 text-center text-gray-400 text-sm border-t border-gray-100 bg-white font-medium">
            &copy; 2026 LeaderLess. Powered by Team Synergy.
          </footer>
        </div>
      </div>
    </div>
  );
}

