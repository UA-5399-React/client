import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react';

interface ToolbarButton {
  icon: React.ReactNode;
  command: string;
  value?: string;
  title: string;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { icon: <Bold className="h-4 w-4" />, command: 'bold', title: 'Bold' },
  { icon: <Italic className="h-4 w-4" />, command: 'italic', title: 'Italic' },
  {
    icon: <Underline className="h-4 w-4" />,
    command: 'underline',
    title: 'Underline',
  },
  {
    icon: <Heading1 className="h-4 w-4" />,
    command: 'formatBlock',
    value: 'h1',
    title: 'Heading 1',
  },
  {
    icon: <Heading2 className="h-4 w-4" />,
    command: 'formatBlock',
    value: 'h2',
    title: 'Heading 2',
  },
  {
    icon: <List className="h-4 w-4" />,
    command: 'insertUnorderedList',
    title: 'Bullet list',
  },
  {
    icon: <ListOrdered className="h-4 w-4" />,
    command: 'insertOrderedList',
    title: 'Numbered list',
  },
];

interface EditorToolbarProps {
  onInsertLink: () => void;
}

export function EditorToolbar({ onInsertLink }: EditorToolbarProps) {
  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="flex flex-wrap gap-1 rounded-t-lg border border-b-0 border-[#e5e7eb] bg-[#F9FAFB] p-2">
      {TOOLBAR_BUTTONS.map((btn) => (
        <button
          key={btn.title}
          type="button"
          title={btn.title}
          onMouseDown={(e) => {
            e.preventDefault();
            handleCommand(btn.command, btn.value);
          }}
          className="rounded border-0 p-1.5 text-[#5E6366] transition-colors hover:bg-[#e5e7eb] hover:text-[#2C2C2C]"
        >
          {btn.icon}
        </button>
      ))}
      <button
        type="button"
        title="Insert link"
        onMouseDown={(e) => {
          e.preventDefault();
          onInsertLink();
        }}
        className="rounded border-0 p-1.5 text-[#5E6366] transition-colors hover:bg-[#e5e7eb] hover:text-[#2C2C2C]"
      >
        <Link className="h-4 w-4" />
      </button>
    </div>
  );
}
