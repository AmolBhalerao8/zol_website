"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Settings, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const profileAppearance = {
  elements: {
    footer: { display: "none" },
    badge: { display: "none" },
    developmentModeWarning: { display: "none" },
  },
};

type ZolProfileMenuProps = {
  align?: "left" | "right";
};

function ProfileAvatar({
  imageUrl,
  hasImage,
  label,
  className,
}: {
  imageUrl?: string | null;
  hasImage: boolean;
  label: string;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = label.charAt(0).toUpperCase();
  const showImage = hasImage && Boolean(imageUrl) && !imageFailed;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700",
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl ?? ""}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : initials ? (
        <span className="text-sm font-semibold">{initials}</span>
      ) : (
        <UserRound className="h-4 w-4" />
      )}
    </div>
  );
}

export function ZolProfileMenu({ align = "right" }: ZolProfileMenuProps) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!user) {
    return null;
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "Account";
  const displayName = user.fullName?.trim() || email;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Open account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="rounded-full border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300"
      >
        <ProfileAvatar
          imageUrl={user.imageUrl}
          hasImage={user.hasImage}
          label={displayName}
          className="h-10 w-10"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-[1.25rem] border border-zinc-200 bg-white shadow-premium",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="border-b border-zinc-100 px-4 py-4">
            <div className="flex items-center gap-3">
              <ProfileAvatar
                imageUrl={user.imageUrl}
                hasImage={user.hasImage}
                label={displayName}
                className="h-10 w-10"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-950">{displayName}</p>
                <p className="truncate text-xs text-zinc-500">{email}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                openUserProfile({ appearance: profileAppearance });
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
            >
              <Settings className="h-4 w-4" />
              Manage account
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void signOut({ redirectUrl: "/" });
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
