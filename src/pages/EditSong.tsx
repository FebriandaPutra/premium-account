import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
  Text,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  useColorModeValue,
  Link,
  ButtonGroup,
  FormHelperText,
  color,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useParams, Link as RouterLink } from "react-router-dom";
import { axiosConfig } from "../utils/axios";
import config from "../config/config";
import axios from "axios";
import Loading from "../components/Loading";

import { getAuthData } from "../utils/auth";

function EditSong() {
  type Song = {
    title: string;
    filename: string;
  };
  const toast = useToast();
  const location = useLocation();
  const { id } = location.state;
  const [song, setSong] = useState<Song>();
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState<File | null>();
  const [loading, setIsLoading] = useState(false);
  const newAxiosInstance = axios.create(axiosConfig());
  const userId = getAuthData().userId;

  const handleChangeTitle: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(e.target.value);
  };

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAudio(e.target.files?.item(0));
  };

  useEffect(() => {
    setIsLoading(true);
    newAxiosInstance.get(`${config.REST_API_URL}/song/${id}`).then((res) => {
      setIsLoading(false);
      setSong(res.data.data);
      setTitle(res.data.data.title);
    });
  }, []);

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
    return true;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);
      const formData = new FormData();
      if (audio !== undefined) {
        formData.append("file", audio as File);
      }
      if (title !== "") {
        formData.append("title", title);
      }
      formData.append("artist_id", userId.toString());
      console.log(formData);
      newAxiosInstance
        .put(`${config.REST_API_URL}/song/${id}`, formData)
        .then((res) => {
          toast({
            title: res.data.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Loading loading={loading} />
      <Navbar children={undefined} />
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        textColor={"white"}
        bg={"#212121"}
      >
        <Box minH="100vh" bg="#212121" textColor="white" minW="100vh" pt="10">
          <Text fontSize="4xl" fontWeight="bold" textAlign="center" mx="auto">
            Edit Premium Song
          </Text>
          <Box maxW="50vh" mx="auto" mt="8vh">
            <Stack spacing={4}>
              <FormControl id="title">
                <FormLabel>Insert New Title</FormLabel>
                <Input
                  type="text"
                  bg="#FFFFFF"
                  color="black"
                  placeholder={song?.title}
                  defaultValue={song?.title}
                  border={"none"}
                  onChange={handleChangeTitle}
                />
                <FormHelperText color="white">
                  Previous Song Name: {song?.title}{" "}
                </FormHelperText>
              </FormControl>
              <FormControl id="username">
                <FormLabel>Insert New Song File</FormLabel>
                <Input
                  type="file"
                  bg="#FFFFFF"
                  placeholder="New File"
                  border={"none"}
                  color="black"
                  onChange={handleChangeFile}
                  pt="1"
                />
                <FormHelperText color="white">
                  Previous Song: {song?.filename}{" "}
                </FormHelperText>
              </FormControl>

              <ButtonGroup gap="2" ml="30vw" mr="30vw" px="25%" pt="6">
                <Link style={{ textDecoration: "none" }}>
                  <Button
                    bg="#1DB954"
                    _hover={{ bg: "#1DB954", color: "black" }}
                    onClick={handleSubmit}
                  >
                    Done
                  </Button>
                </Link>

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

export default EditSong;
