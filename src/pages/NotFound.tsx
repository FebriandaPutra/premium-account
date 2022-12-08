import binongung from "../assets/binongung.webp";
import { Flex, Stack, Text, useColorModeValue, Image } from "@chakra-ui/react";

function NotFound() {
  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        textColor={"white"}
        bg={useColorModeValue("#121212", "gray.800")}
      >
        <Stack align={"center"}>
          <Image src={binongung} alt="logo" mb={8} />
          <Text fontSize={"lg"} color={"white"}>
            Sorry, the page you are looking for doesn't exist
          </Text>
        </Stack>
      </Flex>
    </>
  );
}

export default NotFound;
