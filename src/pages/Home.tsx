import { Card } from '../components/ui/Card';
import { getTotalStats } from '../hooks/useQuizProgress';
import { acsmTopics } from '../data/topics';

interface HomeProps {
  onNavigate: (page: string, topicId?: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const stats = getTotalStats();
  const suggestedTopic = acsmTopics.find(t => t.status === 'available');

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 max-w-lg mx-auto w-full">
      {/* Greeting */}
      <Card className="!p-5">
        <p className="text-sm mb-1" style={{ color: 'var(--color-secondary)' }}>Good to see you</p>
        <h1 className="text-2xl font-bold m-0 mb-1">Ready to study?</h1>
        <p className="text-sm m-0" style={{ color: 'var(--color-secondary)' }}>
          ACSM-CPT: March 20 &bull; CSCS: April 10
        </p>
      </Card>

      {/* Suggested Topic */}
      {suggestedTopic && (
        <Card onClick={() => onNavigate('quiz', suggestedTopic.id)} className="!p-0 overflow-hidden">
          <div className="p-4 pb-3">
            <p className="text-xs font-semibold uppercase tracking-wide m-0 mb-2" style={{ color: 'var(--color-primary)' }}>
              Suggested Topic
            </p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{suggestedTopic.icon}</span>
              <div>
                <h3 className="text-base font-semibold m-0">{suggestedTopic.title}</h3>
                <p className="text-sm m-0" style={{ color: 'var(--color-secondary)' }}>{suggestedTopic.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'var(--color-primary-light)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              {suggestedTopic.questionCount} questions
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              Start →
            </span>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center !p-3">
          <p className="text-2xl font-bold m-0" style={{ color: 'var(--color-primary)' }}>
            {stats.totalAnswered}
          </p>
          <p className="text-[11px] m-0 mt-0.5" style={{ color: 'var(--color-secondary)' }}>Answered</p>
        </Card>
        <Card className="text-center !p-3">
          <p className="text-2xl font-bold m-0" style={{ color: stats.accuracy >= 75 ? 'var(--color-success)' : 'var(--color-warning)' }}>
            {stats.accuracy}%
          </p>
          <p className="text-[11px] m-0 mt-0.5" style={{ color: 'var(--color-secondary)' }}>Accuracy</p>
        </Card>
        <Card className="text-center !p-3">
          <p className="text-2xl font-bold m-0" style={{ color: 'var(--color-warning)' }}>
            {stats.streak}
          </p>
          <p className="text-[11px] m-0 mt-0.5" style={{ color: 'var(--color-secondary)' }}>Day Streak</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold m-0 mt-2">Quick Start</h2>
      <div className="flex flex-col gap-3">
        <Card onClick={() => onNavigate('study')} className="flex items-center gap-3 !py-3.5">
          <span className="text-2xl">📚</span>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold m-0">ACSM-CPT Topics</h3>
            <p className="text-xs m-0" style={{ color: 'var(--color-secondary)' }}>22 topics, exam March 20</p>
          </div>
          <span style={{ color: 'var(--color-secondary)' }}>›</span>
        </Card>
        <Card onClick={() => onNavigate('study')} className="flex items-center gap-3 !py-3.5">
          <span className="text-2xl">🏋️</span>
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold m-0">CSCS Topics</h3>
            <p className="text-xs m-0" style={{ color: 'var(--color-secondary)' }}>Focus on weak areas</p>
          </div>
          <span style={{ color: 'var(--color-secondary)' }}>›</span>
        </Card>
      </div>
    </div>
  );
}
