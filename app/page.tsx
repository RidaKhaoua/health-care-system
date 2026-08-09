import { Button } from "@/components/ui/button";
import { getRoles } from "@/utils/roles";

import { Show, SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";


async function Home() {
  const { userId } = await auth();
  const role = await getRoles();

  
  return (
    <div className="min-h-screen  flex flex-col justify-end max-md:px-4">
      <div className="space-y-3  h-150 flex flex-col justify-between py-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-center space-y-2">
            Welcome to
            <br />
            <span className="text-blue-500 text-5xl  block mt-4">
              Health Care System
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-4 text-center">
            Manage your hospital operations, patients, and more with our
            powerful hospital management system.
          </p>
          <div className="flex items-center justify-center gap-2 mt-8">
            <Show when={"signed-out"}>
              <Link href="/sign-up">
                <Button variant="secondary" className="cursor-pointer">
                  New Patient
                </Button>
              </Link>

              <Link href="/sign-in">
                <Button variant="link" className="cursor-pointer">
                  Login to account
                </Button>
              </Link>
            </Show>
            <Show when={"signed-in"}>
              <Link href={`/${role}`}>
                <Button variant={"secondary"} className={"cursor-pointer"}>
                  Dashboard
                </Button>
              </Link>
              <SignOutButton />
            </Show>
          </div>
        </div>
        <footer className="text-center mt-8 ">
          <p>&copy; 2026 Health Care System. All right reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
