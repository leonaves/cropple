import Image from "next/image";
import { cookies } from "next/headers";
import { Amatic_SC } from "next/font/google";

import GuessForm from "@/components/GuessForm";

const titleFont = Amatic_SC({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const maxGuesses = 4;

  async function guess(formData: FormData) {
    "use server";

    const guess = (formData.get("guess") as string) || "";

    if (guess === "clock") {
      cookies().set("correct", "true");
    }

    const guessesCookie = cookies().get("level")?.value || "";
    const guesses = parseInt(guessesCookie, 10) || 0;
    cookies().set("level", `${guesses + 1}`);
  }

  const level = cookies().get("level")?.value || "0";
  const correct = cookies().get("correct")?.value;

  const finished = correct || parseInt(level, 10) > maxGuesses;

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <h1 className={`p-3 text-6xl ${titleFont.className}`}>Cropple</h1>

        <div className="relative h-64 w-64 bg-blue-500">
          <Image
            className="absolute left-0 top-0 h-full w-full object-cover"
            src={`/img-${finished ? "final" : level}.png`}
            width={500}
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
