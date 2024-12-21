// app/goals/page.tsx
import { CheckCircle, Circle } from 'lucide-react';
import { Indie_Flower } from 'next/font/google';

const indieFlower = Indie_Flower({ subsets: ['latin'], weight: '400' });

const GoalsPage: React.FC = () => {
  const goals = [
    { id: 0, text: 'Master DeepLearning and AI', completed: false },
    { id: 1, text: 'Learn Rust programming language', completed: false },
    { id: 2, text: 'Learn Pytorch', completed: false },
    { id: 4, text: 'Read one book per month', completed: false },
    { id: 20, text: 'Contribute to an open-source project', completed: false },

    { id: 96, text: 'Start a blog', completed: true },
    { id: 98, text: 'Create a personal website', completed: true },
    { id: 99, text: 'Start a side project', completed: true },
    { id: 100, text: 'Run a 5k', completed: true },
  ];

  return (
    <div
      className={`${indieFlower.className} min-h-screen   text-white flex justify-center items-center p-8`}
    >
      <div className=" p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl md:text-4xl text-center mb-6 animate-pulse">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            My Goals
          </span>{' '}
        </h1>
        <ul className="space-y-4">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className={`flex items-center space-x-4 p-3 rounded-md transition-colors duration-200 cursor-pointer ${goal.completed} group`}
            >
              <span className="flex-shrink-0">
                {goal.completed ? (
                  <CheckCircle className="text-green-400" size={20} />
                ) : (
                  <Circle className="text-gray-400" size={20} />
                )}
              </span>
              <span
                className={`text-lg group-hover:underline transition-all duration-200 ${
                  goal.completed ? 'line-through opacity-70' : ''
                }`}
              >
                {goal.text}
              </span>
            </li>
          ))}
        </ul>
        {goals.every((goal) => goal.completed) && (
          <div className="mt-8 text-center">
            <p className="text-sm  animate-bounce">
              🎉 All goals achieved! Time for new ones?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
