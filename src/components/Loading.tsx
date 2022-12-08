import { Modal, ModalContent, ModalOverlay, Spinner } from "@chakra-ui/react";
import React from "react";

type LoadingProps = {
  loading: boolean
}

const Loading = ({loading}: LoadingProps) => {
  return (
    <>
      <Modal
        isOpen={loading}
        onClose={() => {}}
        size="xs"
        scrollBehavior="inside"
        isCentered={true}
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent
          bg={"0"}
          shadow="none"
          alignContent={"center"}
          justifyContent={"center"}
          alignItems={"center"}
          justifyItems={"center"}
          display={"flex"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </ModalContent>
      </Modal>
    </>
  );
}

export default Loading;
