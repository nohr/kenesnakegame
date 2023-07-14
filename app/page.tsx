import Snake from "./snake";

export const metadata = {
  title: "keneandfriends",
  description: "keneandfriends",
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <Snake />
    </main>
  );
}
