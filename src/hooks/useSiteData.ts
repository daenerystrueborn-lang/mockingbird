import { useState, useEffect } from "react";

export interface Friend {
  name: string;
  img: string;
}

export interface Social {
  name: string;
  url: string;
}

export interface SiteData {
  name: string;
  bio: string;
  tags: string[];
  obsessions: string[];
  friends: Friend[];
  socials: Social[];
  avatarImg: string;
  bannerImg: string;
}

const STORAGE_KEY = "mockingbird_site_data";

const defaultData: SiteData = {
  name: "Mockingbird",
  bio: "just a girl living in her own little world, collecting soft moments & pretty things",
  tags: ["she/her", "dreamer", "soft life"],
  obsessions: ["chess", "anime", "matcha", "soft music", "night sky"],
  friends: [
    { name: "soap",   img: "/friend-soap.jpg" },
    { name: "akaza",  img: "/friend-akaza.jpg" },
    { name: "luffy",  img: "/friend-luffy.jpg" },
    { name: "mikasa", img: "/friend-mikasa.png" },
  ],
  socials: [
    { name: "Instagram", url: "https://www.instagram.com/skyhigh_bird1/" },
    { name: "WhatsApp",  url: "https://wa.me/23462301848?text=Hi!" },
    { name: "YouTube",   url: "https://www.youtube.com/channel/UCR2ho6g89WPviPPJLaGvnaQ" },
    { name: "Discord",   url: "https://discord.com/users/1074712637650243597" },
    { name: "Pinterest", url: "https://www.pinterest.com/gmtrueborn/" },
    { name: "Chess",     url: "https://www.chess.com/member/mockingbirdgm" },
  ],
  avatarImg: "",
  bannerImg: "",
};

function load(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return defaultData;
  }
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useSiteData() {
  const [data, setData] = useState<SiteData>(load);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setData(load());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function save(next: SiteData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setData(next);
  }

  return { data, save };
}
