import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import {
  Calculator as CalcIcon,
  Utensils,
  Info,
  ArrowRight,
} from "lucide-react";
import "./Calculator.css";

const Calculator: React.FC = () => {
  const { profile } = useStore();
  const [foodAmount, setFoodAmount] = useState("");
  const [carbsPer100g, setCarbsPer100g] = useState("");
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [nan, setNan] = useState(0);
  const [insulin, setInsulin] = useState(0);

  useEffect(() => {
    const amount = parseFloat(foodAmount) || 0;
    const carbs = parseFloat(carbsPer100g) || 0;

    const calculatedCarbs = (amount * carbs) / 100;
    const calculatedNan = calculatedCarbs / 12;
    const calculatedInsulin = calculatedNan * (profile?.nanInsulin || 1);

    setTotalCarbs(calculatedCarbs);
    setNan(calculatedNan);
    setInsulin(calculatedInsulin);
  }, [foodAmount, carbsPer100g, profile]);

  return (
    <div className="calc-container">
      <header className="page-header">
        <h1>Insulin Kalkulyatori</h1>
      </header>

      <div className="card calculator-card glass">
        <div className="input-group">
          <label>
            <Utensils size={16} /> Mahsulot miqdori (gramm)
          </label>
          <input
            type="number"
            value={foodAmount}
            onChange={(e) => setFoodAmount(e.target.value)}
            placeholder="Masalan: 200"
          />
        </div>

        <div className="input-group">
          <label>
            <Info size={16} /> 100g tarkibidagi uglevod (g)
          </label>
          <input
            type="number"
            value={carbsPer100g}
            onChange={(e) => setCarbsPer100g(e.target.value)}
            placeholder="Masalan: 12"
          />
        </div>

        <div className="results-grid">
          <div className="result-item">
            <span>Umumiy uglevod</span>
            <p>{totalCarbs.toFixed(1)} g</p>
          </div>
          <div className="result-item">
            <span>NAN birligi</span>
            <p>{nan.toFixed(1)}</p>
          </div>
        </div>

        <div className="final-result card">
          <span>Kerakli insulin dozasi</span>
          <h2>
            {insulin.toFixed(1)} <sub>birlik</sub>
          </h2>
          <p className="formula-hint">
            Formula: {nan.toFixed(1)} NAN × {profile?.nanInsulin || 1} birlik
          </p>
        </div>
      </div>

      <section className="food-db">
        <h3>Tezkor mahsulotlar</h3>
        <div className="food-chips">
          {[
            { name: "Olma", carbs: 14 },
            { name: "Banan", carbs: 23 },
            { name: "Non", carbs: 48 },
            { name: "Guruch", carbs: 28 },
            { name: "Sut", carbs: 5 },
          ].map((food) => (
            <button
              key={food.name}
              className="chip"
              onClick={() => {
                setCarbsPer100g(food.carbs.toString());
              }}
            >
              {food.name} ({food.carbs}g)
            </button>
          ))}
        </div>
      </section>

      <section className="card promo-card glass">
        <CalcIcon size={32} color="var(--primary)" />
        <div className="promo-content">
          <h4>Oldingi hisoblar</h4>
          <p>Oxirgi ovqatlanish tarixingizni ko'ring.</p>
          <button className="text-btn">
            Tarixga o'tish <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Calculator;
