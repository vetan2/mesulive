import { Link } from "@nextui-org/react";

import { Button } from "~/shared/ui";

export const Footer = () => {
  return (
    <footer className="mx-auto my-14 flex flex-col items-center">
      <Link
        href="https://open.kakao.com/me/kurate"
        target="_blank"
        rel="noreferrer"
      >
        <Button size="lg" color="primary" className="font-semibold">
          제작자에게 커피 사주기
        </Button>
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
