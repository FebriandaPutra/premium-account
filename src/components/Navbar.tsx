import React, { ReactNode } from "react";
import premiumLogo from "../assets/binotifylogo.svg";

// function Navbar() {
//   return (
//     <div>Ceritanya Ini Navbar</div>
//   )
// }

// export default Navbar
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
  Button,
  useToast,
} from "@chakra-ui/react";

import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";

import { getUsername, getIsAdmin } from "../utils/auth";

import { IconType } from "react-icons";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome },
  { name: "Song Management", icon: FiCompass },
  { name: "Subscription Requests", icon: FiStar },
];

export default function Navbar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box bg={useColorModeValue("#212121", "gray.900")}>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box p="0">{children}</Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

// SIDE NAVBAR
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("black", "gray.900")}
      textColor={useColorModeValue("white", "gray.200")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={premiumLogo} alt="logo" />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "#1DB954",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

// HEADER NAVBAR
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const username = getUsername();
  const isAdmin = getIsAdmin();
  const toast = useToast();
  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "You have been logged out",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    navigate("/");
  };
  const navigate = useNavigate();
  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("#121212", "gray.800")}
      textColor={useColorModeValue("white", "gray.200")}
      justifyContent={{ base: "space-between" }}
      {...rest}
    >
      <Image src={premiumLogo} alt="logo" height="7vh" />

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s">
              <HStack>
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="2px"
                  ml="2"
                >
                  <Text fontSize="sm">Hello, {username}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {isAdmin ? "Admin" : "Singer"}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
          </Menu>
        </Flex>
        <Button
          colorScheme="#212121"
          variant="outline"
          _hover={{
            bg: "#FF0052",
            color: "black",
          }}
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </HStack>
    </Flex>
  );
};
