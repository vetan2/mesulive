import { ModalBody, ModalContent } from "@nextui-org/react";
import { type ComponentProps, type ReactNode } from "react";

import { cx } from "~/shared/style";
import { type S } from "~/shared/ui";
import { Modal } from "~/shared/ui/Modal";
import { ModalHeader } from "~/shared/ui/ModalHeader";

interface Props
  extends Omit<ComponentProps<typeof S.Modal>, "children" | "title"> {
  title?: ReactNode;
  children: ReactNode;
  modalHeaderProps?: ComponentProps<typeof ModalHeader>;
  modalBodyProps?: Omit<ComponentProps<typeof ModalBody>, "children">;
}

export const DefaultModal = ({
  children,
  title,
  size,
  modalHeaderProps,
  modalBodyProps,
  ...props
}: Props) => {
  return (
    <Modal size={size ?? "sm"} {...props}>
      <ModalContent className="flex flex-col">
        {title && <ModalHeader {...modalHeaderProps}>{title}</ModalHeader>}
        <ModalBody
          {...modalBodyProps}
          className={cx(
            "flex items-center gap-4 pb-6 text-default-600",
            modalBodyProps?.className,
          )}
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
