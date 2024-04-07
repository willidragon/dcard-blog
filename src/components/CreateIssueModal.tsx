import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, 
  ModalCloseButton, Button, useDisclosure, Text, Box, Spinner, Flex, Stack,
  Link, useColorModeValue, HStack, Image, Divider, Tag, Input, Textarea, useToast
} from '@chakra-ui/react';
import { Remarkable } from 'remarkable';

import { Issue } from "@/types/Issue";
import { createIssue } from '@/api/issue';
import { getAccessToken } from "@/utils/githubToken";

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateIssueModal: React.FC<IssueModalProps> = ({ isOpen, onClose }) => {
  const token = getAccessToken();
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const toast = useToast();

  const handleCreate = () => {
    if(!editedTitle) {
      toast({
        title: 'Failid!',
        description: '標題不能空白',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return;
    }
    if(editedBody.length < 30) {
      toast({
        title: 'Failid!',
        description: '內容⾄少需要 30 字',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return;
    }

    createIssue(token, editedTitle, editedBody)
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

    setTimeout(() => location.reload(), 1000);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
      <ModalOverlay />
      <ModalContent >
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody >
          <Flex borderWidth="1px" borderRadius="lg" overflow="hidden" w="100%" gap="12px"
            p={4} bg={useColorModeValue("white", "gray.700")} justify='space-between'>
            <Stack justify="space-between" flexGrow='1'>
              <Box>
                <Text fontSize='18px'>Title: </Text>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  size="lg"
                  fontWeight="bold"
                  w='100%'
                />
              </Box>
              <Box>
                <Text fontSize='18px'>Content: </Text>
                <Textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  mt={2}
                  height="150px"
                  flexGrow='1'
                />
              </Box>
            </Stack>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex gap='12px'>
            <Button colorScheme="green" onClick={handleCreate}>創建</Button>
            <Button colorScheme="red" onClick={onClose}>取消</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateIssueModal;