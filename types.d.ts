declare module "*.svg" {
  import { type FC, type SVGProps } from "react";
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module "next/link" {
  import NextLink from "next/link";
  export default NextLink;
}

declare module "next/image" {
  import NextImage from "next/image";
  export default NextImage;
}
