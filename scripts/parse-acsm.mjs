import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const md = readFileSync(
  process.env.HOME + '/.openclaw/workspace/ACSM-CPT/Day-01-Energy-Systems-Quiz.md',
  'utf-8'
);

let currentPart = 'General';
const partRegex = /^## 📦 (Part \d+)｜(.+?)（題.+）$/;
const questionRegex = /^\*\*(\d+)\.\*\*\s+(.+)/;
const optionRegex = /^([A-D])\)\s+(.+)/;
const correctRegex = /\*\*正確答案：([A-D])\*\*/;
const explanationRegex = /\*\*中文詳解：\*\*\s*/;
const tipRegex = /\*\*考點提示：\*\*\s*/;

const lines = md.split('\n');
const questions = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  // Check for part header
  const partMatch = line.match(partRegex);
  if (partMatch) {
    currentPart = partMatch[2].trim();
    i++;
    continue;
  }

  // Check for question
  const qMatch = line.match(questionRegex);
  if (qMatch) {
    const id = parseInt(qMatch[1]);
    let questionText = qMatch[2].trim();

    // Collect multi-line question text until we hit options
    i++;
    while (i < lines.length && !lines[i].match(optionRegex)) {
      const trimmed = lines[i].trim();
      if (trimmed) questionText += ' ' + trimmed;
      i++;
    }

    // Parse options
    const options = {};
    while (i < lines.length) {
      const optMatch = lines[i].match(optionRegex);
      if (optMatch) {
        options[optMatch[1]] = optMatch[2].trim();
        i++;
      } else {
        break;
      }
    }

    // Find correct answer in details block
    let correct = '';
    let explanation = '';
    let examTip = '';

    while (i < lines.length && !lines[i].match(/^\*\*\d+\.\*\*/)) {
      const cMatch = lines[i].match(correctRegex);
      if (cMatch) {
        correct = cMatch[1];
      }

      if (lines[i].match(explanationRegex)) {
        // Collect explanation lines
        const expStart = lines[i].replace(explanationRegex, '').trim();
        const expLines = expStart ? [expStart] : [];
        i++;
        while (i < lines.length && !lines[i].match(tipRegex) && !lines[i].match(/^<\/details>/) && !lines[i].match(/^\*\*\d+\.\*\*/) && !lines[i].match(partRegex)) {
          const t = lines[i].trim();
          if (t && t !== '---') expLines.push(t);
          i++;
        }
        explanation = expLines.join(' ').trim();
        continue;
      }

      if (lines[i].match(tipRegex)) {
        const tipStart = lines[i].replace(tipRegex, '').trim();
        const tipLines = tipStart ? [tipStart] : [];
        i++;
        while (i < lines.length && !lines[i].match(/^<\/details>/) && !lines[i].match(/^\*\*\d+\.\*\*/) && !lines[i].match(partRegex)) {
          const t = lines[i].trim();
          if (t && t !== '---' && t !== '</details>') tipLines.push(t);
          i++;
        }
        examTip = tipLines.join(' ').trim();
        continue;
      }

      i++;
    }

    if (correct && options.A && options.B && options.C && options.D) {
      questions.push({
        id,
        question: questionText,
        options: { A: options.A, B: options.B, C: options.C, D: options.D },
        correct,
        explanation: explanation || 'No explanation provided.',
        examTip: examTip || '',
        topic: 'acsm-day01',
        part: currentPart,
      });
    }
    continue;
  }

  i++;
}

console.log(`Parsed ${questions.length} questions`);

// Generate TypeScript file
const ts = `import type { Question } from './types';

export const acsmDay01Questions: Question[] = ${JSON.stringify(questions, null, 2).replace(/"correct": "([A-D])"/g, '"correct": \'$1\' as const').replace(/"([A-D])":/g, '$1:')};
`;

// Fix the output to use proper TS syntax
const fixedTs = `import type { Question } from './types';

export const acsmDay01Questions: Question[] = [
${questions.map(q => `  {
    id: ${q.id},
    question: ${JSON.stringify(q.question)},
    options: { A: ${JSON.stringify(q.options.A)}, B: ${JSON.stringify(q.options.B)}, C: ${JSON.stringify(q.options.C)}, D: ${JSON.stringify(q.options.D)} },
    correct: '${q.correct}',
    explanation: ${JSON.stringify(q.explanation)},
    examTip: ${JSON.stringify(q.examTip)},
    topic: 'acsm-day01',
    part: ${JSON.stringify(q.part)},
  }`).join(',\n')}
];
`;

mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/acsm-day01.ts', fixedTs);
console.log('Written to src/data/acsm-day01.ts');
