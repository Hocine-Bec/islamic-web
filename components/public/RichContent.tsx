import sanitizeHtml from "sanitize-html";

export default function RichContent({ html }: { html: string }) {
  const clean = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["u", "s"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["style", "dir"],
    },
  });

  return (
    <div
      className="rich-content text-sm text-gray-700 leading-loose"
      dir="rtl"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
