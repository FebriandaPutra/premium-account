import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Text,
  useColorModeValue,
  Link,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { axiosInstance } from "../utils/axios";
import { AxiosError } from "axios";
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Loading from "../components/Loading";

function Register() {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [usernameError, setUsernameError] = useState(
    "Username must be alphanumeric or underscore"
  );
  const handleShowClick = () => setShowPassword(!showPassword);
  const navigate = useNavigate();

  const handleChangeName: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setName(e.target.value);
  };

  const handleChangeUsername: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    checkUsername(e.target.value);
    setUsername(e.target.value);
  };

  const handleChangeEmail: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(e.target.value);
  };

  const handleChangePassword: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmation: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmation(e.target.value);
  };

  const validateName = () => {
    if (name.length > 2) {
      return true;
    } else {
      return false;
    }
  };
  const validateUsername = () =>
    username.length > 0 &&
    username.match(/^[a-z0-9][a-z0-9\d]*(?:_[a-z0-9\d]+)*$/i);
  const validateEmail = () =>
    email.length > 0 &&
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  const validatePassword = () => password.length > 7;
  const validateConfirmation = () => confirmation === password;

  const checkUsername = (s: string) => {
    axiosInstance
      .get(`/username?username=${s}`)
      .then((res) => {
        if (res.data.data as boolean) {
          setUsernameTaken(true);
          setUsernameError("Username already taken");
        } else {
          setUsernameTaken(false);
          setUsernameError("Username must be alphanumeric or underscore");
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };
  const validate = () => {
    if (
      validateName() &&
      validateUsername() &&
      validateEmail() &&
      validatePassword() &&
      validateConfirmation() &&
      !usernameTaken
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  useEffect(() => validate(), [name, username, email, password, confirmation, usernameTaken]);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/register", {
        username: username.toLowerCase(),
        password: password,
        email: email.toLowerCase(),
        name: name,
      });
      if (response.status === 200) {
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
        navigate("/login");
      }
      else {
        toast({
          title: "Error.",
          description: "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      const err = error as AxiosError;
      if (err.response?.status === 401) {
        console.log("Register Failed");
      } else {
        console.log("Another Error");
      }
    }
  };

  return (
    <>
      <Loading loading={loading} />
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        textColor={"white"}
        bg={useColorModeValue("#121212", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} minW={"md"} py={8} px={6}>
          <Stack align={"center"}>
            <Text fontSize={"5xl"} color={"white"} py={8}>
              Binotify Premium
            </Text>
            <Text fontSize={"lg"} color={"white"}>
              Sign up for free to start uploading music
            </Text>
          </Stack>

          <Box>
            <Stack spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Insert your name</FormLabel>
                <Input
                  type="text"
                  bg="#212121"
                  placeholder="Enter your name."
                  border={"none"}
                  onChange={handleChangeName}
                />
                {name && !validateName() && (
                  <Text color="red.400" fontSize="xs">
                    Name must be alphanumeric
                  </Text>
                )}
              </FormControl>
              <FormControl id="username" isRequired>
                <FormLabel>Create a username</FormLabel>
                <Input
                  type="text"
                  bg="#212121"
                  placeholder="Enter your username."
                  border={"none"}
                  onChange={handleChangeUsername}
                />
                {username && (!validateUsername() || usernameTaken) && (
                  <Text color="red.400" fontSize="xs">
                    {usernameError}
                  </Text>
                )}
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>What's your email?</FormLabel>
                <Input
                  type="text"
                  bg="#212121"
                  placeholder="Enter your email."
                  border={"none"}
                  onChange={handleChangeEmail}
                />
                {email && !validateEmail() && (
                  <Text color="red.400" fontSize="xs">
                    Invalid email.
                  </Text>
                )}
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Create a Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    bg="#212121"
                    placeholder="Enter your password"
                    border={"none"}
                    onChange={handleChangePassword}
                  />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={handleShowClick}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {password && !validatePassword() && (
                  <Text color="red.400" fontSize="xs">
                    Password must have 8 characters or more.
                  </Text>
                )}
              </FormControl>

              <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Your Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    bg="#212121"
                    placeholder="Enter your password"
                    border={"none"}
                    onChange={handleChangeConfirmation}
                  />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={handleShowClick}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {confirmation && !validateConfirmation() && (
                  <Text color="red.400" fontSize="xs">
                    Password doesn't match.
                  </Text>
                )}
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  borderRadius={"22px"}
                  size="lg"
                  bg={"#1DB954"}
                  color={"#121212"}
                  _hover={{ bg: "#169844" }}
                  onClick={handleRegister}
                  disabled={isDisabled}
                >
                  Sign Up
                </Button>
              </Stack>

              <Stack pt={6}>
                <Text align={"center"}>
                  Have an account?{" "}
                  <RouterLink to={{"pathname":"/login"}} color={"#1DB954"} >
                    Log In
                  </RouterLink>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export default Register;
