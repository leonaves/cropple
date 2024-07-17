"use client";
import { useState } from "react";
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function GuessForm({
  action,
}: {
  action: (payload: FormData) => Promise<FormData | void>;
}) {
  const [guessState, setGuessState] = useState("");

  const { pending } = useFormStatus();

  return (
    <form
      action={async (payload) => {
        setGuessState("");
        return action(payload);
      }}
      className="flex space-x-2"
    >
      <input
        className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900
              focus:border-blue-500 focus:ring-blue-500
              dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
              dark:focus:border-blue-500 dark:focus:ring-blue-500"
        type="text"
        name="guess"
        value={guessState}
        onChange={(e) => setGuessState(e.target.value)}
      />
      <button
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white
              hover:bg-blue-800
              focus:outline-none focus:ring-4 focus:ring-blue-300
              dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="submit"
      >
        Guess
      </button>
    </form>
  );
}
