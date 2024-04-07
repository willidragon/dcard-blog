import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, 
  ModalCloseButton, Button, useDisclosure, Text, Box, Badge, Flex, Stack,
  Link, useColorModeValue, HStack, Image, Divider, Tag
} from '@chakra-ui/react';

import { Issue } from "@/types/Issue"
import { reactionsIcons } from '@/utils/iconUtils';
import { formatDate, truncate } from "@/utils/stringUtils";

interface IssueModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
}

const IssueModal: React.FC<IssueModalProps> = ({ issue, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
      <ModalOverlay />
      <ModalContent >
        <ModalBody >
        <Flex borderWidth="1px" borderRadius="lg" overflow="hidden" w="100%" gap="12px"
          p={4} bg={useColorModeValue("white", "gray.700")} justify='space-between'>
          <Stack justify="space-between">
            <Box>
              <Flex justify="space-between" align="center">
                <Link fontSize="24px" fontWeight="bold" href={issue.url}>
                  {issue.title} 
                  <Text as="span" fontSize="18px" color="gray.500">#{issue.number}</Text>
                </Link>
              </Flex>
              <Text mt={2} noOfLines={4} height="80px" overflow="hidden">
                {issue.body}
              </Text>
            </Box>        
            <HStack justifySelf='end' alignSelf='end' justify="space-between" alignItems="center">
              {Object.entries(issue.reactions).map(([key, value]) => (
                reactionsIcons[key] && value > 0 ? 
                <Flex key={key} gap='4px' align='center' padding='2px 4px'
                  border='1px' borderRadius='2px' shadow="md">
                  {reactionsIcons[key]} {value}
                </Flex> : null
              ))}
            </HStack>
          </Stack>
          <Stack w='200px'>
            <Stack>
              <Text>User: </Text>
              <Flex gap='10px'>
                <Image
                  borderRadius='full'
                  boxSize='24px'
                  src={issue.user.avatar_url!}
                  alt={`Profile Picture for ${issue.user.name}`}
                />
                <Text>{issue.user.name}</Text>
              </Flex>
              <Divider color='black' />
            </Stack>
            <Stack>
              <Text>Label: </Text>
              <Flex>
                {issue.labels.map(label => (
                  <Tag key={label.id} ml={2} w='fit-content'
                    color="white" bg={`#${label.color}`}>
                    {label.name}
                  </Tag>
                ))}
              </Flex>
              <Divider color='black' />
            </Stack>
            <Stack>
              <Text>Updated Time: </Text>
              <Flex>
                {formatDate(issue.updated_at)}
              </Flex>
              <Divider color='black' />
            </Stack>
            <Stack>
              <Text>Created Time: </Text>
              <Flex>
                {formatDate(issue.created_at)}
              </Flex>
              <Divider color='black' />
            </Stack>
          </Stack>
        </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex gap='12px'>
            <Button colorScheme="green" onClick={onClose}>編輯</Button>
            <Button colorScheme="red" onClick={onClose}>刪除</Button>
            <Button colorScheme="blue" onClick={onClose}>關閉</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IssueModal;