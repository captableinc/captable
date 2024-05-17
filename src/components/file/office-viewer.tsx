type OfficeViewerProps = {
  url: string;
};

const OfficeViewer = ({ url }: OfficeViewerProps) => {
  return (
    <iframe
      src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url,
      )}`}
      className="w-full h-full min-h-screen"
    />
  );
};

export { OfficeViewer };
