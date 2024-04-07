import React from "react";
import { FaThumbsUp, FaSadTear, FaHeart, FaSurprise, FaEye, FaLaugh, FaRocket } from "react-icons/fa";

// 将reactions映射到相应的图标
export const reactionsIcons: { [key: string]: JSX.Element | undefined } = {
  "+1": <FaThumbsUp />,
  "-1": <FaSadTear />,
  laugh: <FaLaugh />,
  hooray: <FaRocket />,
  confused: <FaSurprise />,
  heart: <FaHeart />,
  eyes: <FaEye />,
};