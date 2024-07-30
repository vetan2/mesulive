"use server";

import { signIn as _signIn } from "~/entities/auth/index";

export const signIn = async () => _signIn("google");
