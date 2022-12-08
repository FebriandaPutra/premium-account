import React from "react";
import Navbar from "../components/Navbar";

import {
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Slide,
  Button,
  Link,
  ButtonGroup,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  CloseButton,
  useDisclosure,
  useToast,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { axiosConfig } from "../utils/axios";
import { getUserId } from "../utils/auth";
import axios from "axios";
import config from "../config/config";
import Loading from "../components/Loading";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

function AddSong() {
  const [loading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState<File | null>();
  const newAxiosInstance = axios.create(axiosConfig());
  const toast = useToast();
  const userId = getUserId();
  const navigate = useNavigate();
  const handleChangeTitle: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(e.target.value);
    console.log("hi");
    console.log(title);
  };

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAudio(e.target.files?.item(0));
  };

  const validate = () => {
    if (title === "") {
      toast({
        title: "Title is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (audio === undefined) {
      toast({
        title: "Audio is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleCloseAlert = async () => {
    setShowAlert(false);
    navigate("/song-management");
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", audio as File);
      formData.append("title", title);
      formData.append("artist_id", userId.toString());
      console.log(formData);
      newAxiosInstance
        .post(`${config.REST_API_URL}/song`, formData)
        .then((res) => {
          // console.log(res);
          // setShowAlert(true);
          toast({
            title: res.data.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: err.response.data.includes("mp3")
              ? "File must be mp3"
              : err.response.data,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar children={undefined} />
      {showAlert && (
        <Alert
          status="success"
          variant="subtle"
          // flexDirection='column'
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="80px"
        >
          <AlertIcon />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your song has been added.</AlertDescription>
          <CloseButton
            alignSelf="flex-end"
            position={"absolute"}
            right={-1}
            top={-1}
            onClick={handleCloseAlert}
          />
        </Alert>
      )}

      <Loading loading={loading} />
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        textColor={"white"}
        bg={"#212121"}
      >
        <Box minH="100vh" bg="#212121" textColor="white" minW="100vh">
          <Text
            fontSize="4xl"
            fontWeight="bold"
            textAlign="center"
            mx={"auto"}
            pt="10"
          >
            Add Premium Song
          </Text>
          <Box maxW="50vh" mx="auto" mt="8vh">
            <Stack spacing={4}>
              <FormControl id="title" isRequired>
                <FormLabel>Insert Title</FormLabel>
                <Input
                  type="text"
                  bg="#FFFFFF"
                  placeholder="Enter song title."
                  border={"none"}
                  color="black"
                  onChange={handleChangeTitle}
                />
              </FormControl>
              <FormControl id="song-file" isRequired>
                <FormLabel>Insert Song</FormLabel>
                <Input
                  type="file"
                  bg="#FFFFFF"
                  placeholder="Enter your email."
                  color="black"
                  border={"none"}
                  pt="1"
                  onChange={handleChangeFile}
                />
              </FormControl>

              <ButtonGroup gap="2" ml="30vw" mr="30vw" px="25%" pt="6">
                {/* <Link href="/song-management" style={{ textDecoration: "none" }}> */}
                <Button
                  bg="#1DB954"
                  _hover={{ bg: "#1DB954", color: "black" }}
                  onClick={handleSubmit}
                >
                  Add
                </Button>
                {/* </Link> */}
                <RouterLink to={{ pathname: "/song-management" }}>
                  <Button
                    colorScheme="#212121"
                    variant="outline"
                    _hover={{ bg: "#7D7575", color: "black" }}
                  >
                    Cancel
                  </Button>
                </RouterLink>
              </ButtonGroup>
            </Stack>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default AddSong;
