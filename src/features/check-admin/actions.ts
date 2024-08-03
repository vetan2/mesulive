import { flow, pipe } from "fp-ts/lib/function";

import { auth } from "~/entities/auth";
import { getAllowedEmails } from "~/entities/auth/utils";
import { E, O, TE } from "~/shared/fp";

export const checkAdmin = pipe(
  TE.tryCatch(
    () =>
      auth().then(
        flow(
          O.fromNullable,
          O.chain((session) => O.fromNullable(session.user)),
        ),
      ),
    E.toError,
  ),
  TE.chain(TE.fromOption(() => new Error("No user found"))),
  TE.filterOrElse(
    (user) => !!user.email && getAllowedEmails().includes(user.email),
    () => new Error("Not allowed"),
  ),
);
