"use client";

import { ServerCrash } from "lucide-react";
import { overlay } from "overlay-kit";
import { useEffect } from "react";
import { createQuery } from "react-query-kit";

import { S } from "~/shared/ui";

import { getPotentialGradeUpRecord, getPotentialOptionTable } from "./actions";

export const useOptionTable = createQuery({
  queryKey: ["potential", "optionTable"],
  fetcher: (variables: Parameters<typeof getPotentialOptionTable>[0]) =>
    getPotentialOptionTable(variables),
  use: [
    (useQueryNext) => (options) => {
      const result = useQueryNext(options);

      useEffect(() => {
        if (result.isError) {
          overlay.open(({ close, isOpen, unmount }) => (
            <S.Modal onClose={close} isOpen={isOpen} onExit={unmount}>
              <S.ModalContent>
                <S.ModalHeader className="text-red-500">
                  <ServerCrash />
                  <p className="ml-2">서버 오류</p>
                </S.ModalHeader>
                <S.ModalBody className="text-center">
                  잠재능력 데이터를 불러오는데 실패했습니다.
                  <br />
                  같은 문제가 계속 발생한다면 페이지를 새로고침해주세요.
                </S.ModalBody>
                <S.ModalFooter />
              </S.ModalContent>
            </S.Modal>
          ));
        }
      }, [result.isError]);

      return result;
    },
  ],
});

export const useGradeUpRecord = createQuery({
  queryKey: ["potential", "gradeUpRecord"],
  fetcher: (variables: Parameters<typeof getPotentialGradeUpRecord>[0]) =>
    getPotentialGradeUpRecord(variables),
  use: [
    (useQueryNext) => (options) => {
      const result = useQueryNext(options);

      useEffect(() => {
        if (result.isError) {
          overlay.open(({ close, isOpen, unmount }) => (
            <S.Modal onClose={close} isOpen={isOpen} onExit={unmount}>
              <S.ModalContent>
                <S.ModalHeader className="text-red-500">
                  <ServerCrash />
                  <p className="ml-2">서버 오류</p>
                </S.ModalHeader>
                <S.ModalBody className="text-center">
                  잠재능력 데이터를 불러오는데 실패했습니다.
                  <br />
                  같은 문제가 계속 발생한다면 페이지를 새로고침해주세요.
                </S.ModalBody>
                <S.ModalFooter />
              </S.ModalContent>
            </S.Modal>
          ));
        }
      }, [result.isError]);

      return result;
    },
  ],
});

export const PotentialQueries = {
  useOptionTable,
  useGradeUpRecord,
};
