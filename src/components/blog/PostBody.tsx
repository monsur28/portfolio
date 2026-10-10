import { MarkdownAsync, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

// react-markdown passes its hast `node`; keep it off the DOM element.
function withoutNode<T extends { node?: unknown }>(props: T) {
  const { node, ...rest } = props;
  void node;
  return rest;
}

const components: Components = {
  a: ({ href = "", children, ...rest }) => {
    const props = withoutNode(rest);
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  img: ({ src, alt = "", ...rest }) => {
    const props = withoutNode(rest);
    const url = typeof src === "string" ? cloudinaryUrl(src, 1400) ?? src : undefined;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} loading="lazy" decoding="async" {...props} />;
  },
  table: (props) => (
    <div className="post-table">
      <table {...withoutNode(props)} />
    </div>
  ),
};

export default function PostBody({ markdown }: { markdown: string }) {
  return (
    <MarkdownAsync
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        [rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: false, defaultLang: "plaintext" }],
      ]}
      components={components}
    >
      {markdown}
    </MarkdownAsync>
  );
}
