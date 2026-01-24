
'use client';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getStyleAdvice } from '@/app/actions/ai';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  prompt: string;
};

export default function AIAdvisorClient() {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{ type: 'prompt' | 'response'; content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, displayedResponse]);

  useEffect(() => {
    if (isTyping) {
      const lastResponse = history[history.length - 1]?.content;
      if (lastResponse && displayedResponse.length < lastResponse.length) {
        const timeout = setTimeout(() => {
          setDisplayedResponse(lastResponse.substring(0, displayedResponse.length + 1));
        }, 10);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
      }
    }
  }, [isTyping, displayedResponse, history]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.prompt.trim()) return;

    setIsLoading(true);
    setHistory(prev => [...prev, { type: 'prompt', content: data.prompt }]);
    
    try {
      const result = await getStyleAdvice(data.prompt);
      setHistory(prev => [...prev, { type: 'response', content: result }]);
      setDisplayedResponse('');
      setIsTyping(true);
    } catch (error) {
      console.error(error);
      setHistory(prev => [...prev, { type: 'response', content: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        ref={terminalRef}
        className="h-[500px] bg-primary text-primary-foreground font-mono rounded-t-lg p-4 overflow-y-auto text-sm"
      >
        <p className="text-accent">ALEXIS Style_Advisor v1.0</p>
        <p>Awaiting input for style protocol generation...</p>
        <p>===================================================</p>
        {history.map((item, index) => (
          <div key={index}>
            {item.type === 'prompt' ? (
              <p><span className="text-accent">&gt;</span> {item.content}</p>
            ) : (
              <div className="whitespace-pre-wrap">
                {isTyping && index === history.length - 1 ? displayedResponse : item.content}
                {isTyping && index === history.length - 1 && <span className="animate-ping">_</span>}
              </div>
            )}
          </div>
        ))}
        {isLoading && <p className="text-accent animate-pulse">Generating Style Protocol...</p>}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex rounded-b-lg overflow-hidden">
        <Input
          {...register('prompt', { required: true })}
          placeholder="Describe an occasion or mood (e.g., 'my ex-girlfriend's wedding')"
          className="bg-muted text-foreground rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
          disabled={isLoading}
          autoComplete="off"
        />
        <Button type="submit" className="rounded-none bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
        </Button>
      </form>
    </div>
  );
}
