import { FileText, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { aiService } from '../services/ai.service';
import { useCvStore } from '../store/useCvStore';

export default function CvBuilder() {
  const { 
    fullName, profession, bio, skills, experience,
    updateField, addExperience, removeExperience, updateExperience 
  } = useCvStore();

  const [isGenerating, setIsGenerating] = useState(false);

  // AI orqali Bio yaratish simulyatsiyasi (Keyingi qadamda haqiqiy API ulaymiz)
  const generateBio = async () => {
    if (!profession && !skills) {
      alert("Iltimos, avval kasbingiz va ko'nikmalaringizni kiriting!");
      return;
    }
    
    setIsGenerating(true);
    try {
      // AI servisini chaqiramiz
      const generatedText = await aiService.generateBio(profession, skills);
      updateField('bio', generatedText);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Noma\'lum xatolik';
      alert(`Xatolik yuz berdi: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
      
      {/* Chap tomon: Ma'lumot kiritish formasi */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="text-blue-500" />
          CV Ma'lumotlari
        </h2>

        <div className="space-y-6">
          {/* Asosiy ma'lumotlar */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">To'liq ismingiz</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Masalan: Sardorbek"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Kasbingiz / Mutaxassisligingiz</label>
              <input 
                type="text" 
                value={profession}
                onChange={(e) => updateField('profession', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Frontend Developer"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-400">O'zingiz haqingizda (Bio)</label>
                <button 
                  onClick={generateBio}
                  disabled={isGenerating}
                  className={`text-xs flex items-center gap-1 transition-colors ${isGenerating ? 'text-gray-500 cursor-not-allowed' : 'text-purple-400 hover:text-purple-300'}`}
                >
                  <Sparkles size={14} className={isGenerating ? 'animate-pulse' : ''} /> 
                  {isGenerating ? 'AI o\'ylamoqda...' : 'AI bilan yozish'}
                </button>
              </div>
              <textarea 
                value={bio}
                onChange={(e) => updateField('bio', e.target.value)}
                rows={4}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Qisqacha o'zingiz haqingizda..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Ko'nikmalar (vergul bilan ajrating)</label>
              <input 
                type="text" 
                value={skills}
                onChange={(e) => updateField('skills', e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="React, TypeScript, Node.js"
              />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-200">Ish tajribasi</h3>
              <button 
                onClick={addExperience}
                className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus size={16} /> Qo'shish
              </button>
            </div>

            {experience.map((exp) => (
              <div key={exp.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4 mb-4 relative">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="space-y-3 pr-8">
                  <input 
                    type="text" 
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-800 focus:border-blue-500 px-2 py-1 text-white focus:outline-none text-sm font-medium"
                    placeholder="Kompaniya nomi"
                  />
                  <input 
                    type="text" 
                    value={exp.role}
                    onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-800 focus:border-blue-500 px-2 py-1 text-white focus:outline-none text-sm"
                    placeholder="Lavozim"
                  />
                  <textarea 
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent border border-gray-800 rounded focus:border-blue-500 px-2 py-1 text-white focus:outline-none text-sm mt-2"
                    placeholder="Nimalar qilgansiz?"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* O'ng tomon: Jonli CV ko'rinishi (Live Preview) */}
      <div className="bg-white rounded-2xl p-8 text-gray-900 shadow-2xl overflow-y-auto print:shadow-none print:p-0">
        <div className="border-b-2 border-gray-200 pb-6 mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {fullName || 'Ism Familiya'}
          </h1>
          <p className="text-xl text-blue-600 font-medium mt-1">
            {profession || 'Mutaxassislik'}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-2 border-b border-gray-200 pb-1">Profil</h3>
          <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
            {bio || "Bu yerda sizning qisqacha ma'lumotingiz va professional maqsadingiz ko'rsatiladi."}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-2 border-b border-gray-200 pb-1">Ko'nikmalar</h3>
          <div className="flex flex-wrap gap-2">
            {skills ? skills.split(',').map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-sm text-sm font-medium text-gray-700">
                {skill.trim()}
              </span>
            )) : (
              <span className="text-gray-400 italic text-sm">Ko'nikmalar kiritilmagan</span>
            )}
          </div>
        </div>

        {experience.length > 0 && (
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-4 border-b border-gray-200 pb-1">Ish Tajribasi</h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <h4 className="text-md font-bold text-gray-900">{exp.role || 'Lavozim'}</h4>
                  <p className="text-blue-600 font-medium text-sm mb-2">{exp.company || 'Kompaniya'}</p>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">
                    {exp.description || 'Vazifalar ta\'rifi...'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}