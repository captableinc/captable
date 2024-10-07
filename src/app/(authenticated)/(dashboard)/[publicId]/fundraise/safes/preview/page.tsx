"use client";
import { PostMoneyCap, PostMoneyDiscount } from "@/components/safe/templates";
import { PDFViewer } from "@react-pdf/renderer";

const SafePreview = () => {
  return (
    <PDFViewer
      className="w-full h-screen border-none rounded-md"
      showToolbar={false}
    >
      <PostMoneyDiscount
        options={{
          author: "Y Combinator",
          creator: "Captable, Inc.",
          producer: "Captable, Inc.",
          title: "YC SAFE - Post Money Discount",
          subject: "YC SAFE - Post Money Discount",
          keywords: "YC, SAFE, Post Money, Discount",
        }}
        investor={{
          name: "Puru Dahal",
          email: "",
        }}
        investment={100000}
        discountRate={10}
        date={new Date().toISOString()}
        company={{
          name: "Company Inc.",
          state: "CA",
        }}
      />
    </PDFViewer>
  );
};

export default SafePreview;
