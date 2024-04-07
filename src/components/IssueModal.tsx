import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, 
  ModalCloseButton, Button, useDisclosure, Text, Box, Badge, Flex, Stack,
  Link, useColorModeValue, HStack, Image, Divider, Tag, Input, Textarea, useToast
} from '@chakra-ui/react';

import { Issue } from "@/types/Issue"
import { reactionsIcons } from '@/utils/iconUtils';
import { formatDate, truncate } from "@/utils/stringUtils";
import { updateIssue, closeIssue } from '@/utils/issue';
import { getAccessToken } from "@/utils/githubToken";
import { error } from 'console';

interface IssueModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
  onIssueUpdated: () => void;
}

const IssueModal: React.FC<IssueModalProps> = ({ issue, isOpen, onClose, onIssueUpdated }) => {
  const token = getAccessToken();
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(issue.title);
  const [editedBody, setEditedBody] = useState(issue.body);
  const toast = useToast();

  const handleEdit = () => {
    updateIssue(token, issue.number, editedTitle, editedBody)
      .then(res => toast({
        title: 'Success!',
        description: res.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      }))
      .catch(error => toast({
        title: 'Failid!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      }))

    setEditMode(false);
    onClose();
    onIssueUpdated();
  };

  const handleDelete = () => {
    closeIssue(token, issue.number)
      .then(res => toast({
        title: 'Success!',
        description: res.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      }))
      .catch(error => toast({
        title: 'Failid!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      }))

    onClose();
    onIssueUpdated();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
      <ModalOverlay />
      <ModalContent >
        <ModalBody >
        <Flex borderWidth="1px" borderRadius="lg" overflow="hidden" w="100%" gap="12px"
          p={4} bg={useColorModeValue("white", "gray.700")} justify='space-between'>
          <Stack justify="space-between" flexGrow='1'>
            <Box>
              {editMode ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  size="lg"
                  fontWeight="bold"
                  w='100%'
                />
              ) : (
                <Link fontSize="24px" fontWeight="bold" href={issue.url}>
                  {editedTitle}
                  <Text as="span" fontSize="18px" color="gray.500">#{issue.number}</Text>
                </Link>
              )}
              {editMode ? (
                <Textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  mt={2}
                  height="150px"
                  flexGrow='1'
                />
              ) : (
                <Text flexGrow='1' mt={2} noOfLines={4} height="80px" overflow="hidden">
                  {editedBody}
                </Text>
              )}
            </Box>        
            <HStack justifySelf="start">
              {Object.entries(issue.reactions).map(([key, value]) => (
                reactionsIcons[key] && value > 0 ? 
                <Flex key={key} gap='4px' align='center' padding='2px 4px'
                  border='1px' borderRadius='2px' shadow="md">
                  {reactionsIcons[key]} {value}
                </Flex> : null
              ))}
            </HStack>
          </Stack>
          <Stack w='200px' justifySelf='start'>
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
              <Flex flexWrap="wrap">
                {issue.labels.map(label => (
                  <Tag key={label.id} ml={2} mt={2} minW='fit-content'
                    whiteSpace='nowrap'
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
            {editMode ? (
              <Button colorScheme="green" onClick={handleEdit}>保存</Button>
            ) : (
              <React.Fragment>
                <Button colorScheme="green" onClick={() => setEditMode(true)}>編輯</Button>
                <Button colorScheme="red" onClick={handleDelete}>刪除</Button>
              </React.Fragment>
            )}
            
            <Button colorScheme="blue" onClick={onClose}>關閉</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IssueModal;