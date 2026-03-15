import React, { useMemo } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import imgMoneyTree from '../../assets/e64d974d5a01bec25d6463a6587944bee2595453.png';

const LEVELS = [
  { level: 1, target: 50, label: '$50 - Seedling' },
  { level: 2, target: 100, label: '$100 - Sprout' },
  { level: 3, target: 200, label: '$200 - Young Tree' },
  { level: 4, target: 400, label: '$400 - Growing Tree' },
  { level: 5, target: 750, label: '$750 - Strong Tree' },
  { level: 6, target: 1000, label: '$1,000 - Money Tree' },
  { level: 7, target: 2000, label: '$2,000 - Forest' },
  { level: 8, target: 5000, label: '$5,000 - Grove' },
];

export const MoneyTreePage: React.FC = () => {
  const { currentBudget, currentMonth } = useApp();

  const totalSavings = useMemo(() => {
    if (!currentBudget) return 0;
    const remaining = currentBudget.monthlyBudget - 
      currentBudget.categories.reduce((sum, cat) => sum + cat.spentAmount, 0);
    return Math.max(0, remaining);
  }, [currentBudget]);

  const currentLevel = useMemo(() => {
    let level = 0;
    for (let i = 0; i < LEVELS.length; i++) {
      if (totalSavings >= LEVELS[i].target) {
        level = i + 1;
      } else {
        break;
      }
    }
    return level;
  }, [totalSavings]);

  const nextLevel = currentLevel < LEVELS.length ? LEVELS[currentLevel] : null;
  const progressToNextLevel = nextLevel 
    ? ((totalSavings % nextLevel.target) / nextLevel.target) * 100
    : 100;

  const treeScale = 0.5 + (currentLevel * 0.15);

  return (
    <MobileLayout showNavigation={true}>
      <div className="px-4 py-6 pb-20 bg-gradient-to-b from-[#c2e1cc] to-white min-h-screen">
        <h1 className="font-['Inter'] font-bold text-[#023a14] text-[24px] mb-2 text-center">
          Your Money Tree
        </h1>
        <p className="font-['Inter'] text-[#023a14] text-[14px] mb-6 text-center opacity-70">
          Grow your tree by saving money each month!
        </p>

        {/* Money Tree Visual */}
        <div className="bg-white rounded-[20px] shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="transition-all duration-500 ease-out"
              style={{
                transform: `scale(${treeScale})`,
                filter: currentLevel === 0 ? 'grayscale(100%)' : 'grayscale(0%)',
              }}
            >
              <div className="w-[120px] h-[120px] rounded-full bg-[#13642D] flex items-center justify-center relative">
                <img src={imgMoneyTree} alt="Money Tree" className="w-[100px] h-[100px]" />
                {currentLevel > 0 && (
                  <div className="absolute -top-2 -right-2 bg-[#399a57] text-white rounded-full w-[32px] h-[32px] flex items-center justify-center font-bold text-[14px]">
                    {currentLevel}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="font-['Inter'] font-bold text-[#023a14] text-[28px]">
                ${totalSavings.toFixed(0)}
              </p>
              <p className="font-['Inter'] text-[#399a57] text-[16px]">
                Total Saved This Month
              </p>
            </div>
          </div>

          {/* Current Level Info */}
          <div className="mt-6 bg-[#c2e1cc] rounded-[15px] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-['Inter'] font-medium text-[#023a14] text-[14px]">
                {currentLevel === 0 ? 'Start Saving' : LEVELS[currentLevel - 1].label}
              </span>
              <span className="font-['Inter'] font-bold text-[#399a57] text-[14px]">
                Level {currentLevel}
              </span>
            </div>

            {nextLevel && (
              <>
                <div className="h-[30px] bg-white rounded-[42px] overflow-hidden relative mb-2">
                  <div
                    className="h-full bg-[#399a57] rounded-[42px] transition-all duration-500"
                    style={{ width: `${progressToNextLevel}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-['Inter'] font-bold text-[#023a14] text-[12px]">
                      {progressToNextLevel.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-[12px] text-[#023a14] text-center">
                  ${(nextLevel.target - (totalSavings % nextLevel.target)).toFixed(0)} more to reach {nextLevel.label}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Levels Progress */}
        <div className="bg-white rounded-[20px] shadow-sm p-4">
          <h2 className="font-['Inter'] font-bold text-[#023a14] text-[18px] mb-4">
            Growth Milestones
          </h2>
          <div className="space-y-3">
            {LEVELS.map((level, index) => {
              const isReached = currentLevel >= level.level;
              const isCurrent = currentLevel === level.level - 1;

              return (
                <div
                  key={level.level}
                  className={`flex items-center justify-between p-3 rounded-[10px] ${
                    isReached
                      ? 'bg-[#c2e1cc]'
                      : isCurrent
                      ? 'bg-[#f0f9f4] border-2 border-[#399a57]'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-[36px] h-[36px] rounded-full flex items-center justify-center font-bold ${
                        isReached
                          ? 'bg-[#399a57] text-white'
                          : isCurrent
                          ? 'bg-white text-[#399a57] border-2 border-[#399a57]'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {level.level}
                    </div>
                    <div>
                      <p className={`font-['Inter'] font-medium text-[14px] ${
                        isReached ? 'text-[#023a14]' : 'text-gray-600'
                      }`}>
                        {level.label}
                      </p>
                      {isCurrent && (
                        <p className="text-[11px] text-[#399a57] font-medium">In Progress</p>
                      )}
                    </div>
                  </div>
                  {isReached && (
                    <div className="text-[#399a57]">✓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-r from-[#399a57] to-[#2d7a45] rounded-[20px] shadow-sm p-6 text-white">
          <h3 className="font-['Inter'] font-bold text-[18px] mb-3">💡 Savings Tip</h3>
          <p className="font-['Inter'] text-[14px] leading-relaxed">
            {currentLevel === 0 
              ? "Start small! Even saving $1 a day can help you reach your first milestone. Every dollar counts!"
              : currentLevel < 3
              ? "Great start! Try to identify one unnecessary expense you can cut this month to boost your savings."
              : currentLevel < 5
              ? "You're doing amazing! Consider automating your savings to make it even easier."
              : "Incredible work! You're a savings superstar. Keep growing your financial forest!"}
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};
