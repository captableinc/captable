import { UpdateStatusEnum } from "@/prisma-enums";
import { capitalize } from "lodash-es";
import { type Block } from "@blocknote/core";

export const statusValues = Object.keys(UpdateStatusEnum).map((item) => ({
  label: capitalize(item),
  value: item,
}));

export const defaultContent: Block[] = [
  {
    id: "1",
    type: "paragraph",
    props: {
      textColor: "default",
      textAlignment: "left",
      backgroundColor: "default",
    },
    content: [
      {
        text: "Hello, investors! 👋",
        type: "text",
        styles: {
          bold: true,
        },
      },
    ],
    children: [],
  },
  {
    id: "2",
    type: "paragraph",
    props: {
      textColor: "default",
      textAlignment: "left",
      backgroundColor: "default",
    },
    content: [],
    children: [],
  },
  {
    id: "3",
    type: "paragraph",
    props: {
      textColor: "default",
      textAlignment: "left",
      backgroundColor: "default",
    },
    content: [
      {
        text: "Here's a quick update on what's been happening at OpenCap this month. We're excited to share that we've hit a major milestone! Our team has been hard at work and we're proud to announce that we've successfully launched our new product feature.",
        type: "text",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "4",
    type: "paragraph",
    props: {
      textColor: "default",
      textAlignment: "left",
      backgroundColor: "default",
    },
    content: [],
    children: [],
  },
  {
    id: "5",
    type: "paragraph",
    props: {
      textColor: "default",
      textAlignment: "left",
      backgroundColor: "default",
    },
    content: [
      {
        text: "We're grateful for your continued support and we're looking forward to sharing more updates with you soon.",
        type: "text",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "6",
    type: "paragraph",
    props: {
      textColor: "default",
      textAlignment: "left",
      backgroundColor: "default",
    },
    content: [],
    children: [],
  },
  {
    id: "7",
    type: "paragraph",
    props: {
      textColor: "default",
      textAlignment: "left",
      backgroundColor: "default",
    },
    content: [
      {
        text: "Best,",
        type: "text",
        styles: {},
      },
    ],
    children: [],
  },
  {
    id: "8",
    type: "paragraph",
    props: {
      textColor: "default",
      textAlignment: "left",
      backgroundColor: "default",
    },
    content: [
      {
        text: "The OpenCap Team",
        type: "text",
        styles: {},
      },
    ],
    children: [],
  },
];
