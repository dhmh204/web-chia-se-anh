import React from "react";

type AvatarUserProps = {
  name: string;
  avatarUrl?: string | null;
};

const AvatarUser = ({ name, avatarUrl }: AvatarUserProps) => {
  const getAvatarText = (name: string) => {
    if (!name) return "?";

    return name.trim().charAt(0).toUpperCase();
  };

  const avatarText = getAvatarText(name);

  return (
    <div className="rounded-[14px] overflow-hidden grid place-items-center w-[42px] h-[42px] bg-[linear-gradient(135deg,#047857,#10b981)] font-black border border-[var(--line)] flex-shrink-0">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        avatarText
      )}
    </div>
  );
};

export default AvatarUser;
