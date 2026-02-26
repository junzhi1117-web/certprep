import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { acsmTopics, cscsTopics } from '../data/topics';
import type { TopicMeta } from '../data/types';
import { useQuizProgress } from '../hooks/useQuizProgress';

interface StudyProps {
  onStartQuiz: (topicId: string) => void;
}

type Tab = 'acsm' | 'cscs';

export function Study({ onStartQuiz }: StudyProps) {
  const [tab, setTab] = useState<Tab>('acsm');
  const { getProgress } = useQuizProgress();

  const topics = tab === 'acsm' ? acsmTopics : cscsTopics;

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 max-w-lg mx-auto w-full">
      {/* Tab Selector */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#E5E5EA' }}>
        {(['acsm', 'cscs'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-[15px] font-semibold border-none cursor-pointer transition-all duration-200"
            style={{
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--color-dark)' : 'var(--color-secondary)',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {t === 'acsm' ? 'ACSM-CPT' : 'CSCS'}
          </button>
        ))}
      </div>

      {/* Topic Grid */}
      <div className="flex flex-col gap-3">
        {topics.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            progress={getProgress(topic.id)}
            onStart={() => onStartQuiz(topic.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface TopicCardProps {
  topic: TopicMeta;
  progress?: { bestScore: number; lastAttempted: string; attempts: { date: string }[] };
  onStart: () => void;
}

function TopicCard({ topic, progress, onStart }: TopicCardProps) {
  const isAvailable = topic.status === 'available';

  return (
    <Card
      onClick={isAvailable ? onStart : undefined}
      className={`!p-0 overflow-hidden ${!isAvailable ? 'opacity-55' : ''}`}
    >
      <div className="p-4 flex items-start gap-3">
        <span className="text-2xl mt-0.5">{topic.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {topic.day && (
              <span className="text-xs font-medium" style={{ color: 'var(--color-secondary)' }}>
                Day {String(topic.day).padStart(2, '0')}
              </span>
            )}
            <Badge
              label={isAvailable ? `${topic.questionCount}q` : 'Coming Soon'}
              variant={isAvailable ? 'success' : 'secondary'}
            />
          </div>
          <h3 className="text-[15px] font-semibold m-0 mb-0.5">{topic.title}</h3>
          <p className="text-xs m-0" style={{ color: 'var(--color-secondary)' }}>{topic.subtitle}</p>

          {progress && progress.bestScore > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                Best: {progress.bestScore}%
              </span>
              <span className="text-xs" style={{ color: 'var(--color-secondary)' }}>
                {progress.attempts.length} attempt{progress.attempts.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        {isAvailable && (
          <span className="text-xl mt-1" style={{ color: 'var(--color-secondary)' }}>›</span>
        )}
      </div>
    </Card>
  );
}
