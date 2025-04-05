import { Modal } from "@/components/Modal";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { HelpIcon } from "@/components/Icons";

export const HelpModal = ({
  label,
  content
}: {
  label: string;
  content: string; //React.ReactNode
}) => {
  return(
    <Modal
      size="md"
      title={`Help / ${label}`}
      content={(
        <MarkdownRenderer>
          {content}
        </MarkdownRenderer>
      )}
      trigger={<HelpIcon size="16" className="hover:cursor-pointer" />}
    />
  );
};