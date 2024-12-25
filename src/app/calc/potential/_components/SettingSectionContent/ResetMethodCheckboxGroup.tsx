"use client";

import { useMolecule } from "bunshi/react";
import { useAtomValue, useSetAtom } from "jotai";
import NextImage from "next/image";
import { match } from "ts-pattern";

import { PotentialCalcMolecule } from "~/app/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  className?: string;
}

export const ResetMethodCheckboxGroup = ({ className }: Props) => {
  const potentialCalcMolecule = useMolecule(PotentialCalcMolecule);
  const {
    resetMethodsAtom,
    addResetMethodAtom,
    removeResetMethodAtom,
    aimTypeAtom,
    gradeAtom,
    typeAtom,
    // cubePriceSettingModalOpen,
  } = potentialCalcMolecule;
  const resetMethods = useAtomValue(resetMethodsAtom);
  const aimType = useAtomValue(aimTypeAtom);
  const grade = useAtomValue(gradeAtom);
  const type = useAtomValue(typeAtom);

  const addResetMethod = useSetAtom(addResetMethodAtom);
  const removeResetMethod = useSetAtom(removeResetMethodAtom);
  // const setCubePriceSettingModalOpen = useSetAtom(cubePriceSettingModalOpen);

  return (
    <>
      <S.CheckboxGroup
        label={
          <div className="md:md-0 mb-1">
            재설정 수단(복수 선택 가능)
            {/* <S.Button
              size="sm"
              color="primary"
              className="block h-6 md:ml-2 md:inline"
              variant="flat"
              onPress={() => {
                setCubePriceSettingModalOpen(true);
              }}
            >
              큐브 가격 설정
            </S.Button> */}
          </div>
        }
        className={cx(className)}
        classNames={{
          wrapper: cx("w-fit gap-3 md:grid md:grid-cols-2 md:gap-4"),
        }}
        size="sm"
        value={resetMethods}
      >
        {Potential.resetMethods.map((method) => (
          <S.Checkbox
            key={method}
            value={method}
            onValueChange={(selected) => {
              if (selected) {
                addResetMethod(method);
                return;
              }

              removeResetMethod(method);
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
        {/* <CubePriceSettingModal /> */}
      </S.CheckboxGroup>
    </>
  );
};
