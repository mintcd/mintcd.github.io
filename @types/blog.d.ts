type GlobalData = {
  metadata: {
    site_title: string;
    site_tag: string;
  };
}

type Post = {
  id: string;
  slug: string;
  title: string;
  metadata: {
    published_date: string;
    content: string;
    hero?: {
      imgix_url?: string;
    };
    author?: {
      id: string;
      slug?: string;
      title?: string;
      metadata: {
        image?: {
          imgix_url?: string;
        };
      };
    };
    teaser: string;
    categories: {
      title: string;
    }[];
  };
}

type Author = {
  id: string;
  slug: string;
  title: string;
  metadata: {
    image?: {
      imgix_url?: string;
    };
  };
}