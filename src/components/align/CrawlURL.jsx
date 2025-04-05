import { useState } from "react";

import { Button } from "@/components/buttons/Button";
import { Label } from "@/components/fields/Label";
import { toast } from "@/components/Toast";

const CrawlURLChunkContent = ({ dismiss }) => {
  const [chunks, setChunks] = useState([]);
  const onTest = () => {
    console.log('*** TEST CHUNKS');
    setChunks([
      "Chunk 1",
      "Chunk 2",
      "Chunk 3",
    ]);
  };
  const onSubmit = () => {
    console.log('*** SUBMIT CHUNKS');
    toast({ title: "Crawling URL..." });
    dismiss();
  };
  return(
    <div className="flex flex-col space-y-4">
      <Label 
        htmlFor="chunkOptions"
        label="Chunk Options"
        >
      <input 
        type="text"
        className="inputs"
      />
      </Label>
      { chunks?.length < 1 && (
        <div className="ms-auto">
          <Button
            label="Test"
            onClick={onTest}
          />
        </div>
      )}
      { chunks?.map((chunk, idx) => (
        <Label key={idx} htmlFor={idx} label={`Chunk ${idx + 1}`}>
          <textarea
            readOnly
            type="text"
            className="inputs"
            rows={3}
            value={chunk}
          />
        </Label>
      ))}
      { chunks?.length > 0 && (
        <div className="ms-auto">
          <Button
            label="OK, Crawl"
            onClick={onSubmit}
          />
        </div>
      )}
    </div>
  );
};

export const CrawlURLModalContent = ({ dismiss }) => {
  const [url, setURL] = useState('');
  const [chunkContent, setChunkContent] = useState(null);
  const onClick = () => {
    console.log('*** URL: ', url);
    setChunkContent(<CrawlURLChunkContent dismiss={dismiss} />);
  };
  return(
    <div className="flex flex-col space-y-4">
      <Label 
        htmlFor="url"
        label="URL (eg, https://example.com)"
        >
      <input 
        type="text"
        disabled={!!chunkContent}
        className={[
          "inputs",
          //!!chunkContent ? "bg-black/50" : ''
        ].join(" ")}
        value={url}
        onChange={(e) => setURL(e.target.value)}
      />
      </Label>
      {/*<span className="placeholders text-sm">Depending on your amount of data to be loaded, the migration should take less than a few minutes. You can periodically refresh this Data page to observe the progress...</span>*/}
      { chunkContent ? null : (
        <div className="ms-auto">
          <Button
            onClick={onClick}
            label="Submit"
          />
        </div>
      )}
      {chunkContent}
    </div>
  );
};
