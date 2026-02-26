import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { loadSettings, saveSettings } from '../hooks/useQuizProgress';

export function Settings() {
  const [settings, setSettings] = useState(loadSettings);

  const update = <K extends keyof ReturnType<typeof loadSettings>>(
    key: K,
    value: ReturnType<typeof loadSettings>[K]
  ) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  };

  const questionOptions = [10, 25, 50, 100] as const;

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold m-0">Settings</h1>

      {/* Quiz Preferences */}
      <Card>
        <h3 className="text-sm font-semibold m-0 mb-4" style={{ color: 'var(--color-secondary)' }}>
          QUIZ PREFERENCES
        </h3>

        {/* Questions Per Session */}
        <div className="mb-4">
          <label className="text-[15px] font-medium block mb-2">Questions per session</label>
          <div className="flex gap-2">
            {questionOptions.map(n => (
              <button
                key={n}
                onClick={() => update('questionsPerSession', n)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all duration-200"
                style={{
                  background: settings.questionsPerSession === n ? 'var(--color-primary)' : 'white',
                  color: settings.questionsPerSession === n ? 'white' : 'var(--color-dark)',
                  borderColor: settings.questionsPerSession === n ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle: Shuffle */}
        <div className="flex items-center justify-between py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <p className="text-[15px] font-medium m-0">Shuffle Questions</p>
            <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--color-secondary)' }}>Randomize question order</p>
          </div>
          <ToggleSwitch checked={settings.shuffleQuestions} onChange={v => update('shuffleQuestions', v)} />
        </div>

        {/* Toggle: Timer */}
        <div className="flex items-center justify-between py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <p className="text-[15px] font-medium m-0">Show Timer</p>
            <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--color-secondary)' }}>Display elapsed time</p>
          </div>
          <ToggleSwitch checked={settings.showTimer} onChange={v => update('showTimer', v)} />
        </div>

        {/* Toggle: Immediate Explanation */}
        <div className="flex items-center justify-between py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <p className="text-[15px] font-medium m-0">Show Explanation</p>
            <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--color-secondary)' }}>Show after each answer</p>
          </div>
          <ToggleSwitch
            checked={settings.showExplanationImmediately}
            onChange={v => update('showExplanationImmediately', v)}
          />
        </div>
      </Card>

      {/* About */}
      <Card>
        <h3 className="text-sm font-semibold m-0 mb-3" style={{ color: 'var(--color-secondary)' }}>
          ABOUT
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm">App</span>
            <span className="text-sm" style={{ color: 'var(--color-secondary)' }}>CertPrep v1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">ACSM-CPT</span>
            <span className="text-sm" style={{ color: 'var(--color-secondary)' }}>Day 01 (100q)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">CSCS</span>
            <span className="text-sm" style={{ color: 'var(--color-secondary)' }}>Program Design + Implementation (100q)</span>
          </div>
        </div>
      </Card>

      {/* Clear Data */}
      <button
        onClick={() => {
          if (confirm('Clear all progress data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
          }
        }}
        className="text-sm font-medium border-none bg-transparent cursor-pointer py-3"
        style={{ color: 'var(--color-danger)' }}
      >
        Clear All Data
      </button>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative w-[51px] h-[31px] rounded-full border-none cursor-pointer transition-colors duration-200 shrink-0"
      style={{ background: checked ? 'var(--color-success)' : '#E5E5EA' }}
    >
      <span
        className="absolute top-0.5 w-[27px] h-[27px] rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(21px)' : 'translateX(2px)' }}
      />
    </button>
  );
}
