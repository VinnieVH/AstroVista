export interface NasaImageResponse {
  latestImages: {
    version: string;
    href: string;
    items: NasaItem[];
  };
}

export interface NasaItem {
  data: NasaItemData[];
  href: string;
  links: NasaLink[];
}

export interface NasaItemData {
  center?: string;
  dateCreated: Date;
  description?: string;
  keywords?: string[];
  mediaType: string;
  nasaId: string;
  title: string;
}

export interface NasaLink {
  href: string;
  rel?: string;
  prompt?: string;
  render?: string;
}
