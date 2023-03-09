import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div>
      <button onClick={() => signIn("discord")}>Sign in with Discord</button>
    </div>
  );
}
