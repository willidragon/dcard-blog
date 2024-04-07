import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, Text, Badge, Stack, HStack, VStack, Image, Flex, Button,
  Tag, SimpleGrid, Spinner, useColorModeValue, useDisclosure, Link, Divider
} from "@chakra-ui/react";
import { FaThumbsUp, FaGrin, FaSadTear, FaHeart, FaSurprise, FaEye, FaLaugh, FaRocket } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

import IssueModal from "./IssueModal";
import { Issue } from "@/types/Issue"
import { fetchIssues } from "@/utils/issue";
import { getAccessToken } from "@/utils/githubToken";
import { formatDate, truncate } from "@/utils/stringUtils";
import { reactionsIcons } from '@/utils/iconUtils';

const IssueCard = ({ issue, reloadIssues }: { 
  issue: Issue,
  reloadIssues: () => void
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" w="100%" cursor="pointer"
      p={4} bg={useColorModeValue("white", "gray.700")} onClick={onOpen}>
      <Flex justify="space-between" align="center">
        <Text fontSize="24px" fontWeight="bold">
          {issue.title} <Text as="span" fontSize="18px" color="gray.500">#{issue.number}</Text>
        </Text>
        <Box>
          {issue.labels.map(label => (
            <Tag key={label.id} ml={2} color="white" bg={`#${label.color}`}>
              {label.name}
            </Tag>
          ))}
        </Box>
      </Flex>
      <Text mt={2} noOfLines={4} height="80px" overflow="hidden">
        {truncate(issue.body, 200)}
      </Text>
      <Flex mt={4} justify="space-between" alignItems="center">
        <HStack>
          {Object.entries(issue.reactions).map(([key, value]) => (
            reactionsIcons[key] && value > 0 ? 
            <Flex key={key} gap='4px' align='center' padding='2px 4px'
              border='1px' borderRadius='2px' shadow="md">
              {reactionsIcons[key]} {value}
            </Flex> : null
          ))}
        </HStack>
        <Text fontSize="sm">Updated at {formatDate(issue.updated_at)}</Text>
      </Flex>
      <IssueModal issue={issue} isOpen={isOpen} 
        onClose={onClose} onIssueUpdated={reloadIssues}
      />
    </Box>
  );
};

const InfiniteIssuesList = () => {
  const token = getAccessToken();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const loadMoreIssues = useCallback(async () => {
    if (loading || !hasMore) 
      return;

    setLoading(true);
    const newIssues = await fetchIssues(token, page);
    setIssues((prev) => [...prev, ...newIssues]);
    setPage((prev) => prev + 1);
    setLoading(false);

    if (newIssues.length < 10) 
      setHasMore(false);
  }, [page, loading, hasMore, issues.length]);

  const reloadIssues = async () => {
    setLoading(true);
    setPage(1);
    const newIssues = await fetchIssues(token, 1); // 重新从第一页开始加载
    setIssues(newIssues);
    setLoading(false);
    setHasMore(newIssues.length === 10); // 假设每页有10条，如果少于10条则说明没有更多数据
  };

  useEffect(() => {
    if (hasMore && inView) loadMoreIssues();
  }, [inView]);

  return (
    <VStack spacing="16px" padding="32px">
      {issues.map(issue => (
        <IssueCard key={issue.id} issue={issue} reloadIssues={reloadIssues}/>
      ))}
      <Box ref={ref}>
        {hasMore ? 
          loading && <Spinner /> : 
          <Text>No more posts</Text>
        }
      </Box>
    </VStack>
  );
};

export default InfiniteIssuesList;
