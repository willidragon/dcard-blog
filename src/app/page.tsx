"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';

import InfiniteIssuesList from '@/components/InfiniteIssuesList';
import Navbar from "@/components/Navbar";

export default function Home() {

  return (
    <ChakraProvider>
      <Navbar />
      <InfiniteIssuesList />
    </ChakraProvider>
  );
}
