import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { TrendingUp, AlertTriangle, CheckCircle, Info, FileDown, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Analytics.css';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const Analytics: React.FC = () => {
  const { glucoseLogs, theme } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  // Statistics Calculation
  const stats = useMemo(() => {
    if (glucoseLogs.length === 0) return null;
    const values = glucoseLogs.map(l => l.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    const normal = glucoseLogs.filter(l => l.value >= 3.9 && l.value <= 10.0).length;
    const high = glucoseLogs.filter(l => l.value > 10.0).length;
    const low = glucoseLogs.filter(l => l.value < 3.9).length;

    return { avg, max, min, normal, high, low, total: glucoseLogs.length };
  }, [glucoseLogs]);

  // Line Chart Data (Last 7 Days)
  const lineChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayLogs = glucoseLogs.filter(log => 
        isWithinInterval(new Date(log.timestamp), { 
          start: startOfDay(date), 
          end: endOfDay(date) 
        })
      );
      const avg = dayLogs.length > 0 
        ? dayLogs.reduce((a, b) => a + b.value, 0) / dayLogs.length 
        : null;
      return { 
        label: format(date, 'EEE'), 
        value: avg 
      };
    });

    return {
      labels: last7Days.map(d => d.label),
      datasets: [
        {
          label: 'O\'rtacha qand miqdori (mmol/l)',
          data: last7Days.map(d => d.value),
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#0d9488',
          pointBorderColor: '#fff',
          pointHoverRadius: 6,
        }
      ]
    };
  }, [glucoseLogs]);

  // AI Insights Logic
  const aiInsights = useMemo(() => {
    if (glucoseLogs.length < 5) return [];
    const insights = [];

    // 1. Persistent High Trend (Last 3 days average > 10)
    const last3Days = Array.from({ length: 3 }, (_, i) => {
      const date = subDays(new Date(), i);
      const dayLogs = glucoseLogs.filter(log => 
        isWithinInterval(new Date(log.timestamp), { start: startOfDay(date), end: endOfDay(date) })
      );
      return dayLogs.length > 0 ? dayLogs.reduce((a, b) => a + b.value, 0) / dayLogs.length : null;
    }).filter(v => v !== null);

    if (last3Days.length >= 3 && last3Days.every(v => v! > 10)) {
      insights.push({
        type: 'warning',
        title: 'Barqaror yuqori trend',
        message: 'Oxirgi 3 kunda qand miqdori baland bo\'lmoqda. Parhezni ko\'rib chiqing yoki shifokor bilan maslahatlashib doza miqdorini aniqlashtiring.',
        icon: <TrendingUp size={20} />
      });
    }

    // 2. Morning High (Dawn Phenomenon)
    const morningLogs = glucoseLogs.filter(log => {
      const hour = new Date(log.timestamp).getHours();
      return hour >= 5 && hour <= 8;
    });

    if (morningLogs.length >= 3 && (morningLogs.reduce((a, b) => a + b.value, 0) / morningLogs.length) > 7.0) {
      insights.push({
        type: 'info',
        title: 'Tonggi giperglikemiya',
        message: 'Ertalabki qand miqdori yuqori chiqmoqda. Kechki ovqat vaqtini yoki kechki uzoq ta\'sir qiluvchi insulin dozasini tekshiring.',
        icon: <Sparkles size={20} />
      });
    }

    // 3. Excellent Stability
    if (stats && (stats.normal / stats.total) > 0.8) {
      insights.push({
        type: 'success',
        title: 'Ajoyib barqarorlik!',
        message: 'O\'lcho\'vlarining 80% dan ortig\'i me\'yorida. Shunday davom eting!',
        icon: <CheckCircle size={20} />
      });
    }

    return insights;
  }, [glucoseLogs, stats]);

  // Doughnut Chart Data
  const doughnutData = useMemo(() => {
    if (!stats) return null;
    return {
      labels: ['Normal', 'Yuqori', 'Past'],
      datasets: [
        {
          data: [stats.normal, stats.high, stats.low],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 4
        }
      ]
    };
  }, [stats]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
        titleColor: theme === 'dark' ? '#fff' : '#1e293b',
        bodyColor: theme === 'dark' ? '#94a3b8' : '#64748b',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: 'var(--text-muted)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-muted)' }
      }
    }
  };

  const exportToPDF = async () => {
    const element = document.getElementById('analytics-content');
    if (!element) return;

    setIsLoading(true);
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Glucobalance_Hisobot.pdf');
    setIsLoading(false);
  };

  if (glucoseLogs.length === 0) {
    return (
      <div className="analytics-container empty">
        <div className="card empty-card glass">
          <Info size={48} color="var(--primary)" />
          <h2>Tahlillar hali mavjud emas</h2>
          <p>Grafiklar shakllanishi uchun kamida bitta glyukoza o'lchovini kiriting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container" id="analytics-content">
      <header className="page-header">
        <h1>Tahlil va Trendlar</h1>
        <button className="btn-secondary" onClick={exportToPDF} disabled={isLoading}>
          <FileDown size={18} /> {isLoading ? 'Yuklanmoqda...' : 'Hisobotni yuklab olish'}
        </button>
      </header>

      <section className="ai-insights-section">
        <div className="section-title">
          <Sparkles size={20} color="var(--primary)" />
          <h3>AI Tavsiyalari</h3>
        </div>
        <div className="insights-grid">
          {aiInsights.length > 0 ? aiInsights.map((insight, i) => (
            <div key={i} className={`card insight-card glass ${insight.type}`}>
              <div className="insight-icon">{insight.icon}</div>
              <div className="insight-text">
                <h4>{insight.title}</h4>
                <p>{insight.message}</p>
              </div>
            </div>
          )) : (
            <div className="card insight-card glass empty-insight">
              <Info size={20} color="var(--text-muted)" />
              <p>Hozircha yangi tavsiyalar yo'q. Ma'lumotlar yig'ilishda davom etmoqda.</p>
            </div>
          )}
        </div>
      </section>

      <div className="analytics-grid">
        {/* Weekly Trend Chart */}
        <div className="card chart-card weekly-trend glass">
          <div className="chart-header">
            <h3>Haftalik trend</h3>
            <span className="badge">Oxirgi 7 kun</span>
          </div>
          <div className="chart-wrapper">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="card chart-card distribution glass">
          <div className="chart-header">
            <h3>Darajalar taqsimoti</h3>
          </div>
          <div className="doughnut-container">
            {doughnutData && <Doughnut data={doughnutData} options={{...chartOptions, scales: {}}} />}
            <div className="doughnut-center">
              <h3>{((stats!.normal / stats!.total) * 100).toFixed(0)}%</h3>
              <span>Normal</span>
            </div>
          </div>
          <div className="dist-legend">
            <div className="legend-item"><span className="dot" style={{background: '#10b981'}}></span> Normal: {stats?.normal}</div>
            <div className="legend-item"><span className="dot" style={{background: '#f59e0b'}}></span> Yuqori: {stats?.high}</div>
            <div className="legend-item"><span className="dot" style={{background: '#ef4444'}}></span> Past: {stats?.low}</div>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="stats-summary">
          <div className="card stat-mini-card">
            <TrendingUp size={24} color="var(--primary)" />
            <div className="stat-info">
              <span>O'rtacha ko'rsatkich</span>
              <h3>{stats?.avg.toFixed(1)} <sub>mmol/l</sub></h3>
            </div>
          </div>
          <div className="card stat-mini-card">
            <CheckCircle size={24} color="#10b981" />
            <div className="stat-info">
              <span>Eng past ko'rsatkich</span>
              <h3>{stats?.min.toFixed(1)} <sub>mmol/l</sub></h3>
            </div>
          </div>
          <div className="card stat-mini-card">
            <AlertTriangle size={24} color="#f59e0b" />
            <div className="stat-info">
              <span>Eng yuqori ko'rsatkich</span>
              <h3>{stats?.max.toFixed(1)} <sub>mmol/l</sub></h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
