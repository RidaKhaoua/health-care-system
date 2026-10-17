import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

function page() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <SignIn />
      </Suspense>
    </div>
  );
}

export default page;
