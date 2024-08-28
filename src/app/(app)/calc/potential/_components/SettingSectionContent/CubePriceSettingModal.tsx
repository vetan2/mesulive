import { useSelector } from "@xstate/react";
import { identity, pipe } from "fp-ts/lib/function";
import NextImage from "next/image";
import { type ComponentProps } from "react";
import { type ActorRefFrom } from "xstate";

import { type potentialInputMachine } from "~/app/(app)/calc/potential/_lib/machines/potentialInputMachine";
import { currencyUnitLabels, currencyUnits } from "~/entities/game";
import { Potential } from "~/entities/potential";
import { E } from "~/shared/fp";
import { entries } from "~/shared/object";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props extends Omit<ComponentProps<typeof S.Modal>, "children"> {
  inputActorRef: ActorRefFrom<typeof potentialInputMachine>;
}

export const CubePriceSettingModal = ({ inputActorRef, ...props }: Props) => {
  const cubePrices = useSelector(
    inputActorRef,
    ({ context }) => context.cubePrices,
  );

  return (
    <S.Modal {...props}>
      <S.ModalContent>
        <S.ModalHeader>큐브 가격 설정</S.ModalHeader>
        <S.ModalBody className="flex flex-col gap-4 pb-6">
          {entries(cubePrices).map(([cube, { price, unit }]) => (
            <div key={cube}>
              <p
                className={cx(
                  "text-sm",
                  Potential.resetMethodColorClassNames[cube].text,
                )}
              >
                <NextImage
                  src={Potential.resetMethodImages[cube]}
                  height="18"
                  alt={Potential.resetMethodLabels[cube]}
                  className="mr-1 inline"
                />
                {Potential.resetMethodLabels[cube]}
              </p>
              <div className="mt-2 flex items-start gap-2">
                <S.Input
                  size="sm"
                  className="flex-[2]"
                  value={price.input}
                  onValueChange={(value) => {
                    inputActorRef.send({
                      type: "SET_CUBE_PRICE",
                      cube,
                      price: value,
                    });
                  }}
                  description="빈칸이면 0으로 계산됩니다."
                  isInvalid={E.isLeft(price.value)}
                  errorMessage={pipe(
                    price.value,
                    E.match(identity, () => ""),
                  )}
                />
                <S.Select
                  size="sm"
                  className="flex-1"
                  selectedKeys={[unit]}
                  onChange={(e) => {
                    inputActorRef.send({
                      type: "SET_CUBE_PRICE",
                      cube,
                      unit: e.target.value,
                    });
                  }}
                >
                  {currencyUnits.map((unit) => (
                    <S.SelectItem key={unit} value={unit}>
                      {currencyUnitLabels[unit]}
                    </S.SelectItem>
                  ))}
                </S.Select>
              </div>
            </div>
          ))}
        </S.ModalBody>
      </S.ModalContent>
    </S.Modal>
  );
};
