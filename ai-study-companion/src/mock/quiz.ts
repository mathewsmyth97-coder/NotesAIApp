export const mockQuiz = [
  {
    id: '1',
    question: 'Which concept allows an inner function to access variables from an outer function?',
    options: ['Memoization', 'Lexical scoping', 'Inheritance', 'Debouncing'],
    correctAnswer: 'Lexical scoping',
    explanation: 'Closures work because JavaScript functions retain access to their lexical environment.',
  },
  {
    id: '2',
    question: 'Which use case commonly relies on closures?',
    options: ['CSS resets', 'Factory functions', 'Image compression', 'Static site export'],
    correctAnswer: 'Factory functions',
    explanation: 'Factory functions often use closures to hold private state.',
  },
]