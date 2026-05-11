import React from 'react';
import { Github } from 'lucide-react';

import { EngineerCard } from '@/components/EngineerCard';
import { ENGINEERS } from '@/constants/engineers';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 pt-12 pb-6 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our Best Engineers
          </h1>

          <p className="mb-6 text-lg leading-relaxed text-gray-600">
            A passionate group of engineers building the future of technology.
            Reach out - we're always happy to connect.
          </p>

          <div className="flex flex-col items-center gap-1">
            <a
              href="https://github.com/UA-5399-React/client"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base text-gray-700 transition hover:text-blue-600"
            >
              <Github size={18} strokeWidth={1.75} />
              Frontend
            </a>
            <a
              href="https://github.com/UA-5399-React/backend"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base text-gray-700 transition hover:text-blue-600"
            >
              <Github size={18} strokeWidth={1.75} />
              Backend
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-14">
          {ENGINEERS.map((engineer) => (
            <div key={engineer.id} className="w-40 sm:w-48 md:w-56">
              {' '}
              <EngineerCard
                name={engineer.name}
                photoUrl={engineer.photoUrl}
                email={engineer.email}
                linkedin={engineer.linkedin}
                github={engineer.github}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
