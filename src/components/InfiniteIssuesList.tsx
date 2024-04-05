import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, Badge, Stack, HStack, VStack, Spacer, 
  Tag, SimpleGrid, Spinner, useColorModeValue, Flex } from "@chakra-ui/react";
import { FaThumbsUp, FaGrin, FaSadTear, FaHeart, FaSurprise, FaEye, FaLaugh, FaRocket } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

import { fetchIssues } from "@/utils/issue";
import { Issue } from "@/types/Issue"
import { getAccessToken } from "@/utils/githubToken";

const IssueCard = ({ issue }: { issue: Issue }) => {
  // 格式化时间显示
  const formatDate = (dateString: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return dateString.toLocaleDateString(undefined, options);
  };

  // 截断长文本
  const truncate = (str: string, length = 100, ending = "...") => {
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };

  // 将reactions映射到相应的图标
  const reactionsIcons: { [key: string]: JSX.Element | undefined } = {
    "+1": <FaThumbsUp />,
    "-1": <FaSadTear />,
    laugh: <FaLaugh />,
    hooray: <FaRocket />,
    confused: <FaSurprise />,
    heart: <FaHeart />,
    eyes: <FaEye />,
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" w="100%" p={4} bg={useColorModeValue("white", "gray.700")}>
      <Flex justify="space-between" align="center">
        <Text fontSize="24px" fontWeight="bold">
          [Issue#{issue.number}] {issue.title}
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
        <Spacer />
        <Text fontSize="sm">Updated at {formatDate(issue.updated_at)}</Text>
      </Flex>
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
    console.log(newIssues);
    setIssues((prev) => [...prev, ...newIssues]);
    setPage((prev) => prev + 1);
    setLoading(false);

    if (newIssues.length < 10) 
      setHasMore(false);
  }, [page, loading, hasMore, issues.length]);

  useEffect(() => {
    if (hasMore && inView) loadMoreIssues();
  }, [inView]);

  return (
    <VStack spacing="16px" padding="32px">
      {issues.map(issue => (
        <IssueCard key={issue.id} issue={issue}/>
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
