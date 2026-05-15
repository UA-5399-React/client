import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

import type Engineer from '@/types/engineer.types'; // Шлях може відрізнятися залежно від налаштувань

export type EngineerCardProps = Omit<Engineer, 'id'>;

export const EngineerCard: React.FC<EngineerCardProps> = ({
  name,
  photoUrl,
  email,
  linkedin,
  github,
}) => {
  return (
    <div className="group flex cursor-pointer flex-col items-center text-center">
      <div className="mb-5 aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl dark:bg-gray-800">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-3xl font-bold text-gray-300">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {name}
        </h3>
      </div>

      <div className="flex items-center gap-3 text-gray-400">
        {email && (
          <a
            href={`mailto:${email}`}
            aria-label={`Email ${name}`}
            className="transition-colors duration-200 hover:-translate-y-0.5 hover:text-blue-500"
          >
            <Mail size={20} strokeWidth={2} />
          </a>
        )}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} on LinkedIn`}
            className="transition-colors duration-200 hover:-translate-y-0.5 hover:text-blue-600"
          >
            <Linkedin size={20} strokeWidth={2} />
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} on GitHub`}
            className="transition-colors duration-200 hover:-translate-y-0.5 hover:text-gray-900"
          >
            <Github size={20} strokeWidth={2} />
          </a>
        )}
      </div>
    </div>
  );
};
