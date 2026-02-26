import React, { useState, useEffect } from 'react';
import { Search, PlayCircle, BookOpen, ChevronRight, HelpCircle, Info } from 'lucide-react';
import './Academy.css';

const Academy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const articles = [
    {
      id: 1,
      title: 'Qandli diabet nima?',
      category: 'Asoslar',
      duration: '5 daqiqa',
      type: 'text',
      content: `
        <h3>Qandli diabet haqida umumiy tushuncha</h3>
        <p>Qandli diabet — bu organizmda glyukoza (qand) miqdorining surunkali ravishda oshib ketishi bilan bog'liq kasallikdir. Bu holat oshqozon osti bezidan ajralib chiqadigan insulin gormonining yetishmovchiligi yoki hujayralarning ushbu gormonga sezuvchanligi pasayishi natijasida yuzaga keladi.</p>
        <p>Glyukoza bizning asosiy energiya manbaimizdir, ammo u hujayralarga kirishi uchun insulin "kalit" vazifasini o'taydi. Insulin bo'lmasa, qand qonda to'planib qoladi va vaqt o'tishi bilan turli a'zolarga zarar yetkazadi.</p>
        <ul>
          <li><strong>Asosiy turlari:</strong> 1-tur, 2-tur va homiladorlik diabeti.</li>
          <li><strong>Belgilari:</strong> Tez-tez chanqash, ko'p peshob ajratish, holsizlik, ko'rishning pasayishi.</li>
        </ul>
      `
    },
    {
      id: 2,
      title: '1-tur va 2-tur farqi',
      category: 'Asoslar',
      duration: '8 daqiqa',
      type: 'video',
      content: `
        <h3>1-tur va 2-tur diabet: Farqlari va xususiyatlari</h3>
        <p>Ko'pchilik bu ikki tur bir xil deb o'ylaydi, lekin ularning kelib chiqish sabablari turlicha.</p>
        <h4>1-tur diabet:</h4>
        <p>Odatda bolalik yoki yoshlikda boshlanadi. Bu autoimmun kasallik bo'lib, organizm o'zining insulin ishlab chiqaruvchi hujayralarini yo'q qiladi. Davolash uchun insulin in'ektsiyalari hayotiy zarur.</p>
        <h4>2-tur diabet:</h4>
        <p>Eng ko'p tarqalgan turi (90% holatlar). Odatda 35-40 yoshdan keyin rivojlanadi. Bunda insulin ishlab chiqariladi, ammo hujayralar unga "javob bermaydi" (insulin rezistentligi). Ko'pincha ortiqcha vazn va kam harakatlilik natijasida kelib chiqadi.</p>
      `
    },
    {
      id: 3,
      title: 'Glikemik indeks nima?',
      category: 'Parhez',
      duration: '7 daqiqa',
      type: 'text',
      content: `
        <h3>Glikemik indeks (GI) tushunchasi</h3>
        <p>Glikemik indeks — bu mahsulot tarkibidagi uglevodlarning qon qandi miqdoriga qanchalik tez ta'sir qilishini ko'rsatadigan ko'rsatkichdir.</p>
        <ul>
          <li><strong>Past GI (55 dan past):</strong> Qonda qand miqdorini sekin va bir me'yorda oshiradi. (Masalan: yasmiq, olma, suli yormasi).</li>
          <li><strong>O'rta GI (56-69):</strong> O'rtacha tezlikda ta'sir qiladi. (Masalan: banan, jigarrang guruch).</li>
          <li><strong>Yuqori GI (70 dan yuqori):</strong> Qandni tezda ko'tarib yuboradi. (Masalan: oq non, kartofel frisi, shirinliklar).</li>
        </ul>
        <p>Diabeti bor insonlar uchun asosan past va o'rta GI ga ega bo'lgan mahsulotlarni tanlash tavsiya etiladi.</p>
      `
    },
    {
      id: 4,
      title: 'NAN (Non birligi) nima?',
      category: 'Hisoblash',
      duration: '6 daqiqa',
      type: 'video',
      content: `
        <h3>Non birligi (NAN) haqida</h3>
        <p>Non birligi — bu oziq-ovqat mahsulotlaridagi uglevodlar miqdorini hisoblash uchun ishlatiladigan universal o'lchov birligidir. 1 NAN taxminan 10-12 gramm uglevodga teng.</p>
        <p>Nima uchun kerak? Insulin dozasini to'g'ri hisoblash uchun qancha uglevod iste'mol qilinganini bilish juda muhim. Masalan, 1 bo'lak non yoki 1 dona o'rtacha olma 1 NAN ga teng deb hisoblanadi.</p>
      `
    },
    {
      id: 5,
      title: 'Gipoglikemiyada birinchi yordam',
      category: 'Favqulodda',
      duration: '4 daqiqa',
      type: 'text',
      content: `
        <h3>Gipoglikemiya: Qand miqdori tushib ketishi</h3>
        <p>Gipoglikemiya — qon qandi darajasi 3.9 mmol/L dan pastga tushib ketishi. Bu xavfli holat bo'lib, tezda chora ko'rishni talab qiladi.</p>
        <h4>Alomatlari:</h4>
        <p>Titroq, sovuq ter chiqishi, kuchli ochlik hissi, bosh aylanishi, asabiylashish.</p>
        <h4>Birinchi yordam (15/15 qoidasi):</h4>
        <ol>
          <li>15 gramm tez so'riladigan uglevod iste'mol qiling (yarim stakan sharbat, 3-4 bo'lak qand, 1 osh qoshiq asal).</li>
          <li>15 daqiqa kuting.</li>
          <li>Qand miqdorini qayta tekshiring. Agar hali ham past bo'lsa, jarayonni takrorlang.</li>
        </ol>
      `
    },
    {
      id: 6,
      title: 'To\'g\'ri ovqatlanish tamoyillari',
      category: 'Parhez',
      duration: '10 daqiqa',
      type: 'text',
      content: `
        <h3>Diabetda sog'lom ovqatlanish</h3>
        <p>Parhez — bu nafaqat cheklovlar, balki muvozanatli turmush tarzidir.</p>
        <ul>
          <li><strong>Tez-tez va kam-kamdan:</strong> Kuniga 5-6 marta ovqatlanish qand miqdorini bir xilda ushlab turadi.</li>
          <li><strong>"Likopcha qoidasi":</strong> Likopchaning yarmi sabzavotlar, to'rtdan biri oqsillar (go'sht, baliq), qolgan to'rtdan biri esa murakkab uglevodlar (guruch, grechka) bilan to'lishi kerak.</li>
          <li><strong>Suyuqlik:</strong> Kuniga kamida 1.5-2 litr toza suv ichishni unutmang.</li>
        </ul>
      `
    },
    {
      id: 7,
      title: 'Insulinni to\'g\'ri yuborish texnikasi',
      category: 'Davolash',
      duration: '12 daqiqa',
      type: 'video',
      content: `
        <h3>Insulin in'ektsiyasi: Qadam-ba-qadam</h3>
        <p>Insulinni to'g'ri yuborish uning samaradorligini ta'minlaydi va asoratlarning oldini oladi.</p>
        <ol>
          <li>Yuborish joyini tanlang (qorin, son, yelka). Har safar joyni kamida 1-2 sm ga almashtiring.</li>
          <li>Terini tozalang.</li>
          <li>Shprits-ruchkani tayyorlang, havoni chiqaring.</li>
          <li>Igna ostidagi teri burmasini hosil qiling va ignani 90 daraja burchak ostida kiriting.</li>
          <li>Tugmani oxirigacha bosing va ignani chiqarishdan oldin 10 soniya kuting.</li>
        </ol>
      `
    },
    {
      id: 8,
      title: 'Jismoniy faollik va qand miqdori',
      category: 'Turmush tarzi',
      duration: '9 daqiqa',
      type: 'text',
      content: `
        <h3>Harakat — bu dori!</h3>
        <p>Jismoniy harakat hujayralarning insulinga sezuvchanligini oshiradi va ortiqcha vazndan xalos bo'lishga yordam beradi.</p>
        <p>Tavsiyalar: Kuniga kamida 30 daqiqa piyoda yurish, suzish yoki velosiped haydash. Mashg'ulotdan oldin va keyin qand miqdorini tekshirishni unutmang.</p>
      `
    },
    {
      id: 9,
      title: 'Oyoq parvarishi qoidalari',
      category: 'Profilaktika',
      duration: '8 daqiqa',
      type: 'text',
      content: `
        <h3>Diabetik tovon profilaktikasi</h3>
        <p>Diabetda oyoqlar sezuvchanligi pasayishi mumkin, shuning uchun jarohatlarni sezmaslik xavfi bor.</p>
        <ul>
          <li>Har kuni oyoqlaringizni ko'zdan kechiring (yara, shish, qizarish yo'qligiga ishonch hosil qiling).</li>
          <li>Oyoqlarni iliq suvda yuving va yumshoq sochiq bilan ehtiyotkorlik bilan quriting.</li>
          <li>Hech qachon yalangoyoq yurmang.</li>
          <li>Qulay va tor bo'lmagan poyabzal kiying.</li>
        </ul>
      `
    },
    {
      id: 10,
      title: 'Stress va qand miqdori o\'rtasidagi bog\'liqlik',
      category: 'Turmush tarzi',
      duration: '11 daqiqa',
      type: 'text',
      content: `
        <h3>Stressning qand miqdoriga ta'siri</h3>
        <p>Stress paytida organizm "kortizol" va "adrenalin" kabi gormonlarni ishlab chiqaradi. Bu gormonlar jigardagi glyukoza zahirasini qonga chiqarib yuboradi, natijada qand miqdori ko'tariladi.</p>
        <p>Qanday kurashish kerak? Chuqur nafas olish mashqlari, meditatsiya, sevimli mashg'ulot bilan shug'ullanish va yetarli uyqu stressni kamaytirishga yordam beradi.</p>
      `
    },
    {
      id: 11,
      title: 'Ketoatsidoz – ilk belgilar va profilaktika',
      category: 'Davolash',
      duration: '15 daqiqa',
      type: 'video',
      content: `
        <h3>Diabetik ketoatsidoz (DKA)</h3>
        <p>DKA — bu insulin mutlaqo yetishmaganda yuzaga keladigan og'ir asoratdir. Organizm energiya uchun yog'larni parchalaydi va qonda "ketonlar" (atseton) to'planadi.</p>
        <p><strong>Belgilari:</strong> Og'izdan atseton hidi kelishi, ko'ngil aynishi, qusish, qorin og'rig'i, nafas qisishi.</p>
        <p>Bu holatda zudlik bilan shifokorga murojaat qilish shart!</p>
      `
    },
    {
      id: 12,
      title: 'Dori vositalarining o\'zaro ta\'siri',
      category: 'Davolash',
      duration: '10 daqiqa',
      type: 'text',
      content: `
        <h3>Dori vositalarini ehtiyotkorlik bilan qo'llash</h3>
        <p>Ba'zi dori vositalari (masalan, ayrim antibiotiklar, gormonal dorilar, shamollashga qarshi siroplar) qand miqdorini ko'tarishi yoki tushirib yuborishi mumkin.</p>
        <p>Har doim shifokoringizga diabet borligi haqida xabar bering va yangi dori ichishdan oldin yo'riqnomani diqqat bilan o'qing.</p>
      `
    }
  ];

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const diagnostics = [
    {
      title: 'Och qoringa qon tahlili',
      description: '8–10 soat ovqat yemay topshiriladi.',
      levels: [
        { range: '3.3 – 5.5 mmol/L', status: 'Me\'yor', color: 'var(--success)' },
        { range: '5.6 – 6.9 mmol/L', status: 'Xavf (prediabet)', color: 'var(--warning)' },
        { range: '7.0+ mmol/L', status: 'Diabet ehtimoli', color: 'var(--error)' }
      ]
    },
    {
      title: 'Ovqatdan 2 soat keyin',
      description: 'Ovqatdan keyin qand miqdori o\'zgarishini tekshirish.',
      levels: [
        { range: '7.8 mmol/L gacha', status: 'Me\'yor', color: 'var(--success)' },
        { range: '11.1+ mmol/L', status: 'Diabet ehtimoli', color: 'var(--error)' }
      ]
    },
    {
      title: 'HbA1c (Glokirlangan gemoglobin)',
      description: 'Oxirgi 3 oylik o\'rtacha qand darajasi.',
      levels: [
        { range: '6.0% gacha', status: 'Me\'yor', color: 'var(--success)' },
        { range: '6.0 – 6.4%', status: 'Xavf (prediabet)', color: 'var(--warning)' },
        { range: '6.5%+ ', status: 'Diabet', color: 'var(--error)' }
      ]
    },
    {
      title: 'S-Peptid tahlili',
      description: 'Diabet turini (1 yoki 2) aniqlash uchun.',
      customNote: 'Kam bo\'lsa: 1-tur. Ko\'p bo\'lsa: 2-tur.'
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedArticle]);

  const currentIndex = selectedArticle 
    ? articles.findIndex(a => a.id === selectedArticle.id) 
    : -1;

  const handleNext = () => {
    if (currentIndex < articles.length - 1) {
      setSelectedArticle(articles[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedArticle(articles[currentIndex - 1]);
    }
  };

  if (selectedArticle) {
    return (
      <div className="academy-container lesson-page">
        <button className="back-btn" onClick={() => setSelectedArticle(null)}>
          <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
          Barcha darslarga qaytish
        </button>

        <article className="lesson-full-content">
          <header className="lesson-header">
            <span className="article-category">{selectedArticle.category}</span>
            <h1>{selectedArticle.title}</h1>
            <div className="article-meta">
              {selectedArticle.duration} • {selectedArticle.type === 'video' ? 'Video dars' : 'Mutolaa darsi'}
            </div>
          </header>

          {selectedArticle.type === 'video' && (
            <div className="video-placeholder">
              <PlayCircle size={48} color="white" />
              <span>Video tez kunda qo'shiladi</span>
            </div>
          )}

          <div 
            className="article-text-content"
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />

          <footer className="lesson-footer">
            <div className="lesson-nav">
              <button 
                className="nav-btn prev" 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
              >
                <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                <span>Oldingi dars</span>
              </button>
              
              <button 
                className="nav-btn next" 
                onClick={handleNext}
                disabled={currentIndex === articles.length - 1}
              >
                <span>Keyingi dars</span>
                <ChevronRight size={20} />
              </button>
            </div>
            <button 
              className="btn-primary w-full" 
              style={{ marginTop: '24px' }}
              onClick={() => setSelectedArticle(null)}
            >
              Darsni yakunlash
            </button>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="academy-container">
      <header className="page-header">
        <h1>Diabetes Academy</h1>
      </header>

      <div className="search-bar glass">
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Mavzuni qidiring..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <section className="diagnostics-section">
        <div className="section-title">
          <HelpCircle size={20} color="var(--primary)" />
          <h3>Diagnostika me'yorlari</h3>
        </div>
        <div className="diag-grid">
          {diagnostics.map((diag, i) => (
            <div key={i} className="card diag-card glass">
              <h4>{diag.title}</h4>
              <p className="diag-desc">{diag.description}</p>
              {diag.levels ? (
                <div className="diag-levels">
                  {diag.levels.map((lvl, j) => (
                    <div key={j} className="diag-level-item">
                      <span className="diag-range">{lvl.range}</span>
                      <span className="diag-status" style={{ color: lvl.color, background: `${lvl.color}15` }}>
                        {lvl.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="diag-custom-note glass">
                  <Info size={16} color="var(--primary)" />
                  <span>{diag.customNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="section-title">
        <h3>Barcha darslar</h3>
      </div>

      <div className="articles-list">
        {filteredArticles.map(article => (
          <div 
            key={article.id} 
            className="card article-card"
            onClick={() => setSelectedArticle(article)}
            style={{ cursor: 'pointer' }}
          >
            <div className="article-icon">
              {article.type === 'video' ? <PlayCircle size={24} color="var(--primary)" /> : <BookOpen size={24} color="var(--success)" />}
            </div>
            <div className="article-info">
              <span className="article-category">{article.category}</span>
              <h4>{article.title}</h4>
              <span className="article-meta">{article.duration} • {article.type === 'video' ? 'Video' : 'Maqola'}</span>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>
        ))}
      </div>

      <section className="quiz-promo glass">
        <HelpCircle size={32} color="var(--primary)" />
        <div>
          <h4>Bilimingizni tekshiring!</h4>
          <p>O'tgan darslar bo'yicha qisqa testdan o'ting.</p>
        </div>
        <button className="chip active">Testni boshlash</button>
      </section>
    </div>
  );
};

export default Academy;
