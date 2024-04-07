import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  Box,
  Spinner,
  Flex,
  Stack,
  Link,
  useColorModeValue,
  HStack,
  Image,
  Divider,
  Tag,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Remarkable } from "remarkable";
import { useSession } from "next-auth/react";

import { Issue } from "@/types/Issue";
import { Comment } from "@/types/comment";
import { reactionsIcons } from "@/utils/iconUtils";
import { formatDate } from "@/utils/stringUtils";
import { updateIssue, closeIssue } from "@/api/issue";
import { fetchComments } from "@/api/comment";
import { getAccessToken } from "@/utils/githubToken";

interface IssueModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
  onIssueReload: () => void;
}

const EditableIssueCard = ({
  issue,
  reloadIssues,
  closeModal,
}: {
  issue: Issue;
  reloadIssues: () => void;
  closeModal: () => void;
}) => {
  const md = new Remarkable();
  const token = getAccessToken();
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(issue.title);
  const [editedBody, setEditedBody] = useState(issue.body);
  const toast = useToast();
  const { data: session } = useSession();

  const handleEdit = () => {
    if (!editedTitle) {
      toast({
        title: "Failid!",
        description: "標題不能空白",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (editedBody.length < 30) {
      toast({
        title: "Failid!",
        description: "內容⾄少需要 30 字",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    updateIssue(token, issue.number, editedTitle, editedBody)
      .then((res) =>
        toast({
          title: "Success!",
          description: res.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      )
      .catch((error) =>
        toast({
          title: "Failid!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      );

    setEditMode(false);
    setTimeout(() => reloadIssues(), 1000);
    closeModal();
  };

  const handleDelete = () => {
    closeIssue(token, issue.number)
      .then((res) =>
        toast({
          title: "Success!",
          description: res.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      )
      .catch((error) =>
        toast({
          title: "Failid!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      );

    setTimeout(() => reloadIssues(), 1000);
    closeModal();
  };

  return (
    <Flex
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      w="100%"
      gap="12px"
      p={4}
      bg={useColorModeValue("white", "gray.700")}
      justify="space-between"
    >
      <Stack justify="space-between" flexGrow="1">
        <Box>
          {editMode ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              size="lg"
              fontWeight="bold"
              w="100%"
            />
          ) : (
            <Link fontSize="24px" fontWeight="bold" href={issue.url}>
              {issue.title}
              <Text as="span" fontSize="18px" color="gray.500">
                #{issue.number}
              </Text>
            </Link>
          )}
          {editMode ? (
            <Textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              mt={2}
              height="150px"
              flexGrow="1"
            />
          ) : (
            <Text
              flexGrow="1"
              mt={2}
              noOfLines={4}
              // maxH="8px"
              overflow="hidden"
              dangerouslySetInnerHTML={{ __html: md.render(issue.body) }}
            />
          )}
        </Box>
        <HStack justifySelf="start">
          {Object.entries(issue.reactions).map(([key, value]) =>
            reactionsIcons[key] && value > 0 ? (
              <Flex
                key={key}
                gap="4px"
                align="center"
                padding="2px 4px"
                border="1px"
                borderRadius="2px"
                shadow="md"
              >
                {reactionsIcons[key]} {value}
              </Flex>
            ) : null
          )}
        </HStack>
      </Stack>
      <Stack minW="200px" justifySelf="start">
        {session && session.user.name == process.env.GITHUB_OWNER && (
          <Flex gap="12px" justify="end">
            {editMode ? (
              <React.Fragment>
                <Button colorScheme="green" onClick={handleEdit}>
                  保存
                </Button>
                <Button colorScheme="red" onClick={() => setEditMode(false)}>
                  取消
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button colorScheme="green" onClick={() => setEditMode(true)}>
                  編輯
                </Button>
                <Button colorScheme="red" onClick={handleDelete}>
                  刪除
                </Button>
              </React.Fragment>
            )}
          </Flex>
        )}
        <Stack>
          <Text>User: </Text>
          <Flex gap="10px">
            <Image
              borderRadius="full"
              boxSize="24px"
              src={issue.user.avatar_url!}
              alt={`Profile Picture for ${issue.user.name}`}
            />
            <Text>{issue.user.name}</Text>
          </Flex>
          <Divider color="black" />
        </Stack>
        <Stack>
          <Text>Label: </Text>
          <Flex flexWrap="wrap">
            {issue.labels.map((label) => (
              <Tag
                key={label.id}
                ml={2}
                mt={2}
                minW="fit-content"
                whiteSpace="nowrap"
                color="white"
                bg={`#${label.color}`}
              >
                {label.name}
              </Tag>
            ))}
          </Flex>
          <Divider color="black" />
        </Stack>
        <Stack>
          <Text>Updated Time: </Text>
          <Flex>{formatDate(issue.updated_at)}</Flex>
          <Divider color="black" />
        </Stack>
        <Stack>
          <Text>Created Time: </Text>
          <Flex>{formatDate(issue.created_at)}</Flex>
          <Divider color="black" />
        </Stack>
      </Stack>
    </Flex>
  );
};

const CommentCard = ({ comment }: { comment: Comment }) => {
  const md = new Remarkable();

  return (
    <Flex
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      w="100%"
      gap="12px"
      p={4}
      bg={useColorModeValue("white", "gray.700")}
      justify="space-between"
    >
      <Stack justify="space-between" flexGrow="1">
        <Box>
          <Text flexGrow="1" mt={2} noOfLines={4} minH="80px">
            <Link
              display="block"
              fontSize="18px"
              color="gray.500"
              href={comment.url}
            >
              [Comment#{comment.id}]
            </Link>
            <Text
              dangerouslySetInnerHTML={{ __html: md.render(comment.body) }}
            ></Text>
          </Text>
        </Box>
        <HStack justifySelf="start">
          {Object.entries(comment.reactions).map(([key, value]) =>
            reactionsIcons[key] && value > 0 ? (
              <Flex
                key={key}
                gap="4px"
                align="center"
                padding="2px 4px"
                border="1px"
                borderRadius="2px"
                shadow="md"
              >
                {reactionsIcons[key]} {value}
              </Flex>
            ) : null
          )}
        </HStack>
      </Stack>
      <Stack w="200px" justifySelf="start">
        <Stack>
          <Text>User: </Text>
          <Flex gap="10px">
            <Image
              borderRadius="full"
              boxSize="24px"
              src={comment.user.avatar_url!}
              alt={`Profile Picture for ${comment.user.name}`}
            />
            <Text>{comment.user.name}</Text>
          </Flex>
          <Divider color="black" />
        </Stack>
        <Stack>
          <Text>Updated Time: </Text>
          <Flex>{formatDate(comment.updated_at)}</Flex>
          <Divider color="black" />
        </Stack>
        <Stack>
          <Text>Created Time: </Text>
          <Flex>{formatDate(comment.created_at)}</Flex>
          <Divider color="black" />
        </Stack>
      </Stack>
    </Flex>
  );
};

const IssueModal: React.FC<IssueModalProps> = ({
  issue,
  isOpen,
  onClose,
  onIssueReload,
}) => {
  const token = getAccessToken();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Separate effect for handling modal opening actions
  useEffect(() => {
    const loadComments = async () => {
      if (!isOpen) return; // Only proceed if the modal is open
      setIsLoading(true);
      try {
        const newComments = await fetchComments(token, issue.number);
        setComments(newComments);
      } catch (error) {
        console.error("Failed to load comments:", error);
        // Optionally, handle the error, e.g., show a toast notification
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [isOpen, issue.number, token]); // Depend on isOpen to control fetch initiation

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <EditableIssueCard
            issue={issue}
            reloadIssues={onIssueReload}
            closeModal={onClose}
          />
          {isLoading ? (
            <Spinner />
          ) : (
            comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <Box h="20px" w="3px" ml="100px" bg="gray" />
                <CommentCard comment={comment} />
              </React.Fragment>
            ))
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default IssueModal;
