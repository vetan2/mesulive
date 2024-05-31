import { Link } from "@nextui-org/react";

import { S } from "~/shared/ui";

export const Footer = () => {
  return (
    <footer className="mx-auto mt-14 flex flex-col items-center">
      <Link href="https://toss.me/vetan2" target="_blank" rel="noreferrer">
        <S.Button size="lg" color="primary" className="font-semibold">
          제작자에게 커피 사주기
        </S.Button>
      </Link>
      <p className="mt-3 text-center text-sm text-default-400">
        Copyright 2022~ mesulive All rights reserved.
        <br />
        mesulive is not associated with NEXON Korea.
        <br />
        Contact: help@mesu.live
      </p>
    </footer>
  );
};
