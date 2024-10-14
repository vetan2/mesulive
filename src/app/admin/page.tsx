import { auth } from "~/entities/auth";
import { ImmediatelySignIn } from "~/features/sign-in";

import { TestButton } from "./TestButton";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <ImmediatelySignIn provider="google" />;
  }

  return (
    <div>
      <p>어드민 페이지</p>
      <TestButton />
    </div>
  );
}
