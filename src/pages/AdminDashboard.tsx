import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Activity, PlusCircle, Save, 
  ChevronRight, ShieldCheck, Database, Trash2, Edit2, Undo2, Image, Video,
  Upload, Loader, Play
} from 'lucide-react';
import { useStore } from '../store';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { 
    lessons, addLesson, updateLesson, deleteLesson, 
    exercises, fetchExercises, addExercise, updateExercise, deleteExercise,
    uploadImage, seedLessons, seedExercises 
  } = useStore();
  const [activeTab, setActiveTab] = useState<'academy' | 'exercises'>('academy');
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Lesson state
  const [newLesson, setNewLesson] = useState({
    title: '',
    category: 'Asoslar',
    duration: '',
    type: 'text',
    content: '',
    imageUrl: '',
    videoUrl: ''
  });

  // Exercise state
  const [newExercise, setNewExercise] = useState({
    title: '',
    duration: '',
    level: 'Oson' as 'O\'rta' | 'Qiyin' | 'Oson',
    videoId: '',
    thumbnail: '',
    color: '#3b82f6'
  });


  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected for upload:", file.name, file.type, file.size);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const url = await uploadImage(file, (progress) => {
        setUploadProgress(Math.round(progress));
      });
      
      setNewLesson(prev => ({ ...prev, imageUrl: url }));
      alert("Rasm muvaffaqiyatli yuklandi!");
    } catch (error: any) {
      console.error("Upload failed in component:", error);
      alert(`Rasmni yuklashda xatolik yuz berdi: ${error.message || 'Noma\'lum xatolik'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLesson.title || !newLesson.content) return;

    try {
      if (editingId) {
        await updateLesson(editingId, newLesson);
        setEditingId(null);
        alert("Dars muvaffaqiyatli yangilandi!");
      } else {
        await addLesson(newLesson);
        alert("Dars muvaffaqiyatli qo'shildi!");
      }

      setNewLesson({
        title: '',
        category: 'Asoslar',
        duration: '',
        type: 'text',
        content: '',
        imageUrl: '',
        videoUrl: ''
      });
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  const startEdit = (lesson: any) => {
    setEditingId(lesson.id);
    setNewLesson({
      title: lesson.title,
      category: lesson.category,
      duration: lesson.duration,
      type: lesson.type,
      content: lesson.content,
      imageUrl: lesson.imageUrl || '',
      videoUrl: lesson.videoUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewLesson({
      title: '',
      category: 'Asoslar',
      duration: '',
      type: 'text',
      content: '',
      imageUrl: '',
      videoUrl: ''
    });
  };


  const handleDelete = async (id: string, title: string) => {
    if (confirm(`"${title}" darsini o'chirib tashlamoqchimisiz?`)) {
      try {
        await deleteLesson(id);
      } catch (error) {
        console.error("Delete failed:", error);
        alert("O'chirishda xatolik yuz berdi!");
      }
    }
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
        }
      ];
      await seedLessons(initialArticles as any);
      alert("Darslar yuklandi!");
    }
  };

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExercise.title || !newExercise.videoId) return;

    try {
      if (editingId) {
        await updateExercise(editingId, newExercise);
        setEditingId(null);
        alert("Mashq muvaffaqiyatli yangilandi!");
      } else {
        // Auto-generate thumbnail from videoId
        const exerciseWithThumb = {
          ...newExercise,
          thumbnail: `https://img.youtube.com/vi/${newExercise.videoId}/maxresdefault.jpg`
        };
        await addExercise(exerciseWithThumb);
        alert("Mashq muvaffaqiyatli qo'shildi!");
      }

      setNewExercise({
        title: '',
        duration: '',
        level: 'Oson',
        videoId: '',
        thumbnail: '',
        color: '#3b82f6'
      });
    } catch (error) {
      console.error("Exercise operation failed:", error);
      alert("Xatolik yuz berdi!");
    }
  };

  const startEditExercise = (ex: any) => {
    setEditingId(ex.id);
    setNewExercise({
      title: ex.title,
      duration: ex.duration,
      level: ex.level,
      videoId: ex.videoId,
      thumbnail: ex.thumbnail || '',
      color: ex.color || '#3b82f6'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteExercise = async (id: string, title: string) => {
    if (confirm(`"${title}" mashqini o'chirib tashlamoqchimisiz?`)) {
      try {
        await deleteExercise(id);
      } catch (error) {
        console.error("Delete failed:", error);
        alert("O'chirishda xatolik yuz berdi!");
      }
    }
  };

  const handleSeedExercises = async () => {
    if (confirm("Birlamchi mashqlarni yuklamoqchimisiz?")) {
      const initialExercises = [
        { 
          title: 'Diabet uchun 10 daqiqalik kardiomashq', 
          duration: '10 daqiqa', 
          level: 'Oson', 
          color: '#3b82f6',
          videoId: 'hJbRpHZr_d0', 
          thumbnail: 'https://img.youtube.com/vi/hJbRpHZr_d0/maxresdefault.jpg'
        },
        { 
          title: 'Yoga: Qon shakarini tushirish uchun', 
          duration: '20 daqiqa', 
          level: 'Oson', 
          color: '#10b981',
          videoId: 'o_bC40d4hKs', 
          thumbnail: 'https://img.youtube.com/vi/o_bC40d4hKs/maxresdefault.jpg'
        }
      ];
      await seedExercises(initialExercises as any);
      alert("Mashqlar yuklandi!");
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
        </aside>

        <main className="admin-content">
          {activeTab === 'academy' && (
            <div className="admin-section animate-in">
              <div className="section-header">
                <h2><BookOpen size={22} /> Akademiya boshqaruvi ({lessons.length})</h2>
                <button className="btn-secondary btn-sm" onClick={handleSeed}>
                  <Database size={16} /> Birlamchi darslar
                </button>
              </div>

              <div className="card admin-form-card glass">
                <h3>
                  {editingId ? <Edit2 size={18} /> : <PlusCircle size={18} />} 
                  {editingId ? 'Darsni tahrirlash' : 'Yangi dars qo\'shish'}
                </h3>
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
                        <option value="Hisoblash">Hisoblash</option>
                        <option value="Favqulodda">Favqulodda</option>
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
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Image size={14} /> Rasm URL (ixtiyoriy)</span>
                        <button 
                          type="button" 
                          className="btn-text-sm" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader size={12} className="animate-spin" />
                              Yuklanmoqda {uploadProgress}%
                            </>
                          ) : (
                            <>
                              <Upload size={12} />
                              Kompyuterdan yuklash
                            </>
                          )}
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                        />
                      </label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        value={newLesson.imageUrl}
                        onChange={e => setNewLesson({...newLesson, imageUrl: e.target.value})}
                      />
                      {newLesson.imageUrl && (
                        <div className="admin-image-preview-wrapper animate-in">
                          <img src={newLesson.imageUrl} alt="Preview" className="admin-image-preview" />
                          <button 
                            type="button" 
                            className="btn-icon-sm delete preview-remove"
                            onClick={() => setNewLesson({...newLesson, imageUrl: ''})}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Video size={14} /> Video URL (ixtiyoriy)
                      </label>
                      <input 
                        type="text" 
                        placeholder="YouTube link..."
                        value={newLesson.videoUrl}
                        onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})}
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
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      <Save size={18} /> {editingId ? 'Yangilash' : 'Saqlash'}
                    </button>
                    {editingId && (
                      <button type="button" className="btn-secondary" onClick={cancelEdit}>
                        <Undo2 size={18} /> Bekor qilish
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="active-items-list">
                <h3>Mavjud darslar</h3>
                <div className="items-grid">
                  {lessons.map(lesson => (
                    <div key={lesson.id} className="item-card glass">
                      <div className="item-main-info">
                        <div className="item-thumbnail">
                          {lesson.imageUrl ? (
                            <img src={lesson.imageUrl} alt="" />
                          ) : (
                            <BookOpen size={16} color="var(--primary)" />
                          )}
                        </div>
                        <div className="item-info">
                          <h4>{lesson.title}</h4>
                          <span className="badge">{lesson.category}</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button className="btn-icon-sm edit" onClick={() => startEdit(lesson)} title="Tahrirlash">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon-sm delete" onClick={() => handleDelete(lesson.id, lesson.title)} title="O'chirish">
                          <Trash2 size={16} />
                        </button>
                        <ChevronRight size={18} color="var(--text-muted)" style={{ marginLeft: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exercises' && (
            <div className="admin-section animate-in">
              <div className="section-header">
                <h2><Activity size={22} /> Mashqlar boshqaruvi ({exercises.length})</h2>
                <button className="btn-secondary btn-sm" onClick={handleSeedExercises}>
                  <Database size={16} /> Birlamchi mashqlar
                </button>
              </div>

              <div className="card admin-form-card glass">
                <h3>
                  {editingId ? <Edit2 size={18} /> : <PlusCircle size={18} />} 
                  {editingId ? 'Mashqni tahrirlash' : 'Yangi mashq qo\'shish'}
                </h3>
                <form onSubmit={handleAddExercise} className="admin-form">
                  <div className="form-group">
                    <label>Mashq nomi</label>
                    <input 
                      type="text" 
                      placeholder="Mashq sarlavhasi"
                      value={newExercise.title}
                      onChange={e => setNewExercise({...newExercise, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Murakkablik darajasi</label>
                      <select 
                        value={newExercise.level}
                        onChange={e => setNewExercise({...newExercise, level: e.target.value as any})}
                      >
                        <option value="Oson">Oson</option>
                        <option value="O'rta">O'rta</option>
                        <option value="Qiyin">Qiyin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Davomiyligi</label>
                      <input 
                        type="text" 
                        placeholder="Masalan: 10 daqiqa"
                        value={newExercise.duration}
                        onChange={e => setNewExercise({...newExercise, duration: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>YouTube Video ID</label>
                      <input 
                        type="text" 
                        placeholder="Masalan: hJbRpHZr_d0"
                        value={newExercise.videoId}
                        onChange={e => setNewExercise({...newExercise, videoId: e.target.value})}
                        required
                      />
                      <small style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
                        YouTube linkining oxiridagi kod (v= dan keyingi qism)
                      </small>
                    </div>
                    <div className="form-group">
                      <label>Tema rangi</label>
                      <input 
                        type="color" 
                        value={newExercise.color}
                        onChange={e => setNewExercise({...newExercise, color: e.target.value})}
                        style={{ height: '42px', padding: '4px' }}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      <Save size={18} /> {editingId ? 'Yangilash' : 'Saqlash'}
                    </button>
                    {editingId && (
                      <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setNewExercise({ title: '', duration: '', level: 'Oson', videoId: '', thumbnail: '', color: '#3b82f6' }); }}>
                        <Undo2 size={18} /> Bekor qilish
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="active-items-list">
                <h3>Mavjud mashqlar</h3>
                <div className="items-grid">
                  {exercises.map(ex => (
                    <div key={ex.id} className="item-card glass">
                      <div className="item-main-info">
                        <div className="item-thumbnail">
                          <img src={ex.thumbnail} alt="" />
                          <div className="play-hint"><Play size={12} fill="white" /></div>
                        </div>
                        <div className="item-info">
                          <h4>{ex.title}</h4>
                          <span className="badge" style={{ backgroundColor: ex.color + '20', color: ex.color }}>{ex.level} • {ex.duration}</span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button className="btn-icon-sm edit" onClick={() => startEditExercise(ex)} title="Tahrirlash">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon-sm delete" onClick={() => handleDeleteExercise(ex.id, ex.title)} title="O'chirish">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {exercises.length === 0 && (
                    <div className="empty-state">
                      <Activity size={32} opacity={0.3} />
                      <p>Mashqlar hali qo'shilmagan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
