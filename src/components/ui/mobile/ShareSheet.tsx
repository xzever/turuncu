"use client";

import React, { useEffect, useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { ListItem } from "./ListItem";
import { Twitter, Linkedin, Facebook, Link as LinkIcon, MessageCircle } from "lucide-react";

export type ShareSheetProps = {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description?: string;
};

/**
 * Mobile UI Kit - ShareSheet Component
 * 
 * @example
 * <ShareSheet 
 *   open={isOpen} 
 *   onClose={() => setIsOpen(false)} 
 *   url="https://turuncusolar.com" 
 *   title="Turuncu Solar" 
 * />
 */
export const ShareSheet = ({
  open,
  onClose,
  url,
  title,
  description,
}: ShareSheetProps) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (open) {
      if (typeof navigator !== "undefined" && navigator.share) {
        navigator.share({ title, text: description, url })
          .then(() => {
            onClose();
          })
          .catch((error) => {
            if (error.name === "AbortError") {
              onClose();
            } else {
              setShowFallback(true);
            }
          });
      } else {
        setShowFallback(true);
      }
    } else {
      setShowFallback(false);
    }
  }, [open, title, description, url, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link kopyalandı!");
      onClose();
    }).catch(() => {
      alert("Kopyalama başarısız oldu.");
    });
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const fallbackContent = (
    <div className="ui-share-sheet__list">
      <ListItem
        title="WhatsApp"
        leading={<MessageCircle width={24} height={24} />}
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        onClick={onClose}
      />
      <ListItem
        title="Twitter (X)"
        leading={<Twitter width={24} height={24} />}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        onClick={onClose}
      />
      <ListItem
        title="LinkedIn"
        leading={<Linkedin width={24} height={24} />}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        onClick={onClose}
      />
      <ListItem
        title="Facebook"
        leading={<Facebook width={24} height={24} />}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        onClick={onClose}
      />
      <ListItem
        title="Linki Kopyala"
        leading={<LinkIcon width={24} height={24} />}
        onClick={handleCopy}
        divider={false}
      />
    </div>
  );

  return (
    <BottomSheet 
      open={open && showFallback} 
      onClose={onClose} 
      title="Paylaş"
      snapPoints={["60"]}
      defaultSnap="60"
    >
      {fallbackContent}
    </BottomSheet>
  );
};
