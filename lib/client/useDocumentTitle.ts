import { useEffect, useState } from "react";

export function useDocumentTitle() {
  const [title, setTitle] = useState("Loading");

  useEffect(() => {
    const updateTitle = () =>
      setTitle(document.title == "Dysperse" ? "Loading" : document.title);

    updateTitle();

    const observer = new MutationObserver(updateTitle);
    const tag: any = document.querySelector("title");

    observer.observe(tag, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);
  return title;
}
