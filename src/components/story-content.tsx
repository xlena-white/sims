/** Renders storyline rich text (HTML written in the admin editor) as a readable page. */
export function StoryContent({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`prose prose-invert max-w-none font-display text-lg leading-[1.85] prose-p:text-chalk/90 prose-headings:font-display prose-headings:font-semibold prose-headings:text-chalk prose-strong:text-chalk prose-a:text-mint prose-blockquote:my-8 prose-blockquote:border-l-4 prose-blockquote:border-mint prose-blockquote:pl-6 prose-blockquote:text-2xl prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:leading-snug prose-blockquote:text-chalk ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
