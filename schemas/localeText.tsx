// schemas/localeText.tsx
import React from "react";
import { defineType, defineArrayMember } from "sanity";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { TextAlignDecorator } from "./components/TextAlignDecorator";

export default defineType({
  name: "localeText",
  title: "Locale rich text",
  type: "object",
  fields: [
    {
      name: "en",
      title: "English",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            decorators: [
              {
                title: "Left",
                value: "align-left",
                icon: AlignLeft,
                component: (p: any) => (
                  <TextAlignDecorator align="left">{p.children}</TextAlignDecorator>
                ),
              },
              {
                title: "Center",
                value: "align-center",
                icon: AlignCenter,
                component: (p: any) => (
                  <TextAlignDecorator align="center">{p.children}</TextAlignDecorator>
                ),
              },
              {
                title: "Right",
                value: "align-right",
                icon: AlignRight,
                component: (p: any) => (
                  <TextAlignDecorator align="right">{p.children}</TextAlignDecorator>
                ),
              },
              {
                title: "Justify",
                value: "align-justify",
                icon: AlignJustify,
                component: (p: any) => (
                  <TextAlignDecorator align="justify">{p.children}</TextAlignDecorator>
                ),
              },
            ],
          },
        }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
    },
    {
      name: "pl",
      title: "Polski",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            decorators: [
              {
                title: "Left",
                value: "align-left",
                icon: AlignLeft,
                component: (p: any) => (
                  <TextAlignDecorator align="left">{p.children}</TextAlignDecorator>
                ),
              },
              {
                title: "Center",
                value: "align-center",
                icon: AlignCenter,
                component: (p: any) => (
                  <TextAlignDecorator align="center">{p.children}</TextAlignDecorator>
                ),
              },
              {
                title: "Right",
                value: "align-right",
                icon: AlignRight,
                component: (p: any) => (
                  <TextAlignDecorator align="right">{p.children}</TextAlignDecorator>
                ),
              },
              {
                title: "Justify",
                value: "align-justify",
                icon: AlignJustify,
                component: (p: any) => (
                  <TextAlignDecorator align="justify">{p.children}</TextAlignDecorator>
                ),
              },
            ],
          },
        }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
    },
  ],
});