import { auth } from "~/entities/auth";
import { ImmediatelySignIn } from "~/features/sign-in";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <ImmediatelySignIn provider="google" />;
  }

  return <>어드민 페이지</>;
}
