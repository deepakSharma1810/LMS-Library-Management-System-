import React from "react";

const TopLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 z-[9999] h-0.5 w-full overflow-hidden">
      <div
        className="h-full bg-yellow-400 animate-[loader_1s_ease-in-out_infinite]"
        style={{
          boxShadow: "0 0 3px rgba(250,204,21,0.3)",
          borderRadius: "999px",
        }}
      />
    </div>
  );
};

export default TopLoader;
