import { getInitials } from "../lib/utils";

const Avatar = ({ user, size = "size-12", border = false, hasStory = false }) => {
  const initials = getInitials(user?.fullName || user?.name);

  return (
    <div className={`relative ${hasStory ? "p-0.5 ring-2 ring-primary animate-pulse" : ""} rounded-full flex-shrink-0`}>
      <div className={`${size} rounded-full overflow-hidden ${border ? "border-2 border-base-300" : ""} bg-primary/10 flex items-center justify-center`}>
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.fullName || "User"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-full h-full items-center justify-center text-primary font-bold ${user?.profilePic ? "hidden" : "flex"}`}
          style={{ fontSize: size.includes("size-32") ? "2rem" : "1.2rem" }}
        >
          {initials}
        </div>
      </div>
    </div>
  );
};

export default Avatar;
