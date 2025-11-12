import { useEffect } from "react";

const useMetaTags = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  useEffect(() => {
    document.title = title;
    document
      ?.querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [description, title]);
};

export default useMetaTags;
