import { CircularProgress, Stack } from "@mui/material";
import { useGetImage } from "../queries/useGetImage";

const PAGES = [0, 1];

export default function EditorContainer() {
  return (
    <Stack spacing={2} width={640} overflow={"auto"} height={"100%"}>
      {PAGES.map((pageNum) => {
        return <Page pageNum={pageNum} />;
      })}
    </Stack>
  );
}

type PageProps = { pageNum: number };

function Page(props: PageProps) {
  const { pageNum } = props;

  const { data, isLoading } = useGetImage(pageNum);

  if (isLoading) {
    return <CircularProgress />;
  }
  return <img src={data} style={{ height: "auto", width: "auto" }} />;
}
