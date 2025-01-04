import { Input, ModalBody, ModalContent, SelectItem } from "@nextui-org/react";
import { useMolecule } from "bunshi/react";
import { identity, pipe } from "fp-ts/lib/function";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import NextImage from "next/image";
import { type ComponentProps } from "react";

import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { currencyUnitLabels, currencyUnits } from "~/entities/game";
import { Potential } from "~/entities/potential";
import { E } from "~/shared/fp";
import { entries } from "~/shared/object";
import { cx } from "~/shared/style";
import { Modal, ModalHeader, Select } from "~/shared/ui";

type Props = Omit<
  ComponentProps<typeof Modal>,
  "children" | "isOpen" | "onClose" | "onExit"
>;

export const CubePriceSettingModal = ({ ...props }: Props) => {
  const { cubePricesAtom, setCubePriceAtom, cubePriceSettingModalOpen } =
    useMolecule(PotentialCalcMolecule);
  const cubePrices = useAtomValue(cubePricesAtom);
  const setCubePrice = useSetAtom(setCubePriceAtom);
  const [isOpen, setIsOpen] = useAtom(cubePriceSettingModalOpen);

  return (
    <Modal
      {...props}
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <ModalContent>
        <ModalHeader>큐브 가격 설정</ModalHeader>
        <ModalBody className="flex flex-col gap-4 pb-6">
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
                <Input
                  size="sm"
                  className="flex-[2]"
                  value={price.input}
                  onValueChange={(value) => {
                    setCubePrice(cube, { priceInput: value });
                  }}
                  description="빈칸이면 0으로 계산됩니다."
                  isInvalid={E.isLeft(price.value)}
                  errorMessage={pipe(
                    price.value,
                    E.match(identity, () => ""),
                  )}
                  aria-label={Potential.resetMethodLabels[cube]}
                />
                <Select
                  size="sm"
                  className="flex-1"
                  selectedKeys={[unit]}
                  onChange={(e) => {
                    setCubePrice(cube, { unitInput: e.target.value });
                  }}
                  aria-label={Potential.resetMethodLabels[cube]}
                >
                  {currencyUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {currencyUnitLabels[unit]}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
