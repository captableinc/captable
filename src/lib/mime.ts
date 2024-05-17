type FileProps = {
  mimeType: string;
};

const fileType = (mimeType: string) => {
  switch (true) {
    case mimeType.includes("pdf"):
      return "pdf";
    case mimeType.includes("image"):
      return "image";
    case mimeType.includes("audio"):
      return "audio";
    case mimeType.includes("video"):
      return "video";
    case mimeType.includes("powerpoint") || mimeType.includes("presentation"):
      return "powerpoint";
    case mimeType.includes("csv") ||
      mimeType.includes("excel") ||
      mimeType.includes("sheet"):
      return "excel";
    case mimeType.includes("doc"):
    case mimeType.includes("word"):
      return "doc";
    default:
      return "unknown";
  }
};

export { fileType };
