import DOMPurify from "isomorphic-dompurify";

export default function RichContent({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html);

  return (
    <div
      className="rich-content text-sm text-gray-700 leading-loose"
      dir="rtl"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
