import React from 'react';
import type { ChatContextScope } from '../types';

interface ChatEmptyStateProps {
  onSelectPrompt?: (prompt: string, scope?: ChatContextScope) => void;
  activeScope?: ChatContextScope;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = () => {
  return null;
};

export default ChatEmptyState;
