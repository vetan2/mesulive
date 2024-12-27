import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import { z } from "zod";

import { Reboot } from "~/shared/assets/images";
import { loggingIdentity } from "~/shared/function";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

const idResponseSchema = z.object({
  ocid: z.string(),
});

const characterResponseSchema = z.object({
  // eslint-disable-next-line camelcase
  character_image: z.string(),
});

export const DeveloperProfile = async () => {
  const imageSrc = await fetch(
    `https://open.api.nexon.com/maplestory/v1/id?${new URLSearchParams({
      // eslint-disable-next-line camelcase
      character_name: "쿠라테",
    })}`,
    {
      headers: { "x-nxopen-api-key": process.env.NEXON_OPEN_API_KEY! },
      cache: "force-cache",
      next: { revalidate: 86400 },
    },
  )
    .then((res) => res.json())
    .then(loggingIdentity("ocid"))
    .then(idResponseSchema.parse)
    .then(({ ocid }) =>
      fetch(
        `https://open.api.nexon.com/maplestory/v1/character/basic?${new URLSearchParams(
          {
            ocid,
          },
        )}`,
        {
          headers: { "x-nxopen-api-key": process.env.NEXON_OPEN_API_KEY! },
          cache: "force-cache",
          next: { revalidate: 86400 },
        },
      ),
    )
    .then((res) => res.json())
    .then(characterResponseSchema.parse)
    // eslint-disable-next-line camelcase
    .then(({ character_image }) => character_image);

  return (
    <S.Link
      href="https://maple.gg/u/%EC%BF%A0%EB%9D%BC%ED%85%8C"
      target="_blank"
      rel="noreferrer"
      className="flex-col text-sm"
      color="foreground"
    >
      <Image
        src={imageSrc}
        alt="제작자"
        classNames={{ img: cx("pixelated") }}
      />
      <div className="flex items-center">
        <p>제작자: 쿠라테</p>
        <NextImage src={Reboot} alt="리부트" className="ml-1 mt-0.5" />
      </div>
    </S.Link>
  );
};
