import React, { useState } from 'react';
import { 
  BookOpen, Activity, Music, PlusCircle, Save, 
  ChevronRight, ShieldCheck, Database
} from 'lucide-react';
import { useStore } from '../store';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { lessons, addLesson, seedLessons } = useStore();
  const [activeTab, setActiveTab] = useState<'academy' | 'exercises' | 'music'>('academy');
  
  // Lesson state (from Academy.tsx)
  const [newLesson, setNewLesson] = useState({
    title: '',
    category: 'Asoslar',
    duration: '',
    type: 'text',
    content: ''
  });

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLesson.title || !newLesson.content) return;
    await addLesson(newLesson);
    setNewLesson({
      title: '',
      category: 'Asoslar',
      duration: '',
      type: 'text',
      content: ''
    });
    alert("Dars muvaffaqiyatli qo'shildi!");
  };

  const handleSeed = async () => {
    if (confirm("Birlamchi darslarni yuklamoqchimisiz?")) {
      const initialArticles = [
        {
          title: 'Qandli diabet nima?',
          category: 'Asoslar',
          duration: '5 daqiqa',
          type: 'text',
          content: `
            <h3>Qandli diabet haqida umumiy tushuncha</h3>
            <p>Qandli diabet — bu organizmda glyukoza (qand) miqdorining surunkali ravishda oshib ketishi bilan bog'liq kasallikdir...</p>
          `
        },
        // ... more can be added/imported
      ];
      await seedLessons(initialArticles as any);
      alert("Darslar yuklandi!");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="page-header">
        <div className="header-title">
          <ShieldCheck size={28} color="var(--primary)" />
          <h1>Boshqaruv Paneli</h1>
        </div>
        <p className="header-subtitle">Ilova kontentini va sozlamalarini boshqarish</p>
      </header>

      <div className="admin-layout">
        <aside className="admin-tabs glass">
          <button 
            className={`tab-item ${activeTab === 'academy' ? 'active' : ''}`}
            onClick={() => setActiveTab('academy')}
          >
            <BookOpen size={20} />
            <span>Akademiya</span>
          </button>
          <button 
            className={`tab-item ${activeTab === 'exercises' ? 'active' : ''}`}
            onClick={() => setActiveTab('exercises')}
          >
            <Activity size={20} />
            <span>Mashqlar</span>
          </button>
          <button 
            className={`tab-item ${activeTab === 'music' ? 'active' : ''}`}
            onClick={() => setActiveTab('music')}
          >
            <Music size={20} />
            <span>Musiqa</span>
          </button>
        </aside>

        <main className="admin-content">
          {activeTab === 'academy' && (
            <div className="admin-section animate-in">
              <div className="section-header">
                <h2><BookOpen size={22} /> Akademiya boshqaruvi</h2>
                <button className="btn-secondary btn-sm" onClick={handleSeed}>
                  <Database size={16} /> Birlamchi darslar
                </button>
              </div>

              <div className="card admin-form-card glass">
                <h3><PlusCircle size={18} /> Yangi dars qo'shish</h3>
                <form onSubmit={handleAddLesson} className="admin-form">
                  <div className="form-group">
                    <label>Dars nomi</label>
                    <input 
                      type="text" 
                      placeholder="Mavzu sarlavhasi"
                      value={newLesson.title}
                      onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Kategoriya</label>
                      <select 
                        value={newLesson.category}
                        onChange={e => setNewLesson({...newLesson, category: e.target.value})}
                      >
                        <option value="Asoslar">Asoslar</option>
                        <option value="Parhez">Parhez</option>
                        <option value="Davolash">Davolash</option>
                        <option value="Turmush tarzi">Turmush tarzi</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Davomiyligi</label>
                      <input 
                        type="text" 
                        placeholder="Masalan: 5 daqiqa"
                        value={newLesson.duration}
                        onChange={e => setNewLesson({...newLesson, duration: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Mazmuni (HTML)</label>
                    <textarea 
                      placeholder="Dars matni (h3, p, ul teglari bilan)"
                      value={newLesson.content}
                      onChange={e => setNewLesson({...newLesson, content: e.target.value})}
                      required
                      rows={8}
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    <Save size={18} /> Saqlash
                  </button>
                </form>
              </div>

              <div className="active-items-list">
                <h3>Mavjud darslar ({lessons.length})</h3>
                <div className="items-grid">
                  {lessons.map(lesson => (
                    <div key={lesson.id} className="item-card glass">
                      <div className="item-info">
                        <h4>{lesson.title}</h4>
                        <span className="badge">{lesson.category}</span>
                      </div>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exercises' && (
            <div className="admin-section animate-in">
              <div className="placeholder-content glass">
                <Activity size={48} color="var(--primary)" opacity={0.5} />
                <h3>Mashqlar bo'limi</h3>
                <p>Tez kunda: Salomatlik uchun foydali mashqlarni boshqarish imkoniyati qo'shiladi.</p>
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="admin-section animate-in">
              <div className="placeholder-content glass">
                <Music size={48} color="var(--primary)" opacity={0.5} />
                <h3>Musiqa bo'limi</h3>
                <p>Tez kunda: Relaksatsiya va meditatsiya musiqalarini boshqarish imkoniyati qo'shiladi.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
