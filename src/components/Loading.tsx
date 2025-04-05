export const Loading = (
  { variant, isLoading, className }:
  { variant: string; isLoading?: boolean; className?: string
}) => {
  if (!isLoading) return null;
  if (variant === "dots") {
    return(
      <div className="flex flex-row space-x-2 items-center justify-center">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={[
              `w-4 h-4 bg-primary-500 rounded-full animate-bounce`,
              className ?? ''
            ].join(' ')}
            style={{
              animationDuration: '1.2s',
              animationDelay: `${index * 0.2}s`,
            }}
          ></div>
        ))}
      </div>
    );
  };
  // default to 'spinner' variant
  return(
    <div className="w-8 h-8 animate-spin">
      <svg
        className={[
          "w-8 h-8",
          className ?? ''
        ].join(' ')}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10 0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8 4.41 0 8 3.59 8 8 0 4.41-3.59 8-8 8z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};