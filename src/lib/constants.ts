export const constants = {
  title: "OpenCap",
  url: "https://opencap.co",
  description: "OpenCap is the Open Source alternative to Carta and Pulley.",
  twitter: {
    url: "https://twitter.com/opencapco",
  },
  github: {
    url: "https://github.com/opencapco/opencap.co",
  },
  discord: {
    url: "https://discord.gg/xs8Qu4yrTT",
  },
  ocf: {
    url: "https://www.opencaptablecoalition.com/format",
    github: {
      url: "https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF",
    },
  },
};

export enum PayloadType {
  PROFILE_DATA = "profile-data",
  PROFILE_AVATAR = "profile-avatar",
}
export enum UpdateType {
  SAVE_AND_SEND = "save-and-share",
  SEND_ONLY = "share-only",
}

export const publicToggleWarning = `Are you sure you want to make it public? 
Everybody with credentials can view it and
 it may also be indexed by search engines.`;

export const privateToggleWarning = `Are you sure you want to make it private?
  Nobody can view it and link is not
  shareable to anyone.`;
