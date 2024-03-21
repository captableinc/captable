"use client";

import { useState } from "react";
import { type Block } from "@blocknote/core";
import { dayjsExt } from "@/common/dayjs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownButton } from "@/components/ui/dropdown-button";

import "@blocknote/react/style.css";
import "@/styles/editor.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";

type UpdatesEditorProps = {
  publicId?: string;
};

const UpdatesEditor = ({ publicId }: UpdatesEditorProps) => {
  const date = new Date();
  const formattedDate = dayjsExt(date).format("MMM-YY");

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [html, setHtml] = useState<string>("");
  const editor = useCreateBlockNote({
    initialContent: [
      {
        id: "a210d1fa-6d2d-4abf-86ca-32c68b4717ba",
        type: "heading",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
          level: 2,
        },
        content: [
          {
            type: "text",
            text: "This is a heading block",
            styles: {},
          },
        ],
        children: [],
      },
      {
        id: "78f93cf7-523d-4883-98b7-96c9e9c4a6df",
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: "This is a ",
            styles: {},
          },
          {
            type: "link",
            href: "hello.com",
            content: [
              {
                type: "text",
                text: "paragraph",
                styles: {},
              },
            ],
          },
          {
            type: "text",
            text: " block This is a paragraph blockThis is a paragraph block This is a paragraph blockThis is a paragraph block This is a paragraph blockThis is a paragraph block This is a paragraph blockThis is a paragraph block This is a paragraph blockThis is a paragraph block This is a paragraph block",
            styles: {},
          },
        ],
        children: [],
      },
      {
        id: "403de322-a4f6-4198-a3df-5c670ac8cb3e",
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [],
        children: [],
      },
    ],
  });

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-2">
        <div className="gap-y-3">
          <div className="flex w-full font-medium">
            <Badge variant="warning" className="mr-2">
              Draft
            </Badge>
            <span className="h4">Updates / </span>
            <input
              required
              type="text"
              className="h4 bg-transparent px-2 text-gray-500 outline-none focus:ring-0 focus:ring-offset-0	"
              placeholder={`Investor update: ${formattedDate}`}
            />
          </div>

          <p className="ml-[60px] min-h-5 text-sm text-muted-foreground">
            Last saves 2 days ago
          </p>
        </div>

        <div>
          <DropdownButton buttonText="Save and continue">
            <ul>
              <li>
                <Button variant="ghost" size="sm">
                  Save as draft
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm">
                  Send to stakeholders
                </Button>
              </li>
            </ul>
          </DropdownButton>
        </div>
      </div>

      <Card className="mx-auto mt-3 min-h-[80vh] w-[28rem] sm:w-[38rem] md:w-full	">
        <BlockNoteView
          className="py-5"
          editor={editor}
          theme="light"
          onChange={async () => {
            setBlocks(editor.document);
            const html = await editor.blocksToHTMLLossy(editor.document);
            setHtml(html);
          }}
        />
      </Card>
    </div>
  );
};

export default UpdatesEditor;
