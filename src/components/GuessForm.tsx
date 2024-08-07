'use client';
import { useState } from 'react';
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function GuessForm({
  action,
}: {
  action: (payload: FormData) => Promise<FormData | void>;
}) {
  const [guessState, setGuessState] = useState('');

  const { pending } = useFormStatus();

  return (
    <form
      action={async (payload) => {
        setGuessState('');
        return action(payload);
      }}
      className="flex space-x-2"
    >
      <Input
        type="text"
        name="guess"
        value={guessState}
        placeholder="Guess"
        onChange={(e) => setGuessState(e.target.value)}
      />
      <Button type="submit">Guess</Button>
    </form>
  );
}
