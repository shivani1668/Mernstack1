import { getInitials } from "../lib/utils";

const Avatar = ({ user, size = "size-12", border = false, hasStory = false }) => {
  const initials = getInitials(user?.fullName || user?.name);

  return (
    <div className={`relative ${hasStory ? "p-0.5 ring-2 ring-primary animate-pulse" : ""} rounded-full`}>
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt={user.fullName}
          className={`${size} object-cover rounded-full ${border ? "border-4 border-base-300" : ""}`}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className={`${size} rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold
          ${user?.profilePic ? "hidden" : "flex"} ${border ? "border-4 border-base-300" : ""}`}
        style={{ fontSize: size.includes("size-32") ? "2rem" : "1rem" }}
      >
        {initials}
      </div>
    </div>
  );
};

export default Avatar;
