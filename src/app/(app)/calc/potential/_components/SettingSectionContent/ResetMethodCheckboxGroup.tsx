"use client";

import { useSelector } from "@xstate/react";
import NextImage from "next/image";
import { overlay } from "overlay-kit";
import { match } from "ts-pattern";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { Potential } from "~/entities/potential";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

import { CubePriceSettingModal } from "./CubePriceSettingModal";

interface Props {
  className?: string;
}

export const ResetMethodCheckboxGroup = ({ className }: Props) => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );

  const input = useSelector(
    inputActorRef,
    ({ context }) => context.resetMethods,
  );
  const aimType = useSelector(inputActorRef, ({ context }) => context.aimType);
  const grade = useSelector(inputActorRef, ({ context }) => context.grade);
  const type = useSelector(inputActorRef, ({ context }) => context.type);

  const disabled = useSelector(
    inputActorRef,
    ({ value }) => value === "locked",
  );

  return (
    <S.CheckboxGroup
      label={
        <div className="md:md-0 mb-1">
          재설정 수단(복수 선택 가능)
          <S.Button
            size="sm"
            color="primary"
            className="block h-6 md:ml-2 md:inline"
            variant="flat"
            onClick={() => {
              overlay.open(({ isOpen, unmount, close }) => (
                <CubePriceSettingModal
                  inputActorRef={inputActorRef}
                  isOpen={isOpen}
                  onClose={close}
                  onExit={unmount}
                />
              ));
            }}
          >
            큐브 가격 설정
          </S.Button>
        </div>
      }
      isDisabled={disabled}
      className={cx(className)}
      classNames={{
        wrapper: cx("w-fit gap-3 md:grid md:grid-cols-2 md:gap-4"),
      }}
      size="sm"
      value={input}
    >
      {Potential.resetMethods.map((method) => (
        <S.Checkbox
          key={method}
          value={method}
          onValueChange={(selected) => {
            if (selected) {
              inputActorRef.send({
                type: "ADD_RESET_METHOD",
                value: method,
              });
              return;
            }

            inputActorRef.send({
              type: "REMOVE_RESET_METHOD",
              value: method,
            });
          }}
          classNames={{
            label: cx(
              match(method)
                .with("ADDI", () =>
                  cx("group-data-[selected=true]:text-addiCube"),
                )
                .with("ADDI_POTENTIAL", () =>
                  cx("group-data-[selected=true]:text-addiPotential"),
                )
                .with("ARTISAN", () =>
                  cx("group-data-[selected=true]:text-artisanCube"),
                )
                .with("MASTER", () =>
                  cx("group-data-[selected=true]:text-masterCube"),
                )
                .with("POTENTIAL", () =>
                  cx("group-data-[selected=true]:text-potential"),
                )
                .with("RED", () =>
                  cx("group-data-[selected=true]:text-redCube"),
                )
                .with("STRANGE", () =>
                  cx("group-data-[selected=true]:text-strangeCube"),
                )
                .with("STRANGE_ADDI", () =>
                  cx("group-data-[selected=true]:text-strangeAddiCube"),
                )
                .otherwise(() => ""),
            ),
            wrapper: cx(
              match(method)
                .with("ADDI", () => cx("after:bg-addiCube"))
                .with("ADDI_POTENTIAL", () => cx("after:bg-addiPotential"))
                .with("ARTISAN", () => cx("after:bg-artisanCube"))
                .with("MASTER", () => cx("after:bg-masterCube"))
                .with("POTENTIAL", () => cx("after:bg-potential"))
                .with("RED", () => cx("after:bg-redCube"))
                .with("STRANGE", () => cx("after:bg-strangeCube"))
                .with("STRANGE_ADDI", () => cx("after:bg-strangeAddiCube"))
                .otherwise(() => ""),
            ),
          }}
          isDisabled={
            disabled ||
            !Potential.getIsResetMethodEnable({
              resetMethod: method,
              type,
              aimType,
              grade,
            })
          }
        >
          <div className="flex items-center gap-1">
            <NextImage
              src={Potential.resetMethodImages[method]}
              width={20}
              alt={Potential.resetMethodLabels[method]}
            />
            <p>{Potential.resetMethodLabels[method]}</p>
          </div>
        </S.Checkbox>
      ))}
    </S.CheckboxGroup>
  );
};
