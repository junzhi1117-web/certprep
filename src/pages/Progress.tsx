import { Card } from '../components/ui/Card';
import { getTotalStats, getStudyHeatmap, useQuizProgress } from '../hooks/useQuizProgress';
import { allTopics } from '../data/topics';

export function Progress() {
  const stats = getTotalStats();
  const heatmap = getStudyHeatmap();
  const { getAllProgress } = useQuizProgress();
  const allProgress = getAllProgress();

  // Generate last 12 weeks for heatmap
  const weeks: string[][] = [];
  const today = new Date();
  for (let w = 11; w >= 0; w--) {
    const week: string[] = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + d));
      week.push(date.toISOString().split('T')[0]);
    }
    weeks.push(week);
  }

  const getHeatColor = (count: number) => {
    if (count === 0) return '#F2F2F7';
    if (count === 1) return '#B6E3C8';
    if (count <= 3) return '#5BBF82';
    return '#1B8A3B';
  };

  // Weak topics (scored < 70%)
  const weakTopics = allProgress
    .filter(p => p.bestScore < 70 && p.bestScore > 0)
    .map(p => {
      const topic = allTopics.find(t => t.id === p.topicId);
      return { ...p, topic };
    })
    .filter(p => p.topic);

  // Score history per topic
  const topicScores = allProgress
    .filter(p => p.attempts.length > 0)
    .map(p => {
      const topic = allTopics.find(t => t.id === p.topicId);
      return { ...p, topic };
    })
    .filter(p => p.topic);

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold m-0">Progress</h1>

      {/* Total Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="!p-3.5">
          <p className="text-xs m-0 mb-1" style={{ color: 'var(--color-secondary)' }}>Questions Answered</p>
          <p className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>{stats.totalAnswered}</p>
        </Card>
        <Card className="!p-3.5">
          <p className="text-xs m-0 mb-1" style={{ color: 'var(--color-secondary)' }}>Accuracy Rate</p>
          <p className="text-2xl font-bold m-0" style={{ color: stats.accuracy >= 75 ? 'var(--color-success)' : 'var(--color-warning)' }}>
            {stats.accuracy}%
          </p>
        </Card>
        <Card className="!p-3.5">
          <p className="text-xs m-0 mb-1" style={{ color: 'var(--color-secondary)' }}>Study Streak</p>
          <p className="text-2xl font-bold m-0" style={{ color: 'var(--color-warning)' }}>{stats.streak} days</p>
        </Card>
        <Card className="!p-3.5">
          <p className="text-xs m-0 mb-1" style={{ color: 'var(--color-secondary)' }}>Time Studied</p>
          <p className="text-2xl font-bold m-0">{Math.round(stats.totalTime / 60)}m</p>
        </Card>
      </div>

      {/* Study Heatmap */}
      <Card>
        <h3 className="text-sm font-semibold m-0 mb-3">Study Activity</h3>
        <div className="flex gap-[3px] overflow-x-auto">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map(date => (
                <div
                  key={date}
                  className="w-3 h-3 rounded-sm"
                  style={{ background: getHeatColor(heatmap[date] || 0) }}
                  title={`${date}: ${heatmap[date] || 0} sessions`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[10px]" style={{ color: 'var(--color-secondary)' }}>Less</span>
          {[0, 1, 2, 4].map(n => (
            <div key={n} className="w-3 h-3 rounded-sm" style={{ background: getHeatColor(n) }} />
          ))}
          <span className="text-[10px]" style={{ color: 'var(--color-secondary)' }}>More</span>
        </div>
      </Card>

      {/* Score History */}
      {topicScores.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold m-0 mb-3">Score History</h3>
          <div className="flex flex-col gap-3">
            {topicScores.map(({ topic, attempts, bestScore }) => (
              <div key={topic!.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">
                    {topic!.icon} {topic!.title}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                    Best: {bestScore}%
                  </span>
                </div>
                <div className="flex items-end gap-1 h-8">
                  {attempts.slice(-10).map((a, i) => {
                    const pct = a.total > 0 ? (a.score / a.total) * 100 : 0;
                    const color = pct >= 90 ? 'var(--color-success)' : pct >= 75 ? 'var(--color-primary)' : pct >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-sm min-w-[4px]"
                        style={{ height: `${Math.max(pct, 8)}%`, background: color }}
                        title={`${Math.round(pct)}%`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold m-0 mb-3" style={{ color: 'var(--color-danger)' }}>
            Needs Improvement
          </h3>
          <div className="flex flex-col gap-2">
            {weakTopics.map(({ topic, bestScore }) => (
              <div key={topic!.id} className="flex items-center justify-between">
                <span className="text-sm">
                  {topic!.icon} {topic!.title}
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-danger)' }}>
                  {bestScore}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {stats.totalAnswered === 0 && (
        <Card className="text-center !py-8">
          <p className="text-3xl m-0 mb-2">📊</p>
          <p className="text-sm m-0" style={{ color: 'var(--color-secondary)' }}>
            No study data yet. Start a quiz to see your progress!
          </p>
        </Card>
      )}
    </div>
  );
}
