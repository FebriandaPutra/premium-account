import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

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
  TableContainer,
  Select,
  Button,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";

import { colors } from "../theme";

import config from "../config/config";
import { axiosConfig, axiosInstance } from "../utils/axios";
import axios from "axios";
import Loading from "../components/Loading";

interface Users {
  no: number;
  subscriber_id: number;
  artistName: string;
  status: string;
  artistId: number;
}

const initialUsers: Users[] = [];

function Subscription() {
  const toast = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [page, setPage] = useState(1);
  const [loading, setIsLoading] = useState(false);
  const newAxiosInstance = axios.create(axiosConfig());

  useEffect(() => {
    setIsLoading(true);
    newAxiosInstance
      .get(`${config.REST_API_URL}/subscription?page=${page}`)
      .then((res) => {
        const userData: Users[] = res.data.data.map((user: any) => {
          return {
            no: res.data.data.indexOf(user) + 1,
            subscriber_id: user.subscriber_id,
            artistName: user.artist_name,
            status: user.status,
            artistId: user.creator_id,
          };
        });
        setUsers(userData);
        setIsLoading(false);
      });
  }, [page, users.length]);

  const handleNextPage = (e: any) => {
    setPage(page + 1);
  };

  const handlePrevPage = (e: any) => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleAccept = (creator_id: number, subscriber_id: number) => {
    setIsLoading(true);
    newAxiosInstance
      .put(`${config.REST_API_URL}/subscription/update`, {
        creator_id: creator_id,
        subscriber_id: subscriber_id,
        status: "ACCEPTED",
      })
      .then((res) => {
        toast({
          title: "Success",
          description: "Subscription accepted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUsers(
          users.map((user) => {
            if (
              user.artistId === creator_id &&
              user.subscriber_id === subscriber_id
            ) {
              user.status = "ACCEPTED";
            }
            return user;
          })
        );
        setIsLoading(false);
      })
      .catch((err: any) => {
        toast({
          title: "Error",
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      });
  };

  const handleReject = (creator_id: number, subscriber_id: number) => {
    setIsLoading(true);
    newAxiosInstance
      .put(`${config.REST_API_URL}/subscription/update`, {
        creator_id: creator_id,
        subscriber_id: subscriber_id,
        status: "REJECTED",
      })
      .then((res) => {
        toast({
          title: "Success",
          description: "Subscription rejected successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUsers(
          users.map((user) => {
            if (
              user.artistId === creator_id &&
              user.subscriber_id === subscriber_id
            ) {
              user.status = "REJECTED";
            }
            return user;
          })
        );
        setIsLoading(false);
      })
      .catch((err: any) => {
        toast({
          title: "Error",
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      <Loading loading={loading} />
      <Navbar children={undefined} />
      <Box minH="100vh" bg="#212121" textColor="white" p={"10"}>
        <Text fontSize="4xl" fontWeight="bold" textAlign="center" pb="10">
          Subscription Requests
        </Text>
        <TableContainer px="10">
          <Table variant="striped" colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th color="white">No</Th>
                <Th color="white">User ID</Th>
                <Th color="white">Artist Name</Th>
                <Th color="white">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => {
                return (
                  <Tr key={user.no}>
                    <Td>{user.no}</Td>
                    <Td>{user.subscriber_id}</Td>
                    <Td>{user.artistName}</Td>
                    <Td>
                      {user.status === "PENDING" ? (
                        <ButtonGroup gap="2">
                          <Button
                            bg={colors.primaryColor}
                            _hover={{
                              bg: colors.white,
                              color: "black",
                            }}
                            onClick={() => {
                              handleAccept(user.artistId, user.subscriber_id);
                            }}
                          >
                            Accept
                          </Button>

                          <Button
                            bg={colors.red}
                            _hover={{
                              bg: colors.white,
                              color: "black",
                            }}
                            onClick={() => {
                              handleReject(user.artistId, user.subscriber_id);
                            }}
                          >
                            Reject
                          </Button>
                        </ButtonGroup>
                      ) : (
                        user.status
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Box textAlign="center" py="10">
          <ButtonGroup gap="2">
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

export default Subscription;
