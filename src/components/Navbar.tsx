import { Box, Flex, Button, Image, Link, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const bg = useColorModeValue('blue.500', 'gray.800');
  const color = useColorModeValue('white', 'gray.200');

  return (
    <Box bg={bg} color={color} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <NextLink href="/" passHref>
            <Link _hover={{ textDecoration: 'none' }} fontWeight="bold">
              Github Issue Blog
            </Link>
          </NextLink>
        </Box>
        <Flex alignItems={'center'}>
          {!session ? (
            <Button onClick={() => signIn("github")} colorScheme="teal" size="sm">
              Login With GitHub
            </Button>
          ) : (
            <Flex gap={2} align="center">
              <NextLink href="/post/create" passHref>
                <Button as={Link} colorScheme="pink" size="sm">
                  Create Post
                </Button>
              </NextLink>
              <Image
                borderRadius='full'
                boxSize='40px'
                src={session.user.image!}
                alt={`Profile Picture for ${session.user.name}`}
              />
              <Button onClick={() => signOut({ callbackUrl: "/" })} colorScheme="red" size="sm">
                Logout
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
