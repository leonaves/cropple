import { readdir as readdirCallback } from 'fs';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';

import GuessForm from '@/components/GuessForm';
import { NoPuzzleError } from '@/lib/errors';

const readdir = promisify(readdirCallback);

export default async function Home() {
  const maxGuesses = 6;

  const formattedDate = new Date()
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '');

  const files = await readdir(
    process.cwd() + '/public/puzzles/' + formattedDate,
  ).catch((e) => {
    throw new NoPuzzleError(e.message);
  });

  const solution = files[0].split('-')[0];

  async function guess(formData: FormData) {
    'use server';

    const guess = (formData.get('guess') as string) || '';

    if (guess === solution) {
      cookies().set('correct', 'true');
    }

    const guessesCookie = cookies().get('level')?.value || '';
    const guesses = parseInt(guessesCookie, 10) || 1;
    cookies().set('level', `${guesses + 1}`);
  }

  const level = cookies().get('level')?.value || '1';
  const correct = cookies().get('correct')?.value;

  const finished = correct || parseInt(level, 10) > maxGuesses;

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative inline-block w-[500px] text-center">
          <img
            className="inline-block"
            src={`/puzzles/${formattedDate}/${solution}-${
              finished ? '7' : level
            }.jpg`}
            height={500}
            alt=""
          />
        </div>

        {!finished && <GuessForm action={guess} />}

        {correct && (
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-2xl font-bold">You win!</h2>
            <p className="text-lg">You guessed the word!</p>
          </div>
        )}

        {finished && !correct && (
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-2xl font-bold">You lose!</h2>
            <p className="text-lg">You ran out of guesses!</p>
          </div>
        )}
      </div>
    </>
  );
}
