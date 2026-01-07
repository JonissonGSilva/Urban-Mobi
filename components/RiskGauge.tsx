
import React from 'react';

interface RiskGaugeProps {
  score: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const getRiskColor = (s: number) => {
    if (s < 40) return '#10b981'; // green-500
    if (s < 70) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getRiskLabel = (s: number) => {
    if (s < 40) return 'Low Risk';
    if (s < 70) return 'Moderate Risk';
    return 'High Risk';
  };

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke={getRiskColor(score)}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Score</span>
        </div>
      </div>
      <div 
        className="mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
        style={{ backgroundColor: getRiskColor(score) }}
      >
        {getRiskLabel(score)}
      </div>
    </div>
  );
};

export default RiskGauge;
