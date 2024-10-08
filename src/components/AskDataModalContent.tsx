// src/components/AskDataModalContent.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Loader, X } from 'lucide-react'; // Import X icon for the close button
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import autosize from 'autosize';

import { Tweet } from './TweetDisplayer';

interface AskDataModalContentProps {
  tweets: Tweet[];
  onClose: () => void;
}

export default function AskDataModalContent({
  tweets,
  onClose,
}: AskDataModalContentProps) {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea as the user types
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  // Predefined prompts
  const summarizePrompt = 'Summarize the main insights from the following tweets:';
  const suggestPrompt = 'Based on these tweets, suggest 5 tweet ideas that could be part of the conversation:';

  const fetchOpenAIResponse = async (prompt: string) => {
    setIsLoading(true);
    setResponseText('');

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from OpenAI');
      }

      const data = await response.json();
      setResponseText(data.text);
    } catch (error) {
      console.error('Error:', error);
      setResponseText('An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const tweetContents = tweets.map((tweet) => tweet.Tweet).join(' ');
    const prompt = `${inputText}\n\nTweets:\n${tweetContents}`;
    fetchOpenAIResponse(prompt);
  };

  const handlePredefinedPrompt = (type: 'summarize' | 'suggest') => {
    const tweetContents = tweets.map((tweet) => tweet.Tweet).join(' ');
    const basePrompt = type === 'summarize' ? summarizePrompt : suggestPrompt;
    const prompt = `${basePrompt}\n\nTweets:\n${tweetContents}`;
    fetchOpenAIResponse(prompt);
  };

  // Scroll to the bottom of the response when it changes
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [responseText]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close Modal"
      >
        <X className="h-6 w-6" />
      </button>

      <h2 className="text-xl font-bold mb-4">Ask Data</h2>
      <div
        className="flex-1 overflow-auto mb-4 p-4 bg-gray-50 rounded-lg"
        ref={messageContainerRef}
      >
        {responseText ? (
          <div className="prose prose-sm sm:prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{responseText}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-gray-500">Your response will appear here.</p>
        )}
      </div>
      <div className="mt-auto">
        <div className="flex space-x-2 mb-2">
          <Button variant="secondary" onClick={() => handlePredefinedPrompt('summarize')}>
            Summarize Tweets
          </Button>
          <Button variant="secondary" onClick={() => handlePredefinedPrompt('suggest')}>
            Suggest Tweets
          </Button>
        </div>
        <div className="flex items-center">
          <Textarea
            ref={textareaRef}
            placeholder="Ask a question about your data..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={1}
            className="flex-1 resize-none px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !inputText.trim()}
            className="ml-2"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
