
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';


const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 p-2 rounded-md overflow-x-auto text-xs w-full">
        {language && <div className="text-gray-400 mb-1 text-xs">{language}</div>}
        <code className="block whitespace-pre-wrap break-words leading-tight">{code}</code>
      </pre>
      <Button
        onClick={handleCopy}
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 h-6 w-6 p-0 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
};


export const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.slice(3, -3);
          const firstLineEnd = codeContent.indexOf('\n');
          const language = firstLineEnd > 0 ? codeContent.slice(0, firstLineEnd).trim() : '';
          const code = firstLineEnd > 0 ? codeContent.slice(firstLineEnd + 1) : codeContent;

          return <CodeBlock key={index} code={code} language={language} />;
        } else {
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

          const lines = part.split('\n');
          const listItems: string[] = [];
          const regularText: string[] = [];

          lines.forEach(line => {
            const trimmed = line.trim();
            if (/^\d+\.\s/.test(trimmed)) {
              listItems.push(trimmed.replace(/^\d+\.\s/, ''));
            } else if (trimmed) {
              regularText.push(line);
            }
          });

          return (
            <div key={index} className="text-sm leading-relaxed break-words">
              {listItems.length > 0 && (
                <ol className="list-decimal list-inside space-y-1 ml-4 mb-2">
                  {listItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ol>
              )}
              {regularText.length > 0 && (
                <div>
                  {regularText.map((text, textIndex) => {
                    const textParts = text.split(linkRegex);

                    return (
                      <div key={textIndex}>
                        {textParts.map((textPart, partIndex) => {
                          if (partIndex % 3 === 0) {
                            return textPart;
                          } else if (partIndex % 3 === 1) {
                            return (
                              <a
                                key={partIndex}
                                href={textParts[partIndex + 1]}
                                className="text-blue-600 hover:text-blue-800 underline break-words"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {textPart}
                              </a>
                            );
                          }
                          return null;
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};
