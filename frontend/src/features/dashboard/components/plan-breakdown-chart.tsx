import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#f59e0b', '#10b981', '#6366f1']; // FREE (amber), STARTER (emerald), PRO (indigo)
const PLAN_LABELS = ['FREE', 'STARTER', 'PRO'] as const;

export function PlanBreakdownChart({ planBreakdown }: { planBreakdown: Record<string, number> }) {
  const data = PLAN_LABELS.map((plan) => ({
    name: plan,
    value: planBreakdown[plan] ?? 0,
  }));
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  // Find top plan
  let topPlan = 'NONE';
  let maxVal = -1;
  data.forEach(d => {
    if (d.value > maxVal) {
      maxVal = d.value;
      topPlan = d.name;
    }
  });

  return (
    <div className="bg-surface border border-outline-variant/60 p-card-padding rounded-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-section-header text-section-header text-white">Plan Breakdown</h3>
        <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          {total} Companies
        </span>
      </div>
      
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground flex-1 flex items-center justify-center">No data</p>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {data.map((_, index) => (
                    <Cell key={PLAN_LABELS[index]} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface-container-high)',
                    border: '1px solid var(--color-outline-variant)',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-on-surface)'
                  }}
                  formatter={(value, name) => [`${value} companies`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Top Plan</span>
              <span className="font-stat-hero text-[24px] font-bold text-white leading-none mt-1">{topPlan}</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex justify-center flex-wrap gap-4 mt-4">
            {data.map((entry, index) => {
              const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
              return (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    {entry.name} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
