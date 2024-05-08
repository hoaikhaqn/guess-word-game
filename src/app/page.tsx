import MainMenu from "@/components/templates/MainMenu";
import MessegerFB from "@/lib/messenger";

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col justify-center container items-center gap-10">
      <div className="mb-10 text-center">
        <h1 className="text-5xl mb-5 font-bold text-foreground uppercase">Guess words</h1>
        <span className="text-4xl px-3 py-1 font-bold text-white uppercase bg-foreground rounded-xl">The game</span>
      </div>
      <MainMenu/>
      <MessegerFB />
    </main>
  )
}
