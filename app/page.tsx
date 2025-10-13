import Signup from "./signup/page";
// Ana sayfa (form burada, paket param yakalanır)
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex items-center min-h-screen justify-center bg-white dark:bg-zinc-950 gap-4 ">
      <div className="flex w-full flex-col gap-6 items-center justify-center">
        {/* <Link
          href="https://moydus.com"
          className="flex items-center gap-2 self-center text-white font-medium"
        >
          <div className="bg-[#0000] text-white flex size-6 items-center justify-center rounded-md">

     
            <Logo width={50} height={50} />
          </div>
          Moy
        </Link> */}

        {/* <div className="w-full flex items-center justify-center">
          <Dene />
        </div> */}
        <Signup />
      </div>
    </div>
  );
}
