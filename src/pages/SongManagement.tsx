import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import playIcon from "../assets/play-white.png";

import {
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Image,
  Link,
  TableContainer,
  Flex,
  Spacer,
  ButtonGroup,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { axiosConfig } from "../utils/axios";
import { getUserId } from "../utils/auth";
import { FiTrash } from "react-icons/fi";
import config from "../config/config";
import axios from "axios";
import Loading from "../components/Loading";
import { colors } from "../theme";
import { Link as RouterLink } from "react-router-dom";

function SongManagement() {
  type Songs = {
    no: number;
    song_id: number;
    title: string;
    artist_id: number;
    audio_path: string;
  };

  const initialSongs: Songs[] = [];
  const [loading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState(initialSongs);
  const [page, setPage] = useState(1);
  const [length, setLength] = useState(0);
  const newAxiosInstance = axios.create(axiosConfig());
  const userId = getUserId();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<null>(null);
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
    newAxiosInstance
      .get(`${config.REST_API_URL}/songlist/${userId}?page=${page}`)
      .then((res) => {
        const songData: Songs[] = res.data.data.songList.map((song: any) => {
          return {
            no: res.data.data.songList.indexOf(song) + 1,
            song_id: song.songId,
            title: song.title,
            artist_id: song.artist_id,
            audio_path: song.audio_path,
          };
        });
        setSongs(songData);
        setIsLoading(false);
      });
  }, [page, length]);

  const handleNextPage = (e: any) => {
    setPage(page + 1);
  };

  const handlePrevPage = (e: any) => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleDeletion = async (songId: number) => {
    setIsLoading(true);
    newAxiosInstance
      .delete(`${config.REST_API_URL}/song/${songId}`)
      .then((res) => {
        console.log(res);
        toast({
          title: "Song deleted.",
          description: "Song has been deleted successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
        })
        setLength(length - 1);
      });
    setIsLoading(false);
  };

  /*
  useEffect(() => {
    try {
      const userId = getUserId();
      const getSongs = async () => {
        const response = await axiosInstance.get(
          "songlist/" + userId.toString() + "?page=" + page.toString()
        );
        setSongs(response.data.data.songList);
        console.log(response.data.page);
      };
      getSongs();
    } catch (err) {
      console.log(err);
    }
  }, []);
  */

  return (
    <>
      <Loading loading={loading} />
      <Navbar children={undefined} />
      <Box minH="100vh" bg="#212121" textColor="white" p={'10'}>
        <Flex minWidth="max-content" alignItems="center" gap="2" pr="10">
          <Text
            fontSize="4xl"
            fontWeight="bold"
            textAlign="left"
            ml="10"
            mb="10"
          >
            Manage Songs
          </Text>
          <Spacer />
          <ButtonGroup gap="2">
            <RouterLink to={{ pathname: "/add-song" }}>
              <Button
                colorScheme="#212121"
                variant="outline"
                _hover={{ bg: "#1DB954", color: "black" }}
              >
                Add Songs
              </Button>
            </RouterLink>
            {/*
            <Link href="/delete-song" style={{ textDecoration: "none" }}>
              <Button
                colorScheme="#212121"
                variant="outline"
                _hover={{
                  bg: "#FF0052",
                  color: "black",
                }}
              >
                Delete Songs
              </Button>
            </Link>
              */}
          </ButtonGroup>
        </Flex>

        <TableContainer px="10">
          <Table variant="striped" colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th color="white">#</Th>
                <Th color="white">Title</Th>
                <Th color="white"></Th>
                <Th color="white"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {songs.length > 0 &&
                songs.map((item) => {
                  return (
                    <Tr key={item.song_id}>
                      <Td>{item.no}</Td>
                      <Td>{item.title}</Td>
                      <Td>
                        <RouterLink
                          to={{ pathname: "/edit-song" }}
                          state={{ id: item.song_id }}
                        >
                          Edit
                        </RouterLink>
                      </Td>
                      <Td>
                        <FiTrash onClick={() => handleDeletion(item.song_id)} />
                        {/* <FiTrash onClick={onOpen} />
                        
                        <AlertDialog
                          isOpen={isOpen}
                          leastDestructiveRef={cancelRef}
                          onClose={onClose}
                        >
                          <AlertDialogOverlay>
                            <AlertDialogContent>
                              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Delete Song
                              </AlertDialogHeader>

                              <AlertDialogBody>
                                Are you sure? You can't undo this action afterwards.
                              </AlertDialogBody>

                              <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                  Cancel
                                </Button>
                                <Button colorScheme='red' onClick={() => handleDeletion(item.song_id)} ml={3}>
                                  Delete
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialogOverlay>
                        </AlertDialog> */}

                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
        <Box textAlign="center" py="10">
          <ButtonGroup gap="2">
            {page > 1 && (
              <Button
                bg={colors.primaryColor}
                _hover={{
                  bg: colors.white,
                  color: "black",
                }}
                onClick={handlePrevPage}
              >
                Prev
              </Button>
            )}

            <Button
              bg={colors.primaryColor}
              _hover={{
                bg: colors.white,
                color: "black",
              }}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  );
}

export default SongManagement;
