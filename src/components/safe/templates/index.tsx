import { StyleSheet, Text } from "@react-pdf/renderer";

// https://www.ycombinator.com/documents
import PostMoneyCap from "./post-money/cap";
import PostMoneyDiscount from "./post-money/discount";
import PostMoneyMfn from "./post-money/mfn";
import ProRataLetter from "./post-money/pro-rata-letter";

// https://web.archive.org/web/20180628214544/https://www.ycombinator.com/documents
import PreMoneyCap from "./pre-money/cap";
import PreMoneyCapDiscount from "./pre-money/cap-and-discount";
import PreMoneyDiscount from "./pre-money/discount";
import PreMoneyMfn from "./pre-money/mfn";

export const style = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    fontSize: 10,
    color: "#030712",
    fontFamily: "Times-Roman",
  },

  textSm: {
    fontSize: 8,
  },

  title: {
    fontSize: 12,
  },

  upcase: {
    textTransform: "uppercase",
  },

  center: {
    textAlign: "center",
  },

  right: {
    textAlign: "right",
  },

  italic: {
    fontStyle: "italic",
    fontFamily: "Times-Italic",
  },

  bold: {
    fontWeight: "bold",
    fontFamily: "Times-Bold",
  },

  underline: {
    textDecoration: "underline",
  },

  hightlight: {
    color: "blue",
  },

  pt5: {
    paddingTop: 5,
  },

  pt10: {
    paddingTop: 10,
  },

  pt20: {
    paddingTop: 20,
  },

  pb20: {
    paddingBottom: 20,
  },
  signatureRow: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
});

export type SafeProps = {
  investment: number;
  valuation?: number;
  discountRate?: number;
  date: string;
  company: {
    name: string;
    state: string;
    address?: string;
  };

  sender?: {
    name: string;
    email: string;
    title: string;
    signature?: string;
  };

  investor: {
    name: string;
    email: string;
    address?: string | null;
    title?: string;
    signature?: string;
  };

  options: {
    title: string;
    author: string;
    creator: string;
    subject: string;
    keywords: string;
    producer: string;
  };
};

export const Indent = ({
  children,
  size = "sm",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) => {
  switch (size) {
    case "lg":
      return <Text style={{ textIndent: "65px" }}>{children}</Text>;
    case "md":
      return <Text style={{ textIndent: "45px" }}>{children}</Text>;
    default:
      return <Text style={{ textIndent: "25px" }}>{children}</Text>;
  }
};

export {
  // Post-money
  PostMoneyMfn,
  ProRataLetter,
  PostMoneyDiscount,
  PostMoneyCap,
  // Pre-money
  PreMoneyMfn,
  PreMoneyDiscount,
  PreMoneyCapDiscount,
  PreMoneyCap,
};
